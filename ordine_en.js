// FinLearn · grafica "In ordine" (FinLearn 2.0)
// Modulo separato dall'app storica: app.js gli passa dati e funzioni con `kit` e lo mostra al posto della vecchia grafica.
// Nessun passaggio di compilazione: i modelli sono scritti con html`...` (libreria htm, inclusa qui sotto).
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronDown, Check, Calculator, Clock, Timer, Lock, Play, Flag, Crown, SlidersHorizontal, Target, Link2, EyeOff, Wallet, Sprout, Briefcase,
  GraduationCap, Compass, LayoutGrid, FileText, ArrowUp, Plus, TrendingUp, PieChart, Star, Zap, RotateCcw, Table2, Percent, BarChart3, Scale, Coins, Bell, Languages, Download,
  Trash2, LogOut, Info, Shuffle, User, Palette, History, Lightbulb, Share2 } from 'lucide-react';

// ---- lingua e paese ----
// LANG: 'it' = app in italiano, 'en' = app in inglese americano. L'inglese si genera con dev/en/compila.mjs (ordine_en.js), che cambia solo questa riga e sostituisce i testi.
const LANG = 'en';
// COUNTRY: il paese decide quali lezioni valgono (le regole cambiano da un paese all'altro) e la valuta. IT = Italia, US = Stati Uniti.
// In italiano è sempre l'Italia; in inglese lo si sceglie all'inizio e dalle Impostazioni (chiave fl_country, letta prima di disegnare).
function guessCountry() {
  try { const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || ''), lg = (navigator.language || ''); if (/^Europe\/Rome$/.test(tz) || /-IT$/i.test(lg)) return 'IT'; } catch (e) { /* niente */ }
  return 'US';
}
const COUNTRY = (() => { if (LANG !== 'en') return 'IT'; try { const c = localStorage.getItem('fl_country'); if (c === 'US' || c === 'IT') return c; } catch (e) { /* niente */ } return guessCountry(); })();
const LOC = LANG === 'en' ? 'en-US' : 'it-IT';        // formato di numeri e date
const CUR = COUNTRY === 'US' ? '$' : '€';            // simbolo della valuta
const GRP = LANG === 'en' ? ',' : '.', DEC = LANG === 'en' ? '.' : ',';   // 1.331,5 all'italiana · 1,331.5 all'americana
// cambiare lingua o paese ricarica la pagina: le lezioni e i testi dell'altra versione stanno in un altro file
function setLangPref(l) { try { localStorage.setItem('fl_lang', l); localStorage.setItem('fl_lang_chosen', '1'); } catch (e) { /* niente */ } try { document.documentElement.lang = l; location.reload(); } catch (e) { /* niente */ } }
function setCountryPref(c) { try { localStorage.setItem('fl_country', c); } catch (e) { /* niente */ } try { location.reload(); } catch (e) { /* niente */ } }

const useSyncExternalStore = React.useSyncExternalStore || function (sub, get) { const [, f] = useState(0); useEffect(() => sub(() => f(x => x + 1)), [sub]); return get(); };

// ---- htm 3.1.1 · (c) Jason Miller · Apache License 2.0 · https://github.com/developit/htm ----
const htmRun = function (t, s, r, e) { var u; s[0] = 0; for (var h = 1; h < s.length; h++) { var p = s[h++], a = s[h] ? (s[0] |= p ? 1 : 2, r[s[h++]]) : s[++h]; 3 === p ? e[0] = a : 4 === p ? e[1] = Object.assign(e[1] || {}, a) : 5 === p ? (e[1] = e[1] || {})[s[++h]] = a : 6 === p ? e[1][s[++h]] += a + "" : p ? (u = t.apply(a, htmRun(t, a, r, ["", null])), e.push(u), a[0] ? s[0] |= 2 : (s[h - 2] = 0, s[h] = u)) : e.push(a) } return e }, htmCache = new Map;
const htm = function (s) { var r = htmCache.get(this); return r || (r = new Map, htmCache.set(this, r)), (r = htmRun(this, r.get(s) || (r.set(s, r = function (n) { for (var t, s, r = 1, e = "", u = "", h = [0], p = function (n) { 1 === r && (n || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? h.push(0, n, e) : 3 === r && (n || e) ? (h.push(3, n, e), r = 2) : 2 === r && "..." === e && n ? h.push(4, n, 0) : 2 === r && e && !n ? h.push(5, 0, !0, e) : r >= 5 && ((e || !n && 5 === r) && (h.push(r, 0, e, s), r = 6), n && (h.push(r, n, 0, s), r = 6)), e = "" }, a = 0; a < n.length; a++) { a && (1 === r && p(), p(a)); for (var l = 0; l < n[a].length; l++)t = n[a][l], 1 === r ? "<" === t ? (p(), h = [h], r = 3) : e += t : 4 === r ? "--" === e && ">" === t ? (r = 1, e = "") : e = t + e[0] : u ? t === u ? u = "" : e += t : '"' === t || "'" === t ? u = t : ">" === t ? (p(), r = 1) : r && ("=" === t ? (r = 5, s = e, e = "") : "/" === t && (r < 5 || ">" === n[a][l + 1]) ? (p(), 3 === r && (h = h[0]), r = h, (h = h[0]).push(2, 0, r), r = 0) : " " === t || "\t" === t || "\n" === t || "\r" === t ? (p(), r = 2) : e += t), 3 === r && "!--" === e && (r = 4, h = h[0]) } return p(), h }(s)), r), arguments, [])).length > 1 ? r : r[0] };

// stile scritto come nel CSS ("display:flex;gap:8px") -> oggetto per React, con memoria
const cssMemo = new Map();
const camel = k => k.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
function cssObj(s) {
  let o = cssMemo.get(s); if (o) return o; o = {};
  for (const d of s.split(';')) { const i = d.indexOf(':'); if (i < 1) continue; const k = d.slice(0, i).trim(), v = d.slice(i + 1).trim(); if (k && v) o[k.startsWith('--') ? k : camel(k)] = v; }
  cssMemo.set(s, o); return o;
}
function hx(type, props, ...kids) {
  if (props) {
    let p = null;
    for (const k in props) {
      const v = props[k]; let nk = k, nv = v;
      if (k === 'style' && typeof v === 'string') nv = cssObj(v);
      else if (k === 'class') nk = 'className';
      else if (k === 'for') nk = 'htmlFor';
      else if (typeof type === 'string' && k.indexOf('-') > 0 && k.slice(0, 5) !== 'aria-' && k.slice(0, 5) !== 'data-') nk = camel(k);
      if (nk !== k || nv !== v) { if (!p) p = Object.assign({}, props); if (nk !== k) delete p[k]; p[nk] = nv; }
    }
    if (p) props = p;
  }
  return React.createElement(type, props, ...kids);
}
const html = htm.bind(hx);

// ---- colori e misure del sistema "In ordine" ----
const INK = '#1A1A1A', MUT = '#4A4F5A', SEP = '#E3E7EF', DIM = '#C4CAD6', DIMT = '#6B7280';
const AZ = '#8EC5FF', MENTA = '#7EE0B5', PESCA = '#FFC9A3', LILLA = '#D6C8FF', ROSA = '#FFB4C8', GIALLO = '#FFD43B';
const T_AZ = '#D5E9FF', T_GR = '#EEF1F6', T_BG = '#F4F6FA', T_PESCA = '#FFE3CF', T_GIALLO = '#FFE98F', T_MENTA = '#D3F4E6', T_ROSA = '#FFDCE6', T_LILLA = '#ECE5FF';
const ROOM = { home: AZ, allenati: MENTA, sfide: PESCA, coach: LILLA, profilo: ROSA };

const ORD_CSS = `
.o-app{position:fixed;top:0;bottom:0;left:0;right:0;margin:0 auto;max-width:520px;z-index:40;overflow:hidden;background:#fff;color:${INK};
  font-family:'Bricolage Grotesque','Nunito',system-ui,sans-serif;font-size:16px;line-height:1.35;font-weight:600;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;font-variant-numeric:tabular-nums;font-optical-sizing:auto;
  --otop:calc(var(--sat, 0px) + 9px)}
/* iPhone, app installata: sotto l'orologio il sistema sfuma i contenuti per una ventina di punti, quindi testi e pulsanti partono più in basso */
html.fl-ios-app .o-app{--otop:calc(var(--sat, 0px) + 24px)}
/* iPhone, app installata: l'altezza dichiarata è più corta dello schermo (manca in fondo una fascia alta quanto la barra di stato).
   ordFit() misura lo schermo vero e qui l'app viene stesa fino in fondo, dentro una pagina alta quanto lo schermo. */
html.fl-ord-fit,html.fl-ord-fit body{min-height:var(--ord-h)}
html.fl-ord-fit{overscroll-behavior:none}
html.fl-ord-fit .o-app{position:absolute;bottom:auto;height:var(--ord-h)}
html.fl-ord-fit .fixed.inset-0{bottom:calc(-1 * var(--ord-gap, 0px))!important}
:where(.o-app) *,:where(.o-app) *::before,:where(.o-app) *::after{box-sizing:border-box}
:where(.o-app) h1,:where(.o-app) h2,:where(.o-app) h3,:where(.o-app) p,:where(.o-app) ul{margin:0;padding:0}
:where(.o-app) button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;text-align:left;-webkit-tap-highlight-color:transparent;touch-action:manipulation;border-radius:0}
:where(.o-app) button:disabled{cursor:default}
:where(.o-app) img{display:block;max-width:none;-webkit-user-drag:none;user-select:none;-webkit-user-select:none;pointer-events:none}
html .o-app button:focus-visible,html .o-app input:focus-visible,html .o-app textarea:focus-visible{outline:3px solid ${INK};outline-offset:2px}
html.fl-fig .o-app button:active:not(:disabled){transform:none}
.o-mono{font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace!important}
.o-scr{position:absolute;inset:0;display:flex;flex-direction:column;background:#fff}
.o-scroll{flex:1 1 0;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain;scrollbar-width:none}
.o-scroll::-webkit-scrollbar{display:none}
.o-top{padding-top:var(--otop)}
.o-pad{padding-left:20px;padding-right:20px}
.o-foot{flex:none;padding:12px 20px max(22px,calc(env(safe-area-inset-bottom) + 6px));background:#fff}
.o-h1{font-size:42px;line-height:42px;font-weight:800;letter-spacing:-.02em}
.o-h1m{font-size:34px;line-height:36px;font-weight:800;letter-spacing:-.02em}
.o-h2{font-size:20px;line-height:24px;font-weight:800}
.o-big{font-size:28px;line-height:32px;font-weight:800;letter-spacing:-.02em}
.o-q{font-size:26px;line-height:30px;font-weight:800;letter-spacing:-.02em;text-wrap:balance}
.o-body{font-size:15px;line-height:22px;font-weight:600;text-wrap:pretty}
.o-t{font-size:16px;line-height:20px;font-weight:700}
.o-s{font-size:13px;line-height:18px;font-weight:600;color:${MUT}}
.o-lab{font-size:14px;line-height:20px;font-weight:700;color:${MUT}}
.o-mut{color:${MUT}}
.o-link{display:inline-block;padding:10px 6px;font-size:15px;line-height:20px;font-weight:800;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:2px}
.o-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:54px;padding:6px 18px;background:${AZ};border:2.5px solid ${INK};border-radius:16px;box-shadow:3px 3px 0 ${INK};
  font-size:17px;line-height:22px;font-weight:800;color:${INK};text-align:center;transition:transform .06s ease,box-shadow .06s ease}
html.fl-fig .o-app .o-btn:active:not(:disabled){transform:translate(3px,3px);box-shadow:0 0 0 ${INK}}
.o-btn.lg{min-height:56px;box-shadow:4px 4px 0 ${INK}}
.o-btn.sm{min-height:48px;border-radius:14px;font-size:16px}
.o-btn.ink{background:${INK};color:#fff;box-shadow:none}
.o-btn.flat{box-shadow:none}
.o-btn:disabled{background:${T_GR};border-color:${DIM};color:${DIMT};box-shadow:none}
.o-ib{width:44px;height:44px;flex:none;display:flex;align-items:center;justify-content:center;background:#fff;border:2px solid ${INK};border-radius:14px;color:${INK}}
.o-ib.lg{width:56px;height:56px;border-width:2.5px;border-radius:16px}
.o-pill{display:inline-block;padding:5px 12px;background:#fff;border:2px solid ${INK};border-radius:999px;box-shadow:2px 2px 0 ${INK};transform:rotate(-3deg);font-size:14px;line-height:18px;font-weight:800;white-space:nowrap;color:${INK}}
.o-tag{display:inline-flex;align-items:center;padding:1px 9px;background:${GIALLO};border:2px solid ${INK};border-radius:999px;font-size:12px;line-height:16px;font-weight:800;white-space:nowrap}
.o-card{background:#fff;border:2.5px solid ${INK};border-radius:28px;box-shadow:5px 5px 0 ${INK};padding:20px}
.o-card.s{border-radius:24px;box-shadow:4px 4px 0 ${INK}}
.o-hero{flex:1 1 0;min-height:300px;position:relative;display:flex;flex-direction:column;align-items:center}
.o-hero-c{position:relative;flex:none;width:min(288px,70vw);aspect-ratio:1;margin-top:auto;margin-bottom:-8px;background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:5px 5px 0 ${INK};display:flex;align-items:flex-end;justify-content:center}
.o-hero-p{position:absolute;left:min(-22px,calc(20.95% - 79.2px));top:clamp(-12px,calc(28.57% - 58px),20px)}
@supports (width:1cqh){.o-hero{min-height:190px;container-type:size}.o-hero-c{width:min(288px,70vw,calc(100cqh - 70px))}}
.o-sheet{position:relative;background:#fff;border:2.5px solid ${INK};border-bottom:0;border-radius:32px 32px 0 0;margin:0 -3px;padding:20px 23px 0}
.o-row{display:flex;align-items:center;gap:14px;width:100%;min-height:66px;padding:8px 0;border-bottom:2px solid ${SEP}}
.o-row.last,.o-row:last-child{border-bottom:0}
.o-ibox{width:44px;height:44px;flex:none;display:flex;align-items:center;justify-content:center;background:#fff;border:2px solid ${INK};border-radius:14px;font-size:20px;line-height:1;font-weight:800;overflow:hidden}
.o-grow{flex:1 1 0;min-width:0}
.o-col{display:flex;flex-direction:column}
.o-rowf{display:flex;align-items:center}
.o-bar{height:12px;border:2px solid ${INK};border-radius:99px;background:#fff;overflow:hidden}
.o-bar>i{display:block;height:100%;background:${AZ};border-right:2px solid ${INK}}
.o-seg{flex:1 1 0;min-width:0;display:grid;gap:6px}
.o-seg>i{height:10px;background:#fff;border:2px solid ${INK};border-radius:99px}
.o-seg>i.d{background:${INK}}
.o-seg>i.c{background:${AZ}}
.o-opt{display:flex;align-items:center;gap:14px;width:100%;min-height:58px;padding:9px 12px;background:#fff;border:2.5px solid ${INK};border-radius:18px;color:${INK}}
.o-opt>.l{width:36px;height:36px;flex:none;display:flex;align-items:center;justify-content:center;background:#fff;border:2px solid ${INK};border-radius:11px;font-size:15px;line-height:1;font-weight:800}
.o-opt>.x{flex:1 1 0;min-width:0;font-size:16px;line-height:22px;font-weight:700;overflow-wrap:anywhere}
.o-opt.num>.x{font-size:20px;line-height:24px;font-weight:800}
.o-opt .n{flex:none;font-size:13px;line-height:18px;font-weight:700}
.o-opt.sel{background:${T_AZ}}
.o-opt.sel>.l,.o-opt.ok>.l,.o-opt.ko>.l{background:${INK};color:#fff}
.o-opt.ok{background:${MENTA}}
.o-opt.ko{background:${ROSA}}
.o-opt.dim{border-color:${DIM};color:${DIMT}}
.o-opt.dim>.l{border-color:${DIM}}
.o-test .o-opt.sel{background:${T_MENTA}}
.o-duel .o-opt.sel{background:${T_PESCA}}
.o-tabs{position:absolute;left:16px;right:16px;bottom:max(16px,calc(env(safe-area-inset-bottom) - 10px));height:64px;padding:6px;display:flex;gap:2px;background:${INK};border-radius:24px;z-index:6}
.o-tab{flex:1 1 auto;min-width:0;padding:0 3px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border-radius:18px;font-size:11px;line-height:14px;font-weight:700;color:#fff;text-align:center}
.o-tab.on{font-weight:800;color:${INK}}
.o-tabpad{height:calc(64px + max(16px,calc(env(safe-area-inset-bottom) - 10px)) + 20px)}
.o-note{padding:12px 16px;background:${T_GR};border-radius:16px;font-size:15px;line-height:21px;font-weight:700}
.o-chip{flex:none;display:inline-flex;align-items:center;height:36px;padding:0 14px;background:#fff;border:2px solid ${INK};border-radius:999px;font-size:14px;line-height:18px;font-weight:800;white-space:nowrap}
.o-chip.on{background:${INK};color:#fff}
.o-rich{font-size:16px;line-height:25px;font-weight:500;color:${INK};overflow-wrap:anywhere}
html .o-app .o-rich .fl-rich{line-height:inherit}
html .o-app .o-rich .fl-p{margin:0 0 4px}
html .o-app .o-rich .fl-li{margin:0 0 6px;padding-left:1.15em;text-indent:-1.15em}
html .o-app .o-rich .fl-strong{font-weight:800;color:${INK};background:${T_AZ};padding:0 3px;border-radius:4px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
html .o-app .o-rich .fl-tex-d{display:block;margin:10px 0;padding:12px 10px;background:${T_BG};border:2px solid ${INK};border-radius:14px;box-shadow:none;font-size:1.02em;overflow-x:auto;overflow-y:hidden;text-align:center}
html .o-app .o-rich .fl-table-wrap{margin:10px 0;border:2px solid ${INK};border-radius:14px;overflow-x:auto;box-shadow:none}
html .o-app .o-rich .fl-table{width:100%;border-collapse:collapse;font-size:13.5px;line-height:18px;font-weight:600}
html .o-app .o-rich .fl-table th{background:${AZ};text-align:left;padding:8px 10px;font-weight:800;white-space:nowrap}
html .o-app .o-rich .fl-table td{padding:7px 10px;border-top:2px solid ${SEP};white-space:nowrap}
html .o-app .o-rich .fl-table .fl-cw{white-space:normal;min-width:132px}
html .o-app .o-coach button{text-align:center}
html .o-app .o-coach div[style*="position: fixed"]{bottom:calc(max(92px, env(safe-area-inset-bottom) + 66px) - var(--ord-gap, 0px))!important}
.o-rich.sm{font-size:15px;line-height:22px;font-weight:600}
.o-rich.q{font-size:17px;line-height:25px;font-weight:700}
.o-ovl{position:absolute;inset:0;z-index:41;display:flex;flex-direction:column;justify-content:flex-end;background:rgba(26,26,26,.45)}
.o-bs{position:relative;max-height:92%;display:flex;flex-direction:column;border:2.5px solid ${INK};border-bottom:0;border-radius:28px 28px 0 0;margin:0 -3px;padding:18px 23px max(20px,calc(env(safe-area-inset-bottom) + 6px));background:#fff}
.o-toast{position:absolute;left:20px;right:20px;bottom:calc(96px + env(safe-area-inset-bottom));z-index:42;padding:12px 16px;background:${INK};color:#fff;border-radius:16px;font-size:15px;line-height:20px;font-weight:700;text-align:center}
.o-inp{width:100%;height:54px;padding:0 16px;background:#fff;border:2.5px solid ${INK};border-radius:16px;font:inherit;font-size:16px;font-weight:700;color:${INK}}
.o-sw{position:relative;width:50px;height:30px;flex:none;border:2px solid ${INK};border-radius:99px;background:#fff;transition:background .15s}
.o-sw>i{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:${INK};transition:transform .15s}
.o-sw.on{background:${MENTA}}
.o-sw.on>i{transform:translateX(20px)}
.o-range{-webkit-appearance:none;appearance:none;width:100%;height:44px;margin:0;padding:0;background:transparent;touch-action:pan-y;cursor:pointer}
.o-range:focus{outline:none}
.o-range::-webkit-slider-runnable-track{box-sizing:border-box;height:14px;background:linear-gradient(to right,${AZ} var(--p,0%),#fff var(--p,0%));border:2.5px solid ${INK};border-radius:999px}
.o-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;box-sizing:border-box;width:38px;height:38px;margin-top:-14.5px;background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:2px 2px 0 ${INK}}
.o-range::-moz-range-track{box-sizing:border-box;height:14px;background:linear-gradient(to right,${AZ} var(--p,0%),#fff var(--p,0%));border:2.5px solid ${INK};border-radius:999px}
.o-range::-moz-range-thumb{box-sizing:border-box;width:38px;height:38px;background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:2px 2px 0 ${INK}}
.o-range:disabled{opacity:.55}
.o-stepb{width:40px;height:40px;flex:none;display:flex;align-items:center;justify-content:center;background:#fff;border:2.5px solid ${INK};border-radius:50%;color:${INK}}
.o-stepb:disabled{border-color:${DIM};color:${DIM}}
.o-bign{font-size:44px;line-height:50px;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.o-keys{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.o-key{height:48px;display:flex;align-items:center;justify-content:center;background:#fff;border:2.5px solid ${INK};border-radius:14px;font-size:22px;line-height:1;font-weight:800;color:${INK}}
.o-key:active{background:${T_AZ}}
.o-numd{display:flex;align-items:baseline;justify-content:center;gap:8px;min-height:60px;padding:8px 16px;background:${T_BG};border:2.5px solid ${INK};border-radius:16px;font-size:34px;line-height:40px;font-weight:800;font-variant-numeric:tabular-nums}
.o-bucket{display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:6px;min-height:136px;padding:10px;background:#fff;border:2.5px solid ${INK};border-radius:20px;box-shadow:4px 4px 0 ${INK};color:${INK};transition:background .15s}
.o-bucket.ok{background:${MENTA}}
.o-bucket.ko{background:${ROSA}}
.o-bucket:disabled{box-shadow:none}
.o-chip2{display:block;padding:5px 9px;background:${T_GR};border-radius:10px;font-size:13px;line-height:17px;font-weight:700;text-align:left;overflow-wrap:anywhere}
.o-goal{display:flex;align-items:center;gap:12px;padding:12px 14px;background:${T_GIALLO};border:2.5px solid ${INK};border-radius:18px}
.o-goal.ok{background:${MENTA}}
.o-term{text-decoration:underline dotted ${INK};text-decoration-thickness:2px;text-underline-offset:4px;cursor:pointer}
.o-fig{display:flex;flex-direction:column;gap:14px;margin:16px 0;padding:14px 16px 16px;background:#fff;border:2.5px solid ${INK};border-radius:20px;box-shadow:4px 4px 0 ${INK}}
.o-figbar{display:flex;height:24px;min-width:26px;border:2.5px solid ${INK};border-radius:99px;overflow:hidden;transition:width .75s cubic-bezier(.2,.8,.2,1)}
.o-bub{position:relative;margin-bottom:22px;padding:9px 13px;background:#fff;border:2.5px solid ${INK};border-radius:16px 16px 16px 4px;font-size:15px;line-height:19px;font-weight:700}
@keyframes oShake{0%,100%{transform:none}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
.o-shake{animation:oShake .36s ease-in-out}
@keyframes oIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes oUp{from{transform:translateY(100%)}to{transform:none}}
@keyframes oFade{from{opacity:0}to{opacity:1}}
@keyframes oPop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.06);opacity:1}100%{transform:scale(1)}}
.o-in{animation:oIn .22s ease-out both}
.o-up{animation:oUp .26s cubic-bezier(.22,1,.36,1) both}
.o-fade{animation:oFade .2s ease-out both}
.o-pop{animation:oPop .32s cubic-bezier(.22,1,.36,1) both}
.o-ntw{position:relative;z-index:1;flex:none;height:64px;margin:12px 0;overflow:hidden}
.o-nt{position:absolute;left:-14px;right:-14px;top:9px;height:42px;overflow:hidden;background:${GIALLO};border-top:2.5px solid ${INK};border-bottom:2.5px solid ${INK};box-shadow:0 4px 0 ${INK};transform:rotate(-2deg);white-space:nowrap}
.o-nt-run{display:inline-flex;align-items:center;height:100%;animation:oNastro 30s linear infinite;will-change:transform}
.o-nt-g{display:inline-flex;align-items:center;flex:none;padding-left:18px}
.o-nt-chip{flex:none;margin-right:12px;padding:2px 7px;background:${INK};border-radius:6px;color:${GIALLO};font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace;font-size:10px;line-height:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.o-nt-i{display:inline-flex;align-items:center;gap:12px;flex:none;height:37px;padding-right:12px;font-size:15.5px;line-height:20px;font-weight:800;color:${INK};white-space:nowrap}
.o-nt-l{display:inline-flex;align-items:center;gap:4px;font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace;font-size:10px;line-height:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
@keyframes oNastro{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.o-hl{background:linear-gradient(transparent 40%,${GIALLO} 40%,${GIALLO} 93%,transparent 93%);padding:0 4px;margin:0 -4px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.o-rich.art{font-size:17px;line-height:27px;font-weight:500}
.o-art-src{display:flex;align-items:flex-start;gap:10px;padding:11px 0;border-bottom:2px solid ${SEP};color:${INK};text-decoration:none}
.o-art-src:last-of-type{border-bottom:0}
@media (prefers-reduced-motion: reduce){.o-in,.o-up,.o-fade,.o-pop,.o-shake{animation:none}.o-figbar{transition:none}.o-nt{overflow-x:auto}.o-nt-run{animation:none}}
@media (min-width:521px){body{background:#DDE3EC!important}}
`;
function ordInjectCss() {
  if (typeof document === 'undefined') return;
  let st = document.getElementById('ord-css');
  if (!st) { st = document.createElement('style'); st.id = 'ord-css'; document.head.appendChild(st); }
  if (st.textContent !== ORD_CSS) st.textContent = ORD_CSS;
  if (!document.getElementById('ord-font')) {
    const lk = document.createElement('link'); lk.id = 'ord-font'; lk.rel = 'stylesheet';
    lk.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@500;600;700&family=Nunito:wght@900&display=swap';
    document.head.appendChild(lk);
  }
}

// Misura se in fondo allo schermo resta una fascia scoperta (iPhone, app aperta dalla schermata Home) e in quel caso
// stende l'app sull'altezza vera dello schermo. Una volta trovata la misura resta valida finché l'app è aperta.
let ordFitDone = false;
function ordFit() {
  try {
    if (ordFitDone || typeof document === 'undefined' || !document.body) return;
    if (window.navigator.standalone !== true || window.innerHeight < window.innerWidth) return;
    const p = document.createElement('div'); p.style.cssText = 'position:fixed;top:0;bottom:0;left:0;width:1px;visibility:hidden;pointer-events:none';
    document.body.appendChild(p); const h = p.getBoundingClientRect().height; p.remove();
    const full = Math.max(window.screen.height, window.screen.width), gap = Math.round(full - h);
    if (h > 300 && gap > 20 && gap < 110) { const de = document.documentElement; de.style.setProperty('--ord-h', full + 'px'); de.style.setProperty('--ord-gap', gap + 'px'); de.classList.add('fl-ord-fit'); ordFitDone = true; }
  } catch (e) {}
}
function ordFitOff() { try { const de = document.documentElement; de.classList.remove('fl-ord-fit'); de.style.removeProperty('--ord-h'); de.style.removeProperty('--ord-gap'); ordFitDone = false; } catch (e) {} }
function useOrdFit() {
  useEffect(() => {
    ordFit(); const t1 = setTimeout(ordFit, 250), t2 = setTimeout(ordFit, 1200);
    window.addEventListener('resize', ordFit); window.addEventListener('pageshow', ordFit);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener('resize', ordFit); window.removeEventListener('pageshow', ordFit); ordFitOff(); };
  }, []);
}

// ---- memoria locale della nuova grafica (una sola chiave, il resto usa le chiavi storiche dell'app) ----
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  raw(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
};
const S2_KEY = 'fl2_state';
const S2_DEF = { v: 1, name: '', onboard: null, mis: null, started: [], cur: null, basi: [], expl: { d: '', n: 0 }, tests: {}, ans: {}, duel: { w: 0, l: 0, last: null }, serie: { best: 0, n: 0, last: 0 }, xp: {}, gold: {}, seen: {},
  settings: { goalMin: 10, remind: false, remindAt: '19:30', lang: 'Italiano', examEn: true } };
let s2 = null; const s2subs = new Set();
// dati salvati con una forma sbagliata (versioni vecchie, memoria rovinata): si torna al valore di partenza di quel campo
const sameKind = (a, b) => Array.isArray(a) === Array.isArray(b) && typeof a === typeof b && (a === null) === (b === null);
function s2get() {
  if (!s2) {
    let sv = LS.get(S2_KEY, {}); if (!sv || typeof sv !== 'object' || Array.isArray(sv)) sv = {};
    const clean = {}; for (const k in sv) { if (!(k in S2_DEF) || S2_DEF[k] === null || sameKind(sv[k], S2_DEF[k]) || (S2_DEF[k] === '' && typeof sv[k] === 'string')) clean[k] = sv[k]; }
    if (clean.duel && (typeof clean.duel.w !== 'number' || typeof clean.duel.l !== 'number')) delete clean.duel;
    if (clean.expl && typeof clean.expl.n !== 'number') delete clean.expl;
    s2 = Object.assign({}, S2_DEF, clean, { settings: Object.assign({}, S2_DEF.settings, clean.settings || {}) });
  }
  return s2;
}
function s2set(patch) { const cur = s2get(); s2 = Object.assign({}, cur, typeof patch === 'function' ? patch(cur) : patch); LS.set(S2_KEY, s2); s2subs.forEach(f => f()); }
const s2sub = cb => { s2subs.add(cb); return () => s2subs.delete(cb); };
function useS2() { return useSyncExternalStore(s2sub, s2get); }
// ridisegna quando cambiano album o attività (eventi lanciati dalle funzioni storiche dell'app)
function useTick() {
  const [, f] = useState(0);
  useEffect(() => { const h = () => f(x => x + 1); window.addEventListener('fl-album', h); window.addEventListener('fl-activity', h); return () => { window.removeEventListener('fl-album', h); window.removeEventListener('fl-activity', h); }; }, []);
}
// `K` = il kit passato da app.js (dati del curriculum, funzioni dell'album, stato dell'utente). Aggiornato a ogni disegno.
let K = null;
const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const DAY = 864e5;
const fmtInt = n => Math.round(n).toLocaleString(LOC);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const EN_PL = { lezione: 'lesson', lezioni: 'lessons' };   // le altre parole di plural() le traduce il dizionario
const plural = (n, one, many) => { const w = n === 1 ? one : many; return `${n} ${EN_PL[w] || w}`; };

// Lezioni di "Basi della finanza" (generate da dev/ordine/basi_src.py)
const BASI_UNITS = [{"id":"basi-u1","sid":"basi-tempo","name":"Money over time","lessons":[{"key":"basi-1-1","sym":"€","title":"What money is for","minutes":5,"flow":[{"type":"guess","q":"Put €100 in a drawer. Today a coffee at the café costs €1. Twenty years from now, say, it costs €2. How many coffees can you buy with that €100 in twenty years?","after":"Today €100 buys you 100 coffees. If the price doubles, the same €100 buys **50**. The banknote in the drawer hasn't changed: what you can do with it has. Money does three jobs, and this is the most delicate one.","min":0,"max":100,"step":5,"truth":50,"near":5,"unit":"coffees"},{"type":"page","t":"Three jobs in one","x":"**Money in itself is worth nothing: it is worth what it lets you do.**\n\nIt does three different jobs.\n\n• **Medium of exchange.** You hand it over in exchange for what you need. Without money you would have to barter: a baker who wants a pair of shoes would have to find a shoemaker who wants bread.\n• **Unit of account.** It is the yardstick for measuring prices. A coffee costs €1.30, a book €18: you can compare them because they use the same measure.\n• **Store of value.** It lets you move value through time: you earn today, you spend tomorrow.\n\nYou see the first two jobs every day, when you pay and when you look at a price. The third only shows over the years."},{"type":"bucket","t":"Which job is money doing?","buckets":["Medium of exchange","Unit of account","Store of value"],"items":[["You pay for groceries at the checkout",0,"You give money in exchange for things: that is exchange."],["You compare the price of two phones",1,"You use money as a yardstick for measuring."],["You set aside €200 for a vacation",2,"You move value from today to tomorrow."],["You receive your salary for your work",0,"You trade your work for money."],["You read that a car costs €15,000",1,"A price is a measurement expressed in money."],["You keep €1,000 in your account for emergencies",2,"You save it to use later."]]},{"type":"page","t":"The most fragile job","x":"Of the three jobs, the third is the one money does worst.\n\nAs a medium of exchange and as a unit of account, money always works. As a store of value it has an enemy: rising prices.\n\nGo back to the €100 in the drawer.\n\n[fig]\n\nAfter twenty years the banknote is the same, but it buys half as much. Keeping money idle looks like the safest choice, because the figure never goes down. In reality it is a slow loss that you can't see.\n\nEverything else in this path starts from here. **Interest** and **investments** exist for this reason: so that the money you set aside doesn't lose ground and, if possible, gains some.","fig":{"rows":[{"lab":"Today, with coffee at €1","val":"100 coffees","segs":[[100,"What €100 buys","az"]]},{"lab":"In twenty years, with coffee at €2","val":"50 coffees","segs":[[50,"What the same €100 buys","pesca"]]}]}},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"Money is for paying, for measuring prices and for storing value. The third job is the most fragile: if prices rise, idle money buys less.","ex":[{"type":"mcq","q":"You put €500 in a drawer to buy a bike a year from now. Which job are you asking of the money?","options":["Medium of exchange","Unit of account","Store of value"],"ans":2,"exp":"You are keeping it to spend later: that is the **store of value** function. It will become a medium of exchange only on the day you pay for the bike."},{"type":"mcq","q":"Why isn't money kept in a drawer for many years a perfect store of value?","options":["Because banknotes expire","Because if prices rise it buys fewer things","Because the bank taxes it"],"ans":1,"exp":"The figure stays the same, but if prices rise in the meantime, that figure buys **fewer things**. Banknotes don't expire, and the bank has nothing to do with a drawer."}],"pages":[],"lab":"A"},{"key":"basi-1-2","sym":"%","title":"Simple interest","minutes":6,"flow":[{"type":"guess","q":"You lend a friend €1,000 for 3 years. You agree on this: each year they pay you 5% of the amount lent, and at the end they give you back the €1,000. How much extra do you collect in all?","after":"5% of €1,000 is €50 a year. Over three years: \\(50 \\times 3 =\\) **€150**. That payment has a name, interest, and the way you calculated it is called simple interest.","min":0,"max":500,"step":10,"truth":150,"near":15,"unit":"€"},{"type":"page","t":"The price of time","x":"**When you lend money, you give up using it for a while. Interest is the payment for giving it up.**\n\nWhen you lend someone €1,000, for the whole length of the loan that money is not available to you, and you run the risk that it won't come back. In exchange you ask for a payment: **interest**.\n\nInterest is measured with a **rate**: a percentage of the amount lent, usually per year. A rate of 5% a year means €5 of interest for every €100 lent, for every year.\n\nThe amount lent is called the **principal**.\n\nIt works both ways. When you deposit money in a bank, you are the one lending, and you receive the interest. When you take out a loan, you pay it."},{"type":"page","t":"Always on the starting amount","x":"With **simple interest** the rate is always applied only to the starting principal. That is why the interest is the same every year.\n\nHere is the €1,000 lent at 5% a year for 3 years:\n\n[fig]\n\nAt the end you have \\(1{,}000 + 150 =\\) **€1,150**. The total at the end, principal plus interest, is called the **final amount**.\n\nThe calculation can be written in one line:\n\n$$I = C \\times i \\times t$$\n\nWhere \\(I\\) is the interest, \\(C\\) the principal, \\(i\\) the annual rate and \\(t\\) the number of years. Here: \\(1{,}000 \\times 5\\% \\times 3 = \\text{€}150\\).","fig":{"rows":[{"lab":"After 3 years","val":"€1,150","segs":[[1000,"Principal","az","€1,000"],[50,"Year 1","pesca","€50"],[50,"Year 2","pesca","€50"],[50,"Year 3","pesca","€50"]]}],"cap":"Three equal pieces of interest, because they are always calculated on the starting €1,000."}},{"type":"num","q":"You lend €2,000 at 3% a year, at simple interest. How much interest do you earn in one year?","ans":60,"unit":"€","tol":0.5,"dec":0,"exp":"\\(2{,}000 \\times 3\\% =\\) **€60**. With simple interest it will be €60 in the second year too, in the third and in every other."},{"type":"num","q":"Same loan: €2,000 at 3% a year, simple interest, for 4 years. What is the final amount?","ans":2240,"unit":"€","tol":0.5,"dec":0,"exp":"Interest: €60 a year for 4 years, \\(60 \\times 4 = \\text{€}240\\). Final amount: \\(2{,}000 + 240 =\\) **€2,240**."},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"Simple interest: \\(\\text{principal} \\times \\text{rate} \\times \\text{years}\\). The interest is the same every year.","ex":[{"type":"match","pairs":[["Principal","The amount lent or deposited"],["Interest","The payment for the lender"],["Rate","Interest as a percentage, for one year"],["Final amount","Principal plus interest"]]},{"type":"mcq","q":"You deposit €5,000 at 2% a year, simple interest, for 3 years. How much interest do you earn in all?","options":["€100","€300","€306"],"ans":1,"exp":"Each year: \\(5{,}000 \\times 2\\% = \\text{€}100\\). In 3 years: \\(100 \\times 3 =\\) **€300**. The answer €100 is just one year; €306 is what compound interest would give, which we see in the next lesson."},{"type":"mcq","q":"What does a rate of 4% a year tell you?","options":["That the loan lasts 4 years","That each year the interest is €4 for every €100 of principal","That €4 in all is paid back at the end"],"ans":1,"exp":"The rate is the interest as a percentage of the principal, for one year: at 4%, **€4 for every €100, every year**. On €1,000 that is €40 a year."}],"pages":[],"lab":"A"},{"key":"basi-1-3","sym":"%%","title":"Compound interest","minutes":7,"flow":[{"type":"guess","q":"You put €1,000 at 5% a year and leave it untouched for 30 years. Each year the interest stays in and earns interest too. How much do you have at the end?","after":"With simple interest you would have \\(1{,}000 + 50 \\times 30 = \\text{€}2{,}500\\). Letting the interest work too gets you to about **€4,322**. The difference, more than €1,800, is interest earned on interest.","min":1000,"max":8000,"step":100,"truth":4322,"near":300,"unit":"€"},{"type":"page","t":"Interest on interest","x":"**With compound interest the interest doesn't sit aside: it is added to the principal and starts earning too.**\n\nYou start with €1,000 at 5% a year.\n\n• **Year 1**: \\(5\\% \\times 1{,}000 = \\text{€}50\\). You have €1,050.\n• **Year 2**: the 5% is calculated on €1,050, no longer on €1,000. That is €52.50. You have €1,102.50.\n• **Year 3**: \\(5\\% \\times 1{,}102.50 = \\text{€}55.13\\). You have €1,157.63.\n\n[fig]\n\nEach year the interest is a little higher than the year before, because it is calculated on a figure that keeps growing. At first the difference from simple interest is small. As time goes by it becomes enormous.","fig":{"rows":[{"lab":"Interest in year 1","val":"€50.00","segs":[[50,"On the starting principal","pesca"]]},{"lab":"Interest in year 2","val":"€52.50","segs":[[50,"On the starting principal","pesca"],[2.5,"On earlier interest","az"]]},{"lab":"Interest in year 3","val":"€55.13","segs":[[50,"On the starting principal","pesca"],[5.13,"On earlier interest","az"]]}]}},{"type":"page","t":"Watch it grow","x":"Move the years slider. The columns show three pieces: your money, the interest on your money and the interest on the interest. Watch which of the three grows the most as the years go up.","widget":"compound"},{"type":"page","t":"Time matters more than the amount","x":"After \\(t\\) years at rate \\(i\\), the principal \\(C\\) becomes:\n\n$$M = C \\times (1 + i)^t$$\n\nAt 5%, each year the amount is multiplied by 1.05. After two years you have multiplied it twice, after thirty years thirty times.\n\nHere is €1,000 at 5% a year, with simple and with compound interest:\n\n| After | Simple | Compound |\n|---|---|---|\n| 1 year | €1,050 | €1,050 |\n| 10 years | €1,500 | €1,629 |\n| 20 years | €2,000 | €2,653 |\n| 30 years | €2,500 | €4,322 |\n\nIn the first years the two columns almost coincide. Then the one on the right runs away. That is why someone who starts early with a little often ends up ahead of someone who starts late with a lot."},{"type":"num","q":"You put €2,000 at 10% a year with compound interest. How much do you have after 2 years?","ans":2420,"unit":"€","tol":0.5,"dec":0,"exp":"First year: \\(2{,}000 \\times 1.10 = \\text{€}2{,}200\\). Second year: \\(2{,}200 \\times 1.10 =\\) **€2,420**. With simple interest you would be at €2,400: the extra €20 is the interest earned on the first year's interest."},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"Time matters more than the starting amount: interest on interest grows slowly at first and fast later.","ex":[{"type":"mcq","q":"You put €1,000 at 5% a year. How much do you have after 2 years?","options":["€1,100.00","€1,102.50","€1,050.00"],"ans":1,"exp":"In the first year you reach €1,050. In the second year the 5% is calculated on €1,050: that is €52.50, not 50. Total **€1,102.50**. Anyone who answers €1,100 counted the 5% twice on the starting €1,000."},{"type":"mcq","q":"You put €2,000 at 4% a year with compound interest. How much do you have after 3 years?","options":["€2,240.00","€2,163.20","€2,249.73"],"ans":2,"exp":"| Year | Calculation | End of year |\n|---|---|---|\n| 1 | \\(2{,}000.00 \\times 1.04\\) | 2,080.00 |\n| 2 | \\(2{,}080.00 \\times 1.04\\) | 2,163.20 |\n| 3 | \\(2{,}163.20 \\times 1.04\\) | 2,249.73 |\n\nThe typical mistake is counting the 4% each year on the starting €2,000: that gets you to €2,240."}],"pages":[],"lab":"A"},{"key":"basi-1-4","sym":"↑","title":"Inflation","minutes":7,"flow":[{"type":"guess","q":"You have €1,000 sitting in a drawer. Prices rise 3% a year. In 10 years, how much do those €1,000 buy, measured at today's prices?","after":"In ten years, what costs €1,000 today will cost about €1,344. So your €1,000 will buy what you can buy today with about **€744**. The figure in the drawer is the same: it is its value that has dropped by a quarter.","min":0,"max":1000,"step":10,"truth":744,"near":30,"unit":"€"},{"type":"page","t":"Prices that rise","x":"**Inflation is a general rise in prices over time.**\n\nGeneral means it isn't about a single product. If only the price of peaches goes up because the harvest was bad, that isn't inflation. It is when, on average, the cost of everything a household buys goes up: food, bills, rent, transport.\n\nIt is measured as a percentage per year. Inflation of 3% means that what costs €100 today will cost €103 on average a year from now.\n\nTo measure it you use a **basket**: a list of goods and services that stands for what households typically spend on. Every month someone checks how much it costs to fill it and compares that with a year earlier."},{"type":"page","t":"Purchasing power","x":"What matters about your money is not the figure, but what you can buy with it. This is called **purchasing power**.\n\nWhen prices rise and your figure stays the same, purchasing power falls. Here are the €1,000 from the drawer, with inflation at 3% a year:\n\n[fig]\n\nThere are still €1,000 in the drawer. Nobody has taken them. Yet after ten years it is as if you had €744, and after twenty €554.\n\nThat is why keeping everything idle is not a risk-free choice: it is the choice of losing a little at a time, with certainty.","fig":{"rows":[{"lab":"Today","val":"€1,000","segs":[[1000,"Purchasing power","az"]]},{"lab":"In 10 years","val":"€744","segs":[[744,"Purchasing power","az"],[256,"Lost","pesca"]]},{"lab":"In 20 years","val":"€554","segs":[[554,"Purchasing power","az"],[446,"Lost","pesca"]]}],"cap":"With inflation at 3% a year, measuring everything at today's prices."}},{"type":"lever","t":"How much inflation weighs","x":"You have €1,000 sitting idle. Move inflation and years and see how much they buy, at today's prices.","model":"inflazione","params":{"C":1000},"sliders":[{"id":"infl","label":"Inflation","min":1,"max":8,"step":0.5,"start":2,"unit":"%","dec":1},{"id":"anni","label":"Years","min":1,"max":40,"step":1,"start":5,"unit":"years"}],"goals":[{"label":"Find when €1,000 buys less than €750","cond":[["reale","<",750]],"hint":"You can raise inflation, or let more years pass."},{"label":"Now halve purchasing power with inflation at 2%","cond":[["reale","<=",500],["infl","<=",2]],"hint":"Bring inflation back to 2% and add years: it takes a long time."}],"after":"Even low inflation, left to work for decades, halves the value of idle money. At 2% it takes about 35 years, at 6% just 12."},{"type":"num","q":"Your weekly grocery shopping costs €200 today. With inflation of 5%, how much will the same shopping cost in a year?","ans":210,"unit":"€","tol":0.5,"dec":0,"exp":"\\(200 \\times 1.05 =\\) **€210**: €10 more to buy the same things."},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"With inflation, idle money loses purchasing power, even if the figure in the account doesn't fall.","ex":[{"type":"mcq","q":"Inflation is 3% a year and your account earns 1%. After a year, what has happened to your purchasing power?","options":["It rose by 1%","It stayed the same","It fell by about 2%"],"ans":2,"exp":"The account grew by 1%, but prices by 3%: in real terms you lost about **2%** (to be precise, \\(\\dfrac{1.01}{1.03} - 1 = -1.94\\%\\))."},{"type":"mcq","q":"What does inflation measure?","options":["The average rise in the prices of everything households buy","The rise in the price of a single product","How much a bank account earns"],"ans":0,"exp":"Inflation looks at prices as a whole, through a basket of goods and services. If one product goes up and the rest stay put, that is not inflation."}],"pages":[],"lab":"A"},{"key":"basi-1-5","sym":"r","title":"Real rate","minutes":6,"flow":[{"type":"guess","q":"Bank A offers you 2% a year at a time when prices rise 1%. Bank B offers you 5% at a time when prices rise 6%. In which case can you buy more at the end of the year than before?","after":"With A your money grows 2% and prices 1%: in the end you can buy about 1% more. With B it grows 5%, but prices grow 6%: you can buy about 1% less, even though you see a higher figure in your account. What counts is the rate once inflation is taken out: it is called the real rate.","options":["With bank A","With bank B","In both cases"],"ans":0},{"type":"page","t":"Nominal and real","x":"**An interest rate alone doesn't tell you whether you are gaining: you have to compare it with inflation.**\n\nThe rate you read on the contract is called the **nominal rate**: it says by how much the figure grows.\n\nThe **real rate** says instead by how much your purchasing power grows, that is, what you can buy. It is the nominal rate cleaned of inflation.\n\nFor everyday calculations a subtraction is enough:\n\n$$\\text{real} \\approx \\text{nominal} - \\text{inflation}$$\n\n[fig]\n\nIf the real rate is positive, at the end of the year you can buy more. If it is negative you can buy less, even if the figure in the account has gone up.","fig":{"rows":[{"lab":"Bank A: the account earns","val":"2%","segs":[[2,"Nominal rate","az"]]},{"lab":"Bank A: prices rise","val":"1%","segs":[[1,"Inflation","pesca"]]},{"lab":"Bank B: the account earns","val":"5%","segs":[[5,"Nominal rate","az"]]},{"lab":"Bank B: prices rise","val":"6%","segs":[[6,"Inflation","pesca"]]}],"cap":"With A the rate beats prices: real about +1%. With B your money loses: real about −1%."}},{"type":"page","t":"The exact calculation","x":"The subtraction is a good approximation. The precise calculation divides instead of subtracting:\n\n$$1 + r = \\frac{1 + n}{1 + \\pi}$$\n\nWhere \\(r\\) is the real rate, \\(n\\) the nominal rate and \\(\\pi\\) inflation.\n\nWith a nominal rate of 5% and inflation of 2%:\n\n• approximate: \\(5\\% - 2\\% =\\) **3%**\n• exact: \\(\\dfrac{1.05}{1.02} - 1 =\\) **2.94%**\n\nWhy divide? In a year €100 becomes €105, but what cost €100 now costs €102. With €105 you buy \\(\\dfrac{105}{102} = 1.0294\\) times what you bought before.\n\nWith low rates the two calculations almost coincide. The higher the rates, the wider the gap."},{"type":"num","q":"A savings account earns 3.5% a year and inflation is 2%. Roughly what is the real rate? Use subtraction.","ans":1.5,"unit":"%","tol":0.05,"dec":1,"exp":"\\(3.5\\% - 2\\% =\\) **1.5%**. The exact calculation gives \\(\\dfrac{1.035}{1.02} - 1 = 1.47\\%\\)."},{"type":"bucket","t":"Does your purchasing power go up or down?","buckets":["Goes up","Goes down"],"items":[["Rate 4%, inflation 1%",0,"Real about \\(4\\% - 1\\% = +3\\%\\)."],["Rate 2%, inflation 5%",1,"Real about \\(2\\% - 5\\% = -3\\%\\)."],["Rate 0%, inflation 2%",1,"Idle money loses about 2% a year."],["Rate 6%, inflation 3%",0,"Real about \\(6\\% - 3\\% = +3\\%\\)."],["Rate 7%, inflation 9%",1,"A high rate isn't enough if inflation is higher."],["Rate 1%, inflation 0%",0,"Without inflation the whole rate is real gain."]]},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"\\(\\text{Real rate} \\approx \\text{nominal} - \\text{inflation}\\). If the real rate is negative, you are losing purchasing power.","ex":[{"type":"mcq","q":"An investment earns 4% a year and inflation is 6%. Roughly what is the real rate?","options":["−2%","+2%","+10%"],"ans":0,"exp":"\\(\\text{Real} \\approx 4\\% - 6\\% =\\) **−2%**. The investment pays you, but less than prices are rising: in real terms you lose."},{"type":"mcq","q":"Your salary rises 3% in a year when prices rise 3%. What has happened to what you can buy?","options":["It rose 3%","It stayed about the same","It fell 3%"],"ans":1,"exp":"Salary and prices rose at the same pace: your purchasing power stayed **where it was**. The same reasoning as the real rate applies to salaries, rents and pensions."}],"pages":[],"lab":"A"}]},{"id":"basi-u2","sid":"basi-strumenti","name":"Financial instruments","lessons":[{"key":"basi-2-1","sym":"STK","title":"Stocks","minutes":4,"pages":[{"t":"A piece of a company","x":"A **stock** is an ownership stake in a company. If the company has issued 1,000 shares and you own 10, you own 1% of it.\n\nWhoever owns stocks earns in two ways:\n\n• the **dividend**, that is the part of profit the company distributes to its owners;\n• the rise in the **price**, if the stock is worth more when you resell it."},{"t":"Nothing is promised","x":"Neither the dividend nor the price is guaranteed. If the company does badly, the dividend can disappear and the price can fall.\n\nIn exchange for this risk, over the long run stocks have returned more on average than bonds."}],"note":"Stock = an ownership stake. It pays through dividends and price growth, with no guarantees.","ex":[{"type":"mcq","q":"A company has 2,000 shares outstanding and you own 50. What portion of the company is yours?","options":["0.25%","2.5%","25%"],"ans":1,"exp":"\\(\\dfrac{50}{2{,}000} = 0.025\\), that is **2.5%**."}],"lab":"A"},{"key":"basi-2-2","sym":"BND","title":"Bonds","minutes":5,"pages":[{"t":"A loan you can resell","x":"A **bond** is a loan you make to a company or a government. In exchange you receive:\n\n• a **coupon**, that is the interest paid at fixed dates;\n• the **redemption** of the principal at maturity.\n\nA 10-year BTP (an Italian government bond) with a 3% coupon on €1,000 pays you €30 a year and gives you back €1,000 after 10 years."},{"t":"Fewer surprises, not zero","x":"Compared with a stock, you already know how much you will receive, as long as whoever issued the bond pays. There are two risks:\n\n• that the issuer **doesn't pay** (credit risk);\n• that **rates rise**: new bonds pay more, and yours, if you sell it before maturity, is worth less."}],"note":"Bond = loan. Fixed coupons and redemption at maturity; the price falls when rates rise.","ex":[{"type":"match","pairs":[["Stock","An ownership stake in a company"],["Bond","A loan to a company or a government"],["Dividend","The part of profit paid to the owners"],["Inflation","Prices that rise over time"]]},{"type":"mcq","q":"Interest rates fall. What usually happens to the price of bonds already in circulation?","options":["It falls","It stays the same","It rises"],"ans":2,"exp":"Bonds already issued pay higher coupons than new ones, so they are worth more: the price **rises**. Interest rates and bond prices move in opposite directions."}],"lab":"B"},{"key":"basi-2-4","sym":"ETF","title":"Funds and ETFs","minutes":5,"pages":[{"t":"Many securities in one go","x":"A **mutual fund** pools the money of many savers and invests it in many securities together. You don't buy individual stocks or bonds: you buy **shares** of the fund.\n\nThe value of one share is calculated like this:\n\n$$\\text{share value} = \\frac{\\text{net assets}}{\\text{number of shares}}$$\n\nIf the fund has net assets of €10 million divided into 1 million shares, each share is worth **€10**. With €500 you buy 50."},{"t":"What changes with an ETF","x":"An **ETF** is a fund that is bought and sold on the stock market like a stock and that usually **tracks an index**, that is a basket of securities chosen by a fixed rule (for example the 500 largest US companies).\n\n• An **active** fund has a manager who picks the securities and costs more, often between 1% and 2% a year.\n• An ETF that tracks an index doesn't pick anything and costs less, often between 0.1% and 0.3% a year.\n\nIn both cases you hold many different securities with a single transaction."}],"note":"A fund pools the money of many people and buys many securities. An ETF is a fund listed on the stock market that tracks an index and costs little.","ex":[{"type":"mcq","q":"A fund has net assets of €50 million divided into 2 million shares. How much is one share worth?","options":["€2.50","€25","€100"],"ans":1,"exp":"\\(\\dfrac{50{,}000{,}000}{2{,}000{,}000} =\\) **€25** per share."},{"type":"mcq","q":"What does an ETF that tracks an index do?","options":["It picks the best securities every day","It guarantees the invested principal","It buys the index's securities, without picking"],"ans":2,"exp":"It buys the securities that make up the index, in the same proportions, **without picking**. That is why it costs little. It doesn't guarantee the principal: if the index falls, the ETF falls too."}],"lab":"A"},{"key":"basi-2-5","sym":"ACC","title":"Accounts, deposits and liquidity","minutes":4,"pages":[{"t":"Where everyday money sits","x":"• The **checking account** is for receiving and paying. It earns little or nothing.\n• The **deposit account** is made for leaving a sum untouched: in exchange the bank pays you interest. The money is often **locked**: if you withdraw it before maturity you lose the interest, in whole or in part, and in some cases you can't withdraw it at all.\n\nExample: €5,000 in a deposit account at 3% for a year earns \\(5{,}000 \\times 3\\% =\\) **€150** before taxes. In Italy the tax on interest is 26%: you keep **€111**."},{"t":"Liquidity","x":"**Liquidity** means how quickly you can turn something into cash without losing money. A checking account is extremely liquid. A house is not: selling it takes months.\n\nFor the unexpected you need an **emergency fund**: liquid money equal to a few months of expenses. A common rule is to keep 3 to 6 months.\n\nIf you spend €1,500 a month, the emergency fund goes from €4,500 to €9,000. Only what is left over makes sense to invest."}],"note":"Money you may need soon sits in liquid instruments. The rest can work over longer periods.","ex":[{"type":"mcq","q":"You spend €1,200 a month and want an emergency fund that covers 4 months. How much do you need to set aside?","options":["€4,800","€1,200","€14,400"],"ans":0,"exp":"\\(1{,}200 \\times 4 =\\) **€4,800**. €14,400 would be a whole year of expenses."}],"lab":"B"}]},{"id":"basi-u3","sid":"basi-rischio","name":"Risk, time and costs","lessons":[{"key":"basi-2-3","sym":"R","title":"Risk and return","minutes":4,"pages":[{"t":"They go together","x":"Nobody pays you more without asking for something in return. A higher expected return always comes with more **risk**, that is with results that can stray far from the average, up and down.\n\nIf someone promises high returns with no risk, a piece of the story is missing."},{"t":"Not all your eggs in one basket","x":"To **diversify** means to split your money among many different securities. If one does badly, it weighs little on the total.\n\nDiversification doesn't remove all the risk: the risk tied to the whole market remains. It removes the risk of betting everything on the wrong company."}],"note":"More expected return, more risk. Diversifying reduces the risk of individual companies, not that of the market.","ex":[{"type":"mcq","q":"All your savings are in the stock of a single company. What is the most direct way to reduce the risk?","options":["Buy more stock of the same company","Split the money among many different companies","Check the price every day"],"ans":1,"exp":"Splitting the money among many companies is how you **diversify**: the trouble of a single one weighs little on the total."}],"lab":"A"},{"key":"basi-3-2","sym":"½","title":"Diversifying with numbers","minutes":5,"pages":[{"t":"Two securities, two scenarios","x":"Take two companies that react in opposite ways to the same news. Company A gains when oil rises, company B when it falls.\n\n| Scenario | A | B | Half and half |\n|---|---|---|---|\n| Oil up | +20% | −5% | +7.5% |\n| Oil down | −10% | +15% | +2.5% |\n\nWith all the money on A the result ranges from +20% to −10%. With half on A and half on B it ranges from +7.5% to +2.5%: same world, far fewer surprises."},{"t":"How to do the math","x":"A portfolio's return is the average of the securities' returns, weighted by how much you put in each:\n\n$$R_p = w_A \\times R_A + w_B \\times R_B$$\n\nWhere \\(R_p\\) is the portfolio's return, \\(w_A\\) and \\(w_B\\) are the fractions put in the two securities, which add up to 1, and \\(R_A\\) and \\(R_B\\) are their returns.\n\nOil up: \\(0.5 \\times 20\\% + 0.5 \\times (-5\\%) =\\) **+7.5%**.\n\nDiversification works when the securities **don't all move together**. Ten companies in the same sector diversify little."}],"note":"Combining securities that don't move the same way reduces the swings of the portfolio.","ex":[{"type":"mcq","q":"You have 60% in a security that returns +10% and 40% in a security that returns −5%. What does the portfolio return?","options":["+2.5%","+5%","+4%"],"ans":2,"exp":"\\(0.6 \\times 10\\% + 0.4 \\times (-5\\%) = 6\\% - 2\\% =\\) **+4%**. The +2.5% would be the simple average, right only with half and half."}],"lab":"A"},{"key":"basi-3-3","sym":"T","title":"The time horizon","minutes":5,"pages":[{"t":"When you need the money","x":"The **time horizon** is the time that passes before you need that money. It is the first question to ask, even before choosing the instrument.\n\n• Money you need **within a year or two**, like the down payment on a house: liquid, stable instruments.\n• Money you need **in ten years or more**, like retirement: it can sit in instruments that swing, because there is time to recover."},{"t":"Why a loss weighs more than it seems","x":"If an investment drops 30%, to get back to the starting point a +30% is not enough.\n\nStart with €100. After a −30% you have €70. To get back to €100 you need €30 on €70, that is a **+42.9%**.\n\n$$\\text{recovery} = \\frac{1}{1 - \\text{loss}} - 1$$\n\nWith a 50% loss the recovery needed is **100%**: the money has to double. That is why someone with little time ahead can't afford big swings."}],"note":"The later you need the money, the more swings you can bear. A loss always demands a bigger recovery in percentage terms.","ex":[{"type":"mcq","q":"An investment loses 50%. By how much must it rise to get back to its starting value?","options":["By 50%","By 100%","By 75%"],"ans":1,"exp":"From €100 you drop to €50. To get back to €100 the €50 has to double: **+100%**."},{"type":"mcq","q":"You need €20,000 in eight months for the down payment on a house. Where does it make the most sense to keep it?","options":["In a liquid, stable instrument","In stocks, to make it grow","In a fund that invests in a single sector"],"ans":0,"exp":"Eight months is a short horizon: if stocks fall you don't have time to recover. You need **liquid, stable** instruments."}],"lab":"A"},{"key":"basi-3-4","sym":"−%","title":"Costs","minutes":5,"pages":[{"t":"Small percentages, big amounts","x":"Every instrument has a cost: management fees, purchase fees, sale fees. They look like small numbers because they are expressed as a percentage per year, but they are paid **every year** and on the **total** invested, not only on the gains.\n\nThe return before costs is called **gross**, what is left to you is **net**:\n\n$$\\text{net} \\approx \\text{gross} - \\text{costs}$$\n\nA fund that returns 5% before costs and costs 1.5% a year leaves you about **3.5%**."},{"t":"Thirty years later","x":"You invest €10,000 for 30 years in two instruments that both return 6% a year before costs. The first costs 0.2% a year, the second 2%. Assumptions: no other contributions, costs taken out every year.\n\n| Annual cost | Net | After 30 years |\n|---|---|---|\n| 0.2% | 5.8% | €54,271 |\n| 2.0% | 4.0% | €32,434 |\n\nThe difference is about **€21,800**, more than double the amount invested. It is compound interest working in reverse: costs take out money that would have kept earning."}],"note":"Costs are paid every year and compound like interest. All else equal, the instrument that costs less leaves you more.","ex":[{"type":"mcq","q":"A fund returns 7% a year before costs and costs 1.8% a year. About how much is left to you?","options":["5.2%","8.8%","7%"],"ans":0,"exp":"\\(7\\% - 1.8\\% =\\) about **5.2%**. Costs are taken off the return, not added to it."}],"lab":"A"}]},{"id":"basi-u4","sid":"basi-debiti","name":"Debt and credit","lessons":[{"key":"basi-4-1","sym":"P","title":"How a loan works","minutes":7,"flow":[{"type":"guess","q":"You need €3,310 for a used motorcycle. The bank lends it to you at 10% a year and you repay it in 3 equal yearly installments. How much interest do you pay it in total?","after":"Many people say €993, that is 10% of €3,310 for three years. But each installment also pays back a piece of the debt, so interest is calculated on a figure that goes down. In all it is **€683**: now let's see where it comes from.","min":0,"max":1500,"step":10,"truth":683,"near":70,"unit":"€"},{"type":"page","t":"Money today, repaid in installments","x":"**Taking out a loan means using money today that you don't have, and paying it back a little at a time.**\n\nThe bank gives you the €3,310 for the motorcycle right away: that amount is called the **principal**.\n\nBut the bank doesn't do it for free. For every year you hold its money it asks for a payment, the **interest**: here 10% of what you still owe it.\n\nEach year you pay a fixed amount, the **installment**: €1,331. Inside it are two different things:\n\n• one part pays the interest for that year;\n• the rest pays back a piece of the principal.\n\n[fig]\n\nThe more principal you repay, the less you owe the bank, and the less interest you will pay the following year.","fig":{"rows":[{"lab":"Each year's installment","val":"€1,331","segs":[[1,"Interest","pesca"],[3,"Principal repaid","az"]]}],"cap":"What each piece is worth changes from year to year: we see it next."}},{"type":"page","t":"The first year","x":"Let's work out the first installment.\n\nAt the start you owe the bank the whole €3,310. The interest for the first year is 10% of that amount:\n\n• Interest: \\(10\\% \\times 3{,}310 =\\) **€331**\n\nThe installment is €1,331. Take out the interest, and what is left pays back principal:\n\n• Principal repaid: \\(1{,}331 - 331 =\\) **€1,000**\n\n[fig]\n\nAfter the first installment you no longer owe €3,310, but \\(3{,}310 - 1{,}000 =\\) **€2,310**. Next year's interest is calculated on this figure, which is lower.","fig":{"rows":[{"lab":"The first installment","val":"€1,331","segs":[[331,"Interest","pesca","€331"],[1000,"Principal repaid","az","€1,000"]]}]}},{"type":"num","q":"Second year. Now you owe the bank €2,310, and the rate is still 10%.\n\n| Year | Interest | Principal | Balance |\n|---|---|---|---|\n| 1 | 331 | 1,000 | 2,310 |\n| 2 | **?** | | |\n\nHow much interest do you pay in the second year?","ans":231,"unit":"€","tol":0.5,"dec":0,"exp":"\\(10\\% \\times 2{,}310 =\\) **€231**. The rest of the installment, \\(1{,}331 - 231 = \\text{€}1{,}100\\), pays back principal: the debt falls to €1,210."},{"type":"num","q":"Third year. You have €1,210 of debt left at 10%, and the installment is still €1,331.\n\n| Year | Interest | Principal | Balance |\n|---|---|---|---|\n| 1 | 331 | 1,000 | 2,310 |\n| 2 | 231 | 1,100 | 1,210 |\n| 3 | 121 | **?** | |\n\nHow much principal do you repay with the last installment?","ans":1210,"unit":"€","tol":0.5,"dec":0,"exp":"Interest: \\(10\\% \\times 1{,}210 = \\text{€}121\\). Principal repaid: \\(1{,}331 - 121 =\\) **€1,210**, which is all the debt that was left. The loan is paid off."},{"type":"page","t":"The installment stays the same, the inside changes","x":"Here are the three installments one under the other. The amount is always €1,331, but look at how the inside changes.\n\n[fig]\n\nYear after year the debt goes down, so the interest goes down and the part that repays principal grows.\n\nAnd the €683 from the opening question? It is the interest of the three installments added together: \\(331 + 231 + 121 =\\) **€683**. It is the price you pay for having the motorcycle right away.\n\nFor the curious, the equal installment that makes the numbers work is found like this:\n\n$$R = C \\times \\frac{i}{1 - (1 + i)^{-n}}$$\n\nWhere \\(R\\) is the installment, \\(C\\) the principal, \\(i\\) the rate per period and \\(n\\) the number of installments.","fig":{"rows":[{"lab":"Year 1","val":"€1,331","segs":[[331,"Interest","pesca","€331"],[1000,"Principal","az","€1,000"]]},{"lab":"Year 2","val":"€1,331","segs":[[231,"Interest","pesca","€231"],[1100,"Principal","az","€1,100"]]},{"lab":"Year 3","val":"€1,331","segs":[[121,"Interest","pesca","€121"],[1210,"Principal","az","€1,210"]]}]}},{"type":"bucket","t":"As the years go by, does it go up or down?","buckets":["Goes down","Stays the same","Goes up"],"items":[["The interest portion",0,"Interest is calculated on the debt that is left, and the debt shrinks with every installment."],["The installment",1,"In this type of loan the installment is the same from the first to the last."],["The principal portion",2,"The installment is fixed and the interest goes down: what is left over to reduce the debt grows."],["The remaining balance",0,"Each installment pays back a piece of it."]]},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"The installment stays the same, but its inside changes: more interest at first, then almost only principal.","ex":[{"type":"mcq","q":"You borrow €5,000 at 8% a year. How much interest accrues in the first year?","options":["€400","€40","€800"],"ans":0,"exp":"\\(5{,}000 \\times 8\\% =\\) **€400**. In the following years the interest goes down, because the remaining balance shrinks."},{"type":"mcq","q":"In a loan with a constant installment, how does the first installment compare with the last?","options":["It has less interest and more principal","It is the same inside too","It has more interest and less principal"],"ans":2,"exp":"At the start the debt is at its highest, so interest weighs more and there is less room for principal. In the lesson's example the first installment has €331 of interest, the last €121."}],"pages":[],"lab":"A"},{"key":"basi-4-2","sym":"APR","title":"Interest rate and APR","minutes":6,"flow":[{"type":"guess","q":"Two banks offer you the same loan: same amount, same term. Bank A asks for a rate of 5%, bank B 6%. Which costs you less?","after":"The rate alone is not enough: the **fees** are missing. A loan at 5% with high fees can cost more than one at 6% with no fees. That is why every loan has two numbers: the nominal interest rate and the APR.","options":["Bank A","Bank B","You can't tell"],"ans":2},{"type":"page","t":"The rate doesn't tell the whole story","x":"When you take out a loan you pay two kinds of costs.\n\nThe first is **interest**, the payment to the bank for the money it lends you. The rate that measures it is called the **nominal interest rate**.\n\nThe second is **fees**: setting up the loan, collecting each payment, sometimes insurance the bank requires you to take out. They are not in the nominal rate.\n\nThat is why there is a second number, the **APR**, the annual percentage rate: it puts interest and mandatory fees together and tells you how much the loan really costs in a year.\n\n[fig]\n\nWhen you compare two offers, look at the APR.","fig":{"rows":[{"lab":"How much a loan costs you","val":null,"segs":[[4,"Interest: measured by the nominal rate","pesca"],[1,"Mandatory fees","giallo"]]}],"cap":"The APR measures the whole bar, the nominal rate only the first piece."}},{"type":"bucket","t":"Does it count in the APR?","buckets":["Counts in the APR","Left out"],"items":[["Interest on the loan",0,"Interest is the first piece of the APR: it is what the nominal rate measures."],["Loan processing fees",0,"They are mandatory fees for getting the loan: they count."],["Fees for collecting each payment",0,"You pay them with every installment and can't avoid them: they count."],["Mandatory insurance",0,"If you can't get the loan without the policy, its cost counts."],["Optional insurance",1,"If you can get the loan without it, it isn't a mandatory cost: it stays out."],["Late-payment interest (for those who pay late)",1,"You pay it only if you are late with your installments: it is not part of the expected cost."],["Legal fees",1,"On a mortgage you do pay them, but by rule they stay out of the APR: they are counted separately."]],"after":"What counts in the APR is whatever you are obliged to pay to get the loan. Left out are optional costs, those that arise from a delay on your part, and legal fees."},{"type":"num","q":"A €10,000 loan for one year, repaid all at the end.\n\n• Interest (nominal rate 6%): €600\n• Mandatory fees: €150, paid together with the repayment\n\nWhat is the APR, as a percentage?","ans":7.5,"unit":"%","tol":0.05,"dec":2,"exp":"Total cost: \\(600 + 150 = \\text{€}750\\).\n\n$$\\text{APR} = \\frac{750}{10{,}000} = 7.5\\%$$\n\nThe nominal rate says 6%, but the loan costs 7.5%. If the fees were paid up front, the APR would rise a bit more, because in effect you would receive less than €10,000."},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"The nominal rate is the price of the money, the APR is the price of the whole loan. You compare the APR.","ex":[{"type":"match","pairs":[["Nominal rate","The pure interest rate of the loan"],["APR","The annual cost of the loan, fees included"],["Installment","The sum you pay at each due date"],["Principal","The amount you borrowed"]]},{"type":"mcq","q":"Loan A: nominal rate 5%, APR 8.2%. Loan B: nominal rate 6%, APR 6.9%. Same amount, same term. Which costs less?","options":["Loan A","Loan B","They cost the same"],"ans":1,"exp":"What counts is the APR, which includes the fees: **B** costs 6.9% against 8.2% for A, even though it has the higher nominal rate."}],"pages":[],"lab":"A"},{"key":"basi-4-3","sym":"M","title":"The mortgage: fixed or adjustable","minutes":7,"flow":[{"type":"guess","q":"To buy a home you take out a mortgage of €150,000, to be repaid over 25 years. If the rate goes from 3% to 5%, by how much does the monthly payment go up?","after":"At 3% the payment is **€711**, at 5% **€877**: about **€166 more every month**, for 25 years. On long terms even two points of rate weigh a lot.","min":0,"max":400,"step":5,"truth":166,"near":20,"unit":"€"},{"type":"page","t":"A long loan, with the house as collateral","x":"The **mortgage** is the loan you take out to buy a home. The amount is large, so it is repaid over many years, usually between 15 and 30, with one payment each month.\n\nTo lend so much and for so long the bank wants a guarantee: the house itself. If you stop paying, it can have it sold and take its money back. This guarantee is called a **lien**.\n\nOver such long periods interest weighs a lot. Look at how much you repay in all for €150,000 over 25 years:\n\n[fig]\n\nSame house, same amount: two more points of rate mean almost €50,000 more in interest.","fig":{"rows":[{"lab":"With the rate at 3%","val":"€213,395","segs":[[150000,"Principal","az","€150,000"],[63395,"Interest","pesca","€63,395"]]},{"lab":"With the rate at 5%","val":"€263,066","segs":[[150000,"Principal","az","€150,000"],[113066,"Interest","pesca","€113,066"]]}]}},{"type":"page","t":"Fixed or adjustable","x":"When you sign a mortgage you choose how the rate will behave over the years.\n\nWith a **fixed rate** the rate stays what it was on day one, and so does the payment: you already know today how much you will pay in twenty years.\n\nWith an **adjustable rate** the rate follows a market benchmark rate, to which the bank adds a fixed markup, the **spread**. If market rates go up, your payment goes up; if they fall, it falls.\n\nThe adjustable often starts from a lower payment, but the risk that it rises is yours. The fixed often costs a bit more at the start: it is the price of certainty."},{"type":"bucket","t":"Fixed or adjustable?","buckets":["Fixed rate","Adjustable rate"],"items":[["The payment stays the same to the end",0,"It is the fixed rate that locks the payment for the whole term."],["It follows a market rate plus the spread",1,"That is exactly the definition of an adjustable rate."],["If rates go up, the payment goes up",1,"With a fixed rate the payment doesn't move: it only happens with the adjustable."],["You already know today how much you will pay in 20 years",0,"Only the fixed rate gives you this certainty."],["If rates fall, you pay less",1,"The adjustable follows the market even when it falls."]]},{"type":"lever","t":"Find a payment that fits","x":"A mortgage of €150,000. Move rate and term and see what happens to the payment and to total interest.","model":"mutuo","params":{"C":150000},"sliders":[{"id":"tasso","label":"Rate","min":2,"max":6,"step":0.25,"start":5,"unit":"%","dec":2},{"id":"anni","label":"Term","min":10,"max":30,"step":5,"start":20,"unit":"years"}],"goals":[{"label":"Bring the payment to €800 or less","cond":[["rata","<=",800]],"hint":"Lengthening the term isn't enough: try lowering the rate too."},{"label":"Now also keep total interest under €80,000","cond":[["rata","<=",800],["interessi","<",80000]],"hint":"More years means more interest: try lowering the rate further or shortening the term."}],"after":"Lengthening the term lowers the payment, but raises total interest. To keep both low you need a lower rate: that is why it pays to compare several offers before signing."},{"type":"ex","i":0}],"note":"Fixed: a certain payment. Adjustable: a payment that follows market rates. The choice depends on how much room you have if the payment goes up.","ex":[{"type":"mcq","q":"You have an adjustable-rate mortgage and market rates go up. What happens to your payment?","options":["It goes up","It goes down","It stays the same"],"ans":0,"exp":"An adjustable rate follows the market: if rates go up, your payment **goes up** too. With a fixed rate it would have stayed the same."}],"pages":[],"lab":"A"},{"key":"basi-4-4","sym":"!","title":"When debt works against you","minutes":7,"flow":[{"type":"guess","q":"You paid for a sofa and a phone with a credit card: €2,000 of debt, at 18% a year. For 5 years you pay only the interest. How much have you paid in all at the end?","after":"Each year the interest is \\(2{,}000 \\times 18\\% = \\text{€}360\\). In 5 years that makes **€1,800**, and you still owe all the original €2,000.","min":0,"max":3000,"step":50,"truth":1800,"near":150,"unit":"€"},{"type":"page","t":"The debt that doesn't go down","x":"Some credit cards let you pay back what you spend a little at a time. They are called **revolving** cards. It looks convenient, but the rate is often very high, and the minimum payment they ask for covers almost only the interest.\n\nWith €2,000 of debt at 18% a year the interest is €360 a year, that is €30 a month. If you pay €30 a month, everything you pay goes to the bank as interest and the debt stays put.\n\n[fig]\n\nThe debt only goes down with what you pay **on top of** the interest.","fig":{"rows":[{"lab":"Paid in 5 years","val":"€1,800","segs":[[1800,"All interest","pesca"]]},{"lab":"Debt that remains","val":"€2,000","segs":[[2000,"Same as day one","az"]]}]}},{"type":"lever","t":"Pay off the debt","x":"€2,000 of debt at 18% a year, that is 1.5% a month. Decide how much to pay each month.","model":"carta","params":{"debito":2000,"tasso":18},"sliders":[{"id":"rata","label":"Monthly payment","min":30,"max":200,"step":10,"start":30,"unit":"€"}],"goals":[{"label":"Pay off the debt within 2 years","cond":[["mesi","<=",24]],"hint":"With €30 you pay only the interest. Go up until the time drops to 2 years."}],"after":"With €30 a month you never finish. With €100 you pay it off in 2 years and pay about €396 in interest. The more you pay each month, the less the debt costs you."},{"type":"page","t":"Which debt to pay off first","x":"Money you use to reduce a debt stops costing you interest. It is like a safe investment that earns as much as the rate on the debt.\n\nYou have €1,000 free. See what happens in one year:\n\n• in the savings account at 3% you earn €30;\n• used to reduce the card at 18%, you save €180 of interest.\n\n[fig]\n\nThat is why it usually pays to pay off the debts with the highest rate first.","fig":{"rows":[{"lab":"In the savings account at 3%","val":"€30","segs":[[30,"Interest earned","menta"]]},{"lab":"Paying down debt at 18%","val":"€180","segs":[[180,"Interest saved","menta"]]}],"cap":"In one year, with the same €1,000."}},{"type":"order","t":"You have some free money: in what order do you use it?","items":["Emergency fund","Highest-rate debts","Investments"],"after":"It is a rule of thumb: first safety, then expensive debts, then the rest."},{"type":"num","q":"You have a card debt at 18% a year and you reduce it by €500. How much interest do you save in a year?","ans":90,"unit":"€","tol":0.5,"dec":0,"exp":"\\(500 \\times 18\\% =\\) **€90** a year. In a savings account at 3% the same €500 would earn €15."},{"type":"ex","i":0}],"note":"A debt at 18% costs more than almost any investment earns. Paying it off is the safest return you have.","ex":[{"type":"mcq","q":"You have €1,000 free, a card debt at 18% and a savings account that earns 3%. What is the best thing to do?","options":["Put it in the savings account","It makes no difference","Pay down the card debt"],"ans":2,"exp":"Paying down the debt saves you €180 of interest in a year, against the €30 you would earn in the savings account."}],"pages":[],"lab":"A"},{"key":"basi-4-5","sym":"0%","title":"Buying in installments","minutes":7,"flow":[{"type":"guess","q":"A €1,200 TV in 12 installments at zero interest. The contract has €30 of setup fees and €2 of fees on each installment. How much do you pay in all?","after":"The rate really is zero: you pay no interest. But you pay €30 for setup and \\(2 \\times 12 = \\text{€}24\\) on the installments: in all **€1,254**. Those extra €54, over a year, make an APR of 8.75%. Zero rate means a zero nominal rate, not zero cost.","min":1200,"max":1400,"step":2,"truth":1254,"near":10,"unit":"€"},{"type":"page","t":"Where the cost hides","x":"**In an installment purchase, the price of the loan isn't only in the interest.**\n\nThe **nominal interest rate** measures interest. The **APR** puts interest and fees together: it is the only number that tells you how much the loan really costs in a year.\n\nFees are usually found in three places.\n\n• **Setup fees**, paid once at the start.\n• **Collection fees** on each installment and, in Italy, the stamp duty on the contract.\n• **Insurance** sold together with the loan. If it is optional you can refuse it. If it is mandatory to get the loan, its cost has to be inside the APR.\n\nA reference point for telling whether an offer is expensive: in Italy, the Bank of Italy's survey of spring 2026 puts the average APR of loans to buy goods at 11.3%, and of personal loans at 12.1%."},{"type":"lever","t":"Zero rate, but not zero APR","x":"A €1,200 purchase at zero interest. Move the fees and the number of installments.","model":"rate","params":{"prezzo":1200},"sliders":[{"id":"pratica","label":"Setup fees","min":0,"max":100,"step":10,"start":30,"unit":"€"},{"id":"incasso","label":"Fees per installment","min":0,"max":5,"step":0.5,"start":2,"unit":"€","dec":2},{"id":"mesi","label":"Number of installments","min":6,"max":36,"step":6,"start":12,"unit":""}],"goals":[{"label":"Bring the APR under 5%","cond":[["taeg10","<",50]],"hint":"The rate is already zero: the APR only drops by taking out fees."},{"label":"Now put back €30 of setup and €2 per installment, and go down to 6 installments","cond":[["pratica",">=",30],["incasso",">=",2],["mesi","<=",6]],"hint":"Put the fees back to the starting values, then shorten the plan."}],"after":"With the same fees, over 6 installments the APR rises to almost 13%. Fixed costs weigh more on small, short loans: that is why, on an installment purchase, even small fees matter."},{"type":"page","t":"Your rights when you sign","x":"In Italy, an installment purchase is a credit contract, and the law gives you four rights that few people use.\n\n• **Change your mind.** You have 14 days to leave the financing without saying why.\n• **Pay off early.** You can repay everything early whenever you want, and the costs of the loan are reduced for the time you don't use.\n• **Stop the installments if the goods don't arrive.** If the seller doesn't deliver, or delivers something different, and doesn't put it right after your reminder, you can also have the financing linked to the purchase dissolved.\n• **Know beforehand.** Before you sign they must give you a sheet with the APR, the installment and the total to repay, the same for all finance companies: it is there so you can compare two offers."},{"type":"page","t":"What stays on record about you","x":"In Italy, every time you apply for a loan, the application and the payments end up in **credit bureaus**, databases that finance companies check before they decide.\n\nBoth the good and the bad stay on record, for fixed periods:\n\n| What | For how long |\n|---|---|\n| A loan application | 6 months |\n| One or two late installments, then paid | 12 months |\n| More than two late installments, then paid | 24 months |\n| Installments never paid | 36 months |\n| A loan repaid regularly | 60 months |\n\nTwo practical consequences. Even a small delay follows you for a year, and can cost you a mortgage. And applying for loans from many finance companies in the same month leaves a trace that doesn't help.\n\nYou can ask to see your data for free."},{"type":"bucket","t":"Does it count in the APR?","buckets":["Yes","No"],"items":[["The interest",0,"It is the first item of the cost."],["The setup fees",0,"They are a compulsory cost of the loan."],["The insurance the finance company requires",0,"If they won't give you the loan without it, its cost counts in the APR."],["The collection fees on each installment",0,"You pay them with each installment: they are part of the cost."],["The optional insurance you chose yourself",1,"It isn't necessary to get the loan: it stays out of the APR. That is why it has to be looked at separately."],["The late fee for an installment paid late",1,"The APR is calculated as if you always paid on time."]],"after":"The APR counts everything you have to pay no matter what. What you add yourself, or what comes from a delay, stays out."},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"Zero rate means a zero nominal rate: the cost is in the fees, and the APR measures it. In Italy you have 14 days to change your mind, and delays stay on record for at least a year.","ex":[{"type":"mcq","q":"A loan has a nominal rate of 0% and an APR of 9%. What does that mean?","options":["That it costs nothing","That there is no interest, but there are fees","That there's an error in the contract"],"ans":1,"exp":"The nominal rate measures only interest, the APR fees too. With a zero nominal rate and an APR of 9% there is no interest, but there are fees: they are the cost of the loan."},{"type":"mcq","q":"In Italy, you signed a financing agreement for a sofa yesterday and have changed your mind. What can you do?","options":["Leave the contract: you have 14 days","Nothing: the signature is final","Leave only by paying a penalty"],"ans":0,"exp":"On credit contracts you have 14 days to withdraw, without having to give any explanation."},{"type":"mcq","q":"In Italy, you paid two installments late, then caught up. For how long does the record stay in the credit databases?","options":["It is deleted right away","6 months","12 months"],"ans":2,"exp":"A delay of one or two installments, then paid, stays visible for 12 months from the moment you catch up. Beyond two installments the months become 24."}],"pages":[],"lab":"B"},{"key":"basi-4-6","sym":"3×","title":"Buy now, pay later","minutes":6,"flow":[{"type":"guess","q":"You pay for a €300 purchase in three interest-free installments, with a buy now, pay later service. Who pays for the cost of the service?","after":"The **store** pays it, with a fee on each sale. It is worth it to them, because people who can split a payment buy more often and spend more. That is the point to remember: the service is free for you because it works by getting you to buy.","options":["Nobody: it is free for everyone","The store, with a fee","You, with a higher price"],"ans":1},{"type":"page","t":"How it works","x":"**Buy now, pay later is a small interest-free loan, granted in a few seconds at the checkout.**\n\nUsually the price is split into three or four installments: the first right away, the others each month, taken automatically from your card.\n\nIf you pay on time it costs nothing. That is why it feels different from a debt, but it is a debt in every respect.\n\nThere are three risks, and none is written in large letters.\n\n• **You buy more.** A €300 expense that becomes €100 feels smaller.\n• **The installments add up.** Three purchases with three different services are three installment plans, and nobody shows you the monthly total.\n• **Delay costs money.** If there is no money on the card when the installment comes due, late fees can apply, and the delay can be reported."},{"type":"num","q":"In October Elena makes three purchases with buy now, pay later, each in 3 equal installments:\n\n• shoes for €240\n• a jacket for €180\n• headphones for €90\n\nHow much will be taken from her card in all in November?","ans":170,"unit":"€","tol":0.5,"dec":0,"exp":"Each purchase divided by three: \\(80 + 60 + 30 =\\) **€170**. The same again in December. They are small installments, but they arrive together and from three different services."},{"type":"page","t":"In Italy, from November 20, 2026 it is credit in every respect","x":"For years these payments stayed outside the rules for loans. With the new European rules, in force in Italy from November 20, 2026, that is no longer the case.\n\nWhen the deferral is granted by a company other than the store, the consumer credit rules apply:\n\n• whoever grants it must first **check that you can repay**, also looking at the debts you already have;\n• it must tell you clearly the costs and the total;\n• your delays can end up in the credit databases, where the bank you ask for a mortgage will also see them.\n\nOnly the deferral that the seller grants you out of its own pocket, **free of charge** and for **no more than 50 days**, stays outside."},{"type":"bucket","t":"Do the credit rules apply?","buckets":["Yes, it is credit","No, it stays outside"],"items":[["Three interest-free installments with a payments company",0,"The deferral is granted not by the store but by a third company: it is credit."],["The store lets you pay at the end of the month, at no cost",1,"It is a free deferral from the seller, within 50 days."],["Six installments over six months offered by the store, free",0,"It goes beyond 50 days: the credit rules apply."],["The store gives you 30 days, with a €3 fee",0,"It has a cost: it is no longer a free deferral."],["You pay the gym at the end of each month",1,"You pay for a service after using it, with no extra cost."]],"after":"Only what is free, short and granted by the seller stays outside the rules."},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"Buy now, pay later is a debt without interest: free if you pay on time, but the installments add up. In Italy, from November 20, 2026, it follows the credit rules.","ex":[{"type":"mcq","q":"Why should buy now, pay later be treated as a debt, even if it has no interest?","options":["Because it always has hidden fees","Because it commits money you still have to earn","Because it raises the price"],"ans":1,"exp":"If you pay on time it costs nothing. But the installments of the coming months are money already promised: they add up with each other and with the rest of your fixed expenses."},{"type":"mcq","q":"In Italy, from November 20, 2026, what must the company that grants you three installments on a purchase do?","options":["Check beforehand that you can repay","Ask you for a guarantee on your home","Nothing different from before"],"ans":0,"exp":"Under the new rules it is consumer credit: whoever grants it must first assess whether you can repay, also considering your other debts."},{"type":"mcq","q":"You miss an installment on a purchase paid in three parts. Besides the late fee, what do you risk?","options":["Nothing: the amounts are small","That they take back the purchase","That the delay stays on record in the credit databases"],"ans":2,"exp":"Even a small debt, if paid late, can end up in the databases that banks check. You find it again when you ask for a loan or a mortgage."}],"pages":[],"lab":"B"}]},{"id":"basi-u5","sid":"basi-azienda","name":"Reading a company","lessons":[{"key":"basi-5-1","sym":"BS","title":"The balance sheet","minutes":4,"pages":[{"t":"A snapshot","x":"The **balance sheet** is a snapshot of a company on a specific day. It has two sides that always weigh the same.\n\n• The **assets**: what the company owns, like cash, inventory and equipment.\n• The **liabilities**: what it owes to others, like debts to banks and suppliers.\n• The **equity**: what is left to the owners once all debts are paid.\n\n$$\\text{Assets} = \\text{Liabilities} + \\text{Equity}$$"},{"t":"An example","x":"A company owns:\n\n• cash 50\n• inventory 150\n• equipment 300\n\nTotal assets: **500**.\n\nIt owes 320 to banks and suppliers. Equity is what is left over:\n\n\\(500 - 320 =\\) **180**\n\nIf the company earns and doesn't distribute profits, equity rises. If it loses, it falls."}],"note":"\\(\\text{Assets} = \\text{liabilities} + \\text{equity}\\). It is an equality that always holds, for every company.","ex":[{"type":"mcq","q":"A company has assets of 800 and liabilities of 500. What is the equity worth?","options":["1,300","500","300"],"ans":2,"exp":"\\(800 - 500 =\\) **300**. Adding the two figures is the typical mistake: equity is what is left over after the debts."},{"type":"mcq","q":"A company ends the year with a loss and the owners put in no more money. What happens to equity?","options":["It falls","It rises","It stays the same"],"ans":0,"exp":"The loss reduces what is left to the owners: equity **falls**. It rises when the company earns and keeps the profits in the company."}],"lab":"A"},{"key":"basi-5-2","sym":"IS","title":"The income statement","minutes":5,"pages":[{"t":"A movie, not a snapshot","x":"The **income statement** tells the story of a period, usually a year: how much the company took in from sales, the **revenue**, and how much it spent, the **costs**. What is left is the **profit**.\n\nYou work down in steps:\n\n• revenue minus the cost of goods sold = **gross margin**\n• minus operating expenses, like salaries and rent = **operating income**\n• minus interest and taxes = **net income**"},{"t":"An example","x":"| Item | Amount |\n|---|---|\n| Revenue | 1,000 |\n| Cost of goods sold | −600 |\n| **Gross margin** | 400 |\n| Operating expenses | −250 |\n| **Operating income** | 150 |\n| Interest | −30 |\n| Taxes (30% of 120) | −36 |\n| **Net income** | 84 |\n\nThe **net margin** is net income divided by revenue: \\(\\dfrac{84}{1{,}000} =\\) **8.4%**. It tells how much of every €1 of sales stays with the company."}],"note":"Revenue minus costs equals profit. Margins, as a percentage of revenue, let you compare companies of different sizes.","ex":[{"type":"match","pairs":[["Assets","What the company owns"],["Liabilities","What the company owes to others"],["Equity","What is left to the owners"],["Profit","Revenue minus costs"]]},{"type":"mcq","q":"A company has revenue of 2,000 and total costs of 1,700. What is the net margin?","options":["85%","15%","30%"],"ans":1,"exp":"\\(\\text{Profit} = 2{,}000 - 1{,}700 = 300\\). \\(\\text{Net margin} = \\dfrac{300}{2{,}000} =\\) **15%**."}],"lab":"A"},{"key":"basi-5-3","sym":"≠","title":"Profit is not cash","minutes":5,"pages":[{"t":"Two different clocks","x":"The income statement records revenue and costs when they **arise**, not when the money moves. This rule is called the **accrual basis**.\n\n• You sell goods for 100 with payment in 90 days: the revenue is there right away, the money isn't.\n• You buy a machine for 1,000 that you will use for 5 years: you pay 1,000 right away, but the income statement counts 200 a year. That portion is called **depreciation**.\n\nThat is why a company can show a profit and still run out of cash."},{"t":"Following the money","x":"The **cash flow statement** shows the real cash movements.\n\nA company ends the year with a profit of 50. Assumption: all costs were paid in cash, but customers still owe 80 for sales already counted in revenue.\n\n• Profit: +50\n• Sales not yet collected: −80\n• Change in cash: **−30**\n\nThe company earned, and yet it has 30 less in cash. Whoever evaluates a company always looks at both numbers."}],"note":"Profit measures how much you earned, cash how much money you really have. They can go in opposite directions.","ex":[{"type":"mcq","q":"A company has a profit of 120. All costs are paid, but customers still owe 200 for sales already counted. How did cash change?","options":["−80","+120","+320"],"ans":0,"exp":"\\(120 - 200 =\\) **−80**. The profit is there, but the money has not come in yet."}],"lab":"A"},{"key":"basi-5-4","sym":"P/E","title":"Price and value","minutes":5,"pages":[{"t":"What you pay for €1 of profit","x":"The price of a stock alone doesn't say whether it is expensive. A €30 stock can be more expensive than a €300 one.\n\nA first yardstick is the **price/earnings** ratio, known as the **P/E**:\n\n$$\\text{P/E} = \\frac{\\text{stock price}}{\\text{earnings per share}}$$\n\nIf the stock costs €30 and earnings per share are €2, the P/E is **15**: you pay €15 for every €1 of annual profit."},{"t":"How to read it","x":"A high P/E usually means the market expects earnings to grow strongly. A low P/E can mean a bargain, or a company in trouble.\n\n• Company A: price €30, earnings per share €2, P/E 15.\n• Company B: price €60, earnings per share €2, P/E 30.\n\nB costs double for the same earnings today. It makes sense only if its earnings will grow much faster. The P/E alone doesn't give the verdict: it helps you ask the right question."}],"note":"The P/E tells how much you pay for each €1 of profit. It is used to compare similar companies, not as a final judgment.","ex":[{"type":"mcq","q":"A stock costs €48 and earnings per share are €4. What is the P/E?","options":["12","44","192"],"ans":0,"exp":"\\(\\dfrac{48}{4} =\\) **12**: you pay €12 for every €1 of annual profit."},{"type":"mcq","q":"Two companies in the same sector: A has a P/E of 10, B of 25. What does the comparison say?","options":["B earns more than A","A is surely a bargain","For every €1 of profit, B costs more"],"ans":2,"exp":"The P/E says how much you pay for €1 of profit: €25 with B, €10 with A. It doesn't say who earns more, and a low P/E is not necessarily a bargain: it can signal a company in trouble."}],"lab":"A"}]},{"id":"basi-u6","sid":"basi-economia","name":"The economy around you","lessons":[{"key":"basi-6-1","sym":"CB","title":"Central banks and rates","minutes":4,"pages":[{"t":"Who sets the price of money","x":"A **central bank**, like the ECB for the euro or the Federal Reserve for the dollar, sets the **policy rates**: what banks pay to borrow money from the central bank and what they receive if they deposit it there. The rates on mortgages, loans and savings accounts depend on them, in a cascade.\n\nThe ECB's main task is to keep prices stable: its goal is inflation of 2% a year over the medium term."},{"t":"Rates up, rates down","x":"• **Inflation too high**: the central bank **raises** rates. Borrowing money costs more, families and companies spend less, prices slow down.\n• **Weak economy**: it **lowers** rates. Credit costs less, spending and investment pick up.\n\nIt matters a lot for investors: when rates rise, bonds already in circulation lose value and payments on adjustable-rate mortgages go up. When they fall, the opposite happens."}],"note":"The central bank raises rates to curb inflation and lowers them to support the economy. Adjustable-rate mortgages and bonds are the first to feel it.","ex":[{"type":"mcq","q":"Inflation is well above the target. What does the central bank usually do?","options":["It lowers rates","It raises rates","It leaves everything unchanged"],"ans":1,"exp":"It raises rates: credit costs more, spending slows down and prices stop running."},{"type":"mcq","q":"The central bank lowers rates. What effect does it usually have on new mortgages?","options":["They cost less","They cost more","No effect"],"ans":0,"exp":"If money costs banks less, the rates banks charge customers usually fall too: new mortgages **cost less**."}],"us":{"title":"Central banks and rates","pages":[{"t":"Who sets the price of money","x":"A **central bank**, like the Federal Reserve (the Fed) in the US or the ECB in the euro area, sets the **policy rates**: the benchmark rates for what banks pay to borrow money. The rates on mortgages, loans and savings accounts depend on them, in a cascade.\n\nThe Fed has two tasks: stable prices and maximum employment. Its goal is inflation of 2% a year over the long run."},{"t":"Rates up, rates down","x":"• **Inflation too high**: the central bank **raises** rates. Borrowing money costs more, families and companies spend less, prices slow down.\n• **Weak economy**: it **lowers** rates. Credit costs less, spending and investment pick up.\n\nIt matters a lot for investors: when rates rise, bonds already in circulation lose value and payments on adjustable-rate mortgages go up. When they fall, the opposite happens."}],"note":"The central bank raises rates to curb inflation and lowers them to support the economy. Adjustable-rate mortgages and bonds are the first to feel it.","ex":[{"type":"mcq","q":"Inflation is well above the target. What does the central bank usually do?","options":["It lowers rates","It raises rates","It leaves everything unchanged"],"ans":1,"exp":"It raises rates: credit costs more, spending slows down and prices stop running."},{"type":"mcq","q":"The central bank lowers rates. What effect does it usually have on new mortgages?","options":["They cost less","They cost more","No effect"],"ans":0,"exp":"If money costs banks less, the rates banks charge customers usually fall too: new mortgages **cost less**."}]},"lab":"A"},{"key":"basi-6-2","sym":"FX","title":"Exchange rates","minutes":5,"pages":[{"t":"The price of a currency","x":"The **exchange rate** is the price of one currency expressed in another. If the euro/dollar rate is 1.10, with €1 you buy $1.10.\n\n• If the rate rises to 1.20 the euro has **strengthened**: with €1 you buy more dollars.\n• If it falls to 1.00 the euro has **weakened**."},{"t":"Exchange rates inside investments","x":"Whoever buys securities in another currency has two returns: that of the security and that of the exchange rate.\n\nYou buy American stocks for $1,100 when the rate is 1.10: you spend **€1,000**. Assumption: after a year the stocks are still worth $1,100, but the rate has risen to 1.20.\n\n$$\\frac{1{,}100}{1.20} = 916.67$$\n\nIn euros you have **€916.67**: you lost 8.3% without the stock moving. This is **currency risk**. It also works the other way: if the euro weakens, you gain."}],"note":"With a security in a foreign currency you gain or lose because of the exchange rate too. Stronger euro: your dollars are worth less.","ex":[{"type":"mcq","q":"You have $1,000. The euro/dollar rate goes from 1.00 to 1.25. How much are they worth now in euros?","options":["€1,250","€1,000","€800"],"ans":2,"exp":"\\(\\dfrac{1{,}000}{1.25} =\\) **€800**. The euro has strengthened, so your dollars buy fewer euros."},{"type":"mcq","q":"The euro/dollar rate goes from 1.10 to 1.00. What happened to the euro?","options":["It strengthened","It weakened","Nothing changed"],"ans":1,"exp":"Before, with €1 you bought $1.10, now only $1.00: the euro **has weakened**."}],"us":{"title":"Exchange rates","pages":[{"t":"The price of a currency","x":"The **exchange rate** is the price of one currency expressed in another. If the euro/dollar rate is 1.10, one euro costs $1.10.\n\n• If the rate rises to 1.20 the euro has **strengthened**: one euro now costs $1.20, so your dollars buy fewer euros.\n• If it falls to 1.00 the euro has **weakened**: one euro costs only $1.00, so your dollars buy more euros."},{"t":"Exchange rates inside investments","x":"Whoever buys securities in another currency has two returns: that of the security and that of the exchange rate.\n\nYou buy European stocks for €1,000 when the rate is 1.10: you spend **$1,100**. Assumption: after a year the stocks are still worth €1,000, but the rate has fallen to 1.00.\n\n$$1{,}000 \\times 1.00 = 1{,}000$$\n\nIn dollars you have **$1,000**: you lost 9.1% without the stock moving. This is **currency risk**. It also works the other way: if the euro strengthens, you gain."}],"note":"With a security in a foreign currency you gain or lose because of the exchange rate too. Weaker euro: your euro stocks are worth less in dollars.","ex":[{"type":"mcq","q":"You have €1,000. The euro/dollar rate goes from 1.00 to 1.25. How much are they worth now in dollars?","options":["$800","$1,000","$1,250"],"ans":2,"exp":"\\(1{,}000 \\times 1.25 =\\) **$1,250**. The euro has strengthened, so each euro buys more dollars."},{"type":"mcq","q":"The euro/dollar rate goes from 1.10 to 1.00. What happened to the euro?","options":["It strengthened","It weakened","Nothing changed"],"ans":1,"exp":"Before, one euro cost $1.10, now only $1.00: the euro **has weakened**."}]},"lab":"A"},{"key":"basi-6-3","sym":"~","title":"The business cycle","minutes":5,"pages":[{"t":"GDP and its seasons","x":"**GDP**, gross domestic product, is the value of all the goods and services produced in a country in a year. It is the thermometer of the economy.\n\nGDP doesn't grow in a straight line. It goes through phases that repeat:\n\n• **expansion**: GDP grows, companies hire;\n• **peak**: the economy is at its maximum, inflation often rises;\n• **recession**: GDP falls, unemployment rises;\n• **recovery**: you start again from the lowest point."},{"t":"How to recognize a recession","x":"A widely used rule of thumb: there is a **recession** when GDP falls for two consecutive quarters.\n\nThe cycle matters for investors:\n\n• in a recession company earnings fall and stocks suffer;\n• central banks usually lower rates, and this helps bonds;\n• markets look ahead: often stocks recover before the recession is over.\n\nNobody knows for sure which phase we are in until it has passed. That is why a plan that holds up in every season is best."}],"note":"The economy alternates expansions and recessions. Two quarters of falling GDP are the rule of thumb for calling a recession.","ex":[{"type":"mcq","q":"A country's GDP falls for two quarters in a row. What is this phase called?","options":["Expansion","Recession","Inflation"],"ans":1,"exp":"Two consecutive quarters of falling GDP are the rule of thumb for calling a **recession**."},{"type":"mcq","q":"In a recession, what do central banks usually do?","options":["They lower rates","They raise rates","They close the stock exchanges"],"ans":0,"exp":"They lower rates, to make credit cheaper and get spending and investment going again."}],"lab":"A"}]},{"id":"basi-u7","sid":"basi-budget","name":"Income and spending","lessons":[{"key":"basi-7-1","sym":"+/−","title":"Where your money goes","minutes":6,"flow":[{"type":"guess","q":"On workdays Giulia has a coffee and a sandwich at the café: €6 a day, for about 220 days a year. How much does she spend in a year?","after":"€6 for 220 days: \\(6 \\times 220 =\\) **€1,320**, almost a month of her salary, which is €1,600. It isn't a call to give up coffee. It is the reason it pays to know where your money goes: the small amounts that repeat are the ones you notice least.","min":0,"max":3000,"step":20,"truth":1320,"near":150,"unit":"€"},{"type":"page","t":"Income, expenses, balance","x":"**To decide where to send your money, you first need to know where it goes now.**\n\nThe money that comes to you in a month is called **income**: the salary you receive in your account, a pension, rent you collect.\n\nThe money that goes out is called **expenses**: everything you pay, from rent to coffee.\n\nThe difference between the two is the month's **balance**:\n\n$$\\text{balance} = \\text{income} - \\text{expenses}$$\n\nGiulia earns €1,600 a month and spends €1,600: her balance is zero. She has no debts, but she isn't setting anything aside, and she couldn't say where it all went."},{"type":"page","t":"Fixed and variable expenses","x":"Expenses are not all the same. It helps to split them into two groups.\n\n**Fixed expenses** come back every month for the same amount, or nearly, and you don't decide them each time: rent, bills, the phone plan, the car payment.\n\n**Variable expenses** change from one month to the next and depend on what you do: grocery shopping, meals out, clothes, gas.\n\nHere is Giulia's month:\n\n[fig]\n\nFixed expenses rarely change, but when you manage it the saving repeats every month without effort. Variable ones can be changed right away, but you have to keep an eye on them every time.","fig":{"rows":[{"lab":"Giulia's expenses","val":"€1,600","segs":[[900,"Fixed expenses","az","€900"],[700,"Variable expenses","giallo","€700"]]}]}},{"type":"bucket","t":"Fixed or variable expense?","buckets":["Fixed expense","Variable expense"],"items":[["Rent",0,"It is the same amount every month and you don't decide it each time."],["Dinner at a restaurant",1,"It depends on how often you go out: it changes from one month to the next."],["Phone plan",0,"It renews every month for the same amount."],["Clothes",1,"You buy them when you decide, and the amount changes every time."],["Car payment",0,"It is set by the contract: the same every month."],["Gas",1,"It depends on how much you drive."],["Gym membership",0,"You pay it every month, whether you go or not."]]},{"type":"num","q":"Luca's month:\n\n• salary: €1,900\n• fixed expenses: €1,050\n• variable expenses: €620\n\nWhat is his balance for the month?","ans":230,"unit":"€","tol":0.5,"dec":0,"exp":"Expenses: \\(1{,}050 + 620 = \\text{€}1{,}670\\). Balance: \\(1{,}900 - 1{,}670 =\\) **€230**. That is what Luca can set aside."},{"type":"page","t":"What the balance tells you","x":"The balance is the first number to look at.\n\n• If it is **positive**, something is left over: it is the basis of your **savings**.\n• If it is **zero**, you get to the end of the month with nothing to spare, and one unexpected expense is enough to push you under.\n• If it is **negative**, you are spending more than you earn: you pay the difference from earlier savings, or with debt.\n\nTo learn your real balance, one month of attention is enough: write down every expense, even small ones, then split them into fixed and variable.\n\nBack to Giulia. Coffee and a sandwich cost her €1,320 a year, that is €110 a month. If she skipped the café on half the days, she would spend €55 less a month: her balance would go from zero to **+€55**, without changing salary."},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"\\(\\text{Balance} = \\text{income} - \\text{expenses}\\). Fixed expenses come back the same every month, variable ones depend on what you do.","ex":[{"type":"mcq","q":"In a month €2,000 comes in and €2,150 goes out. What happened?","options":["You saved €150","The balance is zero","You spent €150 more than you earned"],"ans":2,"exp":"\\(2{,}000 - 2{,}150 =\\) **−€150**. The balance is negative: you took that €150 from earlier savings, or from a debt."},{"type":"mcq","q":"Which of these is a fixed expense?","options":["Grocery shopping","The home internet subscription","A birthday present"],"ans":1,"exp":"The internet subscription comes back every month for the same amount: it is a **fixed expense**. Grocery shopping and gifts change each time: they are variable expenses."}],"pages":[],"lab":"A"},{"key":"basi-7-2","sym":"BUD","title":"A budget in three parts","minutes":7,"flow":[{"type":"guess","q":"A simple rule says to split your salary into three parts: half for what you need, 30% for what you enjoy, 20% to set aside. On €1,600 a month, how much gets set aside each month?","after":"20% of €1,600 is **€320** a month, or €3,840 in a year. Let's see how to build a plan like this, and what to do when the numbers don't add up.","min":0,"max":800,"step":10,"truth":320,"near":30,"unit":"€"},{"type":"page","t":"A plan for your money","x":"**A budget is a plan: you decide in advance where the month's money will go, instead of finding out at the end.**\n\nA simple way to do it is the **50/30/20** rule. Split your income into three parts:\n\n• 50% for **needs**: what you can't do without, such as housing, bills, food, transport to work;\n• 30% for **wants**: what makes life more enjoyable but could be cut back, such as eating out, trips, subscriptions;\n• 20% for **savings**.\n\nWith Giulia's €1,600:\n\n[fig]\n\nIt isn't a law. It's a starting point for checking whether your month is in balance.","fig":{"rows":[{"lab":"Giulia's salary","val":"€1,600","segs":[[800,"Needs","az","€800"],[480,"Wants","giallo","€480"],[320,"Savings","menta","€320"]]}]}},{"type":"bucket","t":"Need or want?","buckets":["Need","Want"],"items":[["Rent",0,"You need a roof over your head: it is a need."],["Electricity bill",0,"A home can't do without it: it is a need."],["Movie streaming subscription",1,"It is nice to have, but it can be cut if necessary."],["Groceries",0,"Eating is a need. A restaurant, on the other hand, is a want."],["Weekend at the beach",1,"It is a pleasure: it can be postponed or scaled down."],["Monthly train pass to get to work",0,"You need it to earn your salary."],["New phone, while the old one still works",1,"As long as the old one works, replacing it is a choice."]],"after":"The line is not always sharp: groceries are a need, but wants end up in the cart too. What matters is being honest with yourself."},{"type":"page","t":"When the numbers don't add up","x":"In real life the three parts rarely come out right the first time. Giulia's actual month looks like this:\n\n[fig]\n\nNeeds take €950 instead of €800, wants €600 instead of €480. That leaves €50 for savings.\n\nShe has two options, and she can use both:\n\n• cut **wants**, which is the quickest way;\n• cut **needs**, which is slower but lasts: a cheaper home, a cheaper electricity or phone plan.\n\nThere is also a trick that works: set the savings aside **as soon as your salary arrives**, with an automatic transfer, and live on what is left. That way your savings don't depend on how much is left over at the end of the month.","fig":{"rows":[{"lab":"Giulia's actual month","val":"€1,600","segs":[[950,"Needs","az","€950"],[600,"Wants","giallo","€600"],[50,"Savings","menta","€50"]]}]}},{"type":"lever","t":"Bring the month back into balance","x":"Giulia earns €1,600 a month. Move needs and wants and watch how much is left to set aside.","model":"budget","params":{"entrate":1600},"sliders":[{"id":"bisogni","label":"Needs","min":700,"max":1100,"step":10,"start":950,"unit":"€"},{"id":"desideri","label":"Wants","min":100,"max":700,"step":10,"start":600,"unit":"€"}],"goals":[{"label":"Bring savings to at least €320 a month","cond":[["risparmio",">=",320]],"hint":"The quickest way is to lower wants."},{"label":"Now reach €320 while leaving at least €450 for wants","cond":[["risparmio",">=",320],["desideri",">=",450]],"hint":"If wants don't come down, needs have to: try lowering them."}],"after":"Cutting only wants works, but leaves little room to live. Lowering a fixed expense as well, such as rent or phone plans, frees up money every month without constant sacrifices."},{"type":"num","q":"Marco earns €2,200 a month and wants to follow the 50/30/20 rule. What is the most he can put toward wants?","ans":660,"unit":"€","tol":0.5,"dec":0,"exp":"30% of €2,200 is \\(2{,}200 \\times 0.30 =\\) **€660**. Needs get €1,100 and savings €440."},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"A budget decides in advance where the money goes. Starting rule: 50% needs, 30% wants, 20% savings, set aside first.","ex":[{"type":"mcq","q":"You earn €1,800 a month. With the 50/30/20 rule, how much do you set aside?","options":["€180","€360","€540"],"ans":1,"exp":"20% of €1,800 is \\(1{,}800 \\times 0.20 =\\) **€360**. €540 is 30%, the share for wants."},{"type":"mcq","q":"Why is it better to set your savings aside as soon as your salary arrives?","options":["Because then they don't depend on how much is left at the end of the month","Because the bank pays more interest","Because fixed expenses go down"],"ans":0,"exp":"If you wait until the end of the month you only save what is left over, and often nothing is. By setting it aside straight away, saving becomes the first expense of the month, not the last."}],"pages":[],"lab":"A"},{"key":"basi-7-3","sym":"SOS","title":"The emergency fund","minutes":6,"flow":[{"type":"guess","q":"Paolo spends €1,400 a month and wants to set aside a reserve that covers 3 months of expenses, for emergencies. He saves €150 a month. How many months does he need to get there?","after":"He needs \\(1{,}400 \\times 3 = \\text{€}4{,}200\\). At €150 a month: \\(\\dfrac{4{,}200}{150} =\\) **28 months**, more than two years. It sounds like a lot, but every month that passes Paolo is a little safer. That reserve has a name: emergency fund.","min":0,"max":60,"step":1,"truth":28,"near":3,"unit":"months"},{"type":"page","t":"What it is for","x":"**The emergency fund is a sum kept aside only for the unexpected.**\n\nUnexpected expenses aren't rare, they are just hard to predict: the furnace that breaks, the car at the mechanic, a trip to the dentist, a period without work.\n\nWithout a fund you have only two ways out. You can take out a loan, which costs interest. Or you can sell what you own in a hurry, maybe at the wrong moment.\n\nWith a fund the unexpected stays an annoyance, not a debt.\n\nThat is why the **emergency fund** comes before investments: it is what lets you leave them to work in peace."},{"type":"page","t":"How big it should be","x":"The size is not the same amount for everyone: it depends on how much you spend.\n\nThe most widely used rule is to keep **3 to 6 months of expenses** aside. Expenses, not salary: what counts is how much you need to live.\n\nPaolo spends €1,400 a month:\n\n[fig]\n\nWhen is the minimum enough, and when do you need more?\n\n• Closer to **3 months** if you have a steady job and nobody depends on you.\n• Closer to **6 months**, or even more, if your income is irregular, if you are self-employed or if you have a family to support.","fig":{"rows":[{"lab":"3 months of expenses","val":"€4,200","segs":[[4200,"Minimum fund","menta"]]},{"lab":"6 months of expenses","val":"€8,400","segs":[[8400,"More cautious fund","az"]]}]}},{"type":"num","q":"Chiara spends €1,650 a month and wants an emergency fund that covers 4 months. How much does she need to set aside?","ans":6600,"unit":"€","tol":0.5,"dec":0,"exp":"\\(1{,}650 \\times 4 =\\) **€6,600**."},{"type":"page","t":"Where to keep it","x":"The emergency fund has one job: to be there when you need it. It needs two qualities.\n\n• It must be **liquid**: you must be able to use it within a few days, without penalties.\n• It must be **stable**: it must not be able to drop in value just when you need it.\n\nThat is why it doesn't go into stocks, which can lose a lot in a few months, nor into a locked investment you can't touch.\n\nIt sits well in a checking account separate from your everyday one, or in a **savings account** you can withdraw from whenever you want.\n\nIt will earn little, and that is as it should be: it isn't there to make money, it is there to protect you. And after you have used it, the first thing to do is rebuild it."},{"type":"bucket","t":"Is it an emergency fund expense?","buckets":["Yes, it is unexpected","No, it can be planned"],"items":[["Your car breaks down and you need it for work",0,"It is sudden and can't be put off: it is exactly the case for the fund."],["Summer vacation",1,"You already know it is coming: you set a little aside each month."],["Dental treatment that can't wait",0,"It is urgent and it wasn't planned."],["Christmas presents",1,"Christmas comes every year on the same date: it isn't unexpected."],["Two months without a salary",0,"It is the most important case: the fund pays your expenses until your income returns."],["The brand-new phone that just came out",1,"It is a want: you buy it with the money for wants, not with the fund."],["The car insurance, which renews every year",1,"It is an expense you already know about: it goes in the budget."]],"after":"The fund is for what is urgent, necessary and unexpected all at once. Expenses you already know about go in the budget."},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"Emergency fund: 3 to 6 months of expenses, in a liquid and stable account. It comes before investments.","ex":[{"type":"mcq","q":"Dario spends €1,200 a month, has a steady job and nobody depends on him. What is a reasonable size for his emergency fund?","options":["€1,200","€3,600","€36,000"],"ans":1,"exp":"With a steady job the minimum of the rule can be enough: 3 months of expenses, that is \\(1{,}200 \\times 3 =\\) **€3,600**. A single month is too little. €36,000 is two and a half years of expenses: too much money sitting idle."},{"type":"mcq","q":"Where does it make the most sense to keep the emergency fund?","options":["In stocks, so it grows","In an investment locked for 5 years","In an account you can withdraw from right away"],"ans":2,"exp":"It has to be liquid and stable: an account you can withdraw from whenever you want. Stocks can fall just when you need the money, and a 5-year lock blocks it."}],"pages":[],"lab":"A"},{"key":"basi-7-4","sym":"GOAL","title":"A goal, an amount, a date","minutes":7,"flow":[{"type":"guess","q":"Elena wants to buy a used car in 2 years: she needs €6,000. She starts from zero and keeps the money in an account that earns nothing. How much does she need to set aside each month?","after":"€6,000 in 24 months: \\(\\dfrac{6{,}000}{24} =\\) **€250** a month. A goal becomes a plan when it has an amount and a date.","min":0,"max":600,"step":10,"truth":250,"near":20,"unit":"€"},{"type":"page","t":"From wish to plan","x":"**A vague goal stays a wish. With an amount and a date it becomes a plan.**\n\n‘I'd like to put something aside for the car’ doesn't tell you what to do tomorrow. ‘I need €6,000 in 24 months’ does: a division is all it takes.\n\n$$\\text{monthly saving} = \\frac{\\text{amount}}{\\text{months}}$$\n\nFor Elena: \\(\\dfrac{6{,}000}{24} =\\) **€250** a month.\n\n[fig]\n\nIf €250 a month is too much, there are only three levers: a lower amount, a later date, or a revised budget that frees up more money each month.","fig":{"rows":[{"lab":"Elena's plan","val":"€6,000","segs":[[3000,"First year","menta","€3,000"],[3000,"Second year","az","€3,000"]]}],"cap":"€250 a month for 24 months."}},{"type":"lever","t":"Move the date or the amount","x":"Elena needs €6,000 for the car. Move how much she sets aside each month and for how many months.","model":"obiettivo","params":{"cifra":6000},"sliders":[{"id":"rata","label":"Monthly saving","min":50,"max":500,"step":10,"start":100,"unit":"€"},{"id":"mesi","label":"Duration","min":6,"max":48,"step":1,"start":12,"unit":"months"}],"goals":[{"label":"Reach the €6,000 she needs","cond":[["messo",">=",6000]],"hint":"You can raise the monthly saving, lengthen the duration, or both."},{"label":"Now get there setting aside at most €150 a month","cond":[["messo",">=",6000],["rata","<=",150]],"hint":"With €150 a month you need more time: lengthen the duration."}],"after":"With €150 a month it takes 40 months instead of 24. The less you set aside each month, the further away the date moves: deciding which of the two matters more is up to you."},{"type":"num","q":"You want to take a trip in 10 months and you need €1,800. How much do you need to set aside each month?","ans":180,"unit":"€","tol":0.5,"dec":0,"exp":"\\(\\dfrac{1{,}800}{10} =\\) **€180** a month."},{"type":"page","t":"Near goals and distant goals","x":"Not all goals are handled the same way. What counts is how much time is left.\n\n• **Within 2 or 3 years**, like a car or a trip: the money has to stay safe, in an account. There is no time to recover from a drop.\n• **Many years away**, like retirement: the money can be invested, because time works for you.\n\nOn long horizons part of the final amount isn't paid in by you: it is produced by returns, thanks to compound interest.\n\nHere is €250 a month for 20 years, invested at 4% a year. Assumptions: constant return, payments at the end of each month.\n\n[fig]\n\nYou paid in €60,000, but you end up with about €91,000. In reality the return changes every year, and it can be negative too: that is why you only invest money you won't need soon.","fig":{"rows":[{"lab":"After 20 years","val":"€90,960","segs":[[60000,"Paid in by you","menta","€60,000"],[30960,"Returns","az","€30,960"]]}]}},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"A goal has an amount and a date: amount divided by months gives the monthly saving. Near: keep the money safe. Distant: you can invest.","ex":[{"type":"match","pairs":[["Income","The money that comes to you in a month"],["Balance","Income minus expenses"],["Budget","The plan for how you will use your money"],["Emergency fund","Money kept aside for the unexpected"]]},{"type":"mcq","q":"You need €3,000 in 15 months. How much do you need to set aside each month, not counting interest?","options":["€150","€200","€250"],"ans":1,"exp":"\\(\\dfrac{3{,}000}{15} =\\) **€200** a month."},{"type":"mcq","q":"You have two goals: a car in 18 months and retirement in 30 years. Which money makes sense to invest in instruments that fluctuate?","options":["The money for the car","Both in the same way","The money for retirement"],"ans":2,"exp":"With 30 years ahead there is time to recover from drops and to let compound interest work. The money for the car is needed in 18 months: it has to stay safe."}],"pages":[],"lab":"A"}]},{"id":"basi-u8","sid":"basi-protezione","name":"Protecting yourself","lessons":[{"key":"basi-8-1","sym":"INS","title":"How insurance works","minutes":6,"flow":[{"type":"guess","q":"A town has 1,000 families. Every year, on average, 2 houses suffer a fire that causes €100,000 of damage. If all the families split the cost of the damage, how much does each one pay in a year?","after":"The year's damage is \\(2 \\times 100{,}000 = \\text{€}200{,}000\\). Divided among 1,000 families, that is **€200** each. With €200 a year nobody risks losing €100,000: that is the idea behind every insurance policy.","min":0,"max":1000,"step":10,"truth":200,"near":30,"unit":"€"},{"type":"page","t":"Many pay a little, a few receive a lot","x":"**Insuring yourself means paying a small, certain amount so you don't risk a big, uncertain loss.**\n\nA fire at home is rare, but if it happens to you it costs an amount you couldn't pay on your own. Nobody knows who it will hit. But we do know, quite precisely, how many there will be in all: out of 1,000 houses, about 2 a year.\n\nAn **insurance** company collects an amount from everyone every year, the **premium**, and with that money pays the damage of those who were hit. The sum that whoever suffered the damage receives is called the **payout**.\n\n[fig]\n\nThe premium is higher than the simple division of the damage, because the company has to cover its costs and make a profit.","fig":{"rows":[{"lab":"Each family's premium","val":"€260","segs":[[200,"Expected damage","az","€200"],[60,"The company's costs and profit","pesca","€60"]]}],"cap":"An example: real figures change from one policy to another."}},{"type":"page","t":"The contract is called a policy","x":"The contract you sign with the company is called a **policy**. It says:\n\n• what is covered: for example fire and flooding, but not theft;\n• how much you pay: the premium, usually once a year;\n• the most you receive if the damage happens;\n• what is left out, that is the **exclusions**: the cases where the company doesn't pay.\n\nThe exclusions are the part to read most carefully. A policy can also cost little because it covers little.\n\nIf the year goes by without damage, the premium doesn't come back. It is not money thrown away: you bought a year of protection, and with your premium the company paid whoever did have damage."},{"type":"num","q":"An insurance company covers 5,000 cars. Every year, on average, 100 of them have an accident that causes €3,000 of damage. How much should each car pay, just to cover the damage?","ans":60,"unit":"€","tol":0.5,"dec":0,"exp":"The year's damage: \\(100 \\times 3{,}000 = \\text{€}300{,}000\\). Divided among 5,000 cars: \\(\\dfrac{300{,}000}{5{,}000} =\\) **€60**. The real premium will be higher, because it includes the company's costs and profit."},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"With insurance, many people pay a small, certain premium, and whoever suffers damage receives the payout. Always read what is excluded.","ex":[{"type":"match","pairs":[["Premium","What you pay the company"],["Payout","What you receive if you suffer the damage"],["Policy","The insurance contract"],["Exclusions","The cases where the company doesn't pay"]]},{"type":"mcq","q":"You pay a €300 premium to insure your house and nothing happens during the year. What happens to the €300?","options":["It is refunded to you","It counts as next year's premium","It stays with the company: you paid for a year of protection"],"ans":2,"exp":"The premium pays for the year's protection, whether you have damage or not. With the premiums of those who had no damage, the company pays those who did."},{"type":"mcq","q":"Why is the premium higher than the average damage divided among the insured?","options":["Because it includes the company's costs and profit","Because damage is always more than expected","Because the government sets it"],"ans":0,"exp":"Besides paying for damage, the company has offices, staff and a profit to earn. In the lesson's example: €200 of expected damage plus €60 of costs and profit."}],"pages":[],"lab":"A"},{"key":"basi-8-2","sym":"DED","title":"Deductible and coverage limit","minutes":7,"flow":[{"type":"guess","q":"Anna insured her house. The contract says she pays the first €500 of every damage. A pipe breaks and the water causes €3,000 of damage. How much does the insurance reimburse her?","after":"The first €500 stay with Anna: the insurer pays \\(3{,}000 - 500 =\\) **€2,500**. That part you pay yourself is called the deductible. Together with the coverage limit, which we will see shortly, it decides what a policy is really worth.","min":0,"max":3000,"step":50,"truth":2500,"near":100,"unit":"€"},{"type":"page","t":"The part you pay","x":"**Almost no policy pays the whole damage: part of it stays with you.**\n\nThe **deductible** is a fixed amount that stays with you for every damage. With a €500 deductible:\n\n[fig]\n\nWhat is it for? It removes small damages, which would cost the company more time than money. In exchange the premium goes down: the higher the deductible, the less the policy costs.\n\nSometimes, in place of the deductible, there is a **percentage deductible**: it works the same way, but it is a percentage of the damage instead of a fixed amount.","fig":{"rows":[{"lab":"Damage of €3,000","val":null,"segs":[[500,"Deductible: you pay","pesca","€500"],[2500,"The insurer pays","az","€2,500"]]},{"lab":"Damage of €400","val":null,"segs":[[400,"Smaller than the deductible: you pay it all","pesca","€400"]]}]}},{"type":"num","q":"A policy with a €250 deductible. You have damage of €1,900. How much does the company reimburse you?","ans":1650,"unit":"€","tol":0.5,"dec":0,"exp":"\\(1{,}900 - 250 =\\) **€1,650**. The first €250 stay with you."},{"type":"page","t":"The ceiling: the coverage limit","x":"At the other extreme is the **coverage limit**: the highest amount the company pays, whatever the damage.\n\nAnna's policy has a coverage limit of €50,000. If a fire caused €80,000 of damage, the company would stop at €50,000.\n\n[fig]\n\nThat is why the coverage limit should be chosen by looking at the worst damage that can happen, not the most likely one. A policy with a low coverage limit costs less, but leaves you uncovered in exactly the case you insured against.\n\nIn short: small damages you pay yourself because of the deductible. Of enormous ones you pay the part above the coverage limit. In between, the company pays.","fig":{"rows":[{"lab":"Fire damage of €80,000","val":null,"segs":[[50000,"The insurer pays, up to the coverage limit","az","€50,000"],[30000,"Stays with you","pesca","€30,000"]]}]}},{"type":"num","q":"A policy with a €100,000 coverage limit and no deductible. The damage is €130,000. How much stays with you?","ans":30000,"unit":"€","tol":0.5,"dec":0,"exp":"The company pays up to the coverage limit: €100,000. You are left with \\(130{,}000 - 100{,}000 =\\) **€30,000**."},{"type":"bucket","t":"€500 deductible, €50,000 coverage limit: who pays?","buckets":["You pay","The insurer pays"],"items":[["A damage of €300",0,"It is smaller than the deductible: it all stays with you."],["The first €500 of a €4,000 damage",0,"That is the deductible."],["The other €3,500 of that damage",1,"With the deductible removed, the company pays the rest."],["The part above €50,000 of an enormous damage",0,"Above the coverage limit the company doesn't pay."],["A €20,000 damage, after the deductible",1,"It falls between the deductible and the coverage limit: the company pays."]]},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"Deductible: the part of every damage you pay. Coverage limit: the ceiling above which the company doesn't pay. Together they tell you what a policy is worth.","ex":[{"type":"mcq","q":"All else equal, what happens to the premium if you choose a higher deductible?","options":["It goes down","It goes up","It doesn't change"],"ans":0,"exp":"With a higher deductible you take on a bigger share of the damage. The company risks less and asks for a **lower** premium."},{"type":"mcq","q":"You have a policy with a €1,000 deductible and suffer €800 of damage. How much do you receive?","options":["€800","€200","Nothing"],"ans":2,"exp":"The damage is smaller than the deductible: it all stays with you. The company starts paying only above €1,000."}],"pages":[],"lab":"A"},{"key":"basi-8-3","sym":"COV","title":"What to really insure","minutes":6,"flow":[{"type":"guess","q":"You have €400 a year to spend on insurance. Which of these risks makes the most sense to cover first?","after":"You insure first what would ruin you, not what would only annoy you. A broken screen is paid for with the emergency fund. Serious harm done to another person can cost more than you earn in many years.","options":["The phone screen that breaks","Serious harm done to another person","A flight delay"],"ans":1},{"type":"page","t":"Big and rare, small and frequent","x":"**The right question is not how likely it is, but: what happens to me if it happens?**\n\nEvery risk falls into one of these two boxes.\n\n• **Small damages**, even if frequent: the broken phone, the washing machine to replace, a fine. They annoy you, but you can pay them with the budget or the emergency fund. Insuring them is rarely worth it: on average the premiums you pay exceed the payouts you receive, and you could have absorbed that damage yourself.\n• **Big damages**, even if rare: the house destroyed, serious harm done to another person, an illness that keeps you from working for a long time. You can't pay them on your own. That is what insurance exists for.\n\n[fig]\n\nThe emergency fund and insurance work together: the first covers small damages, the second those that the fund could never cover.","fig":{"rows":[{"lab":"Phone screen","val":"€200","segs":[[200,"The emergency fund covers it","menta"]]},{"lab":"Serious harm to another person","val":"€300,000","segs":[[300000,"You need insurance","az"]]}],"cap":"Example figures. The short bar is already longer than the true one: to scale it wouldn't be visible."}},{"type":"page","t":"Damage done to others","x":"There is a risk many people forget: causing damage to someone else.\n\nIf because of you a person gets hurt or something breaks, the law obliges you to pay compensation. This obligation is called **liability**, and the insurance that covers it is liability insurance.\n\nFor drivers it is so important that the law makes it mandatory almost everywhere: without **auto liability insurance** you can't drive. A serious accident can cost a six-figure sum, and without a policy you would have to pay it yourself.\n\nIt exists outside the car too. A liability policy for everyday life covers, for example, the flowerpot that falls from your balcony or the damage done while riding a bicycle. It usually costs little, because these cases are rare, but it covers very high amounts."},{"type":"bucket","t":"Insurance or emergency fund?","buckets":["Insurance","Emergency fund"],"items":[["A fire in your home",0,"It is an enormous damage, which you couldn't pay on your own."],["The washing machine to replace",1,"It costs a few hundred: that is the emergency fund's job."],["Serious harm done to another person",0,"It can cost very high amounts: you need liability insurance."],["The broken phone screen",1,"It is a small expense: you pay it with the money set aside."],["An illness that keeps you from working for years",0,"Losing income for a long time is one of the biggest risks."],["A flat tire",1,"It is a nuisance that costs very little."]]},{"type":"order","t":"What comes first?","items":["Insurance required by law","The risks that would ruin you","Small damages, if you really want"],"x":"Tap the items from the most important to the least important.","after":"First what the law requires, then what you could never pay on your own. Small damages come last, and it is often better to leave them to the emergency fund."},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"You insure what would ruin you, not what annoys you. Small damages are covered by the emergency fund.","ex":[{"type":"mcq","q":"Which risk makes the most sense to insure?","options":["A rare but enormous damage","A frequent but small damage","A small and rare damage"],"ans":0,"exp":"Insurance is for the losses you couldn't bear on your own. Small damages are paid with the emergency fund."},{"type":"mcq","q":"Why is it usually not worth insuring a €150 item?","options":["Because you can bear that loss yourself, and on average premiums exceed payouts","Because it is forbidden","Because companies never pay"],"ans":0,"exp":"A €150 loss annoys you but doesn't put you in difficulty. And since the premium includes the company's costs and profit, on average you pay more than you receive."}],"pages":[],"lab":"A"},{"key":"basi-8-4","sym":"!!","title":"Spotting a scam","minutes":7,"flow":[{"type":"guess","q":"You are offered an investment that pays 10% a month, guaranteed. If it were true, how much would €1,000 become after 5 years?","after":"10% a month for 60 months gives \\(1{,}000 \\times 1.10^{60}\\), which is about **€304,000**. No real business grows like that, and if one existed it would not need your money. A return that high, and on top of that guaranteed, is the first sign of a scam.","options":["About €6,000","About €60,000","More than €300,000"],"ans":2},{"type":"page","t":"High and guaranteed don't go together","x":"**Whoever promises you high, safe gains is hiding something from you.**\n\nReturn and risk go together. A savings account pays a few points a year precisely because the risk is low. To earn more you have to accept that things can go wrong.\n\nThat is why two words never go together: **high** and **guaranteed**.\n\n[fig]\n\nWhoever offers 10% a month is offering, in a single month, more than triple what a prudent investment returns in a whole year. If it were true, banks would be lining up to lend them money at much less.","fig":{"rows":[{"lab":"A savings account, in one year","val":"3%","segs":[[3,"Return","menta"]]},{"lab":"The offer, in one month","val":"10%","segs":[[10,"Promised return","rosa"]]}],"cap":"The 3% is an example: a savings account returns a few points a year."}},{"type":"page","t":"How a Ponzi scheme works","x":"The most common scam has a name: the **Ponzi scheme**. There is no investment at all. The gains paid to the first arrivals are the money paid in by the last.\n\nHere is how it runs, with the promised 10% a month.\n\n• 100 people pay in €1,000 each. There is €100,000 in the pot.\n• Every month the scammer pays 10%, that is €10,000. The money comes out of the pot.\n• The first ones are paid on time, they trust it and bring friends. The new money covers the payments.\n• When new arrivals slow down, the pot empties. The payments stop and the principal is gone.\n\n[fig]\n\nWhoever gets in first sometimes really does earn, and that is what makes the scheme credible. But the money they collect is what was lost by those who came after.","fig":{"rows":[{"lab":"Paid in by 100 people","val":"€100,000","segs":[[100000,"Money in the pot","az"]]},{"lab":"Paid out as gains over 10 months","val":"€100,000","segs":[[100000,"The same money, returned in pieces","pesca"]]}],"cap":"With no new arrivals the pot lasts 10 months. Then nothing is left."}},{"type":"num","q":"A scheme promises 5% a month. 200 people have joined, with €2,000 each. How much must the scammer pay each month to keep the promise?","ans":20000,"unit":"€","tol":0.5,"dec":0,"exp":"There is \\(200 \\times 2{,}000 = \\text{€}400{,}000\\) in the pot. 5% of €400,000 is **€20,000** a month. No investment produces that: it comes out of the pot, that is, out of the money of those who paid in."},{"type":"page","t":"The signs to recognize","x":"Scams change shape, but the signs are almost always the same.\n\n• **High, guaranteed returns**: it is the clearest sign.\n• **Hurry**: the offer expires today, spots are running out. It is there to stop you from thinking.\n• **Lack of clarity**: it is not clear where the gains come from, and questions get vague answers.\n• **Rewards for bringing friends**: the new money is used to pay the old.\n• **No authorization**: to collect savings you need an authorization. In Italy the lists of who is authorized are public, on the websites of Consob and the Bank of Italy.\n\nBefore sending any money, do three things: check those lists, ask for everything in writing and take a few days. A serious offer will still be there in a week."},{"type":"bucket","t":"Warning sign or normal?","buckets":["Warning sign","Normal"],"items":[["A guaranteed return of 5% a month",0,"High and guaranteed together doesn't exist."],["They tell you the value can also go down",1,"It is what a serious operator has to tell you: every investment carries a risk."],["The offer is only valid if you sign today",0,"The hurry is there to stop you from thinking."],["They hand you a document with costs and risks",1,"Putting everything in writing is a sign of seriousness."],["You earn more if you bring other investors",0,"It is the mechanism that keeps a Ponzi scheme standing."],["Whoever is offering is on the list of authorized operators",1,"It is the first check to make, and here it went well."],["They don't explain where the gains come from",0,"If you don't understand how money is made, don't invest."]]},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"A high, guaranteed return doesn't exist. Distrust hurry, ask where the gains come from and check that whoever is offering is authorized.","ex":[{"type":"mcq","q":"In a Ponzi scheme, where do the gains paid to the first investors come from?","options":["From the money paid in by those who join later","From the profits of a real investment","From the central bank"],"ans":0,"exp":"There is no investment at all: the first ones' gains are the **money paid in by the last**. That is why the scheme holds up only as long as new people keep arriving."},{"type":"mcq","q":"An acquaintance offers you a safe investment at 4% a month and asks you to decide by tonight. What do you do?","options":["I pay in right away, before the spots run out","I pay in only a small amount, to try","I pay in nothing and check whether the person offering it is authorized"],"ans":2,"exp":"High return, guarantee and hurry are three warning signs together. Even a small amount risks being lost, and the first on-time payments are there precisely to get you to pay in more."}],"pages":[],"lab":"B"},{"key":"basi-8-5","sym":"SMS","title":"Phishing and identity theft","minutes":7,"flow":[{"type":"guess","q":"A text message arrives in the same conversation where your bank sends you your codes: ‘Unusual account access. Verify now at this link.’ What do you think?","after":"The sender name of a text message and the number of whoever calls you can be faked: it is called **spoofing**. That is why a fake message can show up in the same conversation as the real ones. Since 2025 Italian carriers have blocked many calls from abroad that display a fake Italian number, but the trick has not gone away. The sender, on its own, never proves who is writing.","options":["It is real: it is in the bank's conversation","It could be fake: the sender can be copied","Opening the link is enough to tell"],"ans":1},{"type":"page","t":"Three channels, the same trick","x":"**A scammer doesn't force the door: they talk you into opening it.**\n\n• **Phishing**: an email that imitates the bank, the post office, a courier, a government agency.\n• **Smishing**: the same message, by text or chat.\n• **Vishing**: a phone call. It often comes right after the message: a fake operator, kind and well prepared, who guides you step by step.\n\nThe pattern is always the same: an urgent problem (the account blocked, the package held up, a refund on the way), a link to open or a number to call, and at the end a request for data or codes.\n\nThree rules are almost always enough.\n\n• The bank never asks for passwords, PINs or codes: not by email, not by text, not by phone.\n• Don't go in through the link. Open the app yourself, or type the address yourself.\n• If they call you, hang up and call back yourself, at the number on the card or on the website."},{"type":"bucket","t":"Trap or normal?","buckets":["Trap","Normal"],"items":[["Text message: account suspended, log in from this link",0,"Urgency plus a link: it is the classic pattern."],["The app asks for your fingerprint for a payment you are making",1,"It is strong authentication, and you started the payment."],["An operator asks you for the code that arrived by text",0,"Codes are for authorizing, never for blocking. No real operator asks for them."],["Courier email: pay €1.99 to release the package",0,"The small amount is there to get you to enter your card details."],["App notification for a login you just made",1,"It is a security alert, and it matches what you were doing."],["They tell you to move your money to a safe account",0,"The safe account is the scammer's. No bank asks for that."]]},{"type":"page","t":"When they steal your name","x":"**Scammers need more than your money: they need your data too.**\n\nWith a photo of an ID, the tax code (codice fiscale) and a fake pay stub, someone can apply for a loan in your name. They collect the money. The unpaid installments stay recorded under your name.\n\nIt is called **identity theft**. In Italy in 2025 more than 38,000 cases were uncovered, for over €165 million: on average €4,300 each.\n\nYou often find out late: from a reminder letter, or from financing that is refused to you for no reason.\n\nHow to reduce the risk:\n\n• don't send photos of your documents to people you don't know, not even for a rental or sale listing;\n• protect your email inbox with a password used nowhere else and with two-step verification: whoever gets in there can reset the passwords for everything else;\n• every so often check what is recorded in your name at the credit bureaus: asking for it is free."},{"type":"order","t":"Your data has been used: in what order do you move?","items":["You block cards and access, from the app or the toll-free number","You change your passwords, starting with email","You file a report with the Polizia Postale, the Italian police unit for online crime","You send the report to the bank and the finance companies"],"x":"Tap the moves from the first to the last.","after":"First you stop the damage, then you document it. With the report in hand you dispute in writing the payments and loans you didn't ask for, and have the records in your name at the credit bureaus corrected."},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"The sender can be faked: never go in through a link and never give codes to anyone. Protect your documents and email. If your data is used: block, change your passwords, report, dispute.","ex":[{"type":"mcq","q":"You get an email from your bank with a link to update your details. What is the safe way to check?","options":["Open the link and see whether the site looks real","Open the bank's app yourself, without going through the link","Reply to the email and ask for confirmation"],"ans":1,"exp":"A fake site can be identical to the real one, and whoever sent the email is the one who answers it. The only safe check is to go in on your own, from the app or by typing the address."},{"type":"mcq","q":"Why does the email inbox need more protection than any other service?","options":["Because from there you can reset the passwords for almost everything","Because it is the hardest to get back into","Because it contains advertising"],"ans":0,"exp":"Almost every service lets you reset your password with a link sent by email. Whoever controls your email can get into all the others, one at a time."},{"type":"mcq","q":"A finance company sends you reminders for the installments of a loan you never applied for. What do you do?","options":["You pay, to avoid being reported","You ignore the letter","You file a report and dispute the loan in writing"],"ans":2,"exp":"Paying would mean acknowledging a debt that isn't yours, and ignoring the letter lets the problem grow. With the report you dispute the loan and ask for the records in your name to be deleted."}],"pages":[],"lab":"B"},{"key":"basi-8-6","sym":"LIFE","title":"Life insurance: protection or investment?","minutes":7,"flow":[{"type":"guess","q":"Marco is 35, has two children and a mortgage. He wants his family to receive €200,000 if he dies in the next 20 years. How much does a policy that does only this cost each year?","after":"A **term life insurance** policy usually costs between €200 and €800 a year for amounts between €100,000 and €300,000, depending on age and health. It costs little because it pays only if the event happens, and at 35 that is rare. If at expiration Marco is alive he receives nothing: he bought protection, not an investment.","options":["A few hundred","About €2,000","About €6,000"],"ans":0},{"type":"page","t":"Two products with the same name","x":"**Two very different products are sold under the name life insurance: one protects, the other invests.**\n\n• The **protection policy** is term life insurance. You pay a premium every year and, if you die within the chosen term, the people you named receive the death benefit. If at expiration you are alive, you receive nothing.\n• The **investment policy**: you pay in money, the company invests it and later returns a lump sum to you. It can be a **with-profits policy**, linked to a prudent management by the company, or a **unit-linked policy**, linked to funds: there the value goes up and down, and the risk is yours.\n\nMany policies mix the two. That is why, before signing, the question is one: do I need to protect someone, or to grow some money?"},{"type":"page","t":"Who needs protection","x":"The question to ask is: **if my income disappeared tomorrow, who would be left in difficulty?**\n\n• Young children, a partner who earns less, a mortgage to pay: protection is needed.\n• Nobody depends on your income: as a rule it is not needed.\n\nHow big a death benefit? A simple way: the debt left on the mortgage, plus a few years of the family's expenses.\n\nFour things to know.\n\n• The premium depends on age, health and smoking: the younger you are, the less it costs.\n• Answer the health questions precisely: a false answer can cause the payment to be refused.\n• In Italy, premiums give a 19% tax credit, calculated on a maximum of €530 a year.\n• In Italy, the sum paid to your loved ones is exempt from IRPEF and does not enter the estate: it goes to whoever you named."},{"type":"num","q":"Giulia and Paolo have a mortgage with €120,000 of debt and spend €24,000 a year. They want to cover the mortgage plus three years of expenses. What amount do they insure?","ans":192000,"unit":"€","tol":0.5,"dec":0,"exp":"Three years of expenses: \\(24{,}000 \\times 3 = \\text{€}72{,}000\\). Plus the mortgage: \\(120{,}000 + 72{,}000 =\\) **€192,000**."},{"type":"page","t":"When the policy is an investment","x":"An investment policy has real advantages: you choose who receives the money, without going through the estate, and as a rule those sums can't be seized.\n\nIt also has a price. Inside are the company's costs, the funds' costs and often a **premium charge**, that is, a percentage withheld on every payment. A Bank of Italy study measured that a unit-linked policy costs on average between 0.5 and 2.5 points a year more than buying the same funds directly.\n\nIt seems little. Over 20 years it is not:\n\n[fig]\n\nTwo more things to check.\n\n• **Leaving early costs**: in the first years what you get back can be less than what you paid in.\n• The costs are written in the **KID**, the document of at most three pages that you must receive before signing.","fig":{"rows":[{"lab":"€10,000 at 4% for 20 years","val":"€21,911","segs":[[21911,"With no extra costs","menta"]]},{"lab":"With 1.5 points of extra costs","val":"€16,386","segs":[[16386,"What is left","az"],[5525,"Eaten by costs","pesca","€5,525"]]}],"cap":"An example with a fixed return of 4% a year, before taxes."}},{"type":"bucket","t":"Who needs a term life policy?","buckets":["Needs one","As a rule, no"],"items":[["Father of two children, the only paycheck at home",0,"If he is gone, the family is left with no income."],["Single 25-year-old, no debts and no dependents",1,"Nobody depends on their income."],["Couple who have just taken out a thirty-year mortgage",0,"The one who is left would have to pay the installment alone."],["Retired woman with adult, independent children",1,"The children have their own income: there is nobody to protect."],["Single mother with a 6-year-old child",0,"The child depends entirely on her."]]},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"Life insurance means two things: protection, which costs little and is needed if someone depends on your income, and investment, where you should check costs and exit penalties in the KID.","ex":[{"type":"mcq","q":"You have a 20-year term life policy. At expiration you are alive. What do you receive?","options":["The insured amount","The premiums you paid","Nothing: you paid for twenty years of protection"],"ans":2,"exp":"Term life insurance pays only if you die within the term. It is like home insurance: if nothing happens, the premium bought the protection of those years."},{"type":"mcq","q":"In a unit-linked policy, who bears the risk that the funds go down?","options":["The company","You","The government"],"ans":1,"exp":"In a unit-linked policy the amount follows the value of the funds. If they go down, what you get back goes down: the company doesn't guarantee the result, except what is written in the contract."},{"type":"mcq","q":"Where do you find the costs of an investment policy, before signing?","options":["In the KID","In the advertising","Only in the statement, after the first year"],"ans":0,"exp":"The KID is the key information document: it shows the total costs and how much they weigh on the return, and it must be handed to you before signing."}],"pages":[],"lab":"B"}]},{"id":"basi-u9","sid":"basi-investire","name":"Investing step by step","lessons":[{"key":"basi-9-1","sym":"DCA","title":"All at once or a little at a time","minutes":7,"flow":[{"type":"guess","q":"Davide invests €200 a month for 20 years in a fund that returns 5% a year on average. In all he pays in €48,000. How much does he end up with?","after":"With these assumptions he reaches about **€81,000**: €48,000 he paid in himself, the other €33,000 are returns. Assumptions: constant return of 5% a year, payments at the end of the month. In reality the return changes every year, but the idea holds: paying in a little for a long time works.","min":40000,"max":140000,"step":1000,"truth":81161,"near":6000,"unit":"€"},{"type":"page","t":"Two ways to invest","x":"**You don't need a big sum to start investing: you can begin small, every month.**\n\nThere are two ways to put money into an investment.\n\n• A **lump sum**: you put in a sum all at once. It is the case of someone who already has money set aside, for example an inheritance.\n• **Dollar-cost averaging**: you put in a fixed amount at regular intervals, usually every month. It is the case of someone who invests part of their paycheck.\n\n[fig]\n\nDollar-cost averaging has a practical advantage: it becomes a habit. Once the automatic payment is set up, you invest without having to think about it and without having to decide each time whether it is the right moment.","fig":{"rows":[{"lab":"Lump sum: all on day one","val":"€12,000","segs":[[12000,"A single payment","az"]]},{"lab":"Dollar-cost averaging: after 6 months","val":"€6,000","segs":[[6000,"6 payments of €1,000","menta"]]},{"lab":"Dollar-cost averaging: after 12 months","val":"€12,000","segs":[[12000,"12 payments of €1,000","menta"]]}]}},{"type":"page","t":"Time does the biggest part","x":"Back to Davide: €200 a month for 20 years, at 5% a year.\n\n[fig]\n\nEvery payment starts earning from the day it goes in, and the returns produce more returns: it is compound interest. The first €200 work for almost twenty years, the last ones haven't yet had time to earn.\n\nThat is why starting early matters so much.\n\n| Duration | Paid in | At the end |\n|---|---|---|\n| 10 years | €24,000 | €30,873 |\n| 20 years | €48,000 | €81,161 |\n| 30 years | €72,000 | €163,075 |\n\nFrom 10 to 20 years the amount paid in doubles, but the final amount does much more. From 20 to 30 years you add €24,000 of payments and find about €82,000 more.","fig":{"rows":[{"lab":"After 20 years","val":"€81,161","segs":[[48000,"Paid in by Davide","menta","€48,000"],[33161,"Returns","az","€33,161"]]}]}},{"type":"lever","t":"Build your plan","x":"Every month you pay in an amount and invest it at 5% a year. Move the levers and see how much you will have at the end.","model":"piano","params":{"tasso":5},"sliders":[{"id":"rata","label":"Monthly payment","min":50,"max":500,"step":10,"start":100,"unit":"€"},{"id":"anni","label":"Duration","min":5,"max":40,"step":5,"start":10,"unit":"years"}],"goals":[{"label":"Reach at least €100,000","cond":[["totale",">=",100000]],"hint":"Try lengthening the duration, or raising the payment."},{"label":"Now get there paying in less than €50,000 in all","cond":[["totale",">=",100000],["versato","<",50000]],"hint":"Less money paid in means more work left to time: lengthen the duration and lower the payment."}],"after":"You can reach €100,000 paying in less than half of it, but only by giving the plan many years. Whoever starts late has to pay in much more to reach the same amount."},{"type":"num","q":"You invest €150 a month with dollar-cost averaging. How much have you paid in, in all, after 8 years?","ans":14400,"unit":"€","tol":0.5,"dec":0,"exp":"\\(150 \\times 12 = \\text{€}1{,}800\\) a year. In 8 years: \\(1{,}800 \\times 8 =\\) **€14,400**. The value of your investment will be different, because it depends on returns."},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"Lump sum: all at once. Dollar-cost averaging: a fixed amount every month. With dollar-cost averaging, time matters most: the sooner you start, the more compound interest works.","ex":[{"type":"mcq","q":"What sets dollar-cost averaging apart from investing a lump sum?","options":["With dollar-cost averaging you pay in a fixed amount at regular intervals, with a lump sum everything at once","Dollar-cost averaging is guaranteed, a lump sum is not","Dollar-cost averaging can only be done with bonds"],"ans":0,"exp":"Dollar-cost averaging means regular payments, a lump sum means a single payment. Neither is guaranteed: both invest in instruments that can rise and fall."},{"type":"mcq","q":"Anna and Bruno each pay €200 a month into the same fund. Anna starts at 25, Bruno at 35. Both stop at 65. Who will have more?","options":["Bruno, because he started with more experience","Anna, because her money worked 10 years longer","They will have the same amount"],"ans":1,"exp":"Anna pays in for 40 years, Bruno for 30. Anna has paid in €24,000 more, but above all her first payments had ten more years to produce returns on returns."}],"pages":[],"lab":"A"},{"key":"basi-9-2","sym":"Ø","title":"Buying at different prices","minutes":7,"flow":[{"type":"guess","q":"You invest €100 a month in a fund. The price of one share is €10 the first month, €8 the second, €12.50 the third. In which month did you buy the most shares?","after":"With a fixed amount you buy more shares when the price is low: \\(\\dfrac{100}{8} =\\) **12.5 shares** in the second month, against 10 in the first and 8 in the third. It is a small automatic advantage of always paying in the same amount.","options":["The first","The second","The third"],"ans":1},{"type":"page","t":"Same amount, different shares","x":"**With dollar-cost averaging you don't always buy the same quantity: you always buy for the same amount.**\n\nA fund is divided into **shares**, and the price of a share changes over time. If you pay in €100 a month, how many shares you receive depends on that day's price:\n\n$$\\text{shares} = \\frac{\\text{amount paid in}}{\\text{price of one share}}$$\n\n[fig]\n\nWhen the price falls your €100 buys more, when it rises it buys less. Without deciding anything, you end up buying more shares at low prices than at high prices.","fig":{"rows":[{"lab":"Month 1: price €10","val":"10 shares","segs":[[10,"Shares bought with €100","az"]]},{"lab":"Month 2: price €8","val":"12.5 shares","segs":[[12.5,"Shares bought with €100","menta"]]},{"lab":"Month 3: price €12.50","val":"8 shares","segs":[[8,"Shares bought with €100","pesca"]]}]}},{"type":"num","q":"In three months you have paid in €300 and bought 10 shares, then 12.5, then 8. How many shares do you have in all?","ans":30.5,"unit":"shares","tol":0.01,"dec":1,"exp":"\\(10 + 12.5 + 8 =\\) **30.5 shares**."},{"type":"page","t":"The average purchase price","x":"How much did each share cost you, on average? It is called the **average purchase price**:\n\n$$\\text{average price} = \\frac{\\text{total paid in}}{\\text{shares owned}}$$\n\nYou paid in €300 and you have 30.5 shares: \\(\\dfrac{300}{30.5} =\\) **€9.84** a share.\n\nThe average of the three prices, instead, is \\(\\dfrac{10 + 8 + 12.50}{3} =\\) **€10.17**.\n\nYour cost is lower than the average of the prices, precisely because you bought more shares when they cost less.\n\nBe careful not to ask dollar-cost averaging for what it can't give. It doesn't protect you from losses: if the price falls below €9.84 you are at a loss. And if prices always rise, whoever paid in everything up front did better. Its strength is something else: it saves you from having to guess the right moment to get in."},{"type":"num","q":"With dollar-cost averaging you have paid in €1,200 in all and own 100 shares. Today one share is worth €13. How much is your investment worth?","ans":1300,"unit":"€","tol":0.5,"dec":0,"exp":"100 shares at €13 each: \\(100 \\times 13 =\\) **€1,300**. Your average purchase price is \\(\\dfrac{1{,}200}{100} = \\text{€}12\\): today the share is worth more, so you are earning €100."},{"type":"bucket","t":"True or false about dollar-cost averaging?","buckets":["True","False"],"items":[["With the same amount you buy more shares when the price is low",0,"It is a division: a fixed amount divided by a lower price gives more shares."],["Dollar-cost averaging guarantees you will not lose",1,"If the price falls below your average purchase price, you are at a loss."],["It saves you from choosing the right moment to get in",0,"You get in a little at a time, at different prices."],["If prices always rise, dollar-cost averaging beats a lump sum",1,"In that case whoever paid in everything up front bought at the lowest prices."],["The average purchase price is the total paid in divided by the shares",0,"That is exactly the definition."]]},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"With a fixed amount you buy more shares when they cost less. The average purchase price is the total paid in divided by the shares: it is your breakeven point.","ex":[{"type":"mcq","q":"You pay in €200 when a share costs €20 and another €200 when it costs €10. What is your average purchase price?","options":["€15.00","€13.33","€10.00"],"ans":1,"exp":"Shares bought: \\(\\dfrac{200}{20} = 10\\) and \\(\\dfrac{200}{10} = 20\\), 30 in all. Average purchase price: \\(\\dfrac{400}{30} =\\) **€13.33**. It is not €15, the average of the two prices, because at €10 you bought twice as many shares."},{"type":"mcq","q":"Your average purchase price is €9.84 and today a share is worth €9. How is your investment doing?","options":["At a gain","Breaking even","At a loss"],"ans":2,"exp":"Each share cost you €9.84 on average and today it is worth €9: you are **at a loss**. The average purchase price is your breakeven point."}],"pages":[],"lab":"A"},{"key":"basi-9-3","sym":"72","title":"The rule of 72","minutes":6,"flow":[{"type":"guess","q":"You invest €5,000 and let it grow at 6% a year, without touching it. After how many years will it have become €10,000?","after":"It takes about **12 years**. There is a shortcut to know it without a calculator: divide 72 by the rate. \\(\\dfrac{72}{6} = 12\\).","min":0,"max":40,"step":1,"truth":12,"near":1,"unit":"years"},{"type":"page","t":"A division instead of a formula","x":"**To know in how many years your money doubles, just divide 72 by the rate.**\n\n$$\\text{years to double} \\approx \\frac{72}{\\text{rate}}$$\n\nThe rate is written as a number: for 6% you put 6. It works thanks to compound interest: every year the interest is added to the principal and the next year it earns interest too.\n\n| Rate | Rule of 72 | Exact calculation |\n|---|---|---|\n| 2% | 36 years | 35.0 years |\n| 4% | 18 years | 17.7 years |\n| 6% | 12 years | 11.9 years |\n| 8% | 9 years | 9.0 years |\n\nIt is an estimate, not a precise calculation, but for the rates you usually meet it is off by only a few months.\n\nNotice one thing: going from 2% to 4% doesn't shorten the wait a little. It halves it."},{"type":"num","q":"An investment returns 3% a year. According to the rule of 72, in how many years does it double?","ans":24,"unit":"years","tol":0.5,"dec":0,"exp":"\\(\\dfrac{72}{3} =\\) **24 years**."},{"type":"page","t":"It works for everything that grows","x":"The same rule works for anything that grows at a constant pace. Prices too.\n\nWith inflation of 3% a year, prices double in about \\(\\dfrac{72}{3} =\\) **24 years**. It means that money left idle, in 24 years, buys half as much.\n\n[fig]\n\nAnd it works for debts. A debt at 18% a year on which you pay nothing doubles in about \\(\\dfrac{72}{18} =\\) **4 years**.\n\nThe rule of 72 is for this: to feel how much a rate weighs without doing the math. 2% and 6% look close. But one doubles your money in 36 years, the other in 12.","fig":{"rows":[{"lab":"Today","val":"€1,000","segs":[[1000,"What €1,000 buys","az"]]},{"lab":"In 24 years, with 3% inflation","val":"about half","segs":[[492,"What the same €1,000 buys","pesca"]]}]}},{"type":"num","q":"With inflation of 4% a year, in about how many years do prices double?","ans":18,"unit":"years","tol":0.5,"dec":0,"exp":"\\(\\dfrac{72}{4} =\\) **18 years**. In 18 years money left idle buys about half as much."},{"type":"order","t":"From the fastest doubling to the slowest","items":["Credit card debt at 18%","Investment at 8%","Investment at 4%","Savings account at 2%"],"x":"Tap the items from the one that doubles first to the one that doubles last.","after":"72 divided by the rate: about 4 years, 9 years, 18 years, 36 years."},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"\\(\\text{Years to double} \\approx \\dfrac{72}{\\text{rate}}\\). It works for invested money, for prices and for debts.","ex":[{"type":"mcq","q":"At about what annual rate does money double in 10 years?","options":["3.6%","7.2%","10%"],"ans":1,"exp":"The rule also works in reverse: \\(\\text{rate} \\approx \\dfrac{72}{\\text{years}} = \\dfrac{72}{10} =\\) **7.2%**."},{"type":"mcq","q":"You have €2,000 invested at 8% a year. According to the rule of 72, about how much will you have after 18 years?","options":["€4,000","€6,000","€8,000"],"ans":2,"exp":"At 8% money doubles every \\(\\dfrac{72}{8} = 9\\) years. In 18 years it doubles twice: from €2,000 to €4,000, then to **€8,000**."}],"pages":[],"lab":"A"},{"key":"basi-9-4","sym":"60/40","title":"Splitting and rebalancing","minutes":7,"flow":[{"type":"guess","q":"Marta invests €10,000: €6,000 in stocks and €4,000 in bonds. In a year the stocks rise 30%, the bonds stay flat. What percentage of her portfolio is now in stocks?","after":"The stocks are worth \\(6{,}000 \\times 1.30 = \\text{€}7{,}800\\), the bonds €4,000. In all €11,800, and the stocks are \\(\\dfrac{7{,}800}{11{,}800}\\), that is about **66%**. Marta did nothing, yet her portfolio became riskier than the one she had chosen.","min":50,"max":100,"step":1,"truth":66,"near":2,"unit":"%"},{"type":"page","t":"The choice that matters most","x":"**Before choosing which securities to buy, you decide how to split your money between stocks and bonds.**\n\nThe whole of your investments is called a portfolio. The way you split it has a name: **asset allocation**. It is the choice that weighs most on how much it can rise and fall.\n\n• More **stocks**: more expected growth over the long run, but bigger drops along the way.\n• More **bonds**: less expected growth, but a calmer ride.\n\n[fig]\n\nThere is no split that is right for everyone. It depends on how much time you have before you need the money, and on how much you can bear to watch it fall without selling.\n\nMarta has 15 years ahead and chooses 60% stocks and 40% bonds.","fig":{"rows":[{"lab":"Conservative","val":null,"segs":[[30,"Stocks","pesca","30%"],[70,"Bonds","az","70%"]]},{"lab":"Balanced","val":null,"segs":[[60,"Stocks","pesca","60%"],[40,"Bonds","az","40%"]]},{"lab":"Aggressive","val":null,"segs":[[90,"Stocks","pesca","90%"],[10,"Bonds","az","10%"]]}],"cap":"Three examples. The names change from one provider to another."}},{"type":"page","t":"The portfolio drifts by itself","x":"Once chosen, the split doesn't stay put: the markets move it.\n\nAfter a year in which stocks rise 30% and bonds stay flat, Marta's portfolio has changed:\n\n[fig]\n\nStocks went from 60% to 66%. If they kept rising they would reach 70%, then 80%. Marta would find herself with a portfolio much riskier than the one she chose, right after a long climb: that is, when a drop would hurt most.","fig":{"rows":[{"lab":"At the start","val":"€10,000","segs":[[6000,"Stocks","pesca","€6,000"],[4000,"Bonds","az","€4,000"]]},{"lab":"After a year","val":"€11,800","segs":[[7800,"Stocks","pesca","€7,800"],[4000,"Bonds","az","€4,000"]]}]}},{"type":"page","t":"Bringing it back to where you decided","x":"To **rebalance** means to bring the portfolio back to the split you chose.\n\nMarta wants to go back to 60% stocks on €11,800:\n\n• stocks she should have: \\(11{,}800 \\times 60\\% =\\) **€7,080**\n• stocks she has: €7,800\n• to sell: \\(7{,}800 - 7{,}080 =\\) **€720**\n\nWith those €720 she buys bonds, which rise to €4,720: 40%.\n\nShe sold a bit of what went up and bought what stayed behind. It is the opposite of what instinct would say, and that is why it is best done with a fixed rule, for example once a year.\n\nRebalancing is not for earning more: it is for keeping the risk where you decided. Selling can trigger taxes and fees, so it shouldn't be done too often."},{"type":"num","q":"A portfolio is worth €20,000: €14,000 in stocks and €6,000 in bonds. You want to go back to half and half. How much of the stocks do you need to sell?","ans":4000,"unit":"€","tol":0.5,"dec":0,"exp":"Half of €20,000 is €10,000. You have €14,000 in stocks: you sell \\(14{,}000 - 10{,}000 =\\) **€4,000** and with that money you buy bonds, which rise to €10,000."},{"type":"bucket","t":"More stocks or more bonds?","buckets":["More stocks","More bonds"],"items":[["You need the money in 25 years",0,"With so much time ahead you can bear the drops and aim for growth."],["You need the money in 3 years",1,"With little time a big drop can't be recovered: you need a calmer ride."],["A 20% drop would keep you awake at night",1,"If you would end up selling at the worst moment, better a portfolio that swings less."],["You have just started working and are investing for retirement",0,"It is the typical case of a very long horizon."],["You retire next year",1,"Soon you will need that money to live on."]]},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"Asset allocation is how you split your money between stocks and bonds. The markets move it: rebalancing brings it back to where you decided.","ex":[{"type":"mcq","q":"You chose 50% stocks and 50% bonds. After a year the stocks have risen a lot and are now 60%. What does rebalancing mean?","options":["Buying more stocks, since they are rising","Selling everything and starting over","Selling some of the stocks and buying bonds"],"ans":2,"exp":"Rebalancing brings the portfolio back to the chosen split: you **sell part of what went up** and buy what stayed behind, until you are back to 50 and 50."},{"type":"mcq","q":"What is rebalancing mainly for?","options":["To keep the risk at the level you chose","To beat the market","To avoid paying taxes"],"ans":0,"exp":"It is for not finding yourself, after a long climb, with many more stocks than you had decided on. It doesn't promise higher returns, and selling can in fact trigger taxes."}],"pages":[],"lab":"A"}]},{"id":"basi-u10","sid":"basi-testa","name":"The investor's mind","lessons":[{"key":"basi-10-1","sym":"2×","title":"Losses hurt more","minutes":6,"flow":[{"type":"guess","q":"A game: you flip a coin. If it comes up heads you win €150, if it comes up tails you lose €100. If you could repeat it many times, how much would you earn on average on each flip?","after":"Half the time you win €150, half the time you lose €100: on average \\(0.5 \\times 150 - 0.5 \\times 100 =\\) **+€25** per flip. It is a game worth playing. And yet, faced with a single flip, many people refuse: the fear of losing €100 weighs more than the hope of winning €150.","min":-100,"max":150,"step":5,"truth":25,"near":10,"unit":"€"},{"type":"page","t":"A loss weighs about double","x":"**Losing €100 hurts more than gaining €100 feels good.**\n\nResearchers call it **loss aversion**. In experiments, to accept the risk of losing €100 people ask on average to be able to win about €200. A loss weighs roughly double a gain of the same size.\n\n[fig]\n\nIt is not a flaw to be fixed: it is how we are built. But when investing it leads to wrong decisions, because markets rise and fall all the time, and every drop is felt twice as much as every rise.","fig":{"rows":[{"lab":"Gaining €100","val":null,"segs":[[1,"How good it feels","menta"]]},{"lab":"Losing €100","val":null,"segs":[[2,"How much it hurts","rosa"]]}],"cap":"A rough measure: it varies from person to person."}},{"type":"page","t":"What it makes us do","x":"Loss aversion pushes toward three typical mistakes.\n\n• **Holding losing investments too long.** As long as you don't sell, the loss seems not to exist. So you wait to break even, even when the reasons you bought are gone.\n• **Selling winning investments too early**, out of fear of watching that gain disappear.\n• **Looking too often.** Whoever checks every day sees many more negative days than whoever looks once a year, and every negative day hurts.\n\nOne idea helps against all three: the market doesn't care what price you bought at. The useful question isn't ‘how much am I losing?’ but ‘if I had this money in hand today, would I buy this investment?’ If the answer is no, the purchase price is not a reason to hold on to it."},{"type":"num","q":"Another coin game: heads you win €300, tails you lose €200. How much do you earn on average on each flip?","ans":50,"unit":"€","tol":0.5,"dec":0,"exp":"\\(0.5 \\times 300 - 0.5 \\times 200 = 150 - 100 =\\) **+€50** per flip. It is a favorable game, even if the possible loss of €200 is scary."},{"type":"bucket","t":"Is it an effect of loss aversion?","buckets":["Yes","No"],"items":[["I won't sell until I break even",0,"The purchase price becomes a finish line, but the market doesn't care."],["I immediately sell a stock that has risen 5%, afraid it will fall",0,"The fear of losing a gain makes people sell too early."],["I check my portfolio ten times a day",0,"The more you look, the more negative days you see, and each one weighs double."],["I sell because I have reached the amount I needed",1,"It is a decision tied to your goal, not to fear."],["I rebalance once a year, as per the plan",1,"It is a rule decided beforehand, with a cool head."]]},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"A loss hurts about twice as much as an equal gain feels good. Decide by looking ahead, not at the price you bought at.","ex":[{"type":"mcq","q":"You bought a stock at €50 and it is now worth €30. In the meantime the company has lost its best customers. What is the healthiest way to think about it?","options":["I ask myself whether I would buy it today at €30","I wait for it to go back to €50, then sell","I buy more to lower my average price"],"ans":0,"exp":"The €50 you paid no longer counts: what counts is what the stock is worth today and what you expect for the future. If you wouldn't buy it today, the purchase price is not a reason to keep it."},{"type":"mcq","q":"What does loss aversion say?","options":["That a loss weighs more than a gain of the same size","That whoever invests always loses","That losses recover on their own"],"ans":0,"exp":"Losing €100 hurts about twice as much as gaining €100 feels good. It says nothing about how your investments will do: it says how you will react."}],"pages":[],"lab":"A"},{"key":"basi-10-2","sym":"FOMO","title":"Everyone is buying, so I buy too","minutes":7,"flow":[{"type":"guess","q":"A stock goes from €10 to €40 in a year. Everyone is talking about it, and Luca buys at €40. Then the price goes back to €16. How much did Luca lose, in percentage?","after":"Luca bought at €40 and ends up with €16: he lost €24 out of €40, that is **60%**. Whoever bought at €10 is still up 60%. Same stock, same story: what made the difference was the moment of entry.","min":0,"max":100,"step":1,"truth":60,"near":3,"unit":"%"},{"type":"page","t":"The fear of missing out","x":"**When a price rises and everyone is talking about it, you feel like buying. It is often the worst moment to do it.**\n\nWatching others earn while you stand by and watch creates a very strong push. It has a name by now in common use: **FOMO**, fear of missing out.\n\nAnother habit works alongside it: **herd behavior**. If everybody is doing it, we think, there must be a reason. In everyday life that is often a good rule. In markets it isn't, for a simple reason: the more people have already bought, the more the price has already risen.\n\n[fig]\n\nWhen a piece of news has reached you, it is likely already in the price.","fig":{"rows":[{"lab":"A year earlier","val":"€10","segs":[[10,"Price","az"]]},{"lab":"When everyone is talking about it","val":"€40","segs":[[40,"Price","rosa"]]},{"lab":"A year later","val":"€16","segs":[[16,"Price","az"]]}]}},{"type":"page","t":"How a bubble forms","x":"When herd behavior takes over a whole market, a **bubble** forms: prices rise far more than what you are buying is really worth.\n\nIt usually goes like this.\n\n• Something new catches attention, and the first prices rise for good reasons.\n• The first buyers' gains attract more buyers. The price rises because people buy, and people buy because the price rises.\n• Then come those who buy only to resell at a higher price. Nobody looks at what they are buying anymore.\n• The new buyers run out. The price stops rising, someone sells, and the fall is faster than the rise.\n\nIt happened with tulips in the Netherlands in the seventeenth century, with internet stocks in the late nineties, with houses in the United States before 2008. The object changes, the script doesn't."},{"type":"order","t":"Put the phases of a bubble in order","items":["Something new attracts the first buyers","Prices rise and everyone else arrives","People buy only to resell for more","The buyers run out and the price collapses"],"after":"Whoever enters in the third phase buys from whoever entered in the first."},{"type":"num","q":"You buy a stock at €80, at the height of the enthusiasm. The price falls to €20. By what percentage must it rise to get back to €80?","ans":300,"unit":"%","tol":0.5,"dec":0,"exp":"From €20 to €80 is €60 more: \\(\\dfrac{60}{20} =\\) **300%**. The price has to quadruple. After a 75% drop, a +75% is not enough."},{"type":"page","t":"How to defend yourself","x":"You don't need to be able to predict bubbles. You need not to get carried away.\n\n• **Decide beforehand.** A written plan, with how much you invest each month and in what, takes the decision away from you at the moment when you are most emotional.\n• **Ask yourself the uncomfortable question.** Am I buying because I understood what I'm buying and what it is worth, or because it went up?\n• **Look at how much it weighs.** A small part of your money on a risky idea is a choice. All of your savings is not.\n\nWhoever invests a fixed amount every month in a well-diversified fund already has a good defense: they always buy, both when everyone is enthusiastic and when everyone is afraid."},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"When everyone is buying, the price has already risen. Decide with a plan written beforehand, not with the fear of missing out.","ex":[{"type":"mcq","q":"A stock has tripled in six months and everyone is talking about it. What does this say about its future?","options":["That it will keep rising","That it will surely collapse","Nothing certain: it only says that today it costs much more"],"ans":2,"exp":"A past rise promises neither more rise nor a collapse. It only says that whoever buys today pays three times as much, so has less margin if things go wrong."},{"type":"mcq","q":"What sets a bubble apart from a normal rise in prices?","options":["In a bubble people buy mainly because the price is rising","In a bubble prices rise slowly","In a bubble only professionals buy"],"ans":0,"exp":"In a bubble the price rises because people buy, and people buy because the price rises. Nobody looks anymore at how much what they are buying is really worth."}],"pages":[],"lab":"A"},{"key":"basi-10-3","sym":"↓↑","title":"Selling at the worst moment","minutes":6,"flow":[{"type":"guess","q":"Sara has €10,000 invested. The market loses 30% and she, gripped by fear, sells everything. The next year the market rebounds 50%, but Sara stayed out. How much less money does she have compared with someone who didn't sell?","after":"Whoever stayed invested has \\(10{,}000 \\times 0.70 \\times 1.50 = \\text{€}10{,}500\\). Sara sold at €7,000 and stayed there: she has **€3,500** less. The 30% loss was only on paper. By selling she made it final.","min":0,"max":6000,"step":100,"truth":3500,"near":300,"unit":"€"},{"type":"page","t":"A paper loss","x":"**As long as you don't sell, a drop is a number on a screen. It becomes a real loss the moment you sell.**\n\nWhen markets fall hard, the news talks about a crash and every day the number is lower. The natural reaction is to run: sell everything so as not to lose more.\n\nThe problem is that sharp drops and sharp rebounds are often close together. Whoever gets out after the drop shelters from a fall that has already happened, and misses the rebound that comes after.\n\n[fig]\n\nTo do better than someone who stays put you have to get two moments right: when to get out and when to get back in. Getting just one wrong is enough to do worse.","fig":{"rows":[{"lab":"At the start","val":"€10,000","segs":[[10000,"Both","az"]]},{"lab":"Whoever stays invested","val":"€10,500","segs":[[10500,"After the −30% and the +50%","menta"]]},{"lab":"Whoever sells after the drop","val":"€7,000","segs":[[7000,"Out of the market","rosa"]]}]}},{"type":"page","t":"Why time helps","x":"Falling is part of how stock markets work. In the history of the big stock markets, drops of 10% have come on average every year or two, and those of 30% or more about once every ten years.\n\nSo far the big markets have always recovered: sometimes in a few months, sometimes after many years. It is not a guarantee for the future. But for someone with a lot of time ahead, a drop is a stretch of road, not the end of the journey.\n\nThree things make it easier to stay put.\n\n• **Invest only money you don't need soon.** Whoever needs it in a year is forced to sell, at any price.\n• **Have an emergency fund.** That way an unexpected expense doesn't force you to sell at the wrong moment.\n• **Choose a split you can bear.** If a −30% would keep you awake at night, you need fewer stocks."},{"type":"num","q":"You have €8,000 invested. The market falls 25% and then rebounds 40%. If you don't sell, how much do you have at the end?","ans":8400,"unit":"€","tol":0.5,"dec":0,"exp":"After the drop: \\(8{,}000 \\times 0.75 = \\text{€}6{,}000\\). After the rebound: \\(6{,}000 \\times 1.40 =\\) **€8,400**. A −25% followed by a +40% doesn't make +15%: percentages multiply, they don't add."},{"type":"bucket","t":"Does it help you not sell in a panic?","buckets":["Helps","Doesn't help"],"items":[["Having an emergency fund",0,"An unexpected expense doesn't force you to sell."],["Checking prices every hour",1,"The more you look, the scarier the drop feels."],["Having invested money you need in 20 years",0,"With so much time, a drop can be waited out."],["Having put everything in a single stock",1,"A single stock may never recover: diversifying is for this too."],["Having a plan written beforehand",0,"The decision has already been made, with a cool head."],["Listening to those shouting about a crash",1,"Other people's fear is contagious."]]},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"A drop becomes a real loss only when you sell. Time, an emergency fund and a written plan help you stay put.","ex":[{"type":"mcq","q":"Your diversified fund has lost 20% and you will need that money in 25 years. What does someone with a plan usually do?","options":["Sells everything and waits for better times","Keeps up the planned payments","Moves everything into a single stock that is rising"],"ans":1,"exp":"With 25 years ahead, a 20% drop is a stretch of road. Whoever keeps paying in buys at lower prices during that period."},{"type":"mcq","q":"Why is it so hard to profit by getting out of the market and back in?","options":["Because it is forbidden","Because prices never change","Because you have to get two moments right: when to get out and when to get back in"],"ans":2,"exp":"You have to nail both the moment to get out and the moment to get back in. Whoever gets out after a drop often gets back in when prices have already recovered."}],"pages":[],"lab":"A"},{"key":"basi-10-4","sym":"#1","title":"Feeling smarter than the market","minutes":7,"flow":[{"type":"guess","q":"Luca has €10,000 invested and buys and sells often: 40 trades a year, and each one costs him an €8 fee. How much does he spend in fees in 10 years?","after":"\\(40 \\times 8 = \\text{€}320\\) a year, that is **€3,200** in ten years: almost a third of the starting €10,000, spent just to move around. To break even, every year Luca has to do 3.2% better than someone who stays put.","min":0,"max":6000,"step":100,"truth":3200,"near":300,"unit":"€"},{"type":"page","t":"Everyone above average","x":"**Almost all of us think we are better than average. By definition, it can't be true for everyone.**\n\nIt is called **overconfidence**. Ask a group of people whether they drive better than average: the great majority say yes.\n\nIn investing the same happens, with an aggravating factor: chance disguises itself as skill. If you buy a stock and it rises, you think you understood it. If it falls, it was bad luck. After a few lucky hits you feel like an expert and start taking more risk.\n\nOn the other side of every purchase of yours, though, there is someone selling. Often it is a professional who does this job all day, with more information and more tools than you. It is not impossible to do better than them. It is just much less likely than it seems."},{"type":"page","t":"Moving costs money","x":"Overconfidence has an effect that can be measured: it makes people buy and sell too much.\n\nEvery trade has a cost. There is the **fee** you pay the broker. And there are taxes on gains, which you pay every time you sell at a gain instead of putting them off.\n\nHere are Luca's €10,000 and his ten years of fees:\n\n[fig]\n\nStudies on small investors have found the same result for years: on average, whoever trades more earns less. Not because they pick worse stocks, but because costs eat the results.\n\nOften the move that pays the most is doing nothing.","fig":{"rows":[{"lab":"Starting capital","val":"€10,000","segs":[[10000,"Money invested","az"]]},{"lab":"Fees over 10 years","val":"€3,200","segs":[[3200,"40 trades a year at €8","pesca"]]}]}},{"type":"num","q":"You make 25 trades a year and each one costs a €6 fee. You have €5,000 invested. How much do the fees weigh in a year, as a percentage of the capital?","ans":3,"unit":"%","tol":0.5,"dec":0,"exp":"\\(25 \\times 6 = \\text{€}150\\) a year. \\(\\dfrac{150}{5{,}000} =\\) **3%**. Before you even earn anything, you have to make up the 3%."},{"type":"page","t":"The rules of someone who doesn't trust themselves","x":"Good investors are not the ones who don't have these weaknesses. They are the ones who know they have them and give themselves rules.\n\n• **Write the plan beforehand**: how much you invest, in what, for how long.\n• **Make it automatic**: a fixed payment every month decides in your place.\n• **Diversify**: that way you don't have to be right about a single stock.\n• **Look rarely**: once or twice a year is enough to rebalance.\n• **Keep costs low**: costs are the only certain thing about an investment.\n\nThey are the ideas of this whole course, lined up. None of them requires predicting the future, and that is why they work."},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"Feeling better than average makes you trade too much, and trading costs money. A written, automatic, low-cost plan almost always beats instinct.","ex":[{"type":"match","pairs":[["Loss aversion","A loss weighs more than an equal gain"],["Herd behavior","Doing something because everyone is doing it"],["FOMO","The fear of being left out of a gain"],["Overconfidence","Believing you are better than average"]]},{"type":"mcq","q":"You have picked three stocks in a row correctly. What does it prove?","options":["That you can predict the market","Little: three hits can be luck","That you should bet everything on the next one"],"ans":1,"exp":"Three results are too few to tell skill from luck. The risk is feeling like an expert and starting to bet bigger amounts."},{"type":"mcq","q":"Two investors have the same portfolio. One makes 50 trades a year, the other 2. With the same return before costs, who ends up with more?","options":["The one who makes 50","It's the same","The one who makes 2"],"ans":2,"exp":"Every trade costs a fee, and often taxes too. With the same return before costs, whoever trades less keeps more."}],"pages":[],"lab":"A"}]},{"id":"basi-u13","sid":"basi-casa","name":"Buying a home","lessons":[{"key":"basi-13-1","sym":"HOME","title":"Renting or buying","minutes":7,"flow":[{"type":"guess","q":"You buy a house for €200,000 and after three years you have to move to another city. You sell it at the same price. Compared with renting at €800 a month, how did it go?","after":"In three years rent would have cost €28,800. By buying you paid about €16,000 in purchase costs, €16,000 in interest, maintenance, and you kept your savings tied up: in all about €41,600. Rent is not money thrown away: it is the price of a service. Whoever buys also has money that doesn't come back, it just shows less.","options":["Better: rent is money thrown away","About the same","Worse: you spent about €13,000 more"],"ans":2},{"type":"page","t":"The money that doesn't come back","x":"**Whoever rents pays rent. Whoever buys pays four other things, and none of them is returned.**\n\n• The **purchase costs**: taxes, legal fees, agent. They are paid once and are not recovered when you sell.\n• The mortgage **interest**. The part of each payment that repays principal is saving, the interest is not.\n• **Maintenance** and extraordinary expenses, which with a rental fall on the owner.\n• The **return you give up** on the down payment: that money, invested, would have earned something.\n\nIn exchange the buyer has two advantages: no rent to pay, and if the house rises in value the gain is theirs. If it falls, so is the loss.\n\nThat is why the right question isn't whether buying pays off, but **after how many years**. Purchase costs all weigh at the start: the longer you stay in the house, the more they are spread out."},{"type":"lever","t":"After how many years it pays off","x":"A house at €200,000, a mortgage of €160,000 at 3.5% for 25 years. Purchase costs 8%, maintenance 1% a year, 2% return given up on the money tied up.","model":"casa","params":{"prezzo":200000,"costi":8,"anticipo":20,"tasso":3.5,"anniMutuo":25,"manut":1,"rend":2},"sliders":[{"id":"anni","label":"Years you stay","min":1,"max":20,"step":1,"start":3,"unit":"years"},{"id":"affitto","label":"Monthly rent","min":500,"max":1400,"step":50,"start":800,"unit":"€"},{"id":"crescita","label":"House value, per year","min":-2,"max":4,"step":0.5,"start":0,"unit":"%","dec":1}],"goals":[{"label":"With rent and prices flat, find after how many years buying costs less","cond":[["diff",">",0],["affitto","<=",800],["crescita","<=",0]],"hint":"Move only the years: purchase costs are paid just once."},{"label":"Now go back to 5 years and make buying pay off anyway","cond":[["anni","<=",5],["diff",">",0]],"hint":"Over 5 years buying wins only if rent is high, or if the house rises in value."}],"after":"With these numbers it takes about 11 years for buying to beat rent of €800. Over a short time it wins only if rent is high or prices rise, and nobody has certainty about prices. Before the house, one thing has to be decided: how long you plan to stay in it."},{"type":"page","t":"What shifts the calculation","x":"The result changes a lot with three numbers. It helps to know in which direction they push.\n\n• **The ratio of rent to price.** Rent of €800 a month on a house worth €200,000 amounts, over a year, to 4.8% of the price. Where rents are high compared with prices, buying pays for itself sooner.\n• **The mortgage rate.** On €160,000 of debt, each extra point is about €1,600 more interest a year.\n• **How long you stay.** It is the number that counts most, and it is the only one that depends only on you.\n\nThen there is what no calculation measures: the stability of a home of your own, or the freedom to change city without having to sell. They have a value, but not the same for everyone. The calculation is there to tell you how much you are paying for them."},{"type":"num","q":"An apartment costs €180,000. The same apartment rents for €750 a month. What is a year's rent as a percentage of the price?","ans":5,"unit":"%","tol":0.5,"dec":0,"exp":"A year's rent is \\(750 \\times 12 = \\text{€}9{,}000\\). Compared with the price: \\(\\dfrac{9{,}000}{180{,}000} =\\) **5%**. The higher this number, the sooner buying pays for itself."},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"Buying has costs that don't come back: purchase, interest, maintenance. They are paid back only with time. The right question is after how many years.","ex":[{"type":"mcq","q":"Which of these home-buying expenses is not recovered when you sell?","options":["The part of the payment that repays principal","The taxes and legal fees paid at purchase","The down payment"],"ans":1,"exp":"The down payment and the principal repaid stay inside the value of the house: you get them back when you sell. Taxes, legal fees and agent are paid once and don't come back."},{"type":"mcq","q":"You plan to stay in a city for two years. What usually costs less?","options":["Renting","Buying","It is always the same"],"ans":0,"exp":"In two years the purchase costs don't have time to spread out. Buying would pay off only if prices rose a lot in the meantime, and that can't be known beforehand."},{"type":"mcq","q":"How is mortgage interest like rent?","options":["It is paid only once","It is collected by whoever sold you the house","It is the price for using money that isn't yours, and it doesn't come back"],"ans":2,"exp":"With rent you pay to use a house that isn't yours. With interest you pay to use money that isn't yours. In both cases it is a cost, not a saving."}],"pages":[],"lab":"A"},{"key":"basi-13-2","sym":"1/3","title":"How big a mortgage you can afford","minutes":7,"flow":[{"type":"guess","q":"A couple earns €3,000 net a month between them. With a mortgage at 3.5% for 25 years, how much can they borrow without exceeding a prudent payment?","after":"The most widely used rule says the payment shouldn't exceed **a third of income**: here €1,000 a month. At 3.5% for 25 years, a €1,000 payment repays a mortgage of about **€200,000**. The third isn't a law: it is the margin you need to withstand an unexpected expense without missing a payment.","min":0,"max":400000,"step":5000,"truth":200000,"near":15000,"unit":"€"},{"type":"page","t":"The one-third rule","x":"**How big a mortgage you can afford isn't decided by the price of the house: it is decided by the payment you can handle.**\n\nThe Bank of Italy indicates as reasonable a payment that doesn't exceed **one third of disposable income**. Inside that third must also fit the payments you already have: the car, a loan, a payroll-deduction loan (the Italian cessione del quinto).\n\nOnce the payment is fixed, the mortgage depends on two things.\n\n• **The term.** More years means more mortgage with the same payment, but much more interest.\n• **The rate.** Each extra point reduces the mortgage that the same payment can repay.\n\nThen there is a second limit: as a rule the bank lends up to **80% of the value** of the house. The rest, plus the purchase costs, has to come from your savings."},{"type":"lever","t":"How big a mortgage an income can carry","x":"The payment is a third of net income. Move income, rate and term.","model":"mutuomax","params":{},"sliders":[{"id":"reddito","label":"Monthly net income","min":1500,"max":6000,"step":100,"start":2400,"unit":"€"},{"id":"tasso","label":"Rate","min":2,"max":6,"step":0.25,"start":3.5,"unit":"%","dec":2},{"id":"anni","label":"Term","min":10,"max":30,"step":5,"start":25,"unit":"years"}],"goals":[{"label":"Reach a mortgage of at least €190,000","cond":[["mutuo",">=",190000]],"hint":"You can raise income, lengthen the term or lower the rate."},{"label":"Now get €190,000 paying less than €80,000 in interest","cond":[["mutuo",">=",190000],["interessi","<",80000]],"hint":"A long term raises interest. Try fewer years and more income, or a lower rate."}],"after":"Lengthening the term makes the mortgage grow, but also the interest bill. If it takes 30 years and a payment at the limit to reach the price, the signal is a different one: that house costs too much for that income."},{"type":"page","t":"How the bank looks at you","x":"To decide, the bank looks at four things.\n\n• **Income, and how stable it is.** A permanent contract counts for more than a fixed-term one.\n• **The debts you already have**, and how you paid them: it checks the credit databases.\n• **The value of the house**, estimated by its own appraiser. What counts is the appraisal, not the price you agreed.\n• **How much you put in yourself.**\n\nIf you choose an adjustable rate, run a test on your own: does the payment hold up with two points more? On €160,000 over 25 years, going from 3.5% to 5.5% takes the payment from €801 to €983 a month."},{"type":"num","q":"Marta and Luca earn €3,300 net a month together and already pay €250 a month for the car. With the one-third rule, what mortgage payment can they add?","ans":850,"unit":"€","tol":0.5,"dec":0,"exp":"A third of income: \\(\\dfrac{3{,}300}{3} = \\text{€}1{,}100\\). The car payment has to fit inside it too: \\(1{,}100 - 250 =\\) **€850**."},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"Payment within a third of income, counting other debts. The bank usually lends up to 80% of the appraised value. A longer term means more mortgage, but more interest.","ex":[{"type":"mcq","q":"Net income of €2,700 a month, no other debts. What is a prudent mortgage payment?","options":["€450","€900","€1,350"],"ans":1,"exp":"A third of income: \\(\\dfrac{2{,}700}{3} =\\) **€900**. With €1,350 half of the income would be committed: one unexpected expense would be enough to cause trouble."},{"type":"mcq","q":"With the same payment, what happens if you lengthen the mortgage from 20 to 30 years?","options":["You get more mortgage, and pay more interest in all","You get less mortgage","You pay less interest in all"],"ans":0,"exp":"With more years the same payment repays a bigger debt. But interest is paid for ten more years, and its total goes up a lot."},{"type":"mcq","q":"You agreed on a price of €200,000, but the bank's appraiser values the house at €185,000. On which figure does the bank calculate the 80%?","options":["On the price","On the average of the two figures","On the appraisal"],"ans":2,"exp":"The bank lends based on the value estimated by its appraiser. 80% of €185,000 is €148,000: to reach the price you need €52,000 of your own, not €40,000."}],"pages":[],"lab":"B"}]},{"id":"basi-u15","sid":"basi-notizie","name":"Understanding the news","lessons":[{"key":"basi-15-1","sym":"GDP","title":"GDP, inflation, unemployment","minutes":8,"flow":[{"type":"guess","q":"Out of 100 Italians between 15 and 64, 63 have a job. Of the other 37, how many count as unemployed in the statistics?","after":"About **4**. The other 33 don't work but aren't looking for a job either: they study, take care of the home, have stopped looking. The statistics call them **inactive**. For ISTAT, the Italian statistics institute, only someone who has no job, is looking for one and is ready to start counts as unemployed. And the unemployment rate is calculated only on those who work or look: 4 out of 67, that is about 6%.","min":0,"max":37,"step":1,"truth":4,"near":2,"unit":"people"},{"type":"page","t":"GDP, and how to read it","x":"**GDP is the value of everything a country produces in a period: goods and services, from bread to doctor visits.**\n\nWhen a news story says GDP has grown, look at three things.\n\n• **Compared with when.** The change on the previous quarter is called quarter-on-quarter; the one on the same quarter a year ago, year-on-year. In summer 2026 Italian GDP was flat on the previous quarter and 0.8% higher than a year earlier.\n• **Real or nominal.** Nominal GDP rises even just because prices rise. Real GDP strips out inflation: it is the number the news reports.\n• **Total or per person.** A country can grow just because it has more inhabitants. For the standard of living, **GDP per capita** counts.\n\nReal growth is obtained, more or less, like this:\n\n$$\\text{real} \\approx \\text{nominal} - \\text{inflation}$$\n\nAnd one limit: GDP measures how much is produced, not how people live. It doesn't say how income is divided, and it doesn't count unpaid work."},{"type":"num","q":"In one year a country's nominal GDP grows 3.5% and prices grow 2.7%. By roughly how much did real GDP grow?","ans":0.8,"unit":"%","tol":0.05,"dec":1,"exp":"\\(\\text{real growth} \\approx \\text{nominal growth} - \\text{inflation} = 3.5\\% - 2.7\\% =\\) **0.8%**. The rest of the growth is made only of higher prices."},{"type":"page","t":"Inflation in the headlines","x":"You have already met inflation: it is the general rise in prices. In the news it comes with three labels.\n\n• **Year-on-year**: this month's prices against those of the same month a year ago. It is the number in the headlines.\n• **Month-on-month**: against last month. It tells whether the run is accelerating or slowing down.\n• The **shopping basket**: only food and household and personal care products. These are everyday purchases, so it is the increase you feel the most.\n\nA real example: in October 2026 ISTAT estimated +5.4% year-on-year and +0.9% on the month, with the shopping basket at +2.5%. Energy prices were the ones driving it.\n\nA frequent trap: if inflation falls from 5% to 3%, prices do not fall. They still rise, only more slowly."},{"type":"lever","t":"A hundred people and a rate","x":"A hundred people between 15 and 64. Whoever is not employed and not looking for work is inactive.","model":"lavoro","params":{},"sliders":[{"id":"occ","label":"Employed","min":55,"max":70,"step":1,"start":63,"unit":""},{"id":"dis","label":"Unemployed: looking for work","min":1,"max":12,"step":1,"start":4,"unit":""}],"goals":[{"label":"Bring unemployment below 5% without creating jobs","cond":[["tasso10","<",50],["occ","<=",63]],"hint":"If the employed stay at 63, only the number of people looking can change."},{"label":"Now create three jobs","cond":[["occ",">=",66]],"hint":"Raise the employed to 66 and see what the two rates do."}],"after":"The unemployment rate counts only people looking for work. If someone stops looking they become inactive, and the rate falls even if nobody found a job. That is why it has to be read together with the employment rate, which tells how many people actually work."},{"type":"bucket","t":"Employed, unemployed or inactive?","buckets":["Employed","Unemployed","Inactive"],"items":[["Works part-time, 20 hours a week",0,"For the statistics, having worked at least one hour in the week is enough."],["Without a job, sends out résumés every week",1,"Does not work, is looking and is available: unemployed."],["Studies and is not looking for work",2,"Does not work and is not looking: for the statistics, among the inactive."],["Has stopped looking: thinks they will not find anything",2,"Whoever no longer looks does not count among the unemployed."],["On Italy's wage supplement fund for a month",0,"Whoever is absent from work for a short time stays among the employed."]]},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"GDP: check whether it is real and compared with when. Lower inflation doesn't mean lower prices. Unemployment counts only those who look: read it together with employment.","ex":[{"type":"mcq","q":"A country's real GDP grows 0.5% and its population 1%. What happens to GDP per capita?","options":["It rises","It falls","It stays the same"],"ans":1,"exp":"GDP grows less than the population: the share that on average falls to each person shrinks by about half a percentage point."},{"type":"mcq","q":"Inflation goes from 5% to 2%. What do prices do?","options":["They fall by 3%","They go back to the level of a year earlier","They still rise, but more slowly"],"ans":2,"exp":"Lower inflation means prices that rise less quickly. For prices to fall you need negative inflation, which is called deflation."},{"type":"mcq","q":"In one month the unemployment rate falls, but the number of employed doesn't rise. What may have happened?","options":["Some people stopped looking for work","Salaries went up","GDP grew"],"ans":0,"exp":"Whoever stops looking goes from unemployed to inactive, and drops out of the count. The rate falls even if nobody found a job."}],"pages":[],"lab":"B"},{"key":"basi-15-2","sym":"3%","title":"Deficit and public debt","minutes":8,"flow":[{"type":"guess","q":"In 2025 the Italian state spent more than it took in. By how much, for every €1,000 of GDP?","after":"**€31** for every 1,000 of GDP, that is 3.1%: it is the **deficit**. It seems little, but it adds to a debt that is already worth €1,367 for every 1,000 of GDP. The deficit is what is missing in one year. The debt is what has piled up over all the past years.","min":0,"max":100,"step":1,"truth":31,"near":8,"unit":"€"},{"type":"page","t":"Two words that get confused","x":"**The deficit is how much the state spends over what it takes in during a year. Public debt is the sum of past deficits, still to be repaid.**\n\nOne is measured over a year, the other builds up over time.\n\nTo cover the deficit the state borrows money, by selling securities such as BOT and BTP, the Italian government bonds. Every year that ends in deficit adds debt.\n\nBoth numbers are measured relative to GDP, because what matters is the size of the debt compared with the economy that has to carry it.\n\n| | Italy, 2025 | EU threshold |\n|---|---|---|\n| Deficit | 3.1% of GDP | 3% |\n| Debt | 136.7% of GDP | 60% |\n\nWhoever exceeds a 3% deficit can end up in a European procedure, which asks for a plan to get back in line. Italy has been in one since 2024."},{"type":"bucket","t":"Deficit or debt?","buckets":["Deficit","Debt"],"items":[["How much the state spends over what it takes in this year",0,"It is the result of a single year."],["All the BOT and BTP still to be repaid",1,"It is what the state has to repay in all."],["The European reference is 3% of GDP",0,"The 3% concerns each year's deficit."],["The European reference is 60% of GDP",1,"The 60% concerns the accumulated debt."],["It grows every year in which the accounts close in the red",1,"Every deficit adds to the debt."]]},{"type":"page","t":"What makes debt rise or fall","x":"The ratio of debt to GDP can fall even without repaying €1. It depends on three forces.\n\n• **Interest** makes debt grow, because it has to be paid every year. In 2025 Italy paid €87 billion: 3.8% of GDP.\n• **Growth** makes GDP grow, that is the number under the fraction. What counts is nominal growth, prices included.\n• The **primary balance**: the difference between revenue and spending before paying interest. If it is positive it is called a primary surplus, and it reduces debt. In 2025 Italy's was 0.8% of GDP.\n\nThe rule is this: if the rate paid on the debt is higher than growth, debt rises on its own, and to stop it you need a primary surplus. If growth exceeds the rate, debt falls on its own."},{"type":"lever","t":"Ten years of public debt","x":"We start from numbers close to Italy's 2025 figures: debt at 137% of GDP and deficit at 3.1%.","model":"debito","params":{"debito":137,"anni":10},"sliders":[{"id":"crescita","label":"GDP growth, prices included","min":0,"max":6,"step":0.5,"start":2.5,"unit":"%","dec":1},{"id":"tasso","label":"Average rate paid on the debt","min":1,"max":6,"step":0.5,"start":3,"unit":"%","dec":1},{"id":"primario","label":"Primary balance, as a share of GDP","min":-3,"max":4,"step":0.5,"start":1,"unit":"%","dec":1}],"goals":[{"label":"Bring debt below 130% of GDP","cond":[["finale","<",130]],"hint":"You can raise growth, lower the rate or raise the primary balance."},{"label":"Now do it with growth of 1%","cond":[["finale","<",130],["crescita","<=",1]],"hint":"With little growth you need a big primary surplus, or a lower rate."}],"after":"If growth stays at 1% and the rate stays at 3%, to get below 130% you need a primary surplus of 3.5% of GDP every year, for ten years: more taxes or less spending by tens of billions. With growth of 3.5% half a point would be enough. That is why, when talking about debt, growth counts as much as cuts."},{"type":"num","q":"A country has debt equal to 140% of GDP and pays an average of 3% interest. How much does it spend on interest each year, as a percentage of GDP?","ans":4.2,"unit":"%","tol":0.05,"dec":1,"exp":"\\(\\text{interest} = \\text{debt} \\times \\text{rate} = 140\\% \\times 3\\% =\\) **4.2%** of GDP. It is money that every year cannot go to schools, healthcare or pensions."},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"The deficit is for one year, the debt piles up. Both are measured against GDP. Debt falls if growth exceeds the rate paid, or with a primary surplus.","ex":[{"type":"mcq","q":"A country ends the year with a lower deficit than the year before. What happens to its debt?","options":["It falls","It stays put","It still rises, but less than before"],"ans":2,"exp":"As long as the accounts close in deficit, the amount of debt keeps rising. A smaller deficit only means it rises more slowly."},{"type":"mcq","q":"What is a primary surplus?","options":["Revenue higher than spending, before paying interest","The debt left over at the end of the year","A European loan"],"ans":0,"exp":"The primary balance compares revenue and spending without counting interest on the debt. When it is positive it is called a primary surplus: it is the resources left to pay interest and reduce debt."},{"type":"mcq","q":"A debt costs 3% on average and nominal GDP grows 5%. With a balanced primary balance, what does the ratio of debt to GDP do?","options":["It rises","It falls","It stays the same"],"ans":1,"exp":"Debt grows 3% because of interest, but GDP grows 5%: the fraction shrinks. That is why growth, even growth made of inflation, lightens debt."}],"pages":[],"lab":"B"},{"key":"basi-15-3","sym":"SPR","title":"Spread and rating","minutes":7,"flow":[{"type":"guess","q":"November 2011, in the middle of the debt crisis: the spread between BTPs and Bunds hits its record. How many basis points?","after":"**574 basis points**, on November 9, 2011: to lend money to Italy for ten years the market asked 5.74% more than for Germany. On November 10, 2026 the spread was at 102. That number is a thermometer: it tells how risky lending to one state is considered compared with another.","min":0,"max":1000,"step":10,"truth":574,"near":60,"unit":"points"},{"type":"page","t":"What the spread is","x":"**The spread is the difference between the yield on ten-year Italian government bonds, the BTPs, and that on German bonds, the Bunds.**\n\nIt is measured in **basis points**: 100 basis points are one percentage point.\n\n$$\\text{spread} = \\text{BTP} - \\text{Bund}$$\n\nGermany is the benchmark because its bonds are considered the safest in the euro area. The **spread** is therefore the premium the market asks for lending to Italy instead of Germany.\n\nWhy it ends up in the news:\n\n• if it rises, the state pays higher interest on new bonds, and that money leaves the public budget;\n• over time the rates that banks charge on mortgages and loans rise too;\n• whoever already holds BTPs sees their price fall."},{"type":"num","q":"On November 10, 2026 the ten-year BTP yielded 4.27% and the Bund 3.25%. What was the spread, in basis points?","ans":102,"unit":"","tol":0.5,"dec":0,"exp":"\\(\\text{spread} = 4.27\\% - 3.25\\% = 1.02\\%\\). One percentage point is 100 basis points, so the spread was **102 basis points**."},{"type":"page","t":"The rating: the report card of debt","x":"A **rating** is a grade on the ability of a state, or of a company, to repay its debts. It is given by private agencies: the most followed are S&P, Moody's and Fitch.\n\nThe scale goes from AAA, the top, down to D, which means a missed payment. The line that matters is in the middle.\n\n| Band | S&P grades |\n|---|---|\n| Investment grade | AAA to BBB− |\n| Speculative | BB+ and below |\n\nMany funds can only buy **investment grade** securities. Whoever falls below that line loses some of its buyers, and pays higher rates.\n\nAt the beginning of November 2026 Italy has BBB+ from S&P and from Fitch, and Baa2 from Moody's, which on its scale equals BBB: a few notches above the line.\n\nNext to the grade there is the **outlook**: positive, stable or negative. It says in which direction the grade could move."},{"type":"order","t":"From safest to riskiest","items":["AAA","A","BBB","BB","CCC"],"x":"Tap the grades from the highest to the lowest.","after":"From BBB up we are in the investment grade band. From BB down, in the speculative one. Inside each letter there are then pluses and minuses: BBB+ is one notch above BBB."},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"The spread is the extra yield of BTPs over Bunds, in basis points. The rating is the grade on the debt: from BBB− up it is investment grade, below it is speculative.","ex":[{"type":"mcq","q":"The spread goes from 80 to 150 basis points. What does it mean?","options":["That the market asks more to lend to Italy instead of Germany","That BTPs yield less than Bunds","That public debt has decreased"],"ans":0,"exp":"A wider spread means that the yield on BTPs has moved further from that on Bunds: to buy Italian bonds the market wants a higher premium."},{"type":"mcq","q":"You hold a BTP bought a year ago. The spread rises a lot, with German yields unchanged. What happens to the price of your bond?","options":["It rises","It falls","It doesn't change"],"ans":1,"exp":"If the spread rises with Bund yields unchanged, the BTP yield has risen. Bonds already in circulation, which pay lower coupons, are worth less. If you hold it to maturity you still receive all the principal."},{"type":"mcq","q":"A country goes from BBB− to BB+. Why is it important news?","options":["Because it climbs one notch","Because only the name of the grade changes","Because it leaves the investment grade band"],"ans":2,"exp":"BBB− is the last notch of investment grade. With BB+ you enter the speculative band: many funds can no longer hold those bonds and have to sell them."}],"pages":[],"lab":"B"},{"key":"basi-15-4","sym":"IDX","title":"Stock market indexes","minutes":7,"flow":[{"type":"guess","q":"The FTSE MIB is the most quoted index of the Italian stock market. How many companies does it contain?","after":"There are **40**: the largest and most traded of those listed in Milan. An index is not the whole stock market: it is a basket chosen by a rule. The American S&P 500 contains 500, the German DAX 40.","min":0,"max":300,"step":10,"truth":40,"near":10,"unit":"companies"},{"type":"page","t":"What an index measures","x":"**A stock market index sums up in a single number the prices of a group of stocks. If it rises, on average those stocks are worth more.**\n\nIts value is expressed in points, but points alone say nothing: what counts is the percentage change, calculated like this:\n\n$$\\frac{\\text{today} - \\text{yesterday}}{\\text{yesterday}}$$\n\nEach index tells a different piece of the market.\n\n• The **FTSE MIB**: 40 large Italian companies, among which banks and energy weigh a lot.\n• The **S&P 500**: 500 large American companies, among which technology weighs a lot.\n\nWhen you hear that the stock market has wiped out billions, it means the market value of companies has fallen. No cash has vanished: the prices at which those stocks trade have fallen. They can rise again, or fall further."},{"type":"num","q":"An index closes at 40,600 points. The day before it had closed at 40,000. By what percentage did it rise?","ans":1.5,"unit":"%","tol":0.05,"dec":1,"exp":"\\(\\text{change} = \\dfrac{40{,}600 - 40{,}000}{40{,}000} = \\dfrac{600}{40{,}000} =\\) **1.5%**."},{"type":"page","t":"Not all weigh the same","x":"In most indexes the companies don't count the same: each weighs in proportion to its value on the stock market, its **market capitalization**.\n\nA company worth 100 billion moves the index ten times more than one worth 10 billion.\n\nTwo consequences.\n\n• A few names can decide the day. In the FTSE MIB, in mid-2026, the top five companies alone were worth more than half of the index.\n• The index can rise even if most of the stocks fall: it is enough that the biggest ones rise."},{"type":"lever","t":"An index with three companies","x":"Three companies: the large one weighs 60, the medium one 30, the small one 10. Move their daily changes.","model":"indice","params":{"pa":60,"pb":30,"pc":10},"sliders":[{"id":"a","label":"The large one, weight 60","min":-10,"max":10,"step":1,"start":0,"unit":"%"},{"id":"b","label":"The medium one, weight 30","min":-10,"max":10,"step":1,"start":0,"unit":"%"},{"id":"c","label":"The small one, weight 10","min":-10,"max":10,"step":1,"start":0,"unit":"%"}],"goals":[{"label":"Make the index rise 3% with the medium and small ones flat or down","cond":[["ind10",">=",30],["b","<=",0],["c","<=",0]],"hint":"Just move the largest company."},{"label":"Now make the index close down with two out of three companies up","cond":[["ind10","<",0],["su",">=",2]],"hint":"Make the large one fall, and the other two rise a little."}],"after":"The large company alone is worth 60% of the index: if it rises 5%, the index rises 3% with the others flat. And a day with two stocks out of three up can close in the red. The index tells how the market is doing on average, weighted by value. It doesn't tell how most of the companies are doing."},{"type":"page","t":"Two warnings about newspaper headlines","x":"• **Dividends are not visible.** Almost all the indexes quoted in the news track only prices. Whoever held the stocks also collected the dividends: over many years, the real return is higher than the one the index shows.\n• **Points are misleading.** A drop of 500 points is serious on an index at 5,000 and almost nothing on one at 50,000. Always look at the percentage.\n\nAnd remember that an index is not the economy. Inside it there are only listed companies, often large and with a lot of business abroad: the stock market can rise in a year when GDP is flat."},{"type":"ex","i":0},{"type":"ex","i":1},{"type":"ex","i":2}],"note":"An index is a basket of stocks weighted by market value: look at the percentage, not the points. It usually doesn't count dividends. And the stock market is not the whole economy.","ex":[{"type":"mcq","q":"An index loses 400 points. What do you need to tell whether it is a lot or a little?","options":["The name of the index","The value it started from, to calculate the percentage","The number of companies it contains"],"ans":1,"exp":"Four hundred points are 4% of an index at 10,000 and 0.8% of one at 50,000. Without the starting value the number says nothing."},{"type":"mcq","q":"In an index weighted by market capitalization, which company moves the result the most?","options":["The one with the most employees","The one listed the longest","The one worth the most on the stock market"],"ans":2,"exp":"The weight of each company is in proportion to its market value. The largest count more, and can decide the direction of the day on their own."},{"type":"mcq","q":"The FTSE MIB rises 1%. What can you say for sure?","options":["That, taking the weights into account, its 40 companies are on average worth more","That all Italian stocks have risen","That the Italian economy has grown 1%"],"ans":0,"exp":"An index tells how its basket did on average, weighted by value. Some companies may have fallen, those outside the basket don't count, and the stock market is not GDP."}],"pages":[],"lab":"B"}]}];

// =====================================================================================================
// DATI: percorsi, lezioni, figurine, punteggi
// =====================================================================================================
// "Basi della finanza": primo percorso non d'esame. Contenuti originali, brevi, con un esempio numerico per lezione.
// Le lezioni stanno in basi_src.py (che le controlla e scrive basi.json): build.sh le mette qui sopra come BASI_UNITS.
// Quali lezioni valgono nel paese scelto: A = per tutti, B/C/E = regole e fatti italiani (si vedono solo con l'Italia).
// Senza etichetta (app in italiano) valgono tutte. Per gli Stati Uniti la valuta delle lezioni diventa il dollaro: € -> $ nel testo, \text{€} -> \text{\$} nelle formule.
const lessonOk = l => !l.lab || l.lab === 'A' || COUNTRY === 'IT';
function usDollars(x) {
  if (typeof x === 'string') {
    if (x.indexOf('€') < 0) return x;
    const m = [];   // le formule si tengono da parte: lì il dollaro va protetto con la barra
    const t = x.replace(/\$\$[\s\S]*?\$\$|\\\([\s\S]*?\\\)/g, f => { m.push(f.replace(/€/g, '\\$')); return '\u0001' + (m.length - 1) + '\u0002'; });
    return t.replace(/€/g, '$').replace(/\u0001(\d+)\u0002/g, (_, i) => m[+i]);
  }
  if (Array.isArray(x)) return x.map(usDollars);
  if (x && typeof x === 'object') { const o = {}; for (const k in x) o[k] = usDollars(x[k]); return o; }
  return x;
}
// Per gli Stati Uniti ogni lezione passa da usDollars, tranne quelle con una variante americana (campo "us"): sono già scritte in dollari (e in euro dove si parla proprio dell'euro) e prendono il posto dei campi di base.
const usLesson = l => { const b = usDollars(Object.assign({}, l, { us: undefined })); return l.us ? Object.assign(b, l.us) : b; };
const BASI_LIST = LANG === 'en' && COUNTRY === 'US' ? BASI_UNITS.map(u => Object.assign({}, u, { lessons: u.lessons.map(usLesson) })) : BASI_UNITS;
const BASI = {
  id: 'basi', name: 'Finance basics', badge: CUR, color: AZ, group: 'basi', ready: true, pace: 48,
  tagline: 'For people starting from zero',
  learn: ['How interest, inflation and time work', 'How to keep income, spending and savings in order', 'What loans and mortgages cost, and the math to do before buying a home', 'How to protect yourself from the unexpected', 'What stocks, funds and ETFs are, and how to invest a little at a time', 'What mistakes our brain makes when investing', 'How to read a company\'s financial statements, and how the economy works'],
  units: BASI_LIST.map(u => ({ id: u.id, name: u.name, sections: [{ id: u.sid, name: u.name, lessons: u.lessons.filter(lessonOk) }] })).filter(u => u.sections[0].lessons.length)
};
// Parole da toccare nelle lezioni di base: ogni parola in grassetto che sta qui si apre con un tocco e mostra una spiegazione in parole semplici.
// La chiave è la parola in minuscolo, come compare in grassetto nelle lezioni; le forme diverse (singolare, plurale) stanno in GLOSS_ALIAS.
const GLOSS_DEF = (d => COUNTRY === 'US' ? usDollars(d) : d)({"medium of exchange":["Medium of exchange","One of the three jobs of money: you hand it over in exchange for what you need, without having to swap one thing for another."],"unit of account":["Unit of account","One of the three jobs of money: it works as a yardstick to measure and compare prices."],"store of value":["Store of value","One of the three jobs of money: it keeps its value over time, so you can earn today and spend later."],"investments":["Investments","Using money today to have more in the future, accepting some risk: for example by buying stocks, bonds or shares of a fund."],"principal":["Principal","The starting amount, not counting interest: the sum you lend, deposit or invest, or the sum you borrow and have to pay back."],"interest":["Interest","The payment for using money over time. You receive it when you lend or deposit money, and you pay it when you borrow. It is calculated as a percentage of the amount."],"rate":["Rate","Interest expressed as a percentage of the amount, usually for one year. A rate of 5% a year means €5 of interest for every €100, every year."],"simple interest":["Simple interest","Interest calculated only on the starting principal. The interest is the same every year."],"final amount":["Final amount","The end figure: the starting principal plus the interest earned."],"basket":["Basket","The list of goods and services that stands for what households typically spend. It is used to measure how much prices go up."],"purchasing power":["Purchasing power","How much you can buy with a given amount of money. If prices go up and the amount stays the same, purchasing power goes down."],"nominal rate":["Nominal rate","The rate written on the contract: it tells you how much the amount grows, without taking inflation into account."],"real rate":["Real rate","The rate after inflation: it tells you how much what you can actually buy really grows. It is roughly the nominal rate minus inflation."],"income":["Income","The money that comes in over a period: salary, pension, rent you collect."],"expenses":["Expenses","The money you spend over a period, from utility bills to coffee."],"balance":["Balance","The difference between income and expenses. If it is positive you have something left over; if it is negative you spent more than you earned."],"fixed expenses":["Fixed expenses","The expenses that come back every month for the same amount or nearly, like rent, utility bills and subscriptions."],"variable expenses":["Variable expenses","The expenses that change from one month to the next and depend on what you do, like groceries, eating out and clothes."],"savings":["Savings","The part of your income that you don't spend and set aside."],"needs":["Needs","The expenses you can't do without: housing, bills, food, transport to work."],"wants":["Wants","The expenses that make life more enjoyable but could be cut back: eating out, trips, subscriptions."],"emergency fund":["Emergency fund","A sum kept aside only for the unexpected, usually equal to 3 to 6 months of expenses, in an account you can withdraw from right away."],"liquid":["Liquid","Said of money or investments you can use quickly and without losing out. A checking account is liquid; a house is not."],"liquidity":["Liquidity","How quickly you can turn something into cash without losing out. Money ready to use is also called liquidity."],"checking account":["Checking account","The everyday account: you use it to receive your salary and to pay. It earns little or nothing."],"savings account":["Savings account","An account made to leave a sum untouched in exchange for interest. It can be flexible, if you can withdraw whenever you want, or locked for a set time."],"installment":["Installment","The amount you pay at each due date to pay back a loan. It contains a part of interest and a part of principal."],"nominal interest rate":["Nominal interest rate","The yearly interest rate of the loan, not counting fees."],"apr":["APR","Annual percentage rate. It is what the loan costs you in a year, putting together interest and mandatory fees. It is the number to compare between different offers."],"fees":["Fees","The costs of a loan that are not interest: setting up the loan, collecting each payment, the insurance the bank requires you to take out."],"mortgage":["Mortgage","The long-term loan you take out to buy a home. It is secured by the home itself."],"lien":["Lien","The guarantee you give the bank when you take out a mortgage: if you stop paying, the bank can have the home sold to get its money back."],"fixed rate":["Fixed rate","A rate that stays the same for the whole life of the loan. The payment doesn't change either."],"adjustable rate":["Adjustable rate","A rate that follows a market benchmark rate: when that goes up or down, your payment changes too."],"spread":["Spread","The difference between two rates. On a mortgage it is the markup the bank adds to the benchmark rate. In the news it is the gap between the yield on Italian government bonds (BTPs) and on German ones (Bunds)."],"revolving credit":["Revolving card","A credit card that lets you pay back what you spend in installments, charging interest on the debt that remains. The rate is often high."],"credit bureaus":["Credit bureaus","Databases where banks and lenders record loan applications and payments, on time or late. They check them before granting credit."],"economically inactive":["Economically inactive","People who don't have a job and aren't looking for one: students, retirees, people who take care of the home, people who have stopped looking. They are not counted among the unemployed."],"gdp per capita":["GDP per capita","GDP divided by the number of inhabitants. It is used to compare living standards between countries of different sizes."],"shopping basket":["Shopping basket","The trend of prices for food and for household and personal care products: the things people buy most often."],"deficit":["Deficit","How much the government spends beyond what it takes in during a year. It is measured as a percentage of GDP."],"primary balance":["Primary balance","The difference between the government's revenue and spending, not counting the interest on the debt. When it is positive it is called a primary surplus."],"basis points":["Basis points","Hundredths of a percentage point: 100 basis points are 1%. They are used to measure small differences between rates."],"rating":["Rating","The grade an agency gives to the ability of a government or a company to pay back its debts. It goes from AAA, the highest, to D."],"investment grade":["Investment grade","The band of the highest ratings, from AAA to BBB−: debt considered reliable. Below this line, bonds are called speculative."],"outlook":["Outlook","The expected direction. Next to a rating it can be positive, stable or negative: it says where the grade might move."],"market capitalization":["Market capitalization","The value of a company on the stock market: the price of one share times the number of shares."],"insurance":["Insurance","An agreement in which you pay a small, certain amount to a company, which in return compensates you if you suffer a loss covered by the contract."],"premium":["Premium","The price of insurance: the amount you pay the company, usually once a year."],"payout":["Payout","The sum the insurance company pays you when you suffer a loss covered by the policy."],"policy":["Policy","The insurance contract. It says what is covered, how much you pay and how much you receive in case of loss."],"exclusions":["Exclusions","The cases in which the policy doesn't pay, written in the contract. It is the part to read most carefully."],"deductible":["Deductible","The fixed part of each loss that stays with you. With a €500 deductible, on €3,000 of damage the company pays €2,500."],"percentage deductible":["Percentage deductible","The part of each loss that stays with you, expressed as a percentage. With a 10% deductible, on €3,000 of damage you pay €300."],"coverage limit":["Coverage limit","The highest amount the company pays for a loss. The part above the limit stays with you."],"liability":["Liability","The obligation to compensate for the damage you cause to other people or to their property. The insurance that covers it is called liability insurance."],"auto liability insurance":["Auto liability insurance","The insurance that pays for the damage you cause to others with your vehicle. In most places the law requires every driver to have it."],"ponzi scheme":["Ponzi scheme","A scam in which there is no real investment: the gains paid to the first people in are the money paid in by those who join later. When the new arrivals run out, it collapses."],"phishing":["Phishing","A fake email that imitates your bank, a courier or an agency, to get you to open a link and enter data or codes."],"smishing":["Smishing","Phishing done with a text message or a chat message. It can show up in the same conversation as the real messages from your bank."],"vishing":["Vishing","The scam done by phone: a fake agent from your bank, or from another service, talks you into giving away codes or moving money."],"spoofing":["Spoofing","Faking the name of the sender of a message or the number of the caller, so that it looks like someone you trust is writing or calling."],"identity theft":["Identity theft","Using another person's data, such as ID documents and personal numbers, to get loans or open accounts in their name."],"term life insurance":["Term life insurance","A policy that pays a sum to the people named if the insured person dies before a set date. If the insured is still alive at the end, it pays nothing."],"with-profits policy":["With-profits policy","A life insurance policy that is also an investment, linked to the company's prudent management. The capital grows slowly, usually with a guarantee written in the contract."],"unit-linked policy":["Unit-linked policy","A life insurance policy that is also an investment, whose value follows that of the funds it is linked to. The risk that the funds go down is borne by the person who takes it out."],"premium charge":["Premium charge","The part of each payment that a policy keeps to cover its costs, before investing the rest."],"kid":["KID","Key information document: a document of at most three pages with the key facts about an investment product: risks, scenarios and costs. It must be handed to you before you sign."],"stocks":["Stocks","Ownership stakes in a company. They earn through dividends and through a rising price, but nothing is guaranteed."],"dividend":["Dividend","The part of profit that a company distributes to its owners, that is, to the people who hold its stock."],"bonds":["Bonds","Loans made to a company or to a government. In return you receive interest at fixed dates, the coupons, and the repayment of the principal at maturity."],"coupon":["Coupon","The interest that a bond pays at fixed dates, for example once a year."],"redemption":["Redemption","The paying back of the principal lent, at the maturity of the bond."],"mutual fund":["Mutual fund","A vehicle that gathers the money of many savers and invests it in many securities together. Those who take part own shares of the fund."],"shares":["Shares","The equal parts a fund is divided into. Whoever invests in a fund buys shares, and the value of each share changes over time."],"etf":["ETF","A fund that is bought and sold on the stock exchange like a stock. It usually tracks an index, that is, a basket of securities chosen by a fixed rule, and it costs little."],"risk":["Risk","The possibility that the result is different from what was expected, for better or for worse. The higher it is, the further results can move from the average."],"diversify":["Diversify","Splitting your money among many different investments, so the trouble of just one weighs little on the total."],"time horizon":["Time horizon","The time that passes before you need the money you invested. The longer it is, the more ups and downs you can bear."],"gross":["Gross","Before costs and taxes are taken out."],"net":["Net","What is left after costs and taxes are taken out."],"lump sum":["Lump sum","Investing a whole sum all at once, in a single go."],"dollar-cost averaging":["Dollar-cost averaging","Investing a fixed amount at regular intervals, usually every month."],"average purchase price":["Average purchase price","What each share or unit cost you on average: the total paid in divided by the number of shares you own. It is your break-even point."],"asset allocation":["Asset allocation","How you split your money among different types of investments, for example how much in stocks and how much in bonds."],"rebalance":["Rebalance","Bringing the portfolio back to the split you chose, by selling a bit of what went up and buying what lagged behind."],"loss aversion":["Loss aversion","The tendency to suffer more from a loss than you enjoy a gain of the same size: about twice as much."],"fomo":["FOMO","Short for fear of missing out: the worry of being left out of a gain that others are making."],"herd behavior":["Herd behavior","The tendency to do something because everyone is doing it, without asking whether it makes sense."],"bubble":["Bubble","A phase in which prices rise much more than the real value of what is being bought, pushed by enthusiasm. It ends with a sudden drop."],"overconfidence":["Overconfidence","The tendency to believe you are better or better informed than average. In investing it leads to taking too much risk and to buying and selling too often."],"fee":["Fee","The payment you make to an intermediary for a service, for example every time you buy or sell securities."],"balance sheet":["Balance sheet","The document that takes a snapshot of a company on one specific day: what it owns, what it owes to others and what is left for its owners."],"assets":["Assets","What a company owns: cash, inventory, equipment, money owed by customers."],"liabilities":["Liabilities","What a company owes to others: debts with banks, suppliers, the tax authorities."],"equity":["Equity","What is left to the owners of a company once all the debts are paid: assets minus liabilities."],"income statement":["Income statement","The document that tells the story of a period, usually a year: how much the company took in, how much it spent and how much was left."],"revenue":["Revenue","What a company takes in by selling its products or services."],"costs":["Costs","What is spent to obtain something. For a company they are raw materials, salaries, rent; for an investor they are fees and management costs."],"profit":["Profit","What is left to a company after taking costs away from revenue."],"gross margin":["Gross margin","Revenue minus the cost of the goods sold. It tells you how much is left before paying salaries, rent and the other overhead costs."],"operating income":["Operating income","What the company earns from its business, before paying interest and taxes."],"net income":["Net income","What is left to the company after everything is taken out: costs, interest and taxes."],"net margin":["Net margin","Net income divided by revenue: how many cents the company keeps for every €1 of sales."],"accrual basis":["Accrual basis","The rule that revenue and costs are recorded when they arise, not when the money comes in or goes out."],"depreciation":["Depreciation","The share of the cost of an asset that lasts several years, like a machine, counted in each year it is used."],"cash flow statement":["Cash flow statement","The document that shows a company's real cash movements: the money that came in and the money that went out."],"p/e":["P/E","The ratio between the price of a share and the earnings per share: how much you pay for each €1 of yearly earnings."],"central bank":["Central bank","The institution that manages the money of a country or an area, like the Federal Reserve for the dollar or the ECB for the euro. It sets the policy rates to keep prices stable."],"policy rates":["Policy rates","The rates set by the central bank. The rates on mortgages, loans and savings accounts depend on them, one after the other."],"exchange rate":["Exchange rate","The price of one currency expressed in another. If the euro/dollar rate is 1.10, with 1 euro you buy 1.10 dollars."],"currency risk":["Currency risk","The risk of gaining or losing because the value of the currency you invested in changes."],"gdp":["GDP","Gross domestic product: the value of all the goods and services produced in a country in a year. It is the thermometer of the economy."],"recession":["Recession","A phase in which the economy shrinks. The rule of thumb: GDP falls for two quarters in a row."]});
const GLOSS_ALIAS = {"investment":"investments","investing":"investments","capital":"principal","interest rate":"rate","spending":"expenses","fixed expense":"fixed expenses","variable expense":"variable expenses","saving":"savings","cash":"liquidity","current account":"checking account","deposit account":"savings account","installments":"installment","repayment":"installment","tan":"nominal interest rate","taeg":"apr","variable rate":"adjustable rate","margin":"spread","revolving":"revolving credit","credit bureau":"credit bureaus","inactive":"economically inactive","primary surplus":"primary balance","basis point":"basis points","credit rating":"rating","market cap":"market capitalization","exclusion":"exclusions","policy limit":"coverage limit","third-party liability":"liability","unit-linked":"unit-linked policy","stock":"stocks","share":"shares","bond":"bonds","mutual funds":"mutual fund","investment fund":"mutual fund","etfs":"etf","diversification":"diversify","regular investment plan":"dollar-cost averaging","rebalancing":"rebalance","earnings":"profit","operating profit":"operating income","net profit":"net income","price/earnings":"p/e","policy rate":"policy rates","exchange rate risk":"currency risk"};
const glossKey = t => { const k = String(t || '').toLowerCase().replace(/[.,;:!?()«»“”]/g, '').replace(/\s+/g, ' ').trim(); return GLOSS_DEF[k] ? k : GLOSS_ALIAS[k] || null; };
const hasTerms = text => (String(text || '').match(/\*\*[^*]+\*\*/g) || []).some(m => glossKey(m.slice(2, -2)));

// Percorsi non ancora pronti: compaiono nel catalogo come "in arrivo".
// ---- Scopri: le materie divise in cinque categorie ----
// Una voce è un corso che c'è già ({ course }), una materia in arrivo ({ name, sub }) oppure una materia in arrivo con la sua scheda ({ id, levels }).
// La scheda mostra i livelli e i capitoli (ogni capitolo è una domanda); le lezioni entrano un capitolo alla volta, come corsi veri.
const AZIONI_L = [
  { tab: 'How it works', name: 'From idea to purchase', learn: ['Understand what a company does, how it makes money and which industry it plays in', 'Read the price, the P/E and the other multiples', 'Buying and selling: orders, costs, dividends, leverage'],
    parts: [['Get to know it', ['What is a piece of a company?', 'What does it do and how does it make money?', 'What field does it play in?', 'Is it stronger than the others?']], ['Decide and buy', ['Is it expensive or cheap?', 'How do I buy it?']], ['Own it', ['What am I entitled to as a shareholder?', 'How do I measure how it went?', 'Leverage and short selling: why it hurts', 'Can I beat the market?']]] },
  { tab: 'How to value it', name: 'What it\'s really worth', learn: ['Discount dividends and cash flows', 'Find the right rate: CAPM, beta, WACC', 'Compare using multiples and residual income'],
    parts: [['', ['What value am I looking for?', 'What is something that pays forever worth?', 'Where does the rate come from?', 'How do I forecast the numbers?', 'Dividends that grow in stages', 'The cash the company generates', 'Terminal value, and how much a mistake costs', 'Comparing it with the others', 'Does it create value or destroy it?', 'What if I only look at what it owns?', 'What if it isn\'t publicly traded?', 'The final case']]] }
];
const MATERIE = [
  { id: 'basi', name: 'Basics', sub: 'Where you start', color: AZ, ico: Sprout, items: [
    { course: 'basi' },
    { name: 'Numbers and statistics', sub: 'Time value of money, probability, data' } ] },
  { id: 'mercati', name: 'Markets', sub: 'What you buy', color: PESCA, ico: TrendingUp, items: [
    { id: 'azioni', name: 'Stocks', sub: 'Two levels: how they work, what they\'re worth', color: PESCA, levels: AZIONI_L },
    { name: 'Bonds', sub: 'Price, yield, interest rates, credit' },
    { name: 'Derivatives', sub: 'Options, futures, forwards, swaps' },
    { name: 'Alternative investments', sub: 'Real estate, private equity, hedge funds, commodities' } ] },
  { id: 'aziende', name: 'Companies', sub: 'What\'s behind a security', color: MENTA, ico: Briefcase, items: [
    { name: 'Financial statements', sub: 'Read the three statements, see if the numbers hold up' },
    { name: 'Corporate finance', sub: 'Investments, debt or equity, dividends, mergers' } ] },
  { id: 'portafoglio', name: 'Portfolio', sub: 'How you put the pieces together', color: LILLA, ico: PieChart, items: [
    { name: 'Building a portfolio', sub: 'Diversification, risk and return, ETFs' },
    { name: 'Measuring risk and results', sub: 'Sharpe, alpha, VaR, factors' } ] },
  { id: 'economia', name: 'Economy and rules', sub: 'The world around you', color: GIALLO, ico: Scale, items: [
    { name: 'Economics for investors', sub: 'Business cycle, inflation, government, trade' },
    { name: 'Currencies and central banks', sub: 'Interest rates, money, currencies' },
    { name: 'Ethics and rules', sub: 'The duties of those who manage other people\'s money' } ] }
];

let COURSES_MEMO = null;
const losMinutes = l => { const c = l.content || {}; const n = (c.introduction || '').length + (c.sections || []).reduce((s, x) => s + (x.content || '').length, 0); return clamp(Math.round(n / 900) + (l.question ? 2 : 1), 2, 20); };
function courses() {
  if (COURSES_MEMO) return COURSES_MEMO;
  COURSES_MEMO = [BASI];   // il percorso d'esame non c'è più: quello professionale, scritto da zero, entrerà qui come corso a sé
  // indici utili
  COURSES_MEMO.forEach(c => { c.lessons = []; c.units.forEach((u, ui) => u.sections.forEach(s => s.lessons.forEach(l => { l.course = c; l.unit = u; l.ui = ui; l.section = s; if (!l.kind) l.kind = 'base'; c.lessons.push(l); }))); });
  return COURSES_MEMO;
}
const courseById = id => courses().find(c => c.id === id);
let LESSON_MAP = null;
const lessonByKey = key => { if (!LESSON_MAP) { LESSON_MAP = {}; courses().forEach(c => c.lessons.forEach(l => { LESSON_MAP[l.key] = l; })); } return LESSON_MAP[key]; };
const isDone = key => s2get().basi.includes(key);
const doneCount = list => list.filter(l => isDone(l.key)).length;
const unitLessons = u => u.sections.flatMap(s => s.lessons);

// ---- su misura: l'obiettivo scelto alla registrazione decide che cosa c'è nell'app ----
// Un obiettivo porta un percorso di partenza: un corso intero, oppure una scelta ordinata delle sue unità più quelle ancora da scrivere ("in arrivo").
// Tutte le schede leggono da qui.
const MIS_SOON = {
  azob: ['Stocks and bonds', 'every kind of stock, government and corporate bonds, each with a worked example'],
  fondi: ['Funds and ETFs', 'active and index funds, accumulating or distributing, with costs in numbers'],
  'w-salute': ['Telling whether a company is healthy', 'margins, EBITDA, ROE, debt'],
  'w-cassa': ['Cash', 'receivables, inventory, suppliers'],
  'w-costi': ['Costs, prices and margins', 'break-even point, budget'],
  'w-invest': ['Deciding on an investment', 'NPV, IRR, payback time'],
  'w-finanz': ['Financing the company', 'debt or equity, bank, leasing'],
  'w-valuta': ['Valuing a company', 'multiples and the idea of DCF']
};
// una riga su cosa c'è dentro ogni unità delle Basi (schermata "Ecco la tua FinLearn")
const MIS_SUB = { 'basi-u1': 'Interest, inflation, real rate', 'basi-u7': 'Budget, emergency fund, goals', 'basi-u11': 'Account, cards, transfers, deposit insurance', 'basi-u12': 'Payslip, income tax, deductions, severance pay', 'basi-u4': 'Loans, interest rate and APR, mortgage', 'basi-u13': 'Renting or buying, how big a mortgage you can afford', 'basi-u14': 'Public pension, pension funds, severance pay', 'basi-u15': 'GDP, public debt, spread, stock market indexes', 'basi-u8': 'Insurance, scams, life policies', 'basi-u2': 'Stocks, bonds, funds, accounts',
  'basi-u3': 'Return, diversification, time horizon', 'basi-u9': 'A little at a time, the rule of 72', 'basi-u10': 'Fear of losing, following the crowd', 'basi-u5': 'Balance sheet, profit, cash, price and value', 'basi-u6': 'Central banks, exchange rates, the business cycle' };
// stops: le unità del percorso in ordine; "+nome" è un'unità in arrivo. null = tutto il corso.
// (un oggetto senza le voci "di serie": il nome dell'obiettivo arriva anche dai dati salvati, e una parola come "constructor" non deve valere come percorso)
const MIS_PATHS = Object.assign(Object.create(null), {
  zero: { goal: 'Understand finance from scratch', name: 'Finance basics', pill: 'For people starting from zero', course: 'basi', color: AZ, stops: null },
  invest: { goal: 'Invest my savings', name: 'Invest my savings', pill: 'For people who want to invest', course: 'basi', color: PESCA, ico: TrendingUp, stops: ['basi-u1', 'basi-u2', 'basi-u3', '+azob', '+fondi', 'basi-u9', 'basi-u10'] },
  work: { goal: 'Use it at work', name: 'Finance for work', pill: 'For people who use it at work', course: 'basi', color: MENTA, ico: Briefcase, stops: ['basi-u5', '+w-salute', '+w-cassa', '+w-costi', 'basi-u1', '+w-invest', '+w-finanz', 'basi-u6', '+w-valuta'] }
});
// Chi usava l'app prima di "su misura": l'obiettivo si ricava da quello che aveva scelto o iniziato, e i percorsi iniziati restano tutti.
function misDerive(s) {
  const ob = s.onboard || {}, st = new Set(s.started || []), done = s.basi || [];
  // chi aveva scelto il percorso d'esame (che non c'è più) riparte dalle basi: l'obiettivo si può cambiare da Profilo
  const basi = st.has('basi') || done.length > 0;
  const goal = MIS_PATHS[ob.goal] ? ob.goal : 'zero', P = MIS_PATHS[goal], add = [];
  if (basi && P.course !== 'basi') add.push('basi');
  const more = P.stops ? BASI.units.filter(u => !P.stops.includes(u.id) && unitLessons(u).some(l => done.includes(l.key))).map(u => u.id) : [];
  return { goal, level: ob.start === 'some' ? 'some' : 'zero', known: [], more, add, t: 0 };
}
let MIS_MEMO = null, MIS_DRAFT = null;   // MIS_DRAFT: la registrazione mostra il percorso prima di salvarlo
function misGet() {
  if (MIS_DRAFT) return MIS_DRAFT;
  const s = s2get(); if (s.mis && MIS_PATHS[s.mis.goal]) return s.mis;
  const n = (K && (K.losProgress || []).length) || 0;
  if (!MIS_MEMO || MIS_MEMO.s !== s || MIS_MEMO.n !== n) MIS_MEMO = { s, n, m: misDerive(s) };
  return MIS_MEMO.m;
}
const misP = () => MIS_PATHS[misGet().goal];
function misCourses() { const ids = [misP().course, ...(misGet().add || [])]; return ids.filter((x, i) => ids.indexOf(x) === i).map(id => courseById(id)).filter(Boolean); }
const inMyApp = id => misCourses().some(c => c.id === id);
// le unità di un corso che fanno parte del percorso, in ordine (per i corsi aggiunti interi: tutte)
function misUnits(c) {
  if (!c) return [];
  const P = misP(); if (c.id !== P.course || !P.stops) return c.units;
  const ids = P.stops.filter(x => x[0] !== '+'), more = misGet().more || [];
  return [...ids, ...c.units.map(u => u.id).filter(x => more.includes(x) && !ids.includes(x))].map(id => c.units.find(u => u.id === id)).filter(Boolean);
}
const misLessons = c => misUnits(c).flatMap(unitLessons);
// come misUnits, ma con le unità "in arrivo" al loro posto: [{ u }] oppure [{ soon: { id, name, sub } }]
function misStops(c) {
  if (!c) return [];
  const P = misP(); if (c.id !== P.course || !P.stops) return c.units.map(u => ({ u }));
  const out = P.stops.map(x => (x[0] === '+' ? { soon: { id: x.slice(1), name: MIS_SOON[x.slice(1)][0], sub: MIS_SOON[x.slice(1)][1] } } : { u: c.units.find(u => u.id === x) })).filter(x => x.soon || x.u);
  const more = misGet().more || []; c.units.forEach(u => { if (more.includes(u.id) && !P.stops.includes(u.id)) out.push({ u }); });
  return out;
}
const misRest = c => { const inP = misUnits(c); return c.units.filter(u => !inP.includes(u)); };   // unità del corso che il percorso non usa
const misName = c => (c && c.id === misP().course ? misP().name : c ? c.name : '');
const misIcon = (c, size = 22) => (c && c.id === misP().course && misP().ico ? Ico(misP().ico, size) : c ? c.badge : null);
const misAll = () => misCourses().flatMap(misLessons);
// le lezioni pronte del percorso di un obiettivo (per dire quante sono prima di cambiare)
const misGoalLessons = goal => { const P = MIS_PATHS[goal], c = courseById(P.course); return (P.stops ? P.stops.filter(x => x[0] !== '+').map(id => c.units.find(u => u.id === id)).filter(Boolean) : c.units).flatMap(unitLessons); };
// unità segnate "la sai già" dalle 5 domande della registrazione: contano come fatte nel percorso, ma la figurina si prende solo facendo la lezione
let KNOWN_MEMO = { k: null, set: new Set() };
function knownKeys() {
  const k = misGet().known || null;
  if (KNOWN_MEMO.k !== k) { const set = new Set(); if (k && k.length) courses().forEach(c => c.units.forEach(u => { if (k.includes(u.id)) unitLessons(u).forEach(l => set.add(l.key)); })); KNOWN_MEMO = { k, set }; }
  return KNOWN_MEMO.set;
}
const isHad = key => isDone(key) || knownKeys().has(key);
const hadCount = list => list.filter(l => isHad(l.key)).length;
const coursePct = c => { const ls = misLessons(c); return ls.length ? Math.round(hadCount(ls) / ls.length * 100) : 0; };
// cambia obiettivo: cambia quello che si vede, non quello che si è fatto. Le unità "la sai già" restano solo se stanno nel nuovo percorso.
function misSetGoal(goal) {
  const P = MIS_PATHS[goal]; if (!P) return;
  s2set(s => { const old = misGet(), c = courseById(P.course), keep = P.stops ? P.stops : c.units.map(u => u.id);
    return { mis: Object.assign({}, old, { goal, known: (old.known || []).filter(id => keep.includes(id)), more: P.stops ? BASI.units.filter(u => !P.stops.includes(u.id) && unitLessons(u).some(l => isDone(l.key))).map(u => u.id) : [], add: (old.add || []).filter(id => id !== P.course), t: Date.now() }), cur: P.course }; });
}
const misAddCourse = id => s2set(s => { const m = misGet(); return m.add.includes(id) || MIS_PATHS[m.goal].course === id ? {} : { mis: Object.assign({}, m, { add: [...m.add, id] }) }; });
const misAddUnits = ids => s2set(s => { const m = misGet(); return { mis: Object.assign({}, m, { more: Array.from(new Set([...(m.more || []), ...ids])) }) }; });
const fmtDur = min => { if (min < 60) return `${min} minutes`; const h = Math.floor(min / 60), m = min % 60; return `${h} ${h === 1 ? 'hour' : 'hours'}${m ? ` and ${m} minutes` : ''}`; };
// domande di una lezione (LOS: la domanda d'esame; basi: gli esercizi a scelta)
function lessonQuestions(l) {
  if (l.kind === 'los') return l.los.question ? [{ key: l.key, q: l.los.question.q, options: l.los.question.options, ans: l.los.question.ans, exp: l.los.question.exp, lang: 'en', lesson: l }] : [];
  return (l.ex || []).filter(e => e.type === 'mcq').map((e, i) => ({ key: l.key + (i ? '#' + i : ''), q: e.q, options: e.options, ans: e.ans, exp: e.exp, lesson: l }));
}
const allQuestions = (list) => list.flatMap(lessonQuestions);
// pagine di una lezione, in ordine
function lessonSteps(l) {
  const steps = [];
  if (l.kind === 'los') {
    const c = l.los.content || {};
    if ((c.introduction || '').trim()) steps.push({ k: 'page', title: l.title, text: c.introduction, first: true });
    (c.sections || []).forEach((s, i) => steps.push({ k: 'page', title: String(s.title || '').replace(/^\d+\.\s*/, ''), text: s.content, first: !steps.length && i === 0, head: l.title }));
    const kp = l.los.keyPoints || [], et = l.los.examTips || [];
    if (kp.length || et.length) steps.push({ k: 'recap', points: kp, tips: et });
    lessonQuestions(l).forEach(q => steps.push({ k: 'q', q }));
  } else if (l.flow) {
    // lezione a passi corti: pagine brevi alternate a cose da fare; "In breve" chiude l'ultima pagina
    const qs = lessonQuestions(l), lastPage = l.flow.map(s => s.type).lastIndexOf('page');
    l.flow.forEach((s, i) => {
      if (s.type === 'page') steps.push({ k: 'page', title: s.t, text: s.x, widget: s.widget, fig: s.fig, first: !steps.length, note: i === lastPage ? l.note : null });
      else if (s.type === 'ex') { const e = l.ex[s.i]; if (e.type === 'match') steps.push({ k: 'match', pairs: e.pairs }); else steps.push({ k: 'q', q: qs[l.ex.slice(0, s.i).filter(x => x.type === 'mcq').length] }); }
      else steps.push(Object.assign({}, s, { k: s.type, n: i }));
    });
  } else {
    (l.pages || []).forEach((p, i) => steps.push({ k: 'page', title: p.t, text: p.x, widget: p.widget, first: i === 0, note: i === l.pages.length - 1 ? l.note : null }));
    let qi = 0;
    (l.ex || []).forEach(e => { if (e.type === 'match') steps.push({ k: 'match', pairs: e.pairs }); else { steps.push({ k: 'q', q: lessonQuestions(l)[qi] }); qi++; } });
  }
  return steps;
}
// percorso attuale e prossima lezione
// i percorsi dell'utente sono quelli del suo obiettivo più quelli aggiunti: il primo è sempre quello dell'obiettivo
function startedCourses() { const s = s2get(); const out = new Set(s.started || []); if (s.basi.length) out.add('basi'); return misCourses().filter(c => out.has(c.id)); }
function currentCourse() {
  const s = s2get(); const mine = misCourses();
  return mine.find(c => c.id === s.cur) || mine[0] || null;
}
function nextLesson(c, unitId) {
  const s = s2get(); const album = K.albumLoad(), units = misUnits(c);
  let u = unitId ? c.units.find(x => x.id === unitId) : null;
  if (!u) {
    const lastKey = s.seen && s.seen[c.id]; const ll = lastKey && lessonByKey(lastKey);
    if (ll && ll.course === c && units.includes(ll.unit)) u = ll.unit;
    else { // unità della figurina presa più di recente
      let best = null; misLessons(c).forEach(l => { const a = album[l.key]; if (a && (!best || a.t > best.t)) best = { t: a.t, u: l.unit }; }); u = best ? best.u : units[0];
    }
  }
  const order = [u, ...units.filter(x => x !== u)];
  for (const x of order) { const l = unitLessons(x).find(z => !isHad(z.key)); if (l) return l; }
  return null;
}
function markSeen(l) { s2set(s => ({ cur: l.course.id, started: Array.from(new Set([...(s.started || []), l.course.id])), seen: Object.assign({}, s.seen, { [l.course.id]: l.key }) })); }

// ---- punti, giorni di fila ----
const weekKey = (d = new Date()) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return dayKey(x); };
function addXp(n) { if (!n) return; try { K.setStats(s => Object.assign({}, s, { xp: (s.xp || 0) + n })); } catch (e) {} const wk = weekKey(); s2set(s => ({ xp: { [wk]: ((s.xp || {})[wk] || 0) + n } })); }   // si tiene solo la settimana in corso (serve alla lega)
function streakDays() {
  const a = K.flActLoad(); let n = 0; const d = new Date();
  if (!K.flStudied(a[dayKey(d)])) d.setDate(d.getDate() - 1);
  while (K.flStudied(a[dayKey(d)])) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const todayMinutes = () => { const a = K.flActLoad()[dayKey()] || {}; return a.min || 0; };
function examDays() { const e = LS.raw('finlearn_exam_date'); if (!e) return null; const n = Math.ceil((new Date(e + 'T09:00:00') - new Date()) / DAY); return isNaN(n) ? null : n; }

// ---- figurine ----
// stato: 'manca' | 'viva' | 'sbiadisce' | 'dorata'
function stickerState(l, album, now) {
  const a = album[l.key]; if (!a) return 'manca';
  if (s2get().gold[l.section.id]) return 'dorata';
  return now < a.due ? 'viva' : 'sbiadisce';
}
function dueLessons() { const album = K.albumLoad(), now = Date.now(); return misCourses().flatMap(c => c.lessons).filter(l => stickerState(l, album, now) === 'sbiadisce').sort((x, y) => album[x.key].due - album[y.key].due); }
const stickerSym = l => l.sym || l.code || '?';
const lessonEmoji = l => { if (l.kind !== 'los') return null; const ic = ((l.los.content && l.los.content.sections) || []).map(x => x.icon).find(Boolean); return ic && !String(ic).startsWith('data:') ? ic : null; };

// ---- risposte e punti deboli ----
// Ogni risposta finisce nelle statistiche storiche dell'app e, con la data, nella memoria nuova (ultime 8 per domanda).
function recordAnswer(q, ok) {
  const key = q.key.split('#')[0];
  try { K.qStatsRecord(key, ok); } catch (e) {}
  s2set(s => { const cur = (s.ans[q.key] || []).slice(-7); cur.push([Date.now(), ok ? 1 : 0]); return { ans: Object.assign({}, s.ans, { [q.key]: cur }) }; });
}
// Punteggio 0-100 per argomento: media delle risposte pesata sul tempo (una risposta di 14 giorni fa vale la metà di una di oggi),
// con due risposte "neutre" di partenza così poche domande non danno giudizi estremi. Senza ripasso il punteggio scivola verso 50.
function topicScores(c) {
  const s = s2get(), st = K.qStatsLoad(), now = Date.now(), out = [];
  c.units.forEach(u => u.sections.forEach(sec => {
    let w = 0, wok = 0, n = 0, nok = 0;
    sec.lessons.forEach(l => lessonQuestions(l).forEach(q => {
      const log = s.ans[q.key];
      if (log && log.length) log.forEach(([t, ok]) => { const k = Math.pow(0.5, (now - t) / (14 * DAY)); w += k; wok += k * ok; n++; nok += ok; });
      else { const r = st[q.key]; if (r && r.n) { const k = 0.5 * Math.min(r.n, 3); w += k; wok += k * (r.ok / r.n); n += r.n; nok += r.ok; } }
    }));
    if (n) out.push({ id: sec.id, name: sec.name, unit: u, section: sec, n, nok, score: Math.round((wok + 1) / (w + 2) * 100) });
  }));
  return out.sort((a, b) => a.score - b.score);
}
// ---- spiegazioni gratis al giorno ----
const FREE_EXPL = 3;
function explState() { const s = s2get(); const today = dayKey(); const n = s.expl && s.expl.d === today ? s.expl.n : 0; return { n, left: Math.max(0, FREE_EXPL - n), pro: !!K.isPro }; }
function spendExplanation() { const today = dayKey(); s2set(s => ({ expl: { d: today, n: (s.expl && s.expl.d === today ? s.expl.n : 0) + 1 } })); }

// ---- le 5 domande della registrazione: servono a saltare le unità che si sanno già ----
// Una domanda per unità (di più se le unità sono poche).
function placementFor(goal) {
  const P = MIS_PATHS[goal], c = courseById(P.course), sh = K.flShuffle;
  const units = (P.stops ? P.stops.filter(x => x[0] !== '+').map(id => c.units.find(u => u.id === id)) : c.units).filter(Boolean);
  const pick = units.slice(0, 5), items = [];
  for (let i = 0; i < 5; i++) { const u = pick[Math.floor(i * pick.length / 5)], used = items.map(x => x.q.key); const q = sh(allQuestions(unitLessons(u))).find(x => !used.includes(x.key)); if (q) items.push({ q, u }); }
  return { course: c, units, items };
}
// le unità iniziali con tutte le risposte giuste sono "la sai già"; ne resta sempre almeno una da fare
function placementKnown(pl, res) {
  const known = [];
  for (const u of pl.units) { const mine = pl.items.map((x, i) => [x, res[i]]).filter(([x]) => x.u === u); if (!mine.length || !mine.every(([, ok]) => ok)) break; known.push(u.id); }
  return known.slice(0, Math.max(0, pl.units.length - 1));
}

// ---- test ----
// kind: 'unit' (verifica di una sezione), 'level' (test di livello), 'mock' (simulazione), 'weak' (allenamento punti deboli), 'mix' (quiz misto)
function buildTest(kind, c, sec) {
  const sh = K.flShuffle;
  if (kind === 'unit') { const qs = sh(allQuestions(sec.lessons)).slice(0, 10); return { id: 'unit:' + sec.id, kind, course: c, section: sec, title: 'Unit test: ' + sec.name, qs, secs: qs.length * c.pace, pass: Math.ceil(qs.length * 0.7), timed: true }; }
  if (kind === 'level') { const qs = sh(allQuestions(misLessons(c))).slice(0, 5); return { id: 'level:' + c.id, kind, course: c, title: 'Level test', qs, secs: qs.length * c.pace, pass: Math.ceil(qs.length * 0.6), timed: true }; }
  if (kind === 'mock') { const qs = sh(allQuestions(c.lessons)).slice(0, 44); return { id: 'mock:' + c.id, kind, course: c, title: 'Mock exam', qs, secs: qs.length * 180, pass: Math.ceil(qs.length * 0.7), timed: true }; }
  return null;
}
function saveTest(t, res, secs) {
  const ok = res.filter(r => r && r.ok).length; const passed = ok >= t.pass; const per = {};
  t.qs.forEach((q, i) => { const sec = q.lesson.section; per[sec.id] = per[sec.id] || { name: sec.name, ok: 0, n: 0 }; per[sec.id].n++; if (res[i] && res[i].ok) per[sec.id].ok++; });
  const rec = { ok, n: t.qs.length, secs, t: Date.now(), passed, title: t.title };
  s2set(s => ({ tests: Object.assign({}, s.tests, { [t.id]: Object.assign({}, rec, { best: Math.max(ok, (s.tests[t.id] && s.tests[t.id].best) || 0), passedEver: passed || !!(s.tests[t.id] && s.tests[t.id].passedEver) }), _last: Object.assign({ id: t.id }, rec) }) }));
  if (passed && t.kind === 'unit') { // figurine dorate: quelle già prese non sbiadiscono per il periodo più lungo
    s2set(s => ({ gold: Object.assign({}, s.gold, { [t.section.id]: Date.now() }) }));
    try { const a = K.albumLoad(), now = Date.now(); let ch = false; t.section.lessons.forEach(l => { if (a[l.key]) { a[l.key].step = K.FL_STEPS.length - 1; a[l.key].due = now + K.FL_STEPS[K.FL_STEPS.length - 1] * DAY; ch = true; } }); if (ch) K.albumSave(a); } catch (e) {}
  }
  return Object.assign({ per: Object.values(per) }, rec);
}

// ---- lega e sfide: avversari simulati finché non ci sono gli account online ----
const RIVALS = ['Emma', 'Liam', 'Noah', 'Olivia', 'Ethan', 'Mia', 'Lucas', 'Ava', 'Mason'];
const seedRnd = seed => { let x = 0; for (let i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) >>> 0; return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; };
function league() {
  const wk = weekKey(), start = new Date(wk + 'T00:00:00').getTime(), frac = clamp((Date.now() - start) / (7 * DAY), 0.02, 1);
  const mine = (s2get().xp || {})[wk] || 0;
  const rows = RIVALS.map((name, i) => { const r = seedRnd(wk + name); const target = 180 + Math.round(r() * 640); return { name, xp: Math.round(target * Math.pow(frac, 0.85) / 2) * 2 }; });
  rows.push({ name: 'You', xp: mine, me: true });
  rows.sort((a, b) => b.xp - a.xp || (a.me ? -1 : 1));
  rows.forEach((r, i) => { r.pos = i + 1; });
  return { rows, me: rows.find(r => r.me), name: 'Blue League' };
}
function duelRival() { const wk = weekKey(), r = seedRnd(wk + 'duel' + (s2get().duel.w + s2get().duel.l)); return RIVALS[Math.floor(r() * RIVALS.length)]; }

// =====================================================================================================
// PEZZI DI INTERFACCIA
// =====================================================================================================
const Ico = (C, size = 22, sw = 2.4) => html`<${C} size=${size} strokeWidth=${sw} aria-hidden="true" style="flex:none"/>`;
const PathIco = (d, size = 22, sw = 2.2, fill = 'none', stroke = 'currentColor') => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill=${fill} stroke=${stroke} stroke-width=${sw} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none"><path d=${d}/></svg>`;
const D_CHECK = 'M5 12.5l4.5 4.5L19 7.5', D_X = 'M6 6l12 12M18 6L6 18', D_BACK = 'M15 5l-7 7 7 7', D_NEXT = 'M9 5l7 7-7 7', D_PLUS = 'M12 5v14M5 12h14';
const D_FLAME = 'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 2 1 3 2 3 4 1-2 1-5 0-8z', D_STAR = 'M12 3l2.7 5.6 6.1.8-4.5 4.2 1.2 6-5.5-3-5.5 3 1.2-6L3.2 9.4l6.1-.8z';
const D_TABS = {
  home: 'M12 7v13M12 7a3 3 0 0 0-3-3H3v14h7a2 2 0 0 1 2 2M12 7a3 3 0 0 1 3-3h6v14h-7a2 2 0 0 0-2 2',
  allenati: 'M13 2L4 14h7l-1 8 9-12h-7z',
  sfide: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4',
  coach: 'M4 5h16v11H9l-5 4z',
  profilo: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0'
};
const TAB_NAMES = [['home', 'Learn'], ['allenati', 'Practice'], ['sfide', 'Challenges'], ['coach', 'AI Coach'], ['profilo', 'Profile']];

// Rally: pose disegnate (file in rally/*.svg)
function Rally({ pose = 'saluta', w = 228, style, alt = '' }) {
  return html`<img src=${'rally/' + pose + '.svg'} alt=${alt} width=${w} style=${Object.assign({ width: w, height: 'auto' }, style || {})}/>`;
}
function Btn({ children, onClick, bg, cls = '', disabled, style, label, type }) {
  return html`<button type=${type || 'button'} class=${'o-btn ' + cls} onClick=${onClick} disabled=${!!disabled} aria-label=${label} style=${Object.assign(bg && !disabled ? { background: bg } : {}, style || {})}>${children}</button>`;
}
function IBtn({ d, icon, onClick, label, lg, style }) {
  return html`<button type="button" class=${'o-ib' + (lg ? ' lg' : '')} onClick=${onClick} aria-label=${label} style=${style}>${icon || PathIco(d, lg ? 24 : 22, 2.6)}</button>`;
}
const Pill = ({ children, bg, rot = -3, style }) => html`<span class="o-pill" style=${Object.assign({ transform: `rotate(${rot}deg)` }, bg ? { background: bg } : {}, style || {})}>${children}</span>`;
function Seg({ n, i }) {
  if (n > 14) return html`<div class="o-bar o-grow" role="img" aria-label=${`Step ${i + 1} of ${n}`} style="height:10px"><i style=${{ width: Math.round((i + 1) / n * 100) + '%', background: INK, borderRight: 0 }}></i></div>`;
  return html`<div class="o-seg" role="img" aria-label=${`Step ${Math.min(i + 1, n)} of ${n}`} style=${{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
    ${Array.from({ length: n }, (_, k) => html`<i key=${k} class=${k < i ? 'd' : k === i ? 'c' : ''}></i>`)}</div>`;
}
// barra in alto delle schermate "a passi": chiudi/indietro + avanzamento (o titolo) + eventuale elemento a destra
function TopBar({ onClose, onBack, n, i, title, right, mid }) {
  return html`<div class="o-top o-pad" style="flex:none;background:inherit"><div class="o-rowf" style="height:44px;gap:14px">
    ${onBack ? html`<${IBtn} d=${D_BACK} onClick=${onBack} label="Back"/>` : onClose ? html`<${IBtn} d=${D_X} onClick=${onClose} label="Close"/>` : null}
    ${mid || (n ? html`<${Seg} n=${n} i=${i}/>` : html`<span class="o-grow" style="font-size:15px;line-height:20px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${title}</span>`)}
    ${right || null}</div></div>`;
}
function TabBar({ tab, go }) {
  return html`<nav class="o-tabs" aria-label="App sections">${TAB_NAMES.map(([id, name]) => html`
    <button key=${id} type="button" class=${'o-tab' + (tab === id ? ' on' : '')} aria-current=${tab === id ? 'page' : undefined} onClick=${() => go(id)} style=${tab === id ? { background: ROOM[id] } : null}>
      ${PathIco(D_TABS[id], 22, 2.2)}${name}</button>`)}</nav>`;
}
function Ring({ pct, size = 44, text }) {
  const r = 18, c = 2 * Math.PI * r, p = clamp(pct, 0, 100);
  return html`<span style=${{ position: 'relative', width: size, height: size, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
    <svg width=${size} height=${size} viewBox="0 0 44 44" aria-hidden="true" style="position:absolute;left:0;top:0"><circle cx="22" cy="22" r="18" fill="none" stroke=${SEP} stroke-width="5"/>
    ${p > 0 && html`<circle cx="22" cy="22" r="18" fill="none" stroke=${INK} stroke-width="5" stroke-linecap="round" stroke-dasharray=${`${(c * p / 100).toFixed(1)} ${c.toFixed(1)}`} transform="rotate(-90 22 22)"/>`}</svg>${text != null ? text : Math.round(p) + '%'}</span>`;
}
const Bar = ({ pct, bg = AZ, h = 12, label }) => html`<div class="o-bar" role="img" aria-label=${label || `${Math.round(pct)}%`} style=${{ height: h }}>${pct > 0 && html`<i style=${{ width: clamp(pct, 4, 100) + '%', background: bg, borderRight: pct >= 99.5 ? 0 : undefined }}></i>`}</div>`;
// riga di elenco: riquadro icona, titolo, sottotitolo, elemento a destra
function Row({ icon, ibg, title, sub, right, onClick, last, chev, tag }) {
  const inner = html`${icon != null && html`<span class="o-ibox" style=${ibg ? { background: ibg } : null}>${icon}</span>`}
    <span class="o-grow o-col" style="gap:1px"><span class="o-t">${title}</span>${sub && html`<span class="o-s">${sub}</span>`}</span>
    ${tag && html`<span class="o-tag">${tag}</span>`}${right || null}${chev && html`<span style="flex:none;margin-right:6px">${PathIco(D_NEXT, 22, 2.6)}</span>`}`;
  return onClick ? html`<button type="button" class=${'o-row' + (last ? ' last' : '')} onClick=${onClick}>${inner}</button>` : html`<div class=${'o-row' + (last ? ' last' : '')}>${inner}</div>`;
}
// risposta di una domanda. stato: '' | 'sel' | 'ok' | 'ko' | 'dim'
function Opt({ letter, text, state = '', note, onClick, disabled, lang, rich, big }) {
  const mark = state === 'ok' ? PathIco(D_CHECK, 20, 3) : state === 'ko' ? PathIco(D_X, 18, 3) : letter;
  const short = !rich && big, wide = String(text).length > 26;   // testo lungo: la nota va sotto, non di fianco
  return html`<button type="button" class=${'o-opt ' + state + (short ? ' num' : '')} onClick=${onClick} disabled=${!!disabled} aria-pressed=${state === 'sel' ? 'true' : undefined} lang=${lang}>
    <span class="l">${mark}</span><span class="x">${rich ? html`<${Rich} text=${text} cls="sm" bare=${true}/>` : text}${note && wide && html`<span class="n" lang="it" style="display:block;margin-top:2px">${note}</span>`}</span>${note && !wide && html`<span class="n" lang="it">${note}</span>`}</button>`;
}
// testo ricco dell'app (grassetti, formule, tabelle) nello stile nuovo
// parole da toccare: dentro una lezione di base (termStore.on) le parole in grassetto che stanno nel glossario si aprono con un tocco
const termStore = { cur: null, on: false, subs: new Set() };
const termOpen = k => { termStore.cur = k; termStore.subs.forEach(f => f()); };
function Rich({ text, cls = '', lang, bare, style }) {
  const RT = K && K.RichText, ref = useRef(null), on = termStore.on;
  useEffect(() => {
    const el = ref.current; if (!el || !on) return;
    // i pezzi di testo vengono riusati da una pagina all'altra: prima tolgo i segni vecchi, poi rimetto quelli giusti
    el.querySelectorAll('.fl-strong').forEach(x => { const k = glossKey(x.textContent);
      if (k) { x.classList.add('o-term'); x.setAttribute('role', 'button'); x.setAttribute('tabindex', '0'); x.dataset.term = k; }
      else if (x.classList.contains('o-term')) { x.classList.remove('o-term'); x.removeAttribute('role'); x.removeAttribute('tabindex'); delete x.dataset.term; } });
  }, [text, on]);
  const pick = e => { const t = e.target && e.target.closest ? e.target.closest('.o-term') : null; if (!t) return false; e.stopPropagation(); termOpen(t.dataset.term); return true; };
  return html`<div ref=${ref} class=${bare ? '' : 'o-rich ' + cls} lang=${lang} style=${style} onClick=${on ? pick : undefined} onKeyDown=${on ? e => { if ((e.key === 'Enter' || e.key === ' ') && pick(e)) e.preventDefault(); } : undefined}>${RT ? html`<${RT} text=${text}/>` : String(text || '')}</div>`;
}
function Sw({ on, onChange, label }) {
  return html`<button type="button" role="switch" aria-checked=${on ? 'true' : 'false'} aria-label=${label} class=${'o-sw' + (on ? ' on' : '')} onClick=${() => onChange(!on)}><i></i></button>`;
}
// foglio dal basso sopra la schermata
function BSheet({ children, onClose, bg = '#fff', dim = true, label }) {
  return html`<div class="o-ovl o-fade" style=${dim ? null : { background: 'transparent', pointerEvents: 'none' }} onClick=${onClose} role="dialog" aria-label=${label}>
    <div class="o-bs o-up" style=${{ background: bg, pointerEvents: 'auto' }} onClick=${e => e.stopPropagation()}>${children}</div></div>`;
}
// il foglio che spiega la parola toccata: sta sopra a tutto, una volta sola nell'app
function TermHost() {
  const [, f] = useState(0);
  useEffect(() => { const g = () => f(x => x + 1); termStore.subs.add(g); return () => { termStore.subs.delete(g); }; }, []);
  const d = termStore.cur ? GLOSS_DEF[termStore.cur] : null; if (!d) return null;
  const close = () => termOpen(null);
  return html`<${BSheet} onClose=${close} label=${'What it means ' + d[0]}><div class="o-col" style="gap:8px">
    <span class="o-lab">What it means</span><h2 style="font-size:26px;line-height:30px;font-weight:800;letter-spacing:-.02em">${d[0]}</h2>
    <p style="font-size:17px;line-height:25px;font-weight:500">${d[1]}</p><${Btn} cls="lg" style=${{ marginTop: 10 }} onClick=${close}>Got it<//></div><//>`;
}
// schermata "stanza": testata colorata con Rally, contenuto, barra in basso
function Room({ color, tab, go, head, rally, children, tabs = true, headH = 160, scrollRef }) {
  return html`<div class="o-scr" style=${{ background: color }}>
    <div class="o-scroll" ref=${scrollRef}><div class="o-col" style="min-height:100%">
      <div class="o-top" style=${{ position: 'relative', flex: 'none', minHeight: `calc(var(--otop) + ${headH}px)` }}>
        ${rally}
        <div class="o-pad" style="position:relative;padding-bottom:18px">${head}</div>
      </div>
      ${children}
    </div></div>
    ${tabs && html`<${TabBar} tab=${tab} go=${go}/>`}
  </div>`;
}
// foglio bianco che riempie fino in fondo
const Sheet = ({ children, pad = true, style }) => html`<div class="o-sheet" style=${Object.assign({ flex: '1 0 auto' }, style || {})}>${children}${pad && html`<div class="o-tabpad"></div>`}</div>`;
// schermata "a passi": barra in alto, contenuto che scorre, azioni in fondo
function Flow({ top, children, foot, bg = '#fff', scrollRef, over }) {
  return html`<div class="o-scr" style=${{ background: bg }}>${top}
    <div class="o-scroll" ref=${scrollRef}>${children}</div>
    ${foot && html`<div class="o-foot" style=${{ background: bg }}>${foot}</div>`}${over || null}</div>`;
}
const StatPill = ({ streak, xp }) => html`<div class="o-rowf" style="height:36px;gap:10px;padding:0 12px;background:#fff;border:2px solid ${INK};border-radius:999px;font-size:14px;line-height:18px;font-weight:800">
  <span class="o-rowf" style="gap:4px" aria-label=${`${streak}-day streak`}>${PathIco(D_FLAME, 18, 2.4, PESCA, INK)}${streak}</span>
  <span aria-hidden="true" style="width:2px;height:16px;background:${INK}"></span>
  <span class="o-rowf" style="gap:4px" aria-label=${`${xp} experience points`}>${PathIco(D_STAR, 18, 2.4, GIALLO, INK)}${fmtInt(xp)}</span></div>`;
// tre numeri in fila (profilo, scheda percorso)
const Stats3 = ({ items }) => html`<div style="display:grid;grid-template-columns:repeat(${items.length},1fr)">${items.map(([v, l], k) => html`
  <div key=${k} class="o-col" style=${{ gap: 2, paddingLeft: k ? 16 : 0, borderLeft: k ? `2px solid ${SEP}` : 0 }}><span style="font-size:24px;line-height:28px;font-weight:800;letter-spacing:-.01em">${v}</span><span class="o-s">${l}</span></div>`)}</div>`;

// =====================================================================================================
// IMPARA: home, dentro un percorso, lezione, domande
// =====================================================================================================
const firstName = n => String(n || '').trim().split(/\s+/)[0] || '';
function userName() { const s = s2get(); if (s.name) return s.name; const d = K.user && K.user.displayName; return d && d !== 'Google User' && d !== 'Apple User' ? firstName(d) : ''; }

function ExamDateSheet({ onClose }) {
  const cur = LS.raw('finlearn_exam_date') || '';
  const [v, setV] = useState(cur);
  const save = () => { try { if (v) localStorage.setItem('finlearn_exam_date', v); else localStorage.removeItem('finlearn_exam_date'); } catch (e) {} onClose(); };
  return html`<${BSheet} onClose=${onClose} label="Exam date">
    <h2 class="o-big">When is your exam?</h2>
    <p class="o-body o-mut" style="margin-top:6px">Rally counts the days left and reminds you on the home screen.</p>
    <input class="o-inp" type="date" value=${v} onChange=${e => setV(e.target.value)} aria-label="Exam date" style="margin-top:16px"/>
    <div style="margin-top:16px"><${Btn} cls="lg" onClick=${save}>Save the date<//></div>
    ${cur && html`<div style="text-align:center;margin-top:4px"><button type="button" class="o-link" onClick=${() => { try { localStorage.removeItem('finlearn_exam_date'); } catch (e) {} onClose(); }}>Remove the date</button></div>`}
  <//>`;
}

const unitInitials = name => String(name).split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
// Home: il percorso dell'obiettivo scelto, la prossima lezione e le unità in fila (quelle che si sanno già, quella in corso, quelle in arrivo)
function HomeScreen({ nav }) {
  useS2(); useTick();
  const [dateOpen, setDateOpen] = useState(false), [addOpen, setAddOpen] = useState(false);
  const cur = currentCourse();
  const name = userName(), streak = streakDays(), xp = (K.stats && K.stats.xp) || 0;
  const next = nextLesson(cur), pct = coursePct(cur), ed = examDays(), begun = doneCount(misLessons(cur)) > 0;
  const isExam = cur.group === 'cert', title = misName(cur);
  const pill = isExam ? (ed != null && ed >= 0 ? (ed === 0 ? 'Exam today' : `Exam in ${plural(ed, 'day', 'days')}`) : 'Set your exam date') : (streak > 1 ? `${streak}-day streak` : 'Day ' + Math.max(1, streak));
  const others = misCourses().filter(c => c !== cur), stops = misStops(cur), known = misGet().known || [];
  const rest = isExam ? [] : misRest(cur), restN = rest.reduce((n, u) => n + unitLessons(u).length, 0);
  const open = u => nav.go('percorso', { course: cur.id, unit: u.id });
  return html`<${Room} color=${AZ} tab="home" go=${nav.tab}
    rally=${html`<${Rally} pose="saluta" alt="Rally waving" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div style="position:absolute;right:20px;top:0"><${StatPill} streak=${streak} xp=${xp}/></div>
      <div class="o-col" style="align-items:flex-start;gap:14px;padding-top:4px;max-width:210px">
        <h1 class="o-h1" style=${name.length > 9 ? { fontSize: 32, lineHeight: '34px' } : null}>Hi${name ? html`,<br/>${name}` : '!'}</h1>
        ${isExam ? html`<button type="button" onClick=${() => setDateOpen(true)}><${Pill}>${pill}<//></button>` : html`<${Pill}>${pill}<//>`}
      </div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:16px">
      <button type="button" class="o-col" style="gap:10px;width:100%" onClick=${() => nav.go('percorso', { course: cur.id, unit: next ? next.unit.id : null })} aria-label=${`Open ${title}`}>
        <span class="o-rowf" style="gap:10px;width:100%"><span class="o-ibox" style="width:36px;height:36px;border-radius:11px;font-size:14px;background:${misP().course === cur.id ? misP().color : AZ}">${misIcon(cur, 18)}</span>
          <span class="o-grow" style="font-size:16px;line-height:20px;font-weight:800;text-align:left">${title}</span><span style="font-size:14px;line-height:20px;font-weight:800">${pct}%</span></span>
        <span style="display:block;width:100%"><${Bar} pct=${pct} label=${`Path ${pct}% complete`}/></span>
      </button>
      ${next ? html`<div class="o-col" style="gap:4px"><div class="o-big" style=${Object.assign({ overflowWrap: 'anywhere', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden' }, next.title.length > 44 ? { fontSize: 22, lineHeight: '27px', letterSpacing: '-.01em' } : null)}>${next.title}</div>
          <div class="o-body o-mut">${begun ? 'Next lesson' : 'First lesson'} in ${next.unit.name}, ${next.minutes} minutes</div></div>
        <${Btn} onClick=${() => nav.go('lezione', { key: next.key })}>${begun ? 'Resume the lesson' : 'Start the lesson'}<//>`
      : html`<div class="o-col" style="gap:4px"><div class="o-big">Path complete</div><div class="o-body o-mut">You've finished the lessons that are ready. Keep your stickers alive by reviewing.</div></div>
        <${Btn} onClick=${() => nav.tab('allenati')}>Go to review<//>`}
    </div></div>
    <${NewsTicker} nav=${nav}/>
    <${Sheet}>
      <h2 class="o-h2" style="margin-bottom:4px">${isExam ? `Topics in ${title}` : 'Your path, unit by unit'}</h2>
      ${stops.map(s => {
        if (s.soon) return html`<div key=${s.soon.id} class="o-row"><span class="o-ibox" style="font-size:15px;background:${T_BG};border-style:dashed;color:${MUT}">${unitInitials(s.soon.name)}</span>
          <span class="o-grow o-col" style="gap:1px"><span class="o-t" style="color:${MUT}">${s.soon.name}</span><span class="o-s">Coming soon</span></span></div>`;
        const u = s.u, ls = unitLessons(u), d = hadCount(ls), kn = known.includes(u.id) && doneCount(ls) < ls.length, here = next && next.unit === u;
        if (here) return html`<button key=${u.id} type="button" class="o-rowf" onClick=${() => open(u)} style="gap:14px;width:calc(100% + 20px);min-height:62px;margin:4px -10px;padding:0 10px;background:${T_AZ};border:2.5px solid ${INK};border-radius:16px;text-align:left">
          <span class="o-ibox" style="font-size:15px">${unitInitials(u.name)}</span><span class="o-grow o-col" style="gap:1px"><span class="o-t" style="font-weight:800">${u.name}</span><span class="o-s" style="color:${INK}">You are here: ${d} of ${plural(ls.length, 'lezione', 'lezioni')}</span></span>${PathIco(D_NEXT, 22, 2.6)}</button>`;
        return html`<${Row} key=${u.id} icon=${html`<span style="font-size:15px">${unitInitials(u.name)}</span>`} title=${u.name}
          sub=${kn ? `You already know this: ${plural(ls.length, 'lezione', 'lezioni')}` : `${d} of ${plural(ls.length, 'lezione', 'lezioni')}`}
          right=${kn ? html`<span style="width:36px;height:36px;flex:none;display:flex;align-items:center;justify-content:center;background:${MENTA};border:2px solid ${INK};border-radius:50%" role="img" aria-label="You already know this">${PathIco(D_CHECK, 18, 3)}</span>` : html`<${Ring} pct=${ls.length ? d / ls.length * 100 : 0}/>`} onClick=${() => open(u)}/>`; })}
      ${rest.length > 0 && html`<${Row} icon=${PathIco(D_PLUS, 20, 2.6)} title="Add more units" sub=${`${rest.length === 1 ? 'One more unit' : rest.length + ' more units'} from the Basics, ${plural(restN, 'lezione', 'lezioni')}`} chev=${true} onClick=${() => setAddOpen(true)}/>`}
      ${others.length > 0 && html`<h2 class="o-h2" style="margin:22px 0 4px">Your other paths</h2>`}
      ${others.map(c => { const ls = misLessons(c); return html`<${Row} key=${c.id} icon=${c.badge} title=${c.name} sub=${`${hadCount(ls)} of ${plural(ls.length, 'lezione', 'lezioni')}`} right=${html`<${Ring} pct=${coursePct(c)}/>`} onClick=${() => { s2set({ cur: c.id }); }}/>`; })}
      <${NewsHomeRow} nav=${nav}/>
      <${Row} icon=${Ico(LayoutGrid, 22)} ibg=${AZ} title="See all paths" sub="Available to add and coming soon" chev=${true} last=${true} onClick=${() => nav.go('catalogo')}/>
    <//>
    ${dateOpen && html`<${ExamDateSheet} onClose=${() => setDateOpen(false)}/>`}
    ${addOpen && html`<${BSheet} onClose=${() => setAddOpen(false)} label="Add more units">
      <h2 class="o-big" style="flex:none">Add more units</h2><p class="o-body o-mut" style="margin:6px 0 8px;flex:none">These are the other units of Finance Basics. The ones you add go to the end of your path.</p>
      <div class="o-scroll" style="flex:0 1 auto;max-height:56vh">${rest.map((u, k) => html`<div key=${u.id} class=${'o-row' + (k === rest.length - 1 ? ' last' : '')}><span class="o-ibox" style="font-size:15px">${unitInitials(u.name)}</span>
        <span class="o-grow o-col" style="gap:1px"><span class="o-t">${u.name}</span><span class="o-s">${MIS_SUB[u.id] || plural(unitLessons(u).length, 'lezione', 'lezioni')}</span></span>
        <button type="button" class="o-chip" onClick=${() => { misAddUnits([u.id]); if (rest.length === 1) setAddOpen(false); }} aria-label=${`Add ${u.name}`}>Add</button></div>`)}</div>
      ${rest.length > 1 && html`<div style="margin-top:12px;flex:none"><${Btn} cls="lg" onClick=${() => { misAddUnits(rest.map(u => u.id)); setAddOpen(false); }}>Add all<//></div>`}<//>`}
  <//>`;
}

// ---- dentro un percorso: le sezioni dell'unità e le lezioni in fila ----
function PercorsoScreen({ nav, course, unit }) {
  useS2(); useTick();
  const c = courseById(course) || currentCourse();
  const nx = nextLesson(c, unit);
  const [uid, setUid] = useState(unit || (nx ? nx.unit.id : misUnits(c)[0].id));
  const [pick, setPick] = useState(false);
  // le unità del percorso; se se ne apre una che il percorso non usa, compare in fondo
  const u = c.units.find(x => x.id === uid) || misUnits(c)[0], units = misUnits(c).includes(u) ? misUnits(c) : [...misUnits(c), u], ui = units.indexOf(u);
  const album = K.albumLoad(), now = Date.now(), tests = s2get().tests;
  const curL = unitLessons(u).find(l => !isDone(l.key));
  const curRef = useRef(null), scrollRef = useRef(null);
  useEffect(() => { const t = setTimeout(() => { const el = curRef.current, sc = scrollRef.current; if (el && sc) sc.scrollTop = Math.max(0, el.offsetTop - sc.clientHeight / 2 + 60); }, 40); return () => clearTimeout(t); }, [uid]);
  const line = solid => html`<span aria-hidden="true" style=${solid ? { position: 'absolute', left: 22, top: 44, bottom: -12, width: 4, background: INK } : { position: 'absolute', left: 22, top: 46, bottom: -10, width: 0, borderLeft: `4px dotted ${INK}` }}></span>`;
  const subOf = l => { const st = stickerState(l, album, now); return st === 'sbiadisce' ? 'Fading, review it' : st === 'dorata' ? 'Golden sticker' : 'Sticker collected'; };
  return html`<${Room} color=${c.color || AZ} tab="home" go=${nav.tab} headH=${156} scrollRef=${scrollRef}
    rally=${html`<${Rally} pose="indica" w=${206} alt="Rally pointing to your next lesson" style="position:absolute;right:-20px;top:calc(var(--otop) + 6px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px;gap:12px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Back to Learn"/><span style="font-size:15px;line-height:20px;font-weight:800">${misName(c)}</span></div>
      <div class="o-col" style="align-items:flex-start;gap:12px;margin-top:12px;max-width:225px">
        <h1 class="o-h1m" style=${u.name.length > 14 ? { fontSize: 26, lineHeight: '28px' } : null}>${u.name}</h1>
        <button type="button" onClick=${() => setPick(true)} aria-label="Change topic"><${Pill}>Unit ${ui + 1} of ${units.length}<//></button>
      </div>`}>
    <${Sheet} style=${{ paddingTop: 22 }}>
      ${u.sections.map((sec, si) => { const d = doneCount(sec.lessons), qn = allQuestions(sec.lessons).length, tid = 'unit:' + sec.id, tr = tests[tid];
        return html`<section key=${sec.id} style=${{ marginBottom: 28 }}>
          <div class="o-col" style="gap:2px;margin-bottom:10px">${sec.num && html`<span class="o-s">Reading ${sec.num}</span>`}
            <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px"><h2 class="o-h2">${sec.name}</h2><span class="o-lab" style="flex:none">${d} of ${sec.lessons.length} done</span></div></div>
          <div class="o-col">
            ${sec.lessons.map((l, k) => { const done = isDone(l.key), isCur = l === curL, last = k === sec.lessons.length - 1 && qn < 3;
              if (isCur) return html`<div key=${l.key} ref=${curRef} style="position:relative;display:flex;align-items:flex-start;gap:14px;padding:8px 0">${!last && line(false)}
                <span style="width:48px;flex:none;display:flex;justify-content:center;padding-top:14px;position:relative"><span style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:${AZ};border:2.5px solid ${INK};border-radius:50%;box-shadow:0 0 0 5px #fff">${PathIco('M8 5l11 7-11 7z', 20, 2, INK, INK)}</span></span>
                <div class="o-grow o-col" style="gap:12px;padding:14px 16px 16px;background:#fff;border:2.5px solid ${INK};border-radius:22px;box-shadow:4px 4px 0 ${INK}">
                  <div class="o-col" style="gap:2px"><span style="font-size:20px;line-height:24px;font-weight:800;letter-spacing:-.01em;overflow-wrap:anywhere;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden">${l.title}</span><span class="o-lab" style="font-weight:600">Lesson ${k + 1}, ${l.minutes} minutes</span></div>
                  <${Btn} cls="sm" onClick=${() => nav.go('lezione', { key: l.key })}>Get started<//></div></div>`;
              return html`<button key=${l.key} type="button" onClick=${() => nav.go('lezione', { key: l.key })} style="position:relative;min-height:56px;display:flex;align-items:center;gap:14px;padding:6px 0;width:100%">${!last && line(done)}
                <span style="width:48px;flex:none;display:flex;justify-content:center;position:relative">${done
                  ? html`<span style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:${INK};border:2px solid ${INK};border-radius:50%;color:#fff">${PathIco(D_CHECK, 20, 3)}</span>`
                  : html`<span style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:#fff;border:2px solid ${INK};border-radius:50%;font-size:15px;font-weight:800">${k + 1}</span>`}</span>
                <span class="o-grow o-col" style="gap:1px"><span class="o-t" style="overflow-wrap:anywhere">${l.title}</span><span class="o-s">${done ? subOf(l) : l.minutes + ' minutes'}</span></span></button>`; })}
            ${qn >= 3 && html`<button type="button" onClick=${() => nav.go('testInizio', { kind: 'unit', course: c.id, section: sec.id })} style="position:relative;min-height:56px;display:flex;align-items:center;gap:14px;padding:6px 0;width:100%">
              <span style="width:48px;flex:none;display:flex;justify-content:center"><span style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:${tr && tr.passedEver ? GIALLO : '#fff'};border:2px solid ${INK};border-radius:50%">${tr && tr.passedEver ? PathIco(D_STAR, 20, 2.2, INK, INK) : Ico(Flag, 18, 2.4)}</span></span>
              <span class="o-grow o-col" style="gap:1px"><span class="o-t">Unit test</span><span class="o-s">${tr && tr.passedEver ? `Passed with ${tr.best} out of ${tr.n}: golden stickers` : `${Math.min(10, qn)} questions, pass them and your stickers turn golden`}</span></span></button>`}
          </div></section>`; })}
    <//>
    ${pick && html`<${BSheet} onClose=${() => setPick(false)} label="Topics">
      <h2 class="o-big" style="margin-bottom:6px">${misName(c)}</h2>
      ${units.map((x, k) => { const ls = unitLessons(x), d = doneCount(ls); return html`<${Row} key=${x.id} icon=${k + 1} ibg=${x === u ? AZ : null} title=${x.name} sub=${`${d} of ${ls.length} lessons`} right=${html`<${Ring} pct=${ls.length ? d / ls.length * 100 : 0}/>`} last=${k === units.length - 1} onClick=${() => { setUid(x.id); setPick(false); }}/>`; })}
    <//>`}
  <//>`;
}

// ---- pezzi delle domande ----
const L3 = ['A', 'B', 'C', 'D'];
const splitCase = q => { const t = String(q.q || ''); const parts = t.split(/\n\s*\n/); return t.length > 260 && parts.length >= 2 ? { ctx: parts.slice(0, -1).join('\n\n'), ask: parts[parts.length - 1] } : null; };
const optState = (q, k, sel, locked) => !locked ? (sel === k ? 'sel' : '') : k === q.ans ? 'ok' : k === sel ? 'ko' : 'dim';
const optNote = (q, k, sel, locked) => !locked ? (sel === k ? 'Your choice' : null) : (k === sel ? (k === q.ans ? 'Your choice' : 'Your answer') : k === q.ans ? 'The right one' : null);
function Options({ q, sel, onSel, locked }) {
  const rich = q.options.some(o => /\\\(|\*\*|\$\$/.test(o)), big = q.options.every(o => String(o).length <= 14);
  return html`<div class="o-col" style="gap:10px">${q.options.map((o, k) => html`<${Opt} key=${k} letter=${L3[k]} text=${o} rich=${rich} big=${big} lang=${q.lang} state=${optState(q, k, sel, locked)} note=${optNote(q, k, sel, locked)} disabled=${locked} onClick=${() => onSel(k)}/>`)}</div>`;
}
// corpo di una domanda: corta (titolo grande e Rally), media, oppure lunga con le due linguette "Il caso" e "Domanda"
function QuestionBody({ q, label, sel, onSel, locked, tab, setTab, pose = 'pensa' }) {
  const cs = splitCase(q);
  const [open, setOpen] = useState(false);
  if (cs) return html`<div class="o-pad" style="padding-top:12px;padding-bottom:20px">
    <div role="tablist" style="display:grid;grid-template-columns:1fr 1fr;gap:0;padding:3px;border:2.5px solid ${INK};border-radius:16px">
      ${[['case', 'The case'], ['ask', label || 'Question']].map(([id, t]) => html`<button key=${id} type="button" role="tab" aria-selected=${tab === id ? 'true' : 'false'} onClick=${() => setTab(id)}
        style=${{ height: 40, borderRadius: 11, textAlign: 'center', fontSize: 15, fontWeight: 800, background: tab === id ? INK : 'transparent', color: tab === id ? '#fff' : INK }}>${t}</button>`)}</div>
    ${tab === 'case' ? html`<div style="margin-top:18px"><${Rich} text=${cs.ctx} lang=${q.lang}/></div>`
      : html`<div style="margin-top:18px"><${Rich} text=${cs.ask} cls="q" lang=${q.lang}/>
        <button type="button" onClick=${() => setOpen(!open)} aria-expanded=${open ? 'true' : 'false'} class="o-rowf" style="gap:10px;width:100%;min-height:48px;margin-top:14px;padding:0 14px;border:2.5px solid ${INK};border-radius:14px;font-size:15px;font-weight:800">
          ${Ico(Table2, 20)}<span class="o-grow">The case data</span><span style=${{ transform: open ? 'rotate(180deg)' : 'none', display: 'flex' }}>${Ico(ChevronDown, 22, 2.6)}</span></button>
        ${open && html`<div style="margin-top:10px;padding:12px 14px;background:${T_BG};border-radius:14px"><${Rich} text=${cs.ctx} cls="sm" lang=${q.lang}/></div>`}
        <div style="margin-top:14px"><${Options} q=${q} sel=${sel} onSel=${onSel} locked=${locked}/></div></div>`}
  </div>`;
  const short = q.q.length <= 90 && q.q.indexOf('\n') < 0 && !/\\\(|\$\$/.test(q.q);
  return html`<div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px">
    ${short && html`<${Rally} pose=${pose} w=${196} alt="" style="position:absolute;right:-12px;top:-14px"/>`}
    <div class="o-col" style=${{ gap: 6, position: 'relative', minHeight: short ? 150 : 0, maxWidth: short ? 214 : 'none' }}>
      ${label && html`<span class="o-lab">${label}</span>`}
      ${short ? html`<h1 class="o-q" lang=${q.lang}>${q.q}</h1>` : html`<${Rich} text=${q.q} cls="q" lang=${q.lang}/>`}
    </div>
    <div style=${{ marginTop: short ? 18 : 16, position: 'relative' }}><${Options} q=${q} sel=${sel} onSel=${onSel} locked=${locked}/></div>
  </div>`;
}
// foglio dopo la risposta: verde "Giusto!", rosa "Non ancora"
function FeedbackSheet({ ok, q, xp, onNext, nav, left, next = 'Continue' }) {
  const [flagged, setFlagged] = useState(false);
  const flag = () => { s2set(s => ({ flags: Object.assign({}, s.flags, { [q.key]: Date.now() }) })); setFlagged(true); };
  return html`<${BSheet} dim=${false} bg=${ok ? MENTA : ROSA} label=${ok ? 'Correct answer' : 'Wrong answer'}>
    <div class="o-rowf" style="justify-content:space-between;gap:12px"><h2 style="font-size:30px;line-height:36px;font-weight:800;letter-spacing:-.02em">${ok ? 'Right!' : 'Not yet'}</h2>
      ${ok ? (xp ? html`<${Pill} bg=${GIALLO} rot=${4}>+${xp} XP<//>` : null) : (left != null ? html`<${Pill} rot=${3}>Explanation ${FREE_EXPL - left} of ${FREE_EXPL}<//>` : null)}</div>
    ${q.exp && html`<div class="o-scroll" style="flex:0 1 auto;max-height:34vh;margin-top:6px"><${Rich} text=${q.exp} cls="sm"/></div>`}
    <div style="margin-top:14px;flex:none"><${Btn} cls="lg" bg="#fff" onClick=${onNext}>${ok ? next : 'Got it'}<//></div>
    ${!ok && html`<div style="text-align:center;flex:none">${flagged ? html`<span class="o-link" style="text-decoration:none">Reported, thanks</span>` : html`<button type="button" class="o-link" onClick=${flag}>Report an error in this question</button>`}</div>`}
  <//>`;
}
// foglio quando le spiegazioni gratis del giorno sono finite
function LimitSheet({ onPro, onSkip }) {
  return html`<${BSheet} label="Explanations used up">
    <${Rally} pose="re" w=${150} alt="" style="position:absolute;right:14px;top:-128px"/>
    <div><${Pill} bg=${GIALLO} rot=${-3}>FinLearn Pro<//></div>
    <h2 class="o-big" style="margin-top:14px;font-size:24px;line-height:28px">You're out of explanations for today</h2>
    <p class="o-body o-mut" style="margin-top:6px">On the free plan you get ${FREE_EXPL} a day. With Pro they never run out.</p>
    <ul class="o-col" style="gap:10px;margin-top:14px;list-style:none">${PRO_POINTS.slice(0, 3).map(t => html`<li key=${t} class="o-rowf" style="gap:12px"><span style="width:24px;height:24px;flex:none;display:flex;align-items:center;justify-content:center;background:${GIALLO};border:2px solid ${INK};border-radius:8px">${PathIco(D_CHECK, 14, 3.4)}</span><span class="o-t">${t}</span></li>`)}</ul>
    <p class="o-t" style="margin-top:14px;font-size:14px">${PRO_TRIAL_LINE}</p>
    <div style="margin-top:12px"><${Btn} cls="lg" bg=${GIALLO} onClick=${onPro}>Try Pro for free<//></div>
    <div style="text-align:center"><button type="button" class="o-link" onClick=${onSkip}>I'll come back tomorrow</button></div>
  <//>`;
}
// esercizio "abbina le coppie"
function MatchExercise({ pairs, onDone }) {
  const right = useMemo(() => K.flShuffle(pairs.map((p, i) => i)), [pairs]);
  const [a, setA] = useState(null), [ok, setOk] = useState([]), [bad, setBad] = useState(null);
  useEffect(() => { if (ok.length === pairs.length) onDone(); }, [ok.length]);
  const tapR = j => { if (a == null || ok.includes(j)) return; if (j === a) { setOk([...ok, j]); setA(null); } else { setBad(j); setTimeout(() => setBad(null), 420); } };
  const cell = (on, done, wrong) => ({ minHeight: 78, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: '8px 12px', width: '100%', border: `2.5px solid ${INK}`, borderRadius: 18,
    background: done ? MENTA : wrong ? ROSA : on ? T_AZ : '#fff', boxShadow: on && !done ? `4px 4px 0 ${INK}` : 'none', transition: 'background .15s' });
  const tick = PathIco('M5 12l5 5 9-10', 20, 3.2);
  return html`<div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px">
    <${Rally} pose="pensa" w=${196} alt="" style="position:absolute;right:-12px;top:-14px"/>
    <div class="o-col" style="gap:6px;position:relative;min-height:150px;max-width:190px"><h1 class="o-big">Match the pairs</h1><p class="o-lab">Tap a word, then its meaning.</p></div>
    <div style="display:grid;grid-template-columns:minmax(132px,43%) 1fr;gap:10px 12px;margin-top:18px;position:relative">
      ${pairs.map((p, i) => html`<${React.Fragment} key=${i}>
        <button type="button" aria-pressed=${a === i || ok.includes(i) ? 'true' : 'false'} disabled=${ok.includes(i)} onClick=${() => setA(a === i ? null : i)} style=${Object.assign(cell(a === i, ok.includes(i)), { fontSize: 16, fontWeight: 800 })}>${p[0]}${ok.includes(i) && tick}</button>
        <button type="button" disabled=${ok.includes(right[i])} onClick=${() => tapR(right[i])} style=${Object.assign(cell(false, ok.includes(right[i]), bad === right[i]), { fontSize: 14, lineHeight: '19px', fontWeight: ok.includes(right[i]) ? 700 : 600 })}>${pairs[right[i]][1]}${ok.includes(right[i]) && tick}</button>
      <//>`)}
    </div>
    <p class="o-lab" style="margin-top:16px" aria-live="polite">${ok.length === pairs.length ? 'All pairs are matched.' : `${plural(ok.length, 'pair', 'pairs')} out of ${pairs.length}.${a != null ? ` You picked “${pairs[a][0]}”: now tap its meaning.` : ''}`}</p>
  </div>`;
}
// grafico della lezione sull'interesse composto: 1.000 € al 5%, anni a scelta
function CompoundWidget() {
  const [n, setN] = useState(20);
  const C = 1000, i = 0.05, pts = [0, n / 4, n / 2, 3 * n / 4, n];
  const val = t => ({ cap: C, simple: C * i * t, extra: C * Math.pow(1 + i, t) - C - C * i * t });
  const tot = C * Math.pow(1 + i, n), H = 132;
  const eur = v => eur0(v);   // stessa scrittura delle lezioni: 2.653 €
  const end = val(n);
  return html`<div class="o-card s o-col" style="padding:16px 18px;gap:10px;margin-top:16px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><span style="font-size:15px;line-height:20px;font-weight:800">${CUR}1,000 at 5% a year</span>
      <span class="o-col" style="align-items:flex-end"><span class="o-s">after ${n} years</span><span style="font-size:15px;line-height:20px;font-weight:800">${eur(tot)}</span></span></div>
    <div role="img" aria-label=${`After ${n} years ${CUR}1,000 becomes ${eur(tot)}`} style="display:flex;align-items:flex-end;justify-content:space-between;height:${H + 4}px;padding:0 10px;border-bottom:2.5px solid ${INK}">
      ${pts.map((t, k) => { const v = val(t), sc = H / tot; return html`<div key=${k} style="width:42px;display:flex;flex-direction:column;border:2px solid ${INK};border-bottom:0;border-radius:6px 6px 0 0;overflow:hidden">
        ${v.extra * sc >= 1 && html`<i style=${{ display: 'block', height: v.extra * sc, background: AZ, borderBottom: `2px solid ${INK}` }}></i>`}
        ${v.simple * sc >= 1 && html`<i style=${{ display: 'block', height: v.simple * sc, background: T_AZ, borderBottom: `2px solid ${INK}` }}></i>`}
        <i style=${{ display: 'block', height: v.cap * sc, background: '#fff' }}></i></div>`; })}
    </div>
    <div style="display:flex;justify-content:space-between;padding:0 10px;font-size:12px;line-height:16px;font-weight:700;color:${MUT}">${pts.map((t, k) => html`<span key=${k} style="width:42px;text-align:center;white-space:nowrap">${k === 0 ? 'today' : k === 4 ? `${t} years` : t}</span>`)}</div>
    <label class="o-rowf" style="gap:12px;margin-top:2px"><span style="font-size:15px;font-weight:800">Years</span>
      <input type="range" min="4" max="40" step="4" value=${n} onInput=${e => setN(+e.target.value)} onChange=${e => setN(+e.target.value)} style="flex:1;accent-color:${INK};height:28px"/><span style="width:24px;text-align:right;font-size:15px;font-weight:800">${n}</span></label>
    <div class="o-col" style="gap:4px;font-size:14px;line-height:20px;font-weight:700">
      ${[['#fff', 'Your money', end.cap], [T_AZ, 'Interest on your money', end.simple], [AZ, 'Interest on interest', end.extra]].map(([bg, t, v]) => html`<div key=${t} class="o-rowf" style="gap:8px"><i style=${{ width: 14, height: 14, flex: 'none', background: bg, border: `2px solid ${INK}`, borderRadius: 4 }}></i><span class="o-grow">${t}</span><span style="font-weight:800">${eur(v)}</span></div>`)}
    </div></div>`;
}

// ---- la lezione: pagine, riepilogo, esercizi, e alla fine la figurina ----
function LessonScreen({ nav, lessonKey, at, ask }) {
  const l = lessonByKey(lessonKey);
  const steps = useMemo(() => lessonSteps(l), [lessonKey]);
  const [i, setI] = useState(() => clamp(at | 0, 0, Math.max(0, steps.length - 1))), [sel, setSel] = useState(null), [fb, setFb] = useState(null), [res, setRes] = useState({}), [tab, setTab] = useState('case');
  const [matched, setMatched] = useState(false), [done, setDone] = useState(null), [left, setLeft] = useState(null);
  const scrollRef = useRef(null);
  // parole da toccare: solo nelle lezioni di base, e si spengono quando esci dalla lezione
  termStore.on = !!l && l.kind !== 'los';
  useEffect(() => () => { termStore.on = false; termOpen(null); }, []);
  const firstTermPage = useMemo(() => (l && l.kind !== 'los' ? steps.findIndex(s => s.k === 'page' && hasTerms(s.text)) : -1), [lessonKey]);
  useEffect(() => { markSeen(l); }, [lessonKey]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; setSel(null); setFb(null); setTab('case'); setMatched(false); }, [i]);
  const st = steps[i];
  const finish = (resNow) => {
    // contano come risposte le domande a scelta e i "Calcola tu"
    const R = resNow || res, qi = steps.map((s, k) => s.k === 'q' || s.k === 'num' ? k : -1).filter(k => k >= 0), okN = qi.filter(k => R[k] && R[k].ok).length, first = !isDone(l.key);
    if (first) { if (l.kind === 'los') K.setLosProgress(p => p.includes(l.key) ? p : [...p, l.key]); else s2set(s => ({ basi: s.basi.includes(l.key) ? s.basi : [...s.basi, l.key] })); K.albumLearn(l.key); }
    else if (qi.length) K.albumReview(l.key, okN === qi.length);
    const xp = first ? 10 + 10 * okN : 5 * okN; addXp(xp);
    setDone({ xp, okN, qn: qi.length, first, wrong: qi.filter(k => steps[k].k === 'q' && !(R[k] && R[k].ok)) });
  };
  // esito e scelta si azzerano insieme al cambio di passo: così una domanda può stare anche a metà lezione, seguita da una pagina
  const next = () => { if (i < steps.length - 1) { setSel(null); setFb(null); setI(i + 1); } else finish(); };
  useEffect(() => { if (!steps.length) finish({}); }, []);
  // "Chiedi a Rally": la chat conosce la pagina (o la domanda) che hai davanti. Una chat per pagina, che si riapre.
  const askHere = () => {
    if (!st) return;
    const id = `lez_${l.key}_${i}`, back = { lesson: l.key, at: i, chat: id };
    if (st.k === 'q') {
      const plain = K.flPlain(st.q.q), picked = fb && sel != null ? L3[sel] : null, right = L3[st.q.ans];
      return nav.askAbout({ id, back, title: 'Question: ' + plain.slice(0, 40),
        first: picked ? `Question: "${plain}"\n\nYou answered ${picked}; the right answer is ${right}. What would you like to understand?` : `You're working on:\n\n"${plain}"\n\nI'll guide you without giving away the answer. Where shall we start?`,
        ctx: { picked, correct: right, q: plain, opts: st.q.options.map(K.flPlain), topic: `${l.unit.name} · ${l.title}` } });
    }
    const page = st.k === 'recap' ? 'In short' : st.title;
    const text = st.k === 'recap' ? [...st.points.map(p => '• ' + p), ...(st.tips.length ? ['On the exam:', ...st.tips.map(p => '• ' + p)] : [])].join('\n')
      : [st.text, st.note ? 'In short: ' + st.note : ''].filter(Boolean).join('\n\n');
    const others = steps.filter((s, k) => k !== i && s.k === 'page' && s.title).map(s => s.title).join('; ');
    nav.askAbout({ id, back, title: 'Lesson: ' + l.title,
      first: `You're reading "${page}". What doesn't add up? I can explain it more simply, give you an example with numbers, or quiz you.`,
      ctx: { kind: 'lesson', title: l.title, where: [l.course && l.course.name, l.unit && l.unit.name].filter(Boolean).join(' · '), page, text: String(text).slice(0, 6000), others: others.slice(0, 800) } });
  };
  // ritorno da OpenRouter: la lezione si riapre alla stessa pagina, con la chat aperta
  useEffect(() => { if (ask) askHere(); }, []);
  if (done) return html`<${LessonDone} nav=${nav} l=${l} done=${done} steps=${steps} res=${res}/>`;
  if (!st) return html`<div class="o-scr"></div>`;
  // passi interattivi (stima, leve, metti a posto, ordina, calcola): ognuno disegna il suo corpo e il suo piede
  const IS = ISTEPS[st.k];
  if (IS) return html`<${IS} key=${i} st=${st} l=${l} repeat=${isDone(l.key)} scrollRef=${scrollRef} top=${html`<${TopBar} onClose=${nav.back} n=${steps.length} i=${i}/>`}
    onNext=${r => { const R = r ? Object.assign({}, res, { [i]: r }) : res; if (r) setRes(R); if (i < steps.length - 1) setI(i + 1); else finish(R); }}/>`;
  const check = () => {
    const ok = sel === st.q.ans; recordAnswer(st.q, ok); setRes(r => Object.assign({}, r, { [i]: { sel, ok } }));
    if (ok) return setFb('ok');
    const e = explState();
    if (e.pro) { setLeft(null); setFb('ko'); } else if (e.left > 0) { spendExplanation(); setLeft(e.left - 1); setFb('ko'); } else setFb('limit');
  };
  const locked = !!fb;
  const cs = st.k === 'q' ? splitCase(st.q) : null;
  const calcBtn = html`<${IBtn} lg=${true} icon=${Ico(Calculator, 24, 2.2)} onClick=${nav.openCalc} label="Calculator"/>`;
  let body, foot;
  if (st.k === 'page') {
    body = html`<div class="o-pad" style="position:relative;padding-top:18px;padding-bottom:24px">
      ${st.head && html`<div class="o-lab" style="margin-bottom:4px">${st.head}</div>`}
      <h1 style="font-size:30px;line-height:34px;font-weight:800;letter-spacing:-.02em;text-wrap:balance;overflow-wrap:anywhere">${st.title}</h1>
      <div style="margin-top:12px">${(() => { const parts = st.fig ? String(st.text).split(/\n*\[fig\]\n*/) : [st.text]; return html`<${React.Fragment}><${Rich} text=${parts[0]}/>${st.fig && html`<${Fig} key=${'f' + i} fig=${st.fig}/>`}${parts[1] && html`<${Rich} text=${parts[1]}/>`}<//>`; })()}</div>
      ${i === firstTermPage && html`<p class="o-s" style="margin-top:14px">Underlined words are tappable: they tell you what they mean.</p>`}
      ${st.widget === 'compound' && html`<${CompoundWidget}/>`}
      ${st.note && html`<div class="o-note" style="margin-top:18px"><${Rich} text=${'In short: ' + st.note} cls="sm" style=${{ fontSize: 'inherit', lineHeight: 'inherit', fontWeight: 'inherit' }}/></div>`}
    </div>`;
    foot = html`<${Btn} cls="lg" onClick=${next}>Got it<//>`;
  } else if (st.k === 'recap') {
    body = html`<div class="o-pad" style="position:relative;padding-top:18px;padding-bottom:24px">
      <${Rally} pose="insegna" w=${170} alt="" style="position:absolute;right:-14px;top:-8px"/>
      <div style="position:relative;min-height:128px;max-width:200px"><div class="o-lab" style="margin-bottom:4px">${l.title}</div><h1 style="font-size:30px;line-height:34px;font-weight:800;letter-spacing:-.02em">In short</h1></div>
      ${st.points.length > 0 && html`<div class="o-card s o-col" style="position:relative;padding:8px 18px;margin-top:10px">${st.points.map((t, k) => html`<div key=${k} class="o-rowf" style=${{ gap: 12, padding: '12px 0', borderBottom: k < st.points.length - 1 ? `2px solid ${SEP}` : 0, alignItems: 'flex-start' }}>
        <span style="width:24px;height:24px;flex:none;display:flex;align-items:center;justify-content:center;background:${INK};border-radius:50%;color:#fff;margin-top:1px">${PathIco(D_CHECK, 14, 3.4)}</span><${Rich} text=${t} cls="sm" style=${{ fontWeight: 700 }}/></div>`)}</div>`}
      ${st.tips.length > 0 && html`<div style="margin-top:16px;padding:12px 16px;background:${T_GIALLO};border-radius:16px"><div style="font-size:13px;line-height:18px;font-weight:800;margin-bottom:2px">On the exam</div>${st.tips.map((t, k) => html`<${Rich} key=${k} text=${String(t).replace(/^[^\wÀ-ÿ(]+\s*/, '')} cls="sm"/>`)}</div>`}
    </div>`;
    foot = html`<${Btn} cls="lg" onClick=${next}>${steps[i + 1] && steps[i + 1].k === 'q' ? 'Go to the question' : 'Got it'}<//>`;
  } else if (st.k === 'match') {
    body = html`<${MatchExercise} key=${i} pairs=${st.pairs} onDone=${() => setMatched(true)}/>`;
    foot = html`<${Btn} cls="lg" disabled=${!matched} onClick=${next}>Continue<//>`;
  } else {
    const qn = steps.filter(s => s.k === 'q').length, qk = steps.slice(0, i + 1).filter(s => s.k === 'q').length;
    body = html`<${QuestionBody} key=${i} q=${st.q} label=${qn > 1 ? `Question ${qk} of ${qn}` : (l.kind === 'los' ? 'Exam question' : 'Question')} sel=${sel} onSel=${setSel} locked=${locked} tab=${tab} setTab=${setTab}/>`;
    foot = html`<div class="o-rowf" style="gap:12px">${l.kind === 'los' && calcBtn}<div class="o-grow">${cs && tab === 'case'
      ? html`<${Btn} cls="lg" onClick=${() => setTab('ask')}>Go to the question<//>` : html`<${Btn} cls="lg" disabled=${sel == null || locked} onClick=${check}>Check<//>`}</div></div>`;
  }
  const over = st.k !== 'q' ? null : fb === 'ok' ? html`<${FeedbackSheet} ok=${true} q=${st.q} xp=${isDone(l.key) ? 5 : 10} onNext=${next}/>`
    : fb === 'ko' ? html`<${FeedbackSheet} ok=${false} q=${st.q} left=${left} onNext=${next}/>`
    : fb === 'limit' ? html`<${LimitSheet} onPro=${() => { startPro(); setLeft(null); setFb('ko'); }} onSkip=${next}/>` : null;
  const askBtn = st.k === 'page' || st.k === 'recap' || st.k === 'q' ? html`<${IBtn} icon=${PathIco(D_TABS.coach, 22, 2.4)} onClick=${askHere} label="Ask Rally"/>` : null;
  return html`<${Flow} scrollRef=${scrollRef} top=${html`<${TopBar} onClose=${nav.back} n=${steps.length} i=${i} right=${askBtn}/>`} foot=${foot} over=${over}>${body}<//>`;
}
// lezione finita: figurina, punti, giorni di fila
function LessonDone({ nav, l, done, steps, res }) {
  const [rev, setRev] = useState(false);
  const streak = streakDays(), emoji = lessonEmoji(l);
  const wq = done.wrong.length ? steps[done.wrong[0]].q : null, wr = wq ? res[done.wrong[0]] : null;
  const goOn = () => nav.back();   // (qui c'era l'invito a creare un account: tornerà quando gli account saranno veri)
  const conf = [[34, 96, GIALLO, 24, 0], [58, 176, '#fff', 0, 1], [26, 244, MENTA, -32, 0], [96, 70, ROSA, 0, 1], [-48, 88, ROSA, -18, 0], [-70, 170, GIALLO, 0, 1], [-38, 240, '#fff', 38, 0], [-104, 64, MENTA, 0, 1]];
  return html`<div class="o-scr" style="background:repeating-conic-gradient(from 5deg at 50% 190px, #A9D3FF 0deg 10deg, ${AZ} 10deg 20deg)">
    <div class="o-scroll"><div class="o-col" style="min-height:100%;align-items:center;position:relative;padding:0 20px">
      ${conf.map(([x, y, bg, rot, round], k) => html`<span key=${k} aria-hidden="true" style=${Object.assign({ position: 'absolute', top: y, background: bg, border: `2px solid ${INK}` }, x >= 0 ? { left: x } : { right: -x }, round ? { width: 13, height: 13, borderRadius: '50%' } : { width: 10, height: 18, borderRadius: 3, transform: `rotate(${rot}deg)` })}></span>`)}
      <${Rally} pose="festa-grad" w=${300} alt="Rally celebrating in a graduation cap" style="margin-top:calc(var(--otop) - 17px);position:relative"/>
      <h1 class="o-pop" style="font-size:44px;line-height:48px;font-weight:800;letter-spacing:-.02em;text-align:center;margin-top:-18px;position:relative">Lesson complete!</h1>
      <p style="font-size:16px;line-height:22px;font-weight:600;text-align:center;margin-top:6px">${done.first ? 'You have a new sticker in your album.' : 'Sticker refreshed: it stays colorful longer.'}</p>
      <div style="display:flex;align-items:flex-start;justify-content:center;gap:20px;margin-top:26px;width:100%">
        <div class="o-col" style="width:168px;flex:none;padding:8px 8px 12px;gap:10px;background:#fff;border:2.5px solid ${INK};border-radius:20px;box-shadow:5px 5px 0 ${INK};transform:rotate(-5deg)">
          <div style="height:122px;display:flex;align-items:center;justify-content:center;background:${T_AZ};border:2px solid ${INK};border-radius:13px;font-size:${emoji ? 56 : 44}px;line-height:1;font-weight:800">${emoji || stickerSym(l)}</div>
          <div class="o-col" style="gap:1px;padding:0 4px"><span style="font-size:15px;line-height:20px;font-weight:800;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${l.title}</span>
            <span style="font-size:12px;line-height:16px;font-weight:600;color:${MUT};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.unit.name}${l.code ? ', n. ' + l.code : ''}</span></div></div>
        <div class="o-col" style="width:152px;flex:none;margin-top:6px;overflow:hidden;background:#fff;border:2.5px solid ${INK};border-radius:20px">
          <div class="o-col" style="padding:9px 14px 10px;border-bottom:2px solid ${INK};background:${GIALLO}"><span style="font-size:13px;line-height:18px;font-weight:700">Points</span><span style="font-size:22px;line-height:26px;font-weight:800">+${done.xp} XP</span></div>
          ${done.qn > 0 && html`<div class="o-col" style="padding:9px 14px 10px;border-bottom:2px solid ${INK}"><span class="o-s">Correct answers</span><span style="font-size:22px;line-height:26px;font-weight:800">${done.okN} of ${done.qn}</span></div>`}
          <div class="o-col" style="padding:9px 14px 10px"><span class="o-s">Day streak</span><span style="font-size:22px;line-height:26px;font-weight:800">${Math.max(1, streak)}</span></div></div>
      </div>
      <div style="flex:1 1 20px;min-height:20px"></div>
      ${wq && html`<button type="button" class="o-link" onClick=${() => setRev(true)}>Review the question you missed</button>`}
      <div style="width:100%;padding:8px 0 max(34px,calc(env(safe-area-inset-bottom) + 12px))"><${Btn} cls="lg" bg="#fff" onClick=${goOn}>Continue<//></div>
    </div></div>
    ${rev && html`<${BSheet} onClose=${() => setRev(false)} label="Question you missed">
      <div class="o-scroll" style="flex:0 1 auto;max-height:70vh"><${Rich} text=${wq.q} cls="q" lang=${wq.lang}/>
        <div style="margin-top:14px"><${Options} q=${wq} sel=${wr ? wr.sel : null} onSel=${() => {}} locked=${true}/></div>
        ${wq.exp && html`<div style="margin-top:14px;padding:12px 14px;background:${T_BG};border-radius:14px"><div style="font-size:18px;font-weight:800;margin-bottom:4px">Why</div><${Rich} text=${wq.exp} cls="sm"/></div>`}</div>
      <div style="margin-top:14px;flex:none"><${Btn} cls="lg" onClick=${() => setRev(false)}>Got it<//></div>
    <//>`}
  </div>`;
}

// ---- passi interattivi delle lezioni: stima prima di leggere, leve con un obiettivo, metti a posto, metti in ordine, calcola ----
// I dati di ogni passo stanno nelle lezioni (campo "flow"); qui c'è come si vedono e come rispondono al tocco.
const NBSP = ' ';
// numeri scritti allo stesso modo su ogni telefono: all'italiana 1.331 · 7,5 · 87.584 · 1.000 €; all'americana 1,331 · 7.5 · 87,584 · €1,000
const grp = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, GRP);
const fmtN = (v, d = 0) => { const s = Math.abs(Number(v)).toFixed(d).split('.'); return (v < 0 ? '−' : '') + grp(s[0]) + (s[1] ? DEC + s[1] : ''); };
const isMoney = unit => unit === '€' || unit === '$';
// la valuta in inglese sta davanti alla cifra (€1,000), in italiano dopo (1.000 €)
const withUnit = (v, unit, d = 0) => (LANG === 'en' && isMoney(unit) ? CUR + fmtN(v, d) : fmtN(v, d) + (unit === '%' ? '%' : unit ? NBSP + unit : ''));
const eur0 = x => (LANG === 'en' ? CUR + fmtN(Math.round(x)) : fmtN(Math.round(x)) + NBSP + '€');
const mesiTxt = m => { const a = Math.floor(m / 12), r = m % 12; return a ? plural(a, 'year', 'years') + (r ? (LANG === 'en' ? ' and ' : ' e ') + plural(r, 'month', 'months') : '') : plural(r, 'month', 'months'); };

// cursore con i due tasti meno e più: il dito lo trascina, i tasti servono per il passo fine
function Slider({ value, min, max, step, onChange, label, disabled }) {
  const p = clamp((value - min) / (max - min) * 100, 0, 100);
  const set = x => onChange(clamp(Math.round(Math.round(x / step) * step * 100) / 100, min, max));
  return html`<div class="o-rowf" style="gap:10px">
    <button type="button" class="o-stepb" aria-label=${'Decrease: ' + label} disabled=${!!disabled || value <= min} onClick=${() => set(value - step)}>${PathIco('M5 12h14', 18, 3.2)}</button>
    <input type="range" class="o-range o-grow" aria-label=${label} min=${min} max=${max} step=${step} value=${value} disabled=${!!disabled} style=${{ '--p': p + '%' }} onInput=${e => set(+e.target.value)} onChange=${e => set(+e.target.value)}/>
    <button type="button" class="o-stepb" aria-label=${'Increase: ' + label} disabled=${!!disabled || value >= max} onClick=${() => set(value + step)}>${PathIco(D_PLUS, 18, 3.2)}</button></div>`;
}

// figura che accompagna una spiegazione: una o più barre divise in pezzi colorati, con la legenda sotto. Le barre crescono quando la pagina compare.
const FIG_COL = { az: AZ, pesca: PESCA, menta: MENTA, giallo: GIALLO, lilla: LILLA, rosa: ROSA, bianco: '#fff' };
function Fig({ fig }) {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 80); return () => clearTimeout(t); }, []);
  const sum = r => r.segs.reduce((a, x) => a + x[0], 0), max = Math.max.apply(null, fig.rows.map(sum));
  const dot = c => html`<i style=${{ width: 12, height: 12, flex: 'none', borderRadius: 4, background: FIG_COL[c] || AZ, border: `2px solid ${INK}` }}></i>`;
  return html`<figure class="o-fig" role="img" aria-label=${fig.alt || fig.rows.map(r => r.lab + (r.val ? ' ' + r.val : '') + ': ' + r.segs.map(x => x[1] + (x[3] ? ' ' + x[3] : '')).join(', ')).join('. ')}>
    ${fig.rows.map((r, k) => html`<div key=${k} class="o-col" style="gap:6px">
      <div class="o-rowf" style="justify-content:space-between;gap:10px;align-items:baseline"><span class="o-t" style="font-weight:800">${r.lab}</span>${r.val && html`<span class="o-t" style="font-weight:800;white-space:nowrap">${r.val}</span>`}</div>
      <div class="o-figbar" style=${{ width: (go ? Math.max(8, sum(r) / max * 100) : 0) + '%' }}>${r.segs.map((x, j) => html`<i key=${j} style=${{ flex: x[0] + ' 1 0', background: FIG_COL[x[2]] || AZ, borderLeft: j ? `2.5px solid ${INK}` : 0 }}></i>`)}</div>
      <div class="o-rowf" style="flex-wrap:wrap;gap:4px 14px">${r.segs.map((x, j) => html`<span key=${j} class="o-s" style=${{ color: INK, display: 'inline-flex', alignItems: 'center', gap: 6 }}>${dot(x[2])}${x[1]}${x[3] ? ' ' + x[3] : ''}</span>`)}</div></div>`)}
    ${fig.cap && html`<figcaption class="o-s" style="margin-top:2px">${fig.cap}</figcaption>`}</figure>`;
}

// "Prima di leggere": una stima (cursore) o una scelta, senza voto. La spiegazione parte da quello che hai risposto.
function GuessStep({ st, top, onNext, scrollRef }) {
  const choice = Array.isArray(st.options);
  const [v, setV] = useState(choice ? null : st.min), [moved, setMoved] = useState(false), [locked, setLocked] = useState(false);
  const rev = useRef(null);
  useEffect(() => { if (locked && rev.current && rev.current.scrollIntoView) { try { rev.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* niente */ } } }, [locked]);
  const u = x => withUnit(x, st.unit, st.dec || 0);
  const right = choice ? v === st.ans : Math.abs(v - st.truth) <= st.near;
  const verdict = choice ? (right ? 'You called it' : 'Not quite') : right ? 'Almost spot on' : v > st.truth ? 'Less than you thought' : 'More than you thought';
  const pos = x => clamp((x - st.min) / (st.max - st.min) * 100, 0, 100);
  const mark = (x, bg, round) => html`<i style=${{ position: 'absolute', top: '50%', left: pos(x) + '%', width: round ? 24 : 20, height: round ? 24 : 20, marginLeft: round ? -12 : -10, marginTop: round ? -12 : -10, background: bg, border: `2.5px solid ${INK}`, borderRadius: round ? '50%' : 5, transform: round ? 'none' : 'rotate(45deg)' }}></i>`;
  const box = (lab, val, bg) => html`<div class="o-col o-grow" style=${{ padding: '10px 12px', border: `2px solid ${INK}`, borderRadius: 14, background: bg }}><span class="o-s" style=${{ color: INK }}>${lab}</span><span style="font-size:26px;line-height:32px;font-weight:800;white-space:nowrap">${val}</span></div>`;
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:24px">
    <div class="o-rowf" style="gap:8px;align-items:flex-end;margin:-4px 0 12px -6px"><${Rally} pose=${!locked ? 'pensa' : right ? 'giusto' : 'insegna'} w=${92} style=${{ flex: 'none' }}/>
      <span class="o-bub" aria-live="polite">${!locked ? 'Before you read: what do you think?' : right ? 'Nice one!' : 'Let\'s look at the math together.'}</span></div>
    <${Rich} text=${st.q} cls="q"/>
    ${choice ? html`<div class="o-col" style="gap:10px;margin-top:16px">${st.options.map((o, k) => html`<${Opt} key=${k} letter=${L3[k]} text=${o}
        state=${!locked ? (v === k ? 'sel' : '') : k === st.ans ? 'ok' : k === v ? 'sel' : 'dim'} note=${k === v ? 'Your choice' : locked && k === st.ans ? 'The right one' : null} disabled=${locked} onClick=${() => setV(k)}/>`)}</div>`
    : !locked ? html`<div class="o-card s o-col" style="margin-top:18px;padding:16px 16px 18px;gap:12px">
        <div class="o-col" style="align-items:center"><span class="o-s">Your estimate</span><span class="o-bign" aria-live="polite">${moved ? u(v) : '?'}</span></div>
        <${Slider} value=${v} min=${st.min} max=${st.max} step=${st.step} label="Your estimate" onChange=${x => { setV(x); setMoved(true); }}/>
        <div class="o-rowf" style="justify-content:space-between;padding:0 50px"><span class="o-s">${u(st.min)}</span><span class="o-s">${u(st.max)}</span></div></div>`
    : html`<div class="o-card s o-col" style="margin-top:18px;padding:16px 16px 14px;gap:12px">
        <div class="o-rowf" style="gap:10px;align-items:stretch">${box('Your estimate', u(v), '#fff')}${box('The math', u(st.truth), MENTA)}</div>
        <div role="img" aria-label=${`Your estimate is ${u(v)}, the math gives ${u(st.truth)}`} style="position:relative;height:30px;margin:2px 14px 0">
          <i style="position:absolute;left:-14px;right:-14px;top:50%;height:12px;margin-top:-6px;background:#fff;border:2.5px solid ${INK};border-radius:99px"></i>${mark(v, '#fff', true)}${mark(st.truth, MENTA, false)}</div>
        <div class="o-rowf" style="justify-content:space-between"><span class="o-s">${u(st.min)}</span><span class="o-s">${u(st.max)}</span></div></div>`}
    ${locked && html`<div ref=${rev} class="o-in" style="margin-top:20px"><h2 style="font-size:24px;line-height:28px;font-weight:800;letter-spacing:-.02em">${verdict}</h2><div style="margin-top:6px"><${Rich} text=${st.after} cls="sm"/></div></div>`}
  </div>`;
  const foot = !locked ? html`<${Btn} cls="lg" disabled=${choice ? v == null : !moved} onClick=${() => setLocked(true)}>${choice ? 'Lock in your answer' : 'Lock in your estimate'}<//>` : html`<${Btn} cls="lg" onClick=${() => onNext()}>Continue<//>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${foot}>${body}<//>`;
}

// i conti dietro le leve: ogni modello dice come si calcola e che cosa mostrare
const LEVERS = {
  // mutuo a rata costante, rate mensili: leve "tasso" (% annuo) e "anni"; parametro C = capitale
  mutuo: {
    calc: (v, p) => { const j = v.tasso / 1200, m = v.anni * 12, rata = j > 0 ? p.C * j / (1 - Math.pow(1 + j, -m)) : p.C / m; return { rata, interessi: rata * m - p.C, base: p.C }; },
    view: o => ({ lab: 'Monthly payment', big: eur0(o.rata), sideLab: 'Total interest', side: eur0(o.interessi), bar: [o.base, o.interessi], barLab: ['Principal', 'Interest'] })
  },
  // debito su carta rimborsato con una cifra fissa al mese: leva "rata"; parametri debito e tasso (% annuo, diviso 12 per il mese)
  carta: {
    calc: (v, p) => { const j = p.tasso / 1200; let B = p.debito, n = 0, tot = 0; if (v.rata <= B * j + 1e-9) return { mesi: 9999, interessi: 0, base: p.debito, mai: true };
      while (B > 0.005 && n < 1200) { const due = B * (1 + j), pay = Math.min(v.rata, due); B = due - pay; tot += pay; n++; } return { mesi: n, interessi: tot - p.debito, base: p.debito, mai: false }; },
    view: o => o.mai ? { lab: 'Time to pay off', big: 'Never', sideLab: 'With this amount', side: 'you only pay interest', bar: null, barLab: ['Debt', 'Interest'] }
      : { lab: 'Time to pay off', big: mesiTxt(o.mesi), sideLab: 'Total interest', side: eur0(o.interessi), bar: [o.base, o.interessi], barLab: ['Debt', 'Interest'] }
  },
  // versamenti regolari che rendono: leve "rata" (€ al mese) e "anni"; parametro tasso = rendimento annuo in %.
  // Il tasso è quello di un anno intero (il 5% l'anno resta 5% anche versando ogni mese); versamenti a fine mese.
  piano: {
    calc: (v, p) => { const m = v.anni * 12, j = Math.pow(1 + (p.tasso || 0) / 100, 1 / 12) - 1, tot = j > 0 ? v.rata * (Math.pow(1 + j, m) - 1) / j : v.rata * m; return { totale: tot, versato: v.rata * m, interessi: tot - v.rata * m, rata: v.rata, anni: v.anni }; },
    view: o => ({ lab: 'What you\'ll have', big: eur0(o.totale), sideLab: 'What you put in', side: eur0(o.versato), bar: [o.versato, o.interessi], barLab: ['Paid in', 'Returns'], barCol: [MENTA, AZ] })
  },
  // obiettivo di risparmio senza interessi: leve "rata" (€ al mese) e "mesi"; parametro cifra = quanto serve
  obiettivo: {
    calc: (v, p) => { const messo = v.rata * v.mesi; return { messo, manca: Math.max(0, p.cifra - messo), rata: v.rata, mesi: v.mesi, cifra: p.cifra }; },
    view: o => ({ lab: 'You set aside', big: eur0(o.messo), sideLab: o.manca > 0 ? 'Still to go' : 'Goal', side: o.manca > 0 ? eur0(o.manca) : 'reached', bar: [Math.min(o.messo, o.cifra), o.manca], barLab: ['Set aside', 'Still needed'], barCol: [MENTA, '#fff'] })
  },
  // budget del mese: leve "bisogni" e "desideri" (€ al mese); parametro entrate
  budget: {
    calc: (v, p) => { const r = p.entrate - v.bisogni - v.desideri; return { risparmio: r, quota: r / p.entrate * 100, bisogni: v.bisogni, desideri: v.desideri, spese: v.bisogni + v.desideri }; },
    view: o => ({ lab: 'Savings per month', big: eur0(o.risparmio), sideLab: 'Share of income', side: fmtN(o.quota, 0) + '%', bar: o.risparmio >= 0 ? [o.spese, o.risparmio] : null, barLab: ['Spending', 'Savings'], barCol: ['#fff', MENTA] })
  },
  // soldi fermi mentre i prezzi salgono: leve "infl" (% annuo) e "anni"; parametro C = cifra ferma
  inflazione: {
    calc: (v, p) => { const reale = p.C / Math.pow(1 + v.infl / 100, v.anni); return { reale, perso: (1 - reale / p.C) * 100, persi: p.C - reale, infl: v.infl, anni: v.anni }; },
    view: o => ({ lab: 'What it will buy', big: eur0(o.reale), sideLab: "Purchasing power lost", side: fmtN(o.perso, 0) + '%', bar: [o.reale, o.persi], barLab: ['Left', 'Lost'], barCol: [AZ, PESCA] })
  },
  // costo di un conto corrente in un anno: leve "canone" (€ al mese), "ops" (operazioni a pagamento al mese), "giac" (giacenza media, €).
  // Parametri: op = costo di una operazione, bollo = imposta di bollo di un anno, soglia = giacenza media oltre la quale il bollo è dovuto
  conto: {
    calc: (v, p) => { const banca = 12 * v.canone + 12 * v.ops * p.op, bollo = v.giac > p.soglia ? p.bollo : 0; return { costo: banca + bollo, banca, bollo, canone: v.canone, ops: v.ops, giac: v.giac }; },
    view: o => ({ lab: 'Cost over a year', big: eur0(o.costo), sideLab: 'Fees and transactions', side: eur0(o.banca), side2Lab: 'Stamp duty', side2: o.bollo > 0 ? fmtN(o.bollo, 2) + NBSP + '€' : 'not due',
      bar: o.costo > 0 ? [o.banca, o.bollo] : null, barLab: ['To the bank', 'To the State'], barCol: [AZ, PESCA] })
  },
  // garanzia dei depositi: leve "a" (conto tuo in banca A), "co" (conto cointestato in due, banca A), "b" (conto tuo in banca B); parametro lim = limite per persona e per banca.
  // Il cointestato conta per metà; la tua parte in banca A è il tuo conto più quella metà.
  garanzia: {
    calc: (v, p) => { const parteA = v.a + v.co / 2, protA = Math.min(p.lim, parteA), protB = Math.min(p.lim, v.b); return { fuori: parteA - protA + v.b - protB, protetti: protA + protB, tuoi: parteA + v.b, parteA, b: v.b }; },
    view: o => ({ lab: 'Outside the guarantee', big: eur0(o.fuori), sideLab: 'Your share in bank A', side: eur0(o.parteA), side2Lab: 'All your money', side2: eur0(o.tuoi),
      bar: o.tuoi > 0 ? [o.protetti, o.fuori] : null, barLab: ['Protected', 'Outside'], barCol: [MENTA, PESCA] })
  },
  // dal lordo al netto, regole 2026 (fonti in FONTI_BASI.md): leva "ral". Dipendente privato senza familiari a carico, residente a Milano, 13 mensilità.
  // Contributi 9,19% (+1% oltre 56.224 €), IRPEF 23/33/43%, detrazione per lavoro dipendente, taglio del cuneo (somma fino a 20.000 €, detrazione fino a 40.000 €), addizionali di Lombardia e Milano.
  netto: {
    calc: (v, p) => { const N = STIP.netto(v.ral), N2 = STIP.netto(v.ral + 1000), mens = (p && p.mens) || 13;
      return { netto: N.annuo / mens, annuo: N.annuo, contributi: N.contr, imposte: v.ral - N.contr - N.annuo, trattenute: v.ral - N.annuo, resta: N2.annuo - N.annuo, ral: v.ral }; },
    view: o => ({ lab: 'Net per month', big: eur0(o.netto), sideLab: 'Withheld in a year', side: eur0(o.trattenute), side2Lab: 'Of an extra €1,000 gross, you keep', side2: eur0(o.resta),
      bar: [o.annuo, o.trattenute], barLab: ['To you', 'Contributions and taxes'], barCol: [MENTA, PESCA] })
  },
  // IRPEF lorda a scaglioni 2026: leva "reddito" (imponibile). media10 = aliquota media in decimi di punto, per gli obiettivi
  irpef: {
    calc: v => { const im = STIP.irpef(v.reddito), marg = v.reddito > 50000 ? 43 : v.reddito > 28000 ? 33 : 23; return { imposta: im, media: im / v.reddito * 100, media10: im / v.reddito * 1000, marginale: marg, resto: v.reddito - im, reddito: v.reddito }; },
    view: o => ({ lab: 'Gross income tax', big: eur0(o.imposta), sideLab: 'Average rate', side: fmtN(o.media, 1) + '%', side2Lab: "Rate on the last euro", side2: o.marginale + '%',
      bar: [o.imposta, o.resto], barLab: ['Tax', 'Rest of income'], barCol: [PESCA, '#fff'] })
  },
  // quanto vale uno sconto fiscale: leve "reddito" (imponibile) e "spesa". Deduzione = imposta in meno togliendo la spesa dal reddito; detrazione = 19% della spesa
  sconto: {
    calc: v => { const ded = STIP.irpef(v.reddito) - STIP.irpef(Math.max(0, v.reddito - v.spesa)), det = 0.19 * v.spesa; return { ded, det, rapporto100: det > 0 ? ded / det * 100 : 0, reddito: v.reddito, spesa: v.spesa }; },
    view: o => ({ lab: 'If you deduct it, you save', big: eur0(o.ded), sideLab: 'If you take the credit at 19%, you save', side: eur0(o.det), bar: [Math.min(o.ded, o.det), Math.abs(o.ded - o.det)], barLab: ['Tax credit', 'Extra with the deduction'], barCol: [AZ, MENTA] })
  },
  // TFR lasciato in azienda: leve "ral", "anni", "infl" (inflazione annua in %). Quota annua = RAL / 13,5 meno lo 0,5% della RAL;
  // ogni anno quello che c'era a fine anno prima si rivaluta dell'1,5% più il 75% dell'inflazione, meno l'imposta del 17% sulla rivalutazione. RAL costante.
  tfr: {
    calc: (v, p) => { const ral = v.ral != null ? v.ral : p.ral, quota = ral / 13.5 - 0.005 * ral, lordo = 1.5 + 0.75 * v.infl, riv = lordo * 0.83; let T = 0; for (let k = 0; k < v.anni; k++) T = T * (1 + riv / 100) + quota;
      return { tfr: T, versato: quota * v.anni, crescita: T - quota * v.anni, riv, scarto10: (riv - v.infl) * 10, quota, anni: v.anni, infl: v.infl }; },
    view: o => ({ lab: 'Accrued severance pay', big: eur0(o.tfr), sideLab: 'Net revaluation over one year', side: fmtN(o.riv, 2) + '%', side2Lab: "Compared with inflation", side2: (o.riv - o.infl >= 0 ? '+' : '') + fmtN(o.riv - o.infl, 2) + ' points',
      bar: [o.versato, o.crescita], barLab: ['Annual contributions', 'Revaluations'], barCol: [AZ, MENTA] })
  },
  // acquisto a rate a tasso zero con spese: leve "pratica" (spese all'inizio, €), "incasso" (spesa per ogni rata, €), "mesi". Parametro prezzo.
  // Il TAEG è il tasso annuo che rende uguali la cifra finanziata (prezzo meno le spese iniziali) e le rate, spese comprese; si trova per tentativi.
  rate: {
    calc: (v, p) => { const rata = p.prezzo / v.mesi + v.incasso, netto = p.prezzo - v.pratica, costo = v.pratica + v.incasso * v.mesi; let lo = 0, hi = 1;
      if (costo > 0) for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; let pv = 0; for (let j = 1; j <= v.mesi; j++) pv += rata / Math.pow(1 + m, j); if (pv > netto) lo = m; else hi = m; }
      const taeg = costo > 0 ? (Math.pow(1 + lo, 12) - 1) * 100 : 0; return { taeg, taeg10: taeg * 10, costo, totale: p.prezzo + costo, prezzo: p.prezzo, mesi: v.mesi, pratica: v.pratica, incasso: v.incasso }; },
    view: o => ({ lab: 'TAEG', big: fmtN(o.taeg, 1) + '%', sideLab: 'Total fees', side: eur0(o.costo), side2Lab: 'Total paid', side2: eur0(o.totale), bar: [o.prezzo, o.costo], barLab: ['Price', 'Spending'], barCol: [AZ, PESCA] })
  },
  // cessione del quinto: leve "netto" (stipendio netto medio al mese), "anni", "taeg" (% annuo). La rata è un quinto del netto;
  // la somma che si riceve è il valore di oggi delle rate al TAEG scelto (tasso del mese = (1 + TAEG)^(1/12) - 1).
  quinto: {
    calc: v => { const rata = v.netto / 5, n = v.anni * 12, i = Math.pow(1 + v.taeg / 100, 1 / 12) - 1, somma = rata * (1 - Math.pow(1 + i, -n)) / i; return { rata, somma, totale: rata * n, costo: rata * n - somma, anni: v.anni, taeg: v.taeg }; },
    view: o => ({ lab: 'Amount you receive', big: eur0(o.somma), sideLab: 'Installment withheld each month', side: eur0(o.rata), side2Lab: 'You repay in total', side2: eur0(o.totale), bar: [o.somma, o.costo], barLab: ['You receive', 'Cost of the loan'], barCol: [AZ, PESCA] })
  },
  // affitto o acquisto dopo un certo numero di anni: leve "anni", "affitto" (€ al mese), "crescita" (% annuo del valore della casa).
  // Parametri: prezzo, costi (% del prezzo pagata una volta), anticipo (%), tasso e anniMutuo, manut (% del prezzo all'anno), rend (% annuo che avrebbero reso i soldi impegnati).
  // Costo di comprare = costi d'acquisto + interessi pagati + manutenzione - aumento di valore + rendimento perso su anticipo e costi. Costo di affittare = affitti pagati.
  casa: {
    calc: (v, p) => { const M = p.prezzo * (1 - p.anticipo / 100), j = p.tasso / 1200, n = p.anniMutuo * 12, rata = M * j / (1 - Math.pow(1 + j, -n)), k = v.anni * 12;
      const D = M * Math.pow(1 + j, k) - rata * (Math.pow(1 + j, k) - 1) / j, interessi = rata * k - (M - D), fermo = p.prezzo * (p.anticipo + p.costi) / 100;
      const compra = p.prezzo * p.costi / 100 + interessi + p.prezzo * p.manut / 100 * v.anni - p.prezzo * (Math.pow(1 + v.crescita / 100, v.anni) - 1) + fermo * (Math.pow(1 + p.rend / 100, v.anni) - 1), affitta = v.affitto * 12 * v.anni;
      return { compra, affitta, diff: affitta - compra, anni: v.anni, affitto: v.affitto, crescita: v.crescita }; },
    view: o => ({ lab: o.diff >= 0 ? 'Buying saves you' : 'Renting saves you', big: eur0(Math.abs(o.diff)), sideLab: 'Cost of buying', side: eur0(o.compra), side2Lab: 'Cost of renting', side2: eur0(o.affitta),
      bar: o.compra > 0 ? [o.compra, o.affitta] : null, barLab: ['Buy', 'Rent'], barCol: [AZ, GIALLO] })
  },
  // quanto mutuo regge un reddito: leve "reddito" (netto al mese), "tasso" (% annuo), "anni". Rata = un terzo del reddito; il mutuo è l'80% del prezzo della casa.
  mutuomax: {
    calc: v => { const rata = v.reddito / 3, j = v.tasso / 1200, n = v.anni * 12, mutuo = rata * (1 - Math.pow(1 + j, -n)) / j; return { rata, mutuo, prezzo: mutuo / 0.8, interessi: rata * n - mutuo, anni: v.anni }; },
    view: o => ({ lab: 'Mortgage you can afford', big: eur0(o.mutuo), sideLab: 'Payment, a third of income', side: eur0(o.rata), side2Lab: 'Home you can buy with 20% down', side2: eur0(o.prezzo), bar: [o.mutuo, o.interessi], barLab: ['Mortgage', 'Total interest'] })
  },
  // cambiare mutuo: leve "tasso" (nuovo, % annuo) e "anni" (nuova durata). Parametri: debito che resta, anni che restano e tasso del mutuo di oggi.
  surroga: {
    calc: (v, p) => { const R = (C, t, a) => { const j = t / 1200; return C * j / (1 - Math.pow(1 + j, -a * 12)); }, vecchia = R(p.debito, p.vecchio, p.anni), nuova = R(p.debito, v.tasso, v.anni);
      return { nuova, vecchia, rispMese: vecchia - nuova, rispTot: vecchia * p.anni * 12 - nuova * v.anni * 12, intNuovi: nuova * v.anni * 12 - p.debito, debito: p.debito }; },
    view: o => ({ lab: 'New payment', big: eur0(o.nuova), sideLab: 'Compared with today\'s payment', side: (o.rispMese >= 0 ? '−' : '+') + eur0(Math.abs(o.rispMese)), side2Lab: o.rispTot >= 0 ? 'Less interest, in total' : 'More interest, in total', side2: eur0(Math.abs(o.rispTot)),
      bar: [o.debito, o.intNuovi], barLab: ['Debt', 'Interest to pay'] })
  },
  // pensione con il metodo contributivo, in euro di oggi: leve "ral" (stipendio lordo medio di un anno), "anni" (di contributi), "eta" (età alla pensione).
  // Montante = 33% dello stipendio per ogni anno di lavoro (contributi rivalutati quanto i prezzi); pensione di un anno = montante × coefficiente dell'età (valori 2025-2026).
  pensione: {
    calc: v => { const K = { 57: 4.204, 58: 4.308, 59: 4.419, 60: 4.536, 61: 4.661, 62: 4.795, 63: 4.936, 64: 5.088, 65: 5.25, 66: 5.423, 67: 5.608, 68: 5.808, 69: 6.024, 70: 6.258, 71: 6.51 };
      const montante = 0.33 * v.ral * v.anni, coeff = K[v.eta], pensione = montante * coeff / 100; return { montante, coeff, pensione, mese: pensione / 13, tasso: pensione / v.ral * 100, manca: Math.max(0, v.ral - pensione), anni: v.anni, eta: v.eta, ral: v.ral }; },
    view: o => ({ lab: 'Gross pension per month', big: eur0(o.mese), sideLab: 'As a percentage of salary', side: fmtN(o.tasso, 0) + '%', side2Lab: 'Accumulated fund', side2: eur0(o.montante),
      bar: [o.pensione, o.manca], barLab: ["One year of pension", 'Gap with salary'], barCol: [AZ, PESCA] })
  },
  // fondo pensione: leve "versi" (€ al mese tuoi), "anni", "isc" (costo annuo in %). Parametri: tfr (€ al mese che entra comunque), soglia (versamento minimo per avere il contributo del datore),
  // datore (€ al mese), rend (% annuo prima dei costi), aliq (% di IRPEF risparmiata sui tuoi versamenti). Capitale prima delle imposte.
  fondo: {
    calc: (v, p) => { const dat = v.versi >= p.soglia ? p.datore : 0, c = p.tfr + v.versi + dat, n = v.anni * 12, F = r => { const i = Math.pow(1 + r / 100, 1 / 12) - 1; return Math.abs(i) < 1e-9 ? c * n : c * (Math.pow(1 + i, n) - 1) / i; };
      const capitale = F(p.rend - v.isc), pieno = F(p.rend), tuoi = v.versi * n, fisco = tuoi * p.aliq / 100;
      return { capitale, persi: pieno - capitale, tuoi, fisco, costo: tuoi - fisco, datoreTot: dat * n, tfrTot: p.tfr * n, isc10: v.isc * 10, versi: v.versi, anni: v.anni }; },
    view: o => ({ lab: 'Capital at retirement', big: eur0(o.capitale), sideLab: 'You pay in, net of the tax break', side: eur0(o.costo), side2Lab: 'The employer adds', side2: eur0(o.datoreTot),
      bar: [o.capitale, o.persi], barLab: ['Principal', 'Eaten up by costs'], barCol: [AZ, PESCA] })
  },
  // TFR in azienda o nel fondo pensione, al netto delle imposte finali: leve "anni", "rend" (% annuo netto del fondo), "infl" (inflazione annua in %). Parametri: ral, aliqTfr (% sul TFR in azienda).
  // Azienda: quota annua rivalutata dell'1,5% più il 75% dell'inflazione, meno il 17%; alla fine imposta aliqTfr sulle quote. Fondo: stessa quota al rendimento scelto;
  // alla fine sulle quote si paga il 15%, meno 0,3 punti per ogni anno oltre il quindicesimo, con un minimo del 9%.
  tfrscelta: {
    calc: (v, p) => { const quota = p.ral / 13.5 - 0.005 * p.ral, riv = (1.5 + 0.75 * v.infl) * 0.83, vers = quota * v.anni; let A = 0, F = 0; for (let k = 0; k < v.anni; k++) { A = A * (1 + riv / 100) + quota; F = F * (1 + v.rend / 100) + quota; }
      const aliqF = Math.max(9, 15 - 0.3 * Math.max(0, v.anni - 15)), az = A - vers * p.aliqTfr / 100, fo = F - vers * aliqF / 100;
      return { az, fo, diff: fo - az, aliqF, riv, anni: v.anni, infl: v.infl, infl10: v.infl * 10, rend: v.rend }; },
    view: o => ({ lab: o.diff >= 0 ? 'The fund gives you more' : "The company gives you more", big: eur0(Math.abs(o.diff)), sideLab: 'Severance pay with the company, net', side: eur0(o.az), side2Lab: 'Severance pay in the fund, net', side2: eur0(o.fo),
      bar: [o.az, o.fo], barLab: ['With the company', 'In the fund'], barCol: [GIALLO, AZ] })
  },
  // mercato del lavoro su 100 persone tra 15 e 64 anni: leve "occ" (occupati) e "dis" (disoccupati: non lavorano e cercano lavoro). Gli altri sono inattivi.
  lavoro: {
    calc: v => { const forze = v.occ + v.dis, tasso = v.dis / forze * 100; return { tasso, tasso10: tasso * 10, occ: v.occ, dis: v.dis, inattivi: 100 - forze, forze }; },
    view: o => ({ lab: 'Unemployment rate', big: fmtN(o.tasso, 1) + '%', sideLab: 'Employment rate', side: fmtN(o.occ, 0) + '%', side2Lab: 'Inactive: not working and not looking', side2: fmtN(o.inattivi, 0) + ' out of 100',
      bar: [o.occ, o.dis + o.inattivi], barLab: ['Employed', 'Without work: unemployed and inactive'], barCol: [MENTA, GIALLO] })
  },
  // debito pubblico in rapporto al PIL dopo "anni" anni: leve "crescita" (PIL nominale, % annuo), "tasso" (costo medio del debito, %), "primario" (saldo prima degli interessi, % del PIL: positivo = avanzo).
  // Ogni anno: debito = debito × (1 + tasso) / (1 + crescita) − primario. Parametri: debito (% del PIL di partenza), anni.
  debito: {
    calc: (v, p) => { let d = p.debito; for (let k = 0; k < p.anni; k++) d = d * (1 + v.tasso / 100) / (1 + v.crescita / 100) - v.primario; const interessi = p.debito * v.tasso / 100;
      return { finale: d, delta: d - p.debito, interessi, deficit: interessi - v.primario, crescita: v.crescita, tasso: v.tasso, primario: v.primario, debito: p.debito }; },
    view: o => ({ lab: 'Debt in ten years, as a share of GDP', big: fmtN(o.finale, 0) + '%', sideLab: 'Interest spending, as a share of GDP', side: fmtN(o.interessi, 1) + '%', side2Lab: 'First-year deficit, as a share of GDP', side2: fmtN(o.deficit, 1) + '%',
      bar: [o.debito, Math.max(0, o.finale)], barLab: ['Today', 'In ten years'], barCol: [GIALLO, AZ] })
  },
  // indice di Borsa pesato per valore di mercato, con tre società: leve "a", "b", "c" (variazione del giorno di ciascuna, in %). Parametri pa, pb, pc: i pesi, che sommano a 100.
  indice: {
    calc: (v, p) => { const ind = (p.pa * v.a + p.pb * v.b + p.pc * v.c) / 100, su = (v.a > 0 ? 1 : 0) + (v.b > 0 ? 1 : 0) + (v.c > 0 ? 1 : 0), media = (v.a + v.b + v.c) / 3; return { ind, ind10: ind * 10, media, su, a: v.a, b: v.b, c: v.c }; },
    view: o => ({ lab: "The index today", big: (o.ind > 0 ? '+' : '') + fmtN(o.ind, 1) + '%', sideLab: 'Stocks up', side: o.su + ' out of 3', side2Lab: 'Simple average of the three', side2: (o.media > 0 ? '+' : '') + fmtN(o.media, 1) + '%', bar: null })
  }
};
// i conti dello stipendio 2026, usati dalle leve "netto", "irpef" e "sconto" (stesse formule di dev/ordine/FONTI_BASI.md)
const STIP = {
  irpef: x => 0.23 * Math.min(x, 28000) + 0.33 * Math.max(0, Math.min(x, 50000) - 28000) + 0.43 * Math.max(0, x - 50000),
  detrLav: r => (r <= 15000 ? 1955 : r <= 28000 ? 1910 + 1190 * (28000 - r) / 13000 : r <= 50000 ? 1910 * (50000 - r) / 22000 : 0) + (r > 25000 && r <= 35000 ? 65 : 0),
  cuneoDetr: r => (r > 20000 && r <= 32000 ? 1000 : r > 32000 && r <= 40000 ? 1000 * (40000 - r) / 8000 : 0),
  cuneoBonus: r => (r > 20000 ? 0 : r * (r <= 8500 ? 0.071 : r <= 15000 ? 0.053 : 0.048)),
  addReg: r => 0.0123 * Math.min(r, 15000) + 0.0158 * Math.max(0, Math.min(r, 28000) - 15000) + 0.0172 * Math.max(0, Math.min(r, 50000) - 28000) + 0.0173 * Math.max(0, r - 50000),
  addCom: r => (r <= 23000 ? 0 : 0.008 * r),
  netto: ral => { const contr = 0.0919 * ral + 0.01 * Math.max(0, ral - 56224), r = ral - contr, lorda = STIP.irpef(r), irpef = Math.max(0, lorda - STIP.detrLav(r) - STIP.cuneoDetr(r)), add = STIP.addReg(r) + STIP.addCom(r);
    return { contr, imp: r, lorda, irpef, add, bonus: STIP.cuneoBonus(r), annuo: ral - contr - irpef - add + STIP.cuneoBonus(r) }; }
};
// "Muovi le leve": i numeri cambiano sotto il dito; si va avanti quando gli obiettivi sono raggiunti, uno alla volta
// La scheda con il risultato resta ferma in alto mentre scorri: su uno schermo basso si vedono insieme il numero e la leva che stai muovendo.
function LeverStep({ st, top, onNext, scrollRef }) {
  const M = LEVERS[st.model];
  const [vals, setVals] = useState(() => { const o = {}; st.sliders.forEach(s => { o[s.id] = s.start; }); return o; });
  const [got, setGot] = useState(0), [hint, setHint] = useState(false);
  const end = useRef(null);
  const o = M.calc(vals, st.params || {}), w = M.view(o), n = st.goals.length, all = got >= n;
  const test = g => g.cond.every(([k, op, x]) => { const y = Math.round(o[k]); return op === '<=' ? y <= x : op === '<' ? y < x : op === '>=' ? y >= x : y > x; });
  const sig = st.sliders.map(s => vals[s.id]).join('|');
  // l'obiettivo vale quando il cursore si ferma lì, non mentre ci passa sopra
  useEffect(() => { if (all || !test(st.goals[got])) return undefined; const t = setTimeout(() => setGot(g => g + 1), 380); return () => clearTimeout(t); }, [sig, got]);
  useEffect(() => { setHint(false); if (all) return undefined; const t = setTimeout(() => setHint(true), 14000); return () => clearTimeout(t); }, [got]);
  useEffect(() => { if (all && end.current && end.current.scrollIntoView) { try { end.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* niente */ } } }, [all]);
  const tot = w.bar ? w.bar[0] + w.bar[1] : 1;
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:24px">
    <div class="o-col" style="gap:6px"><span class="o-lab">Move the sliders</span><h1 class="o-q">${st.t}</h1><${Rich} text=${st.x} cls="sm"/></div>
    <div style="position:sticky;top:0;z-index:2;margin:6px -8px 0;padding:8px;background:#fff;box-shadow:0 8px 8px -2px #fff"><div class="o-card s o-col" style="padding:14px 16px 14px;gap:10px" aria-live="polite">
      <div class="o-col"><span class="o-s">${w.lab}</span><span class="o-bign" style="font-size:38px;line-height:44px">${w.big}</span></div>
      <div class="o-rowf" style="justify-content:space-between;gap:12px;padding-top:8px;border-top:2px solid ${SEP}"><span class="o-s">${w.sideLab}</span><span style="font-size:17px;line-height:22px;font-weight:800;text-align:right">${w.side}</span></div>
      ${w.side2Lab && html`<div class="o-rowf" style="justify-content:space-between;gap:12px;margin-top:-4px"><span class="o-s">${w.side2Lab}</span><span style="font-size:17px;line-height:22px;font-weight:800;text-align:right">${w.side2}</span></div>`}
      ${w.barLab && html`<div class="o-col" style=${{ gap: 4, opacity: w.bar ? 1 : 0.35 }}><div style=${{ display: 'flex', height: 16, border: `2px solid ${INK}`, borderRadius: 99, overflow: 'hidden', background: w.barCol ? w.barCol[1] : AZ }}>
          ${w.bar && html`<i style=${{ width: w.bar[0] / tot * 100 + '%', background: w.barCol ? w.barCol[0] : '#fff', borderRight: w.bar[1] > 0 ? `2px solid ${INK}` : 0 }}></i>`}</div>
        <div class="o-rowf" style="justify-content:space-between"><span class="o-s">${w.barLab[0]}</span><span class="o-s">${w.barLab[1]}</span></div></div>`}
    </div></div>
    <div class="o-col" style="gap:12px;margin-top:8px">${st.sliders.map(s => html`<div key=${s.id} class="o-col" style="gap:2px">
      <div class="o-rowf" style="justify-content:space-between"><span class="o-t">${s.label}</span><span class="o-t" style="font-weight:800">${withUnit(vals[s.id], s.unit, s.dec || 0)}</span></div>
      <${Slider} value=${vals[s.id]} min=${s.min} max=${s.max} step=${s.step} label=${s.label} onChange=${x => setVals(q => Object.assign({}, q, { [s.id]: x }))}/></div>`)}</div>
    <div class="o-col" style="gap:8px;margin-top:16px" aria-live="polite">
      ${st.goals.map((g, k) => k < got ? html`<div key=${k} class="o-goal ok"><span style="width:28px;height:28px;flex:none;display:flex;align-items:center;justify-content:center;background:${INK};border-radius:50%;color:#fff">${PathIco(D_CHECK, 16, 3.4)}</span><span class="o-t" style="font-weight:800">${g.label}</span></div>`
        : k === got ? html`<div key=${k} class="o-goal o-in">${Ico(Target, 26, 2.4)}<div class="o-col o-grow"><span class="o-s" style=${{ color: INK }}>Goal${n > 1 ? ` ${k + 1} of ${n}` : ''}</span><span class="o-t" style="font-weight:800">${g.label}</span>
            ${hint && g.hint && html`<span class="o-s o-in" style=${{ color: INK, marginTop: 4 }}>${g.hint}</span>`}</div></div>` : null)}
    </div>
    ${all && html`<div ref=${end} class="o-in o-note" style="margin-top:12px">${st.after}</div>`}
  </div>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${html`<${Btn} cls="lg" disabled=${!all} onClick=${() => onNext()}>Continue<//>`}>${body}<//>`;
}

// "Metti al posto giusto": una voce alla volta, da toccare nel contenitore giusto. Se sbagli, sotto compare il perché.
function BucketStep({ st, top, onNext, scrollRef }) {
  const order = useMemo(() => K.flShuffle(st.items.map((x, i) => i)), [st]);
  const [n, setN] = useState(0), [put, setPut] = useState([]), [miss, setMiss] = useState(0), [missed, setMissed] = useState(false), [flash, setFlash] = useState(null), [why, setWhy] = useState(null), [sh, setSh] = useState(0);
  const N = order.length, cur = n < N ? st.items[order[n]] : null, nb = st.buckets.length;
  const tap = b => {
    if (!cur || (flash && flash.ok)) return;
    if (b === cur[1]) { setFlash({ b, ok: true }); setWhy(null); setTimeout(() => { setFlash(null); setPut(p => p.concat(order[n])); setMissed(false); setN(x => x + 1); }, 240); }
    else { if (!missed) { setMissed(true); setMiss(m => m + 1); } setWhy(cur[2] || `It doesn't go in “${st.buckets[b]}”.`); setSh(x => x + 1); setFlash({ b, ok: false }); setTimeout(() => setFlash(f => (f && !f.ok ? null : f)), 420); }
  };
  const card = { alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 16, minHeight: 104, padding: '14px 16px', border: `2.5px solid ${INK}`, borderRadius: 22, textAlign: 'center' };
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:24px">
    <div class="o-col" style="gap:6px"><span class="o-lab">Put each one in its place</span><h1 class="o-q">${st.t}</h1></div>
    ${cur ? html`<div key=${n + '-' + sh} class=${'o-col ' + (missed ? 'o-shake' : 'o-in')} style=${Object.assign({ background: T_AZ }, card)}>
        <span class="o-s" style=${{ color: INK }}>${n + 1} of ${N}</span><span style="font-size:20px;line-height:26px;font-weight:800;text-wrap:balance">${cur[0]}</span></div>`
      : html`<div class="o-col o-pop" style=${Object.assign({ background: MENTA }, card)}><span style="font-size:22px;line-height:28px;font-weight:800">All sorted</span><span class="o-s" style=${{ color: INK }}>${N - miss} of ${N} on the first try</span></div>`}
    <div aria-live="polite" style=${Object.assign({ minHeight: 44, marginTop: 10, fontSize: 14, lineHeight: '20px', fontWeight: 700 }, why ? { padding: '10px 14px', background: T_ROSA, borderRadius: 14, color: INK } : { padding: '10px 2px', color: MUT })}><${Rich} text=${why || (cur ? 'Tap the right bucket.' : (st.after || ''))} cls="sm" style=${{ fontSize: 'inherit', lineHeight: 'inherit', fontWeight: 'inherit', color: 'inherit' }}/></div>
    <div style=${{ display: 'grid', gridTemplateColumns: `repeat(${nb}, minmax(0, 1fr))`, gap: 10, marginTop: 8 }}>
      ${st.buckets.map((name, b) => html`<button key=${b} type="button" class=${'o-bucket' + (flash && flash.b === b ? (flash.ok ? ' ok' : ' ko') : '')} disabled=${!cur} aria-label=${'Put in: ' + name} onClick=${() => tap(b)}>
        <span style=${{ fontSize: nb > 2 ? 15 : 16, lineHeight: '20px', fontWeight: 800, textAlign: 'center', padding: '2px 0 4px' }}>${name}</span>
        ${put.filter(i => st.items[i][1] === b).map(i => html`<span key=${i} class="o-chip2 o-pop" style=${nb > 2 ? { padding: '5px 6px', fontSize: 12, lineHeight: '16px' } : null}>${st.items[i][0]}</span>`)}</button>`)}
    </div>
  </div>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${html`<${Btn} cls="lg" disabled=${!!cur} onClick=${() => onNext()}>Continue<//>`}>${body}<//>`;
}

// "Metti in ordine": le voci sono mescolate, si toccano dalla prima all'ultima
function OrderStep({ st, top, onNext, scrollRef }) {
  const pool = useMemo(() => { const id = st.items.map((x, i) => i); let p = K.flShuffle(id), g = 0; while (p.every((x, i) => x === i) && g++ < 8) p = K.flShuffle(id); return p; }, [st]);
  const [n, setN] = useState(0), [bad, setBad] = useState(null);
  const N = st.items.length, done = n >= N;
  const tap = i => { if (i === n) setN(n + 1); else { setBad(i); setTimeout(() => setBad(null), 420); } };
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:24px">
    <div class="o-col" style="gap:6px"><span class="o-lab">Put in order</span><h1 class="o-q">${st.t}</h1><p class="o-lab">${st.x || 'Tap the items from first to last.'}</p></div>
    <div class="o-col" style="gap:8px;margin-top:16px">${st.items.map((t, k) => html`<div key=${k} class=${'o-rowf' + (k === n - 1 ? ' o-pop' : '')} style=${{ gap: 12, minHeight: 54, padding: '8px 12px', borderRadius: 16, border: k < n ? `2.5px solid ${INK}` : `2.5px dashed ${k === n ? INK : DIM}`, background: k < n ? MENTA : 'transparent' }}>
      <span style=${{ width: 30, height: 30, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: k < n ? INK : 'transparent', border: k < n ? 0 : `2px solid ${k === n ? INK : DIM}`, color: k < n ? '#fff' : k === n ? INK : DIMT, fontSize: 14, fontWeight: 800 }}>${k + 1}</span>
      <span class="o-t" style=${{ fontWeight: 800 }}>${k < n ? t : ''}</span></div>`)}</div>
    ${!done && html`<div class="o-col" style="gap:10px;margin-top:18px" aria-label="Items to sort">${pool.filter(i => i >= n).map(i => html`<button key=${i} type="button" class=${'o-opt' + (bad === i ? ' ko o-shake' : '')} onClick=${() => tap(i)}><span class="x" style="text-align:center">${st.items[i]}</span></button>`)}</div>`}
    ${done && st.after && html`<div class="o-in o-note" style="margin-top:16px">${st.after}</div>`}
  </div>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${html`<${Btn} cls="lg" disabled=${!done} onClick=${() => onNext()}>Continue<//>`}>${body}<//>`;
}

// "Calcola tu": il numero si scrive con il tastierino; vale come una domanda (punti e conteggio delle risposte giuste)
function NumStep({ st, l, top, onNext, repeat, scrollRef }) {
  const [s, setS] = useState(''), [fb, setFb] = useState(null);
  const dec = st.dec || 0;
  const press = k => { if (fb) return; setS(x => k === 'del' ? x.slice(0, -1) : k === DEC ? (dec && x && x.indexOf(DEC) < 0 ? x + DEC : x)
    : (x.replace(DEC, '').length >= 8 || (x.indexOf(DEC) >= 0 && x.split(DEC)[1].length >= dec)) ? x : x === '0' ? k : x + k); };
  const val = s ? parseFloat(s.replace(DEC, '.')) : NaN;
  const shown = s ? grp(s.split(DEC)[0]) + (s.indexOf(DEC) >= 0 ? DEC + (s.split(DEC)[1] || '') : '') : '';
  const ok = fb === 'ok', ansDec = (String(st.ans).split('.')[1] || '').length;
  const q = { key: l.key + '~' + st.n, exp: ok ? st.exp : `The answer is **${withUnit(st.ans, st.unit, ansDec)}**.\n\n${st.exp || ''}` };
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', dec ? DEC : null, '0', 'del'];
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:20px"><div class="o-col" style="gap:6px"><span class="o-lab">Calculate it yourself</span><${Rich} text=${st.q} cls="q"/></div></div>`;
  const foot = html`<div class="o-col" style="gap:10px">
    <div class="o-numd" aria-live="polite" aria-label=${s ? `You wrote ${shown} ${st.unit}` : 'Type the number'}><span style=${{ color: s ? INK : DIM }}>${shown || '?'}</span><span style="font-size:22px;line-height:28px;font-weight:800">${st.unit}</span></div>
    <div class="o-keys">${keys.map((k, j) => k == null ? html`<span key=${j}></span>` : html`<button key=${j} type="button" class="o-key" aria-label=${k === 'del' ? 'Delete' : k === DEC ? 'Decimal point' : k} onClick=${() => press(k)}>${k === 'del' ? PathIco('M20 6H9l-6 6 6 6h11zM12 10l4 4M16 10l-4 4', 24, 2.2) : k}</button>`)}</div>
    <${Btn} cls="lg" disabled=${isNaN(val) || !!fb} onClick=${() => setFb(Math.abs(val - st.ans) <= (st.tol || 0) + 1e-9 ? 'ok' : 'ko')}>Check<//></div>`;
  const over = fb ? html`<${FeedbackSheet} ok=${ok} q=${q} xp=${repeat ? 5 : 10} onNext=${() => onNext({ ok })}/>` : null;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${foot} over=${over}>${body}<//>`;
}
const ISTEPS = { guess: GuessStep, lever: LeverStep, bucket: BucketStep, order: OrderStep, num: NumStep };

// =====================================================================================================
// NOTIZIE: il nastro in home, la pagina dell'articolo e l'archivio di tutti gli articoli.
// I testi non stanno nel codice: notizie.json ha le notizie del giorno, notizie/indice.json l'elenco di tutte,
// notizie/AAAA-MM.json i testi mese per mese. Per aggiornare si cambiano quei file (vedi dev/NOTIZIE.md).
// =====================================================================================================
const NEWS = { data: '', items: [], req: null, subs: new Set(), idx: null, idxReq: null, idxErr: false, mesi: {}, mesiReq: {} };
const newsPing = () => NEWS.subs.forEach(f => f());
const newsJson = u => fetch(u, { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null));
const newsOk = a => a && a.id && a.titolo && Array.isArray(a.corpo);
function newsLoad() {
  if (NEWS.req || typeof fetch === 'undefined') return;
  NEWS.req = newsJson('./notizie.json').then(j => {
    NEWS.data = (j && typeof j.data === 'string' && j.data) || '';
    NEWS.items = j && Array.isArray(j.articoli) ? j.articoli.filter(newsOk).map(a => (a.data ? a : Object.assign({}, a, { data: NEWS.data }))) : [];
    newsPing();
  }).catch(() => { NEWS.req = null; });   // senza rete e senza copia salvata: si riprova alla prossima apertura
}
function newsIndexLoad() {
  if (NEWS.idxReq || typeof fetch === 'undefined') return;
  NEWS.idxErr = false;
  NEWS.idxReq = newsJson('./notizie/indice.json').then(j => { NEWS.idx = j && Array.isArray(j.articoli) ? j.articoli.filter(a => a && a.id && a.data) : []; newsPing(); })
    .catch(() => { NEWS.idxReq = null; NEWS.idxErr = true; newsPing(); });
}
// mesi[m]: undefined = non ancora chiesto, null = non arrivato, lista = arrivato
function newsMonthLoad(m) {
  if (!/^\d{4}-\d{2}$/.test(m) || NEWS.mesiReq[m] || typeof fetch === 'undefined') return;
  NEWS.mesiReq[m] = newsJson(`./notizie/${m}.json`).then(j => { NEWS.mesi[m] = j && Array.isArray(j.articoli) ? j.articoli.filter(newsOk) : []; newsPing(); })
    .catch(() => { delete NEWS.mesiReq[m]; NEWS.mesi[m] = null; newsPing(); });
}
const newsMonthOf = id => String(id || '').slice(0, 7);   // gli id cominciano con la data: 2026-11-10-bollette
const newsFind = id => NEWS.items.find(x => x.id === id) || (NEWS.mesi[newsMonthOf(id)] || []).find(x => x.id === id) || null;
function useNews() {
  const [, f] = useState(0);
  useEffect(() => { const g = () => f(x => x + 1); NEWS.subs.add(g); newsLoad(); return () => { NEWS.subs.delete(g); }; }, []);
  return NEWS;
}
// articoli già letti: restano segnati nell'archivio
const NEWS_READ = 'fl2_news_letti';
let newsReadCache = null;
const newsReadSet = () => newsReadCache || (newsReadCache = new Set((v => (Array.isArray(v) ? v : []))(LS.get(NEWS_READ, []))));
function newsMarkRead(id) { const s = newsReadSet(); if (!id || s.has(id)) return; s.add(id); LS.set(NEWS_READ, Array.from(s).slice(-600)); newsPing(); }

const NEWS_MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
const newsDate = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
// sul nastro c'è scritto "Oggi" solo se le notizie sono davvero di oggi, altrimenti il giorno
const newsDayShort = s => { if (s && s === dayKey()) return 'Today'; const d = newsDate(s); return d ? `${d.getDate()} ${NEWS_MESI[d.getMonth()]}` : 'Notizie'; };
const newsCap = t => t.charAt(0).toUpperCase() + t.slice(1);
const newsDayLong = s => { const d = newsDate(s); return d ? newsCap(d.toLocaleDateString(LOC, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })) : ''; };
const newsDayName = s => { const d = newsDate(s); return d ? d.toLocaleDateString(LOC, { weekday: 'long', day: 'numeric', month: 'long' }) : ''; };
const newsDayHead = s => (s === dayKey() ? 'Oggi · ' + newsDayName(s) : s === dayKey(new Date(Date.now() - DAY)) ? 'Ieri · ' + newsDayName(s) : newsCap(newsDayName(s)));
const newsWords = a => [a.sommario, ...(a.breve || []), ...a.corpo.reduce((t, s) => t.concat(s.h, s.p || []), []), a.perche].join(' ').split(/\s+/).filter(Boolean).length;
const newsMinutes = a => Math.max(1, Math.round(newsWords(a) / 180));
const D_ARROW = 'M5 12h14M13 6l6 6-6 6', D_OUT = 'M14 5h5v5M19 5l-8 8M11 7H6v11h11v-5';
const D_NEWS = 'M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M7.5 9h6M7.5 12.5h6M7.5 16h4';
const newsLab = (t, w = 600) => html`<span class="o-mono" style=${{ fontSize: 11, lineHeight: '14px', fontWeight: w, letterSpacing: '.08em', textTransform: 'uppercase' }}>${t}</span>`;

// Il nastro: i titoli del giorno che scorrono sotto la lezione. Ogni titolo apre il suo articolo, l'etichetta del giorno apre l'archivio.
function NewsTicker({ nav }) {
  const n = useNews();
  if (LANG === 'en') return html`<div style="height:24px;flex:none"></div>`;   // le notizie sono in italiano e sull'Italia
  if (!n.items.length) return html`<div style="height:24px;flex:none"></div>`;
  const lab = newsDayShort(n.data), chars = n.items.reduce((t, a) => t + String(a.nastro || a.titolo).length + 12, 0);
  const star = html`<svg width="14" height="14" viewBox="0 0 24 24" fill=${INK} aria-hidden="true" style="flex:none"><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"/></svg>`;
  // due gruppi uguali uno dopo l'altro: quando il primo è uscito tutto, il giro ricomincia senza salti
  const group = k => html`<span class="o-nt-g" key=${k} aria-hidden=${k ? 'true' : undefined}>
    <button type="button" class="o-nt-chip" tabIndex=${k ? -1 : undefined} aria-label="Tutte le notizie" onClick=${() => nav.go('notizie')}>${lab}</button>
    ${n.items.map(a => html`<button type="button" key=${a.id} class="o-nt-i" tabIndex=${k ? -1 : undefined} onClick=${() => nav.go('articolo', { id: a.id })}>
      <span>${a.nastro || a.titolo}</span><span class="o-nt-l">Leggi${PathIco(D_ARROW, 14, 3)}</span>${star}</button>`)}</span>`;
  // il nastro è inclinato e più largo dello schermo: il riquadro esterno taglia quello che sporge, così la pagina non scorre di lato
  return html`<div class="o-ntw"><div class="o-nt" role="region" aria-label=${lab === 'Today' ? 'Le notizie di oggi' : 'Le ultime notizie'}>
    <div class="o-nt-run" style=${{ animationDuration: Math.max(22, Math.round(chars * 0.34)) + 's' }}>${group(0)}${group(1)}</div></div></div>`;
}
// la riga che dalla home porta all'archivio (compare solo se ci sono notizie)
function NewsHomeRow({ nav }) {
  const n = useNews();
  if (LANG === 'en' || !n.items.length) return null;
  return html`<${Row} icon=${PathIco(D_NEWS, 22, 2.2)} ibg=${GIALLO} title="Tutte le notizie" sub="L'archivio, giorno per giorno" chev=${true} onClick=${() => nav.go('notizie')}/>`;
}

function NewsTitle({ a }) {
  const t = String(a.titolo), e = a.evid && t.indexOf(a.evid) >= 0 ? String(a.evid) : '';
  if (!e) return t;
  const i = t.indexOf(e);
  return html`${t.slice(0, i)}<span class="o-hl">${e}</span>${t.slice(i + e.length)}`;
}
const newsNumSize = s => { const L = String(s).length; return L <= 4 ? 96 : L === 5 ? 88 : L === 6 ? 76 : L === 7 ? 66 : 54; };

// `from: 'archivio'` quando l'articolo è stato aperto dall'elenco: "Tutte le notizie" allora torna indietro invece di aprirne un altro
function ArticleScreen({ nav, id, from }) {
  const n = useNews(), a = newsFind(id), m = newsMonthOf(id);
  termStore.on = true;   // le parole in grassetto che stanno nel glossario si toccano, come nelle lezioni
  useEffect(() => () => { termStore.on = false; termOpen(null); }, []);
  useEffect(() => { if (!newsFind(id)) newsMonthLoad(m); }, [id, n.items.length]);   // articolo dei giorni scorsi: serve il file del suo mese
  useEffect(() => { if (a) newsMarkRead(a.id); }, [a && a.id]);
  const back = html`<${IBtn} d=${D_BACK} onClick=${nav.back} label="Back"/>`;
  if (!a) {
    const failed = NEWS.mesi[m] === null, gone = Array.isArray(NEWS.mesi[m]);
    return html`<div class="o-scr"><div class="o-top o-pad"><div class="o-rowf" style="height:44px">${back}</div>
      <p class="o-body o-mut" style="margin-top:24px">${failed ? 'Non riesco a caricare questa notizia. Controlla la connessione.' : gone ? 'Questa notizia non è più disponibile.' : 'Sto caricando la notizia.'}</p>
      ${failed && html`<div style="margin-top:14px"><${Btn} cls="sm" bg=${GIALLO} onClick=${() => newsMonthLoad(m)}>Try again<//></div>`}</div></div>`;
  }
  const day = a.data || n.data, min = newsMinutes(a);
  const pool = n.items.some(x => x.id === a.id) ? n.items : (NEWS.mesi[m] || []);
  const altre = pool.filter(x => x.id !== a.id && (x.data || n.data) === day);
  const allNews = () => (from === 'archivio' ? nav.back() : nav.replace('notizie'));
  return html`<div class="o-scr"><div class="o-scroll"><div class="o-top o-pad o-col" style="padding-bottom:max(28px,calc(env(safe-area-inset-bottom) + 16px))">
    <div class="o-rowf" style="height:44px;justify-content:space-between;gap:12px">${back}${newsLab(`${a.cat || 'Notizie'} · ${min} min di lettura`)}<span aria-hidden="true" style="width:44px;flex:none"></span></div>

    <div style="position:relative;margin-top:56px">
      <${Rally} pose="saluta" w=${138} alt="" style="position:absolute;right:14px;top:-68px"/>
      <div class="o-col" style="position:relative;padding:16px 20px 18px;background:${GIALLO};border:2.5px solid ${INK};border-radius:28px;box-shadow:5px 5px 0 ${INK}">
        ${newsLab(newsDayLong(day) || 'Notizie')}
        <div class="o-rowf" style="margin-top:4px;align-items:flex-end;flex-wrap:wrap;gap:4px 14px">
          <span style=${{ fontSize: newsNumSize(a.numero || ''), lineHeight: '92px', fontWeight: 800, letterSpacing: '-.045em', whiteSpace: 'nowrap' }}>${a.numero}</span>
          ${a.nota && html`<span style="margin-bottom:14px"><${Pill}>${a.nota}<//></span>`}
        </div>
        ${a.didascalia && html`<span style="margin-top:6px;font-size:15px;line-height:20px;font-weight:700">${a.didascalia}</span>`}
      </div>
    </div>

    <h1 style="margin-top:30px;font-size:32px;line-height:37px;font-weight:800;letter-spacing:-.025em;overflow-wrap:anywhere"><${NewsTitle} a=${a}/></h1>
    ${a.sommario && html`<p class="o-mut" style="margin-top:12px;font-size:18px;line-height:26px;font-weight:600">${a.sommario}</p>`}
    <div class="o-rowf" style="margin-top:16px;gap:10px">
      <span aria-hidden="true" style="position:relative;width:44px;height:44px;flex:none;overflow:hidden;background:${AZ};border:2px solid ${INK};border-radius:50%"><${Rally} pose="scrive" w=${104} style="position:absolute;left:-31px;top:-16px;max-width:none"/></span>
      <span class="o-col"><span style="font-size:15px;line-height:20px;font-weight:800">A cura di FinLearn</span><span class="o-s">${newsDayLong(day)}${a.fonti && a.fonti.length ? ' · fonti in fondo' : ''}</span></span>
    </div>

    ${a.breve && a.breve.length > 0 && html`<div class="o-col" style="margin-top:22px;gap:10px;padding:14px 16px 16px;background:${T_GIALLO};border:2.5px solid ${INK};border-radius:20px">
      ${newsLab('In short', 700)}
      <ul class="o-col" style="gap:8px;list-style:none">${a.breve.map((t, k) => html`<li key=${k} class="o-rowf" style="gap:10px;align-items:flex-start;font-size:15.5px;line-height:22px;font-weight:700">
        <span aria-hidden="true" style="width:8px;height:8px;flex:none;margin-top:7px;background:${INK};border-radius:3px"></span><span>${t}</span></li>`)}</ul></div>`}

    <div class="o-col" style="margin-top:14px;gap:16px">
      ${a.corpo.map((s, k) => html`<${React.Fragment} key=${k}>
        ${s.h && html`<div class="o-col" style="margin-top:14px;gap:10px"><span aria-hidden="true" style="width:34px;height:7px;background:${GIALLO};border:2px solid ${INK};border-radius:99px"></span>
          <h2 style="font-size:24px;line-height:29px;font-weight:800;letter-spacing:-.02em">${s.h}</h2></div>`}
        ${(s.p || []).map((t, j) => html`<${Rich} key=${j} text=${t} cls="art"/>`)}<//>`)}

      ${a.perche && html`<div class="o-col" style="margin-top:8px;gap:4px;padding:12px 16px 14px;background:${T_GIALLO};border-radius:16px">
        ${newsLab('Perché ti riguarda', 700)}<span style="font-size:16px;line-height:23px;font-weight:700">${a.perche}</span></div>`}

      ${a.fonti && a.fonti.length > 0 && html`<div class="o-col" style="margin-top:10px">
        <div aria-hidden="true" style="height:3px;background:${INK};margin-bottom:14px"></div>
        ${newsLab('Fonti', 700)}
        ${a.fonti.map((f, k) => html`<a key=${k} class="o-art-src" href=${f.url} target="_blank" rel="noopener noreferrer">
          <span class="o-grow o-col" style="gap:1px"><span class="o-t">${f.nome}</span>${f.titolo && html`<span class="o-s">${f.titolo}</span>`}</span>
          <span style="flex:none;margin-top:2px">${PathIco(D_OUT, 18, 2.4)}</span></a>`)}
        <p class="o-s" style="margin-top:12px">Sintesi preparata con l'aiuto dell'intelligenza artificiale a partire dalle fonti qui sopra. Serve a capire le notizie, non dice come investire.</p>
      </div>`}

      <div class="o-col" style="margin-top:10px">
        ${altre.length > 0 && html`<h2 class="o-h2" style="margin-bottom:4px">Le altre notizie del giorno</h2>`}
        ${altre.map(x => html`<${Row} key=${x.id} icon=${PathIco(D_NEWS, 22, 2.2)} ibg=${GIALLO} title=${x.nastro || x.titolo} sub=${`${x.cat || 'Notizie'} · ${newsMinutes(x)} min`} chev=${true}
          onClick=${() => nav.replace('articolo', { id: x.id, from })}/>`)}
        <${Row} icon=${PathIco(D_NEWS, 22, 2.2)} title="Tutte le notizie" sub="L'archivio, giorno per giorno" chev=${true} last=${true} onClick=${allNews}/>
      </div>
    </div>
  </div></div></div>`;
}

// L'archivio: tutti gli articoli, dal più recente, divisi per giorno. Quelli già letti restano segnati.
function NewsArchiveScreen({ nav }) {
  const n = useNews();
  useEffect(() => { newsIndexLoad(); }, []);
  const [days, setDays] = useState(10);
  const list = n.idx, read = newsReadSet(), groups = [];
  (list || []).forEach(a => { const g = groups[groups.length - 1]; if (g && g.day === a.data) g.items.push(a); else groups.push({ day: a.data, items: [a] }); });
  const tot = (list || []).length, letti = (list || []).filter(a => read.has(a.id)).length;
  const pill = !list ? 'Un attimo' : tot ? `${letti} of ${tot} correct` : 'Ancora vuoto';
  const ini = c => String(c || 'N').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const okIco = html`<span role="img" aria-label="Già letta" style="width:30px;height:30px;flex:none;margin-right:4px;display:flex;align-items:center;justify-content:center;background:${MENTA};border:2px solid ${INK};border-radius:50%">${PathIco(D_CHECK, 15, 3.2)}</span>`;
  return html`<${Room} color=${GIALLO} tabs=${false} headH=${176}
    rally=${html`<${Rally} pose="telefono" alt="" style="position:absolute;right:-14px;top:calc(var(--otop) + 27px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Back"/></div>
      <div class="o-col" style="align-items:flex-start;gap:12px;margin-top:22px;max-width:200px"><h1 class="o-h1m">Tutte le notizie</h1><${Pill}>${pill}<//></div>`}>
    <${Sheet} pad=${false} style=${{ paddingTop: 6, paddingBottom: 'max(28px, calc(env(safe-area-inset-bottom) + 16px))' }}>
      ${!list && html`<p class="o-body o-mut" style="margin-top:18px">${n.idxErr ? 'Non riesco a caricare le notizie. Controlla la connessione.' : 'Sto caricando le notizie.'}</p>`}
      ${!list && n.idxErr && html`<div style="margin-top:14px"><${Btn} cls="sm" bg=${GIALLO} onClick=${newsIndexLoad}>Try again<//></div>`}
      ${list && !tot && html`<p class="o-body o-mut" style="margin-top:18px">Qui trovi tutti gli articoli, giorno per giorno. Il primo arriva presto.</p>`}
      ${groups.slice(0, days).map(g => html`<div key=${g.day} class="o-col" style="margin-top:18px">
        <div style="margin-bottom:2px">${newsLab(newsDayHead(g.day), 700)}</div>
        ${g.items.map((a, k) => { const r = read.has(a.id); return html`<${Row} key=${a.id} icon=${html`<span style="font-size:15px">${ini(a.cat)}</span>`} ibg=${r ? '#fff' : GIALLO} title=${a.titolo || a.nastro}
          sub=${`${a.cat || 'Notizie'} · ${a.min || 1} min`} right=${r ? okIco : null} chev=${!r} last=${k === g.items.length - 1} onClick=${() => nav.go('articolo', { id: a.id, from: 'archivio' })}/>`; })}
      </div>`)}
      ${groups.length > days && html`<div style="margin-top:18px"><${Btn} cls="sm flat" bg="#fff" onClick=${() => setDays(d => d + 10)}>Mostra i giorni prima<//></div>`}
    <//>
  <//>`;
}

// =====================================================================================================
// ALLENATI e TEST
// =====================================================================================================
const fmtClock = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const fmtSpan = s => s < 60 ? `${Math.round(s)} s` : `${Math.floor(s / 60)} min${Math.round(s % 60) ? ' ' + Math.round(s % 60) + ' s' : ''}`;
const AllenaSwitch = ({ on, nav }) => html`<div role="tablist" style="display:inline-flex;padding:3px;background:#fff;border:2px solid ${INK};border-radius:999px">
  ${[['allenati', 'Practice'], ['test', 'Test']].map(([id, t]) => html`<button key=${id} type="button" role="tab" aria-selected=${on === id ? 'true' : 'false'} onClick=${() => nav.sub(id)}
    style=${{ height: 30, padding: '0 14px', borderRadius: 999, fontSize: 14, fontWeight: 800, background: on === id ? INK : 'transparent', color: on === id ? '#fff' : INK }}>${t}</button>`)}</div>`;
// miniatura di una figurina (album, allenati, profilo)
function Sticker({ l, state, w = 92, onClick, big }) {
  const emoji = lessonEmoji(l), miss = state === 'manca', fade = state === 'sbiadisce', gold = state === 'dorata';
  const tile = miss ? 'transparent' : gold ? GIALLO : fade ? T_GR : (l.course.id === 'basi' ? [AZ, GIALLO, MENTA, PESCA, LILLA][l.course.lessons.indexOf(l) % 5] : [AZ, MENTA, PESCA, LILLA, ROSA][(l.section.num || 0) % 5]);
  const inner = html`<span class="o-col" style=${{ width: w, gap: 6, padding: miss ? 6 : '6px 6px 8px', background: miss ? 'transparent' : '#fff', border: miss ? `2px dashed ${INK}` : `2.5px solid ${fade ? '#8A93A0' : INK}`, borderRadius: 16,
      boxShadow: miss || fade ? 'none' : `3px 3px 0 ${INK}`, transform: miss || fade ? 'none' : `rotate(${[-2, 2, -1, 1][(l.key.length + l.key.charCodeAt(l.key.length - 1)) % 4]}deg)`, color: fade ? DIMT : INK }}>
    <span style=${{ height: big ? 64 : 52, display: 'flex', alignItems: 'center', justifyContent: 'center', background: tile, border: miss ? `2px dashed ${INK}` : `2px solid ${fade ? '#8A93A0' : INK}`, borderRadius: 10, fontSize: emoji && !miss ? 26 : 20, lineHeight: 1, fontWeight: 800, filter: fade ? 'grayscale(1)' : 'none', opacity: fade ? .7 : 1 }}>${miss ? '?' : (emoji || stickerSym(l))}${gold && html`<span style="font-size:12px;margin-left:3px">★</span>`}</span>
    <span style="font-size:12px;line-height:15px;font-weight:700;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:30px;text-align:left;overflow-wrap:anywhere">${l.title}</span></span>`;
  return onClick ? html`<button type="button" onClick=${onClick} aria-label=${`${l.title}: ${({ manca: 'missing', viva: 'alive', sbiadisce: 'fading', dorata: 'golden' })[state] || state}`}>${inner}</button>` : inner;
}

function AllenatiScreen({ nav }) {
  useS2(); useTick();
  const album = K.albumLoad(), now = Date.now();
  const due = dueLessons(), have = Object.keys(album).length, streak = streakDays();
  const cur = currentCourse();
  const weak = topicScores(cur)[0];
  const mins = Math.max(2, Math.round(due.reduce((n, l) => n + (lessonQuestions(l).length ? 1.5 : 0.7), 0)));
  return html`<${Room} color=${MENTA} tab="allenati" go=${nav.tab}
    rally=${html`<${Rally} pose="allena" alt="Rally with a headband" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div style="margin-top:-2px"><${AllenaSwitch} on="allenati" nav=${nav}/></div>
      <div class="o-col" style="align-items:flex-start;gap:14px;margin-top:10px;max-width:210px"><h1 class="o-h1">Practice</h1><${Pill}>${streak > 0 ? `${plural(streak, 'day', 'days')} in a row` : 'Start today'}<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px">
      ${due.length > 0 ? html`<div style="display:flex;gap:10px;justify-content:center">${due.slice(0, 3).map(l => html`<${Sticker} key=${l.key} l=${l} state="sbiadisce" w=${96}/>`)}</div>
          <div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">${due.length === 1 ? 'One sticker is fading' : `${due.length} stickers are fading`}</div><div class="o-body o-mut">${due.length === 1 ? 'You can refresh it' : 'You can refresh them'} in about ${plural(mins, 'minute', 'minutes')}.</div></div>
          <${Btn} bg=${MENTA} onClick=${() => nav.go('pratica', { mode: 'ravviva' })}>${due.length === 1 ? 'Refresh the sticker' : 'Refresh the stickers'}<//>`
        : have > 0 ? html`<div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">All your stickers are alive</div><div class="o-body o-mut">No reviews due. If you like, stay sharp with a mixed quiz.</div></div>
          <${Btn} bg=${MENTA} onClick=${() => nav.go('pratica', { mode: 'mix' })}>Take a mixed quiz<//>`
        : html`<div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">Review what you learn here</div><div class="o-body o-mut">Every finished lesson becomes a sticker. If you don't review it, it fades, and you can bring it back from here.</div></div>
          <${Btn} bg=${MENTA} onClick=${() => nav.tab('home')}>Go to lessons<//>`}
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <h2 class="o-h2" style="margin-bottom:4px">Or pick your own</h2>
      <${Row} icon=${PathIco(D_TABS.allenati, 22, 2.4)} title="Mixed quiz" sub=${misCourses().length > 1 ? '10 questions from your paths' : '10 questions from your path'} chev=${true} onClick=${() => nav.go('pratica', { mode: 'mix' })}/>
      <${Row} icon=${PathIco(D_SENZAFINE, 22, 2.4)} title="Endless run" sub=${serieStato().best > 0 ? `Endless questions, your record is ${serieStato().best}` : 'Endless questions: the third mistake ends it'} chev=${true} onClick=${() => nav.go('pratica', { mode: 'serie' })}/>
      <${Row} icon=${Ico(Target, 22)} title="Weak spots" sub=${weak ? weak.name : 'Rally finds them from your answers'} chev=${true} onClick=${() => nav.go('deboli')}/>
      <${Row} icon=${Ico(Compass, 22)} title="Level test" sub="5 questions to see where you stand" chev=${true} last=${true} onClick=${() => nav.go('testInizio', { kind: 'level', course: cur.id })}/>
    <//>
  <//>`;
}

// sezione consigliata per la prossima verifica: quella con più lezioni fatte tra le non ancora superate
function suggestedTest(c) {
  const tests = s2get().tests; let best = null;
  misUnits(c).forEach(u => u.sections.forEach(sec => { if (allQuestions(sec.lessons).length < 3) return; const t = tests['unit:' + sec.id]; if (t && t.passedEver) return; const d = doneCount(sec.lessons); if (!best || d > best.d) best = { sec, d }; }));
  return best ? best.sec : null;
}
const testableSections = c => misUnits(c).flatMap(u => u.sections).filter(sec => allQuestions(sec.lessons).length >= 3);
function TestScreen({ nav }) {
  useS2();
  const [list, setList] = useState(false);
  const c = currentCourse(), tests = s2get().tests, last = tests._last;
  const sug = suggestedTest(c), secs = testableSections(c), passed = secs.filter(x => tests['unit:' + x.id] && tests['unit:' + x.id].passedEver).length;
  const qn = sug ? Math.min(10, allQuestions(sug.lessons).length) : 0;
  return html`<${Room} color=${MENTA} tab="allenati" go=${nav.tab} headH=${176}
    rally=${html`<${Rally} pose="allena2" alt="Rally ready for the test" style="position:absolute;right:-10px;top:calc(var(--otop) + 13px)"/>`}
    head=${html`<div style="margin-top:-2px"><${AllenaSwitch} on="test" nav=${nav}/></div>
      <div class="o-col" style="align-items:flex-start;gap:14px;margin-top:14px;max-width:200px"><h1 class="o-h1m">Test yourself</h1><${Pill}>${last ? `Last test: ${last.ok} of ${last.n}` : 'No tests yet'}<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px">
      ${sug ? html`<div class="o-col" style="gap:3px"><span class="o-s">Recommended now</span><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em;overflow-wrap:anywhere">Unit test: ${sug.name}</div>
          <div class="o-body o-mut">${misName(c)}, ${qn} questions, ${Math.round(qn * c.pace / 60)} minutes</div></div>
        <div class="o-rowf" style="gap:12px;padding:10px 14px;background:${T_GIALLO};border-radius:14px"><span style="width:28px;height:28px;flex:none;display:flex;align-items:center;justify-content:center;background:${GIALLO};border:2px solid ${INK};border-radius:9px">${PathIco(D_STAR, 16, 2, INK, INK)}</span><span class="o-t" style="font-size:15px">If you pass, your stickers turn golden.</span></div>
        <${Btn} bg=${MENTA} onClick=${() => nav.go('testInizio', { kind: 'unit', course: c.id, section: sug.id })}>Start the unit test<//>`
      : html`<div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800">You've passed all the unit tests</div><div class="o-body o-mut">Stay sharp with the mixed quiz, in Practice.</div></div>`}
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <h2 class="o-h2" style="margin-bottom:4px">All tests</h2>
      <${Row} icon=${Ico(Compass, 22)} title="Level test" sub="5 questions to see where you stand" chev=${true} onClick=${() => nav.go('testInizio', { kind: 'level', course: c.id })}/>
      <${Row} icon=${Ico(Flag, 22)} title="Unit tests" sub=${`${misName(c)}: ${passed} of ${secs.length} passed`} chev=${true} last=${true} onClick=${() => setList(true)}/>
    <//>
    ${list && html`<${BSheet} onClose=${() => setList(false)} label="Unit tests">
      <h2 class="o-big" style="margin-bottom:6px;flex:none">Unit tests</h2>
      <div class="o-scroll" style="flex:0 1 auto;max-height:64vh">${secs.map((sec, k) => { const t = tests['unit:' + sec.id]; return html`<${Row} key=${sec.id} icon=${t && t.passedEver ? PathIco(D_STAR, 20, 2, INK, INK) : (sec.num || k + 1)} ibg=${t && t.passedEver ? GIALLO : null}
        title=${sec.name} sub=${t ? `${t.passedEver ? 'Passed' : 'Not passed yet'}, best ${t.best} of ${t.n}` : `${Math.min(10, allQuestions(sec.lessons).length)} questions`} chev=${true} last=${k === secs.length - 1} onClick=${() => { setList(false); nav.go('testInizio', { kind: 'unit', course: c.id, section: sec.id }); }}/>`; })}</div>
    <//>`}
  <//>`;
}

function TestIntro({ nav, kind, course, section }) {
  const c = courseById(course) || currentCourse();
  const sec = section ? c.units.flatMap(u => u.sections).find(s => s.id === section) : null;
  const t = useMemo(() => buildTest(kind, c, sec), [kind, course, section]);
  const needPro = kind === 'mock' && !K.isPro;
  const start = () => { if (needPro) return nav.go('pro', { why: 'test' }); nav.replace('testRun', { test: t }); };
  const info = [[EyeOff, 'No help: explanations come at the end.'], [Flag, 'You can flag a question and come back to it later.'], [Calculator, 'The calculator is always within reach.']];
  return html`<${Flow} top=${html`<${TopBar} onClose=${nav.back} title=""/>`}
    foot=${html`<p class="o-s" style="text-align:center;margin-bottom:10px;font-size:14px;font-weight:700">${needPro ? 'The full simulation is in the Pro plan.' : 'The clock starts right away.'}</p><${Btn} cls="lg" bg=${needPro ? GIALLO : MENTA} disabled=${!t.qs.length} onClick=${start}>${needPro ? 'Discover Pro' : 'Get started'}<//>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px">
      <${Rally} pose="allena2" w=${196} alt="" style="position:absolute;right:-12px;top:-14px"/>
      <div class="o-col" style="gap:6px;position:relative;min-height:150px;max-width:205px"><span class="o-lab">${c.name}</span><h1 class="o-big" style="overflow-wrap:anywhere">${t.title}</h1></div>
      <div class="o-card s" style="position:relative;padding:6px 18px;margin-top:14px">
        ${[['Questions', t.qs.length], ['Time', fmtDur(Math.round(t.secs / 60))], ['To pass', `${t.pass} correct`]].map(([a, b], k) => html`<div key=${a} class="o-rowf" style=${{ height: 48, justifyContent: 'space-between', gap: 12, borderBottom: k < 2 ? `2px solid ${SEP}` : 0 }}><span style="font-size:15px;font-weight:600">${a}</span><span style="font-size:18px;font-weight:800">${b}</span></div>`)}
      </div>
      <div class="o-col" style="gap:14px;margin-top:20px">${info.map(([I, tx]) => html`<div key=${tx} class="o-rowf" style="gap:14px"><span class="o-ibox" style="width:36px;height:36px;border-radius:11px">${Ico(I, 18, 2.4)}</span><span class="o-t" style="font-size:15px;font-weight:600">${tx}</span></div>`)}</div>
      ${kind === 'unit' && html`<div class="o-rowf" style="gap:12px;padding:12px 14px;margin-top:20px;background:${T_GIALLO};border-radius:16px"><span style="width:32px;height:32px;flex:none;display:flex;align-items:center;justify-content:center;background:${GIALLO};border:2px solid ${INK};border-radius:10px">${PathIco(D_STAR, 18, 2, INK, INK)}</span><span class="o-t" style="font-size:15px">If you pass, the stickers of the unit turn golden and stay alive longer.</span></div>`}
    </div>
  <//>`;
}

function TestRun({ nav, test }) {
  const t = test, n = t.qs.length;
  const [i, setI] = useState(0), [ans, setAns] = useState({}), [flags, setFlags] = useState({}), [tab, setTab] = useState('case'), [quit, setQuit] = useState(false);
  const [dead] = useState(() => Date.now() + t.secs * 1000), [t0] = useState(Date.now()), [leftS, setLeftS] = useState(t.secs);
  const scrollRef = useRef(null), stripRef = useRef(null), sent = useRef(false);
  const submit = () => {
    if (sent.current) return; sent.current = true;
    const res = t.qs.map((q, k) => ans[k] == null ? null : { sel: ans[k], ok: ans[k] === q.ans });
    t.qs.forEach((q, k) => { if (res[k]) recordAnswer(q, res[k].ok); });
    const r = saveTest(t, res, Math.round((Date.now() - t0) / 1000));
    addXp(r.passed ? 50 : 2 * r.ok);
    nav.replace('testFine', { test: t, res, result: r });
  };
  useEffect(() => { const h = setInterval(() => { const s = Math.max(0, Math.round((dead - Date.now()) / 1000)); setLeftS(s); if (s <= 0) { clearInterval(h); submit(); } }, 500); return () => clearInterval(h); }, [ans]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; setTab('case'); const el = stripRef.current && stripRef.current.children[i]; if (el && el.scrollIntoView) { try { el.scrollIntoView({ inline: 'center', block: 'nearest' }); } catch (e) {} } }, [i]);
  const q = t.qs[i], cs = splitCase(q), answered = Object.keys(ans).length;
  const go = k => setI(clamp(k, 0, n - 1));
  const top = html`<div class="o-top o-pad" style="flex:none">
    <div class="o-rowf" style="height:44px;gap:12px;justify-content:space-between"><${IBtn} d=${D_X} onClick=${() => setQuit(true)} label="Leave the test"/>
      <span class="o-rowf o-mono" role="timer" style=${{ gap: 8, height: 40, padding: '0 16px', background: leftS <= 60 ? ROSA : '#fff', border: `2px solid ${INK}`, borderRadius: 999, boxShadow: `2px 2px 0 ${INK}`, fontSize: 17, fontWeight: 600 }}>${Ico(Clock, 18, 2.4)}${fmtClock(leftS)}</span>
      <span style="min-width:44px;text-align:right;font-size:14px;font-weight:800">${i + 1}/${n}</span></div>
    <div ref=${stripRef} class="o-scroll" style="display:flex;gap:6px;margin:14px -20px 0;padding:0 20px 2px;overflow-x:auto;overflow-y:hidden;flex:none">
      ${t.qs.map((_, k) => html`<button key=${k} type="button" onClick=${() => go(k)} aria-label=${`Question ${k + 1}${ans[k] != null ? ', answered' : ''}${flags[k] ? ', flagged' : ''}`} aria-current=${k === i ? 'true' : undefined}
        style=${{ width: 30, height: 30, flex: 'none', textAlign: 'center', border: `2px solid ${INK}`, borderRadius: 9, fontSize: 13, fontWeight: 800, background: k === i ? MENTA : flags[k] ? GIALLO : ans[k] != null ? INK : '#fff', color: k !== i && !flags[k] && ans[k] != null ? '#fff' : INK }}>${k + 1}</button>`)}</div>
    <p class="o-s" style="margin-top:8px;font-size:12px">Black: answered. Yellow: flagged for later.</p></div>`;
  const foot = html`<div class="o-rowf" style="gap:12px">
    <${IBtn} lg=${true} icon=${Ico(Flag, 22, 2.4)} onClick=${() => setFlags(f => Object.assign({}, f, { [i]: !f[i] }))} label=${flags[i] ? 'Remove the flag' : 'Flag for later'} style=${flags[i] ? { background: GIALLO } : null}/>
    <${IBtn} lg=${true} icon=${Ico(Calculator, 24, 2.2)} onClick=${nav.openCalc} label="Calculator"/>
    <div class="o-grow">${cs && tab === 'case' ? html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => setTab('ask')}>Go to the question<//>`
      : i < n - 1 ? html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => go(i + 1)}>Next<//>` : html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => (answered < n ? setQuit('send') : submit())}>Submit<//>`}</div></div>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${foot}
    over=${quit && html`<${BSheet} onClose=${() => setQuit(false)} label="Confirm">
      <h2 class="o-big">${quit === 'send' ? `${plural(n - answered, 'answer', 'answers')} missing` : 'Leave the test?'}</h2>
      <p class="o-body o-mut" style="margin-top:6px">${quit === 'send' ? 'Unanswered questions count as wrong.' : 'If you leave now, the test isn\'t saved.'}</p>
      <div class="o-col" style="gap:10px;margin-top:16px"><${Btn} cls="lg" bg=${MENTA} onClick=${() => setQuit(false)}>${quit === 'send' ? 'Back to the questions' : 'Keep going with the test'}<//>
        <${Btn} cls="lg flat" bg="#fff" onClick=${quit === 'send' ? submit : nav.back}>${quit === 'send' ? 'Submit anyway' : 'Leave'}<//></div><//>`}>
    <div class="o-test"><${QuestionBody} key=${i} q=${q} label=${cs ? `Question ${i + 1}` : null} sel=${ans[i] == null ? null : ans[i]} onSel=${k => setAns(a => Object.assign({}, a, { [i]: k }))} locked=${false} tab=${tab} setTab=${setTab} pose="pensa"/></div>
  <//>`;
}

function TestDone({ nav, test, res, result }) {
  const r = result, t = test, pct = Math.round(r.ok / r.n * 100), wrong = t.qs.map((q, k) => k).filter(k => !(res[k] && res[k].ok));
  const byLesson = t.kind === 'unit';
  return html`<${Room} color=${MENTA} tabs=${false} headH=${150}
    rally=${html`<${Rally} pose=${r.passed ? 'festa-grad' : 'triste'} w=${r.passed ? 210 : 196} alt="" style=${{ position: 'absolute', right: -8, top: `calc(var(--otop) + ${r.passed ? -9 : 5}px)` }}/>`}
    head=${html`<div class="o-col" style="align-items:flex-start;gap:14px;padding-top:6px;max-width:205px"><h1 class="o-h1m">${t.kind === 'level' ? 'Test complete' : r.passed ? 'Unit test passed' : 'Not passed yet'}</h1>
      ${r.passed && t.kind === 'unit' ? html`<${Pill} bg=${GIALLO}>Golden stickers<//>` : html`<${Pill}>${r.passed ? `+50 XP` : 'You can try again anytime'}<//>`}</div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:16px">
      <div class="o-rowf" style="gap:16px"><span style="position:relative;width:84px;height:84px;flex:none;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800">
          <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true" style="position:absolute;left:0;top:0"><circle cx="42" cy="42" r="38" fill="#fff" stroke=${INK} stroke-width="2.5"/><circle cx="42" cy="42" r="30" fill="none" stroke=${T_MENTA} stroke-width="9"/>
            ${pct > 0 && html`<circle cx="42" cy="42" r="30" fill="none" stroke=${r.passed ? MENTA : ROSA} stroke-width="9" stroke-dasharray=${`${(188.5 * pct / 100).toFixed(1)} 188.5`} transform="rotate(-90 42 42)"/>`}<circle cx="42" cy="42" r="24.5" fill="none" stroke=${INK} stroke-width="2"/></svg>
          <span style="position:relative">${pct}%</span></span>
        <div class="o-grow o-col" style="gap:2px"><span class="o-s" style="overflow-wrap:anywhere">${t.section ? t.section.name : t.course.name}</span><span style="font-size:28px;line-height:32px;font-weight:800;letter-spacing:-.02em">${r.ok} of ${r.n}</span>
          <span class="o-s">${r.passed ? `You needed ${t.pass}.` : `You need ${t.pass}.`} Time: ${fmtSpan(r.secs)}.</span></div></div>
      ${wrong.length > 0 && html`<${Btn} bg="#fff" onClick=${() => nav.go('testRev', { test: t, res, wrong })}>${wrong.length === 1 ? 'Review the mistake' : `Review the ${wrong.length} mistakes`}<//>`}
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet} pad=${false}>
      <h2 class="o-h2" style="margin-bottom:10px">${byLesson ? 'Question by question' : 'By topic'}</h2>
      ${byLesson ? t.qs.map((q, k) => html`<div key=${k} class="o-rowf" style=${{ gap: 12, minHeight: 44, padding: '6px 0', borderBottom: k < t.qs.length - 1 ? `2px solid ${SEP}` : 0 }}>
            <span style=${{ width: 26, height: 26, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: `2px solid ${INK}`, background: res[k] && res[k].ok ? MENTA : ROSA }}>${res[k] && res[k].ok ? PathIco(D_CHECK, 14, 3.4) : PathIco(D_X, 13, 3.4)}</span>
            <span class="o-grow o-t" style="font-size:15px;overflow-wrap:anywhere">${q.lesson.title}</span></div>`)
        : r.per.map((p, k) => html`<div key=${k} class="o-col" style="gap:6px;margin-bottom:16px"><div class="o-rowf" style="justify-content:space-between;gap:12px"><span class="o-t" style="font-size:15px;overflow-wrap:anywhere">${p.name}</span><span style="flex:none;font-size:15px;font-weight:800">${p.ok} of ${p.n}</span></div>
            <${Bar} pct=${p.ok / p.n * 100} bg=${p.ok / p.n >= 0.7 ? MENTA : p.ok / p.n >= 0.5 ? GIALLO : ROSA} h=${12}/></div>`)}
      <button type="button" class="o-rowf" onClick=${() => nav.go('deboli')} style="gap:12px;width:100%;padding:12px 16px;margin-top:14px;background:${T_GIALLO};border-radius:16px">
        <span class="o-grow o-col" style="gap:1px"><span class="o-t">Practice your weak spots</span><span class="o-s" style="color:${INK}">Rally starts from the topics where you slip up most</span></span>${!K.isPro && html`<span class="o-tag">Pro</span>`}${PathIco(D_NEXT, 22, 2.6)}</button>
      <div style="padding:20px 0 max(26px,calc(env(safe-area-inset-bottom) + 10px))"><${Btn} cls="lg" bg=${MENTA} onClick=${nav.back}>Continue<//></div>
    <//>
  <//>`;
}

function TestReview({ nav, test, res, wrong }) {
  const [k, setK] = useState(0);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [k]);
  const qi = wrong[k], q = test.qs[qi], r = res[qi];
  const keys = () => { if (!K.isPro) return nav.go('pro', { why: 'tasti' }); nav.askAI(q, r ? L3[r.sel] : null, 'Show me the keys to press on the BA II Plus to solve this question, one step per line.'); };
  return html`<${Flow} scrollRef=${scrollRef}
    top=${html`<${TopBar} onBack=${nav.back} mid=${html`<span class="o-grow" style="text-align:center;font-size:15px;font-weight:800">Mistake ${k + 1} of ${wrong.length}</span>`} right=${html`<span class="o-chip" style="height:32px;font-size:13px">Question ${qi + 1}</span>`}/>`}
    foot=${html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => (k < wrong.length - 1 ? setK(k + 1) : nav.back())}>${k < wrong.length - 1 ? 'Next mistake' : 'Done'}<//>`}>
    <div class="o-pad" style="padding-top:18px;padding-bottom:20px">
      <${Rich} text=${q.q} cls="q" lang=${q.lang}/>
      <div style="margin-top:14px"><${Options} q=${q} sel=${r ? r.sel : null} onSel=${() => {}} locked=${true}/></div>
      ${!r && html`<p class="o-s" style="margin-top:8px">You hadn't answered this question.</p>`}
      ${q.exp && html`<div style="margin-top:18px;padding:16px;background:${T_BG};border-radius:20px"><div style="font-size:18px;line-height:24px;font-weight:800;margin-bottom:6px">Why</div><${Rich} text=${q.exp} cls="sm"/></div>`}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px">
        <button type="button" class="o-btn sm flat" style="background:#fff;font-size:15px;padding:6px 8px" onClick=${keys}>Show me the keys${!K.isPro && html`<span class="o-tag">Pro</span>`}</button>
        <button type="button" class="o-btn sm flat" style="background:#fff;font-size:15px" onClick=${() => nav.askAI(q, r ? L3[r.sel] : null)}>Ask Rally</button></div>
      <${ReportLink} q=${q}/>
    </div>
  <//>`;
}
function ReportLink({ q }) {
  const [f, setF] = useState(false);
  return html`<div style="text-align:center;margin-top:6px">${f ? html`<span class="o-link" style="text-decoration:none">Reported, thanks</span>`
    : html`<button type="button" class="o-link" onClick=${() => { s2set(s => ({ flags: Object.assign({}, s.flags, { [q.key]: Date.now() }) })); setF(true); }}>Report an error in this question</button>`}</div>`;
}

// ---- allenamento con risposta subito: ravviva le figurine, quiz misto, punti deboli ----
function buildPractice(mode, sectionId) {
  const sh = K.flShuffle, all = courses().flatMap(c => c.lessons);
  if (mode === 'ravviva') return dueLessons().slice(0, 12).map(l => { const qs = lessonQuestions(l); return qs.length ? { q: qs[0], l } : { l, recap: true }; });
  if (mode === 'weak') { const sec = all.map(l => l.section).find(s => s.id === sectionId); const st = K.qStatsLoad(); const qs = allQuestions(sec ? sec.lessons : []);
    return sh(qs).sort((a, b) => ((st[a.key] && st[a.key].last === 0) ? 0 : 1) - ((st[b.key] && st[b.key].last === 0) ? 0 : 1)).slice(0, 8).map(q => ({ q, l: q.lesson })); }
  const started = startedCourses(); const pool = (started.length ? started : misCourses()).flatMap(misLessons);   // solo le lezioni del proprio percorso
  const done = pool.filter(l => isHad(l.key)); const src = allQuestions(done).length >= 5 ? done : pool;
  return sh(allQuestions(src)).slice(0, 10).map(q => ({ q, l: q.lesson }));
}
// 'serie' è il gioco delle domande generate (p45_serie.js): passa da qui per non aggiungere una schermata nuova all'elenco dell'app
function PracticeRun(p) { return p.mode === 'serie' ? html`<${SerieRun} nav=${p.nav}/>` : html`<${PracticeQuiz} ...${p}/>`; }
function PracticeQuiz({ nav, mode, section }) {
  const items = useMemo(() => buildPractice(mode, section), [mode, section]);
  const [i, setI] = useState(0), [sel, setSel] = useState(null), [fb, setFb] = useState(null), [okN, setOkN] = useState(0), [left, setLeft] = useState(null), [tab, setTab] = useState('case'), [end, setEnd] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; setSel(null); setFb(null); setTab('case'); }, [i]);
  const titles = { ravviva: 'Stickers refreshed', mix: 'Quiz complete', weak: 'Practice complete' };
  if (!items.length || end) {
    const qn = items.filter(x => x.q).length;
    return html`<${Flow} bg=${MENTA} top=${html`<${TopBar} onClose=${nav.back} title=""/>`} foot=${html`<${Btn} cls="lg" bg="#fff" onClick=${nav.back}>Continue<//>`}>
      <div class="o-col o-pad" style="align-items:center;text-align:center;padding-top:6px"><${Rally} pose=${items.length ? 'festeggia' : 'pensa'} w=${250} alt=""/>
        <h1 class="o-pop" style="font-size:40px;line-height:44px;font-weight:800;letter-spacing:-.02em;margin-top:-6px">${items.length ? titles[mode] : 'Nothing to review'}</h1>
        <p class="o-body" style="margin-top:8px;max-width:300px">${!items.length ? 'There are no questions here for now. Finish a few lessons and come back.' : mode === 'ravviva' ? `${plural(items.length, 'sticker is back', 'stickers are back')} in color.` : 'Every answer updates your weak spots.'}</p>
        ${items.length > 0 && html`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;margin-top:24px">
          <div class="o-col" style="padding:10px 14px;background:${GIALLO};border:2.5px solid ${INK};border-radius:18px;text-align:left"><span style="font-size:13px;font-weight:700">Points</span><span style="font-size:22px;line-height:26px;font-weight:800">+${okN * 5} XP</span></div>
          <div class="o-col" style="padding:10px 14px;background:#fff;border:2.5px solid ${INK};border-radius:18px;text-align:left"><span class="o-s">Correct answers</span><span style="font-size:22px;line-height:26px;font-weight:800">${okN} of ${qn}</span></div></div>`}
      </div><//>`;
  }
  const it = items[i], q = it.q, cs = q ? splitCase(q) : null, locked = !!fb;
  const next = () => { if (i < items.length - 1) setI(i + 1); else setEnd(true); };
  const after = ok => { if (K.albumLoad()[it.l.key]) K.albumReview(it.l.key, ok); };
  const check = () => {
    const ok = sel === q.ans; recordAnswer(q, ok); after(ok);
    if (ok) { setOkN(n => n + 1); addXp(5); return setFb('ok'); }
    const e = explState();
    if (e.pro) { setLeft(null); setFb('ko'); } else if (e.left > 0) { spendExplanation(); setLeft(e.left - 1); setFb('ko'); } else setFb('limit');
  };
  let body, foot;
  if (it.recap) {
    const kp = (it.l.los && it.l.los.keyPoints) || [];
    body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:20px"><div class="o-lab" style="margin-bottom:4px">Quick review</div><h1 style="font-size:28px;line-height:32px;font-weight:800;letter-spacing:-.02em;overflow-wrap:anywhere">${it.l.title}</h1>
      <div class="o-card s o-col" style="padding:8px 18px;margin-top:16px">${(kp.length ? kp : [it.l.note || 'Reopen the lesson to review it.']).map((t, k, a) => html`<div key=${k} class="o-rowf" style=${{ gap: 12, padding: '12px 0', alignItems: 'flex-start', borderBottom: k < a.length - 1 ? `2px solid ${SEP}` : 0 }}>
        <span style="width:24px;height:24px;flex:none;display:flex;align-items:center;justify-content:center;background:${INK};border-radius:50%;color:#fff;margin-top:1px">${PathIco(D_CHECK, 14, 3.4)}</span><${Rich} text=${t} cls="sm" style=${{ fontWeight: 700 }}/></div>`)}</div>
      <div style="text-align:center;margin-top:8px"><button type="button" class="o-link" onClick=${() => nav.go('lezione', { key: it.l.key })}>Reopen the lesson</button></div></div>`;
    foot = html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => { after(true); next(); }}>Reviewed<//>`;
  } else {
    body = html`<${QuestionBody} key=${i} q=${q} label=${`Question ${i + 1} of ${items.length}`} sel=${sel} onSel=${setSel} locked=${locked} tab=${tab} setTab=${setTab}/>`;
    foot = html`<div class="o-rowf" style="gap:12px"><${IBtn} lg=${true} icon=${Ico(Calculator, 24, 2.2)} onClick=${nav.openCalc} label="Calculator"/><div class="o-grow">${cs && tab === 'case'
      ? html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => setTab('ask')}>Go to the question<//>` : html`<${Btn} cls="lg" bg=${MENTA} disabled=${sel == null || locked} onClick=${check}>Check<//>`}</div></div>`;
  }
  const over = fb === 'ok' ? html`<${FeedbackSheet} ok=${true} q=${q} xp=${5} onNext=${next}/>` : fb === 'ko' ? html`<${FeedbackSheet} ok=${false} q=${q} left=${left} onNext=${next}/>`
    : fb === 'limit' ? html`<${LimitSheet} onPro=${() => { startPro(); setLeft(null); setFb('ko'); }} onSkip=${next}/>` : null;
  return html`<${Flow} scrollRef=${scrollRef} top=${html`<${TopBar} onClose=${nav.back} n=${items.length} i=${i}/>`} foot=${foot} over=${over}><div class="o-test">${body}</div><//>`;
}

function WeakScreen({ nav }) {
  useS2();
  const c = currentCourse();
  const sc = topicScores(c), weak = sc[0], pro = !!K.isPro;
  const col = s => s >= 80 ? MENTA : s >= 55 ? GIALLO : ROSA;
  const train = () => { if (!pro) return nav.go('pro', { why: 'deboli' }); nav.go('pratica', { mode: 'weak', section: weak.id }); };
  return html`<${Room} color=${MENTA} tabs=${false} headH=${168}
    rally=${html`<${Rally} pose="allena2" alt="" style="position:absolute;right:-10px;top:calc(var(--otop) + 9px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Back"/></div>
      <div class="o-col" style="align-items:flex-start;gap:14px;margin-top:22px;max-width:210px"><h1 class="o-h1m">Weak spots</h1><${Pill} bg=${pro ? '#fff' : GIALLO}>${pro ? 'From your answers' : 'Pro only'}<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px">
      ${weak ? html`<div class="o-col" style="gap:3px"><span class="o-s">Weakest right now</span>
          <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px"><span style="font-size:24px;line-height:28px;font-weight:800;letter-spacing:-.01em;overflow-wrap:anywhere">${weak.name}</span><span style="flex:none;font-size:15px;font-weight:800">${weak.score} out of 100</span></div></div>
        <${Bar} pct=${weak.score} bg=${col(weak.score)} label=${`${weak.score} out of 100`}/>
        <p class="o-body o-mut">You missed ${weak.n - weak.nok} ${weak.n - weak.nok === 1 ? 'answer' : 'answers'} out of ${weak.n} in ${weak.unit.name}.</p>
        <${Btn} bg=${MENTA} onClick=${train}>Practice for ${plural(Math.max(4, Math.round(Math.min(8, allQuestions(weak.section.lessons).length) * c.pace / 60)), 'minute', 'minutes')}<//>`
      : html`<div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800">Nothing to measure yet</div><div class="o-body o-mut">Answer a few questions: Rally watches where you slip up and tells you where to restart.</div></div>
        <${Btn} bg=${MENTA} onClick=${() => nav.go('pratica', { mode: 'mix' })}>Take a mixed quiz<//>`}
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet} pad=${false}>
      <h2 class="o-h2" style="margin-bottom:12px">All topics</h2>
      ${sc.length === 0 && html`<p class="o-body o-mut">They show up here after your first answers.</p>`}
      ${sc.map(x => html`<button key=${x.id} type="button" class="o-col" style="gap:6px;margin-bottom:16px;width:100%" onClick=${() => (pro ? nav.go('pratica', { mode: 'weak', section: x.id }) : nav.go('pro', { why: 'deboli' }))}>
        <span class="o-rowf" style="justify-content:space-between;gap:12px;width:100%"><span class="o-t" style="font-size:15px;overflow-wrap:anywhere">${x.name}</span><span style="flex:none;font-size:15px;font-weight:800">${x.score}</span></span>
        <span style="display:block;width:100%"><${Bar} pct=${x.score} bg=${col(x.score)}/></span></button>`)}
      <p class="o-s" style="padding:4px 0 max(30px,calc(env(safe-area-inset-bottom) + 14px))">Recent answers weigh more. If you don't review a topic, its score drifts back toward 50.</p>
    <//>
  <//>`;
}
// =====================================================================================================
// MOTORE DELLE DOMANDE GENERATE: stampi di calcolo e tabelle di fatti
// =====================================================================================================
// Codice puro: niente schermo, niente memoria del telefono, niente rete. Non usa niente del resto dell'app,
// così lo stesso file può servire anche all'arbitro delle sfide (sfide/).
// Una domanda nasce in due tempi:
//   1. GEN.crea(tipo, seme)            → il "nucleo": numeri, risposte e posizione della giusta. Niente parole: è uguale in tutte le lingue.
//   2. GEN.testo(nucleo, lingua, valuta) → domanda, risposte e spiegazione scritte in quella lingua.
// Lo stesso tipo con lo stesso seme dà sempre lo stesso nucleo: due telefoni (o un telefono e l'arbitro) vedono la stessa domanda.
// Regole dei contenuti:
//   - la risposta giusta di uno stampo la calcola `ok`; le sbagliate nascono dagli errori tipici (`err`), ognuno con la sua spiegazione;
//   - ogni stampo e ogni fatto è scritto in tutte le lingue attive (it, en): senza una lingua non entra nel gioco;
//   - i fatti hanno la fonte in dev/ordine/FONTI_GIOCHI.md; niente fatti che scadono (cariche, tassi del momento) o contestati.
// Il collaudo (dev/giochi/collauda.mjs) genera migliaia di domande per tipo e rifà i conti con un secondo programma scritto a parte.
const GEN = (() => {
  const V = 1;   // cambia quando cambia il modo di generare: due telefoni con V diversa non darebbero lo stesso nucleo dallo stesso seme

  // ---- il caso: stessa sequenza dallo stesso seme (mulberry32) ----
  function caso(seme) {
    let a = seme >>> 0;
    return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const scegli = (R, a) => a[Math.floor(R() * a.length)];
  const mescola = (R, lista) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  // arrotonda a d decimali, con il 5 che va lontano dallo zero (2,5 → 3; −2,5 → −3)
  const giro = (x, d = 0) => { const m = Math.pow(10, d); return Math.round(x * m + (x >= 0 ? 1e-7 : -1e-7)) / m || 0; };
  const intero = x => Math.abs(x - Math.round(x)) < 1e-9;

  // ---- come si scrive il valore di una risposta ----
  // d: decimali; rel e abs: distanza minima tra due risposte (in rapporto alla giusta e in assoluto); segno: si scrive anche il +
  const FORMA = {
    soldi: { d: 0, rel: 0.03, abs: 5 },
    pct: { d: 1, rel: 0.08, abs: 0.5 },
    pct2: { d: 2, rel: 0.04, abs: 0.15 },
    seg: { d: 1, rel: 0.08, abs: 0.5, segno: true },
    seg2: { d: 2, rel: 0.08, abs: 0.4, segno: true },
    anni: { d: 0, rel: 0.2, abs: 2 }
  };

  // ---- la penna: numeri, soldi e percentuali scritti come vuole la lingua ----
  const NB = '\u00A0';
  function penna(lang, cur) {
    const en = lang === 'en', G = en ? ',' : '.', D = en ? '.' : ',', sim = cur || '€';
    // n(2000) → 2.000 · n(3.5, 1) → 3,5 · n(4, 1) → 4 (gli zeri in fondo si tolgono, se non è `fisso`)
    const n = (x, d = 0, fisso) => {
      let s = Math.abs(x).toFixed(d); if (d && !fisso) s = s.replace(/\.?0+$/, '');
      const k = s.indexOf('.'), i = (k < 0 ? s : s.slice(0, k)).replace(/\B(?=(\d{3})+(?!\d))/g, G), f = k < 0 ? '' : s.slice(k + 1);
      return (x < 0 ? '−' : '') + i + (f ? D + f : '');
    };
    const soldi = x => { const t = intero(x) ? n(x) : n(x, 2, true); return en ? sim + t : t + NB + sim; };
    const pct = (x, d = 1) => n(x, d) + '%';
    const seg = (x, d = 1) => (giro(x, d) > 0 ? '+' : '') + n(x, d) + '%';
    // in italiano l'articolo cambia davanti a 1, 8, 11, 80-89: l'8%, all'8%, dell'8%
    const voc = x => { const k = Math.floor(Math.abs(x)); return k === 1 || k === 8 || k === 11 || (k >= 80 && k <= 89) || (k >= 800 && k <= 899); };
    const ilp = (x, d = 1) => (voc(x) ? "l'" : 'il ') + pct(x, d), alp = (x, d = 1) => (voc(x) ? "all'" : 'al ') + pct(x, d), delp = (x, d = 1) => (voc(x) ? "dell'" : 'del ') + pct(x, d);
    const anni = x => en ? `${n(x)} ${x === 1 ? 'year' : 'years'}` : `${n(x)} ${x === 1 ? 'anno' : 'anni'}`;
    // dentro una formula: la virgola va tra graffe, il % con la barra, il meno è quello semplice
    const f = s => String(s).replace(/−/g, '-').replace(/,/g, '{,}').replace(/%/g, '\\%');
    const fn = (x, d = 0, fisso) => f(n(x, d, fisso));
    const fs = x => intero(x) ? fn(x) : fn(x, 2, true);   // una cifra in valuta dentro una formula: 20 oppure 0,20
    const valore = (forma, x) => forma === 'soldi' ? soldi(x) : forma === 'anni' ? (en ? 'About ' : 'Circa ') + anni(x) : forma === 'seg' || forma === 'seg2' ? seg(x, FORMA[forma].d) : pct(x, FORMA[forma].d);
    return { en, n, soldi, pct, ilp, alp, delp, seg, anni, f, fn, fs, valore };
  }

  // =====================================================================================================
  // STAMPI DI CALCOLO
  // =====================================================================================================
  // par(R): sceglie i numeri (null = combinazione da scartare) · ok(p): la risposta giusta · err: gli errori tipici
  // it / en: q(p, W) la domanda, exp(p, W, ok) la spiegazione con la formula prima a lettere e poi a numeri, err: una riga per ogni errore tipico
  const cap = (r, n) => Math.pow(1 + r / 100, n);
  const STAMPI = {
    semplice: {
      liv: 1, tema: 'tempo', forma: 'soldi',
      par: R => ({ C: scegli(R, [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 8000, 10000]), r: scegli(R, [2, 3, 4, 5, 6, 8]), n: scegli(R, [2, 3, 4, 5, 6, 8, 10]) }),
      ok: p => p.C * p.r / 100 * p.n,
      err: { montante: p => p.C + p.C * p.r / 100 * p.n, unanno: p => p.C * p.r / 100, composto: p => p.C * (cap(p.r, p.n) - 1) },
      it: {
        q: (p, W) => `Presti ${W.soldi(p.C)} a un amico per ${W.anni(p.n)}, ${W.alp(p.r)} l'anno. Gli interessi si calcolano ogni anno solo sulla cifra prestata (interesse semplice). Quanti interessi incassi in tutto?`,
        exp: (p, W, ok) => `Con l'**interesse semplice** ogni anno incassi la stessa cifra, calcolata sempre sul capitale di partenza.\n\n$$I = C \\times r \\times n$$\n\n\\(C\\) = capitale prestato, \\(r\\) = tasso annuo, \\(n\\) = anni, \\(I\\) = interessi in tutto.\n\n$$I = ${W.fn(p.C)} \\times ${W.fn(p.r / 100, 2, true)} \\times ${p.n} = ${W.fn(ok)}$$\n\nIn tutto incassi **${W.soldi(ok)}** di interessi.`,
        err: { montante: 'Hai sommato anche il capitale: la domanda chiede solo gli interessi.', unanno: 'Questi sono gli interessi di un solo anno: vanno moltiplicati per gli anni.', composto: 'Hai fatto rendere anche gli interessi (interesse composto): qui si calcolano solo sulla cifra prestata.' }
      },
      en: {
        q: (p, W) => `You lend a friend ${W.soldi(p.C)} for ${W.anni(p.n)} at ${W.pct(p.r)} a year. Interest is figured each year only on the amount you lent (simple interest). How much interest do you earn in total?`,
        exp: (p, W, ok) => `With **simple interest** you earn the same amount every year, always figured on the starting principal.\n\n$$I = C \\times r \\times n$$\n\n\\(C\\) = principal you lent, \\(r\\) = annual rate, \\(n\\) = years, \\(I\\) = total interest.\n\n$$I = ${W.fn(p.C)} \\times ${W.fn(p.r / 100, 2, true)} \\times ${p.n} = ${W.fn(ok)}$$\n\nIn total you earn **${W.soldi(ok)}** in interest.`,
        err: { montante: 'You added the principal too: the question asks only for the interest.', unanno: 'This is the interest for one year only: multiply it by the number of years.', composto: 'You let the interest earn interest too (compound interest): here it is figured only on the amount you lent.' }
      }
    },
    composto: {
      liv: 2, tema: 'tempo', forma: 'soldi',
      par: R => ({ C: scegli(R, [500, 1000, 1500, 2000, 3000, 4000, 5000, 8000, 10000, 20000]), r: scegli(R, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]), n: scegli(R, [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30]) }),
      ok: p => p.C * cap(p.r, p.n),
      err: { semplice: p => p.C * (1 + p.r / 100 * p.n), soloint: p => p.C * (cap(p.r, p.n) - 1), meno1: p => p.C * cap(p.r, p.n - 1) },
      it: {
        q: (p, W) => `Metti ${W.soldi(p.C)} in un investimento che rende ${W.ilp(p.r)} l'anno. Ogni anno gli interessi restano investiti e rendono anche loro. Quanto hai dopo ${W.anni(p.n)}?`,
        exp: (p, W, ok) => `Gli interessi di ogni anno si aggiungono al capitale e l'anno dopo rendono anche loro: è l'**interesse composto**.\n\n$$M = C \\times (1 + r)^n$$\n\n\\(C\\) = capitale di partenza, \\(r\\) = tasso annuo, \\(n\\) = anni, \\(M\\) = quanto hai alla fine.\n\n$$M = ${W.fn(p.C)} \\times ${W.fn(1 + p.r / 100, 2, true)}^{${p.n}} = ${W.fn(ok)}$$\n\nAlla fine hai **${W.soldi(ok)}** (cifra arrotondata).`,
        err: { semplice: 'Hai calcolato gli interessi sempre sul capitale di partenza (interesse semplice): mancano gli interessi sugli interessi.', soloint: 'Questi sono solo gli interessi: la domanda chiede quanto hai in tutto, capitale compreso.', meno1: 'Hai contato un anno in meno.' }
      },
      en: {
        q: (p, W) => `You put ${W.soldi(p.C)} into an investment that returns ${W.pct(p.r)} a year. Each year the interest stays invested and earns interest too. How much do you have after ${W.anni(p.n)}?`,
        exp: (p, W, ok) => `Each year's interest is added to the principal, and the next year it earns interest too: this is **compound interest**.\n\n$$M = C \\times (1 + r)^n$$\n\n\\(C\\) = starting principal, \\(r\\) = annual rate, \\(n\\) = years, \\(M\\) = what you have at the end.\n\n$$M = ${W.fn(p.C)} \\times ${W.fn(1 + p.r / 100, 2, true)}^{${p.n}} = ${W.fn(ok)}$$\n\nAt the end you have **${W.soldi(ok)}** (rounded).`,
        err: { semplice: 'You figured the interest only on the starting principal (simple interest): the interest on the interest is missing.', soloint: 'This is only the interest: the question asks how much you have in total, principal included.', meno1: 'You counted one year too few.' }
      }
    },
    attuale: {
      liv: 3, tema: 'tempo', forma: 'soldi',
      par: R => ({ F: scegli(R, [500, 1000, 2000, 3000, 5000, 8000, 10000, 15000, 20000, 50000, 100000]), r: scegli(R, [2, 3, 4, 5, 6, 7, 8, 10]), n: scegli(R, [2, 3, 4, 5, 8, 10, 15, 20, 25, 30]) }),
      ok: p => p.F / cap(p.r, p.n),
      err: { capitalizza: p => p.F * cap(p.r, p.n), lineare: p => p.F / (1 + p.r / 100 * p.n), sottrae: p => p.F * (1 - p.r / 100 * p.n) },
      it: {
        q: (p, W) => `Tra ${W.anni(p.n)} ti servono ${W.soldi(p.F)}. Hai un investimento che rende ${W.ilp(p.r)} l'anno, con gli interessi che restano investiti. Quanto devi metterci oggi per arrivare a quella cifra?`,
        exp: (p, W, ok) => `È il conto dell'interesse composto fatto al contrario: si parte dalla cifra futura e si torna a oggi. La cifra di oggi si chiama **valore attuale**.\n\n$$VA = \\frac{F}{(1 + r)^n}$$\n\n\\(F\\) = cifra che ti serve in futuro, \\(r\\) = tasso annuo, \\(n\\) = anni, \\(VA\\) = quanto devi mettere oggi.\n\n$$VA = \\frac{${W.fn(p.F)}}{${W.fn(1 + p.r / 100, 2, true)}^{${p.n}}} = ${W.fn(ok)}$$\n\nOggi devi mettere **${W.soldi(ok)}** (cifra arrotondata).`,
        err: { capitalizza: 'Hai moltiplicato invece di dividere: così trovi quanto diventerebbe quella cifra in futuro, non quanto serve oggi.', lineare: 'Hai tolto gli interessi come se fossero semplici: qui gli interessi restano investiti e rendono anche loro.', sottrae: 'Hai tolto il tasso moltiplicato per gli anni dalla cifra finale: gli interessi si calcolano sulla cifra di oggi, non su quella futura.' }
      },
      en: {
        q: (p, W) => `In ${W.anni(p.n)} you will need ${W.soldi(p.F)}. You have an investment that returns ${W.pct(p.r)} a year, with the interest staying invested. How much do you have to put in today to reach that amount?`,
        exp: (p, W, ok) => `This is the compound interest calculation done backward: you start from the future amount and come back to today. Today's amount is called the **present value**.\n\n$$PV = \\frac{F}{(1 + r)^n}$$\n\n\\(F\\) = amount you need in the future, \\(r\\) = annual rate, \\(n\\) = years, \\(PV\\) = how much you have to put in today.\n\n$$PV = \\frac{${W.fn(p.F)}}{${W.fn(1 + p.r / 100, 2, true)}^{${p.n}}} = ${W.fn(ok)}$$\n\nToday you have to put in **${W.soldi(ok)}** (rounded).`,
        err: { capitalizza: 'You multiplied instead of dividing: that gives what the amount would grow to in the future, not what you need today.', lineare: 'You removed the interest as if it were simple: here the interest stays invested and earns interest too.', sottrae: 'You subtracted the rate times the years from the final amount: interest is figured on today’s amount, not on the future one.' }
      }
    },
    reale: {
      liv: 2, tema: 'tempo', forma: 'seg',
      par: R => { const i = scegli(R, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]), f = scegli(R, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]); return i === f ? null : { i, f }; },
      ok: p => ((1 + p.i / 100) / (1 + p.f / 100) - 1) * 100,
      err: { somma: p => p.i + p.f, ignora: p => p.i, rovescia: p => ((1 + p.f / 100) / (1 + p.i / 100) - 1) * 100 },
      it: {
        q: (p, W) => `In un anno i tuoi risparmi rendono ${W.ilp(p.i)}. Nello stesso anno i prezzi salgono ${W.delp(p.f)}. Di quanto è cambiato davvero quello che puoi comprare con quei soldi?`,
        exp: (p, W, ok) => `Quello che conta è il **rendimento reale**: quanto resta del rendimento dopo aver tolto l'aumento dei prezzi.\n\n$$r_{\\text{reale}} = \\frac{1 + i}{1 + \\pi} - 1$$\n\n\\(i\\) = rendimento dei risparmi, \\(\\pi\\) = aumento dei prezzi (inflazione).\n\n$$r_{\\text{reale}} = \\frac{${W.fn(1 + p.i / 100, 2, true)}}{${W.fn(1 + p.f / 100, 2, true)}} - 1 = ${W.f(W.seg(ok))}$$\n\nA mente basta la differenza: \\(${W.f(W.pct(p.i))} - ${W.f(W.pct(p.f))} = ${W.f(W.seg(p.i - p.f))}\\), che è quasi lo stesso numero.`,
        err: { somma: 'Hai sommato l\'aumento dei prezzi: l\'inflazione si toglie dal rendimento, non si aggiunge.', ignora: 'Hai guardato solo il rendimento: se intanto i prezzi salgono, con quei soldi compri meno.', rovescia: 'Il segno è al contrario: si parte dal rendimento e si toglie l\'aumento dei prezzi.' }
      },
      en: {
        q: (p, W) => `In one year your savings earn ${W.pct(p.i)}. In the same year prices rise ${W.pct(p.f)}. By how much has what you can buy with that money really changed?`,
        exp: (p, W, ok) => `What matters is the **real return**: what is left of the return after taking out the rise in prices.\n\n$$r_{\\text{real}} = \\frac{1 + i}{1 + \\pi} - 1$$\n\n\\(i\\) = return on your savings, \\(\\pi\\) = rise in prices (inflation).\n\n$$r_{\\text{real}} = \\frac{${W.fn(1 + p.i / 100, 2, true)}}{${W.fn(1 + p.f / 100, 2, true)}} - 1 = ${W.f(W.seg(ok))}$$\n\nIn your head, the difference is enough: \\(${W.f(W.pct(p.i))} - ${W.f(W.pct(p.f))} = ${W.f(W.seg(p.i - p.f))}\\), which is almost the same number.`,
        err: { somma: 'You added the rise in prices: inflation is taken out of the return, not added to it.', ignora: 'You looked only at the return: if prices rise in the meantime, that money buys less.', rovescia: 'The sign is reversed: you start from the return and take out the rise in prices.' }
      }
    },
    variazione: {
      liv: 1, tema: 'azioni', forma: 'seg',
      par: R => { const A = scegli(R, [10, 16, 20, 25, 30, 40, 50, 60, 75, 80, 125, 150, 200, 250, 300, 400, 500, 1000]), v = scegli(R, [-75, -60, -50, -40, -30, -25, -20, -10, -5, 5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 150, 200]), B = A * (1 + v / 100); return intero(B) ? { A, B: Math.round(B) } : null; },
      ok: p => (p.B - p.A) / p.A * 100,
      err: { suarrivo: p => (p.B - p.A) / p.B * 100, differenza: p => p.B - p.A, rapporto: p => p.B / p.A * 100 },
      it: {
        q: (p, W) => `Un'azione passa da ${W.soldi(p.A)} a ${W.soldi(p.B)}. Di quanto è cambiato il prezzo, in percentuale?`,
        exp: (p, W, ok) => `La variazione si misura sempre rispetto al **prezzo di partenza**.\n\n$$\\text{variazione} = \\frac{P_1 - P_0}{P_0}$$\n\n\\(P_0\\) = prezzo di partenza, \\(P_1\\) = prezzo di arrivo.\n\n$$\\frac{${W.fn(p.B)} - ${W.fn(p.A)}}{${W.fn(p.A)}} = ${W.f(W.seg(ok))}$$`,
        err: { suarrivo: 'Hai diviso per il prezzo di arrivo: la variazione si calcola sul prezzo di partenza.', differenza: 'Questa è la differenza tra i due prezzi, non la percentuale: va divisa per il prezzo di partenza.', rapporto: 'Questo è il prezzo di arrivo in percentuale di quello di partenza: per la variazione bisogna togliere 100.' }
      },
      en: {
        q: (p, W) => `A stock goes from ${W.soldi(p.A)} to ${W.soldi(p.B)}. By what percentage has the price changed?`,
        exp: (p, W, ok) => `A change is always measured against the **starting price**.\n\n$$\\text{change} = \\frac{P_1 - P_0}{P_0}$$\n\n\\(P_0\\) = starting price, \\(P_1\\) = ending price.\n\n$$\\frac{${W.fn(p.B)} - ${W.fn(p.A)}}{${W.fn(p.A)}} = ${W.f(W.seg(ok))}$$`,
        err: { suarrivo: 'You divided by the ending price: the change is figured on the starting price.', differenza: 'This is the difference between the two prices, not the percentage: divide it by the starting price.', rapporto: 'This is the ending price as a percentage of the starting one: for the change you have to subtract 100.' }
      }
    },
    recupero: {
      liv: 2, tema: 'rischio', forma: 'pct',
      par: R => { const x = scegli(R, [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]), P = scegli(R, [10, 20, 30, 40, 50, 60, 80, 100, 150, 200, 250, 400, 500, 1000]); return { P, x, Q: giro(P * (1 - x / 100), 2) }; },
      ok: p => p.x / (100 - p.x) * 100,
      err: { uguale: p => p.x, doppio: p => 2 * p.x, suuno: p => p.x / (100 + p.x) * 100 },
      it: {
        q: (p, W) => `Un'azione vale ${W.soldi(p.P)}. In un anno perde ${W.ilp(p.x)} e scende a ${W.soldi(p.Q)}. Di quanto deve salire, da lì, per tornare a ${W.soldi(p.P)}?`,
        exp: (p, W, ok) => `Dopo una perdita si riparte da una cifra più bassa: per recuperare gli stessi soldi serve una percentuale più alta.\n\n$$\\text{recupero} = \\frac{P_0 - P_1}{P_1}$$\n\n\\(P_0\\) = prezzo prima della perdita, \\(P_1\\) = prezzo dopo la perdita.\n\n$$\\frac{${W.fn(p.P)} - ${W.fs(p.Q)}}{${W.fs(p.Q)}} = ${W.f(W.pct(ok))}$$\n\nPiù la perdita è grande, più la risalita che serve è lunga.`,
        err: { uguale: 'Non basta la stessa percentuale: dopo la perdita si calcola su una cifra più bassa, quindi si recupera meno.', doppio: 'Non è il doppio della perdita: la risalita si calcola dividendo i soldi persi per il nuovo prezzo.', suuno: 'Hai diviso per una cifra più alta del prezzo di partenza: si divide per il prezzo dopo la perdita.' }
      },
      en: {
        q: (p, W) => `A stock is worth ${W.soldi(p.P)}. In one year it loses ${W.pct(p.x)} and falls to ${W.soldi(p.Q)}. By how much does it have to rise from there to get back to ${W.soldi(p.P)}?`,
        exp: (p, W, ok) => `After a loss you start again from a lower amount: to win back the same money you need a higher percentage.\n\n$$\\text{recovery} = \\frac{P_0 - P_1}{P_1}$$\n\n\\(P_0\\) = price before the loss, \\(P_1\\) = price after the loss.\n\n$$\\frac{${W.fn(p.P)} - ${W.fs(p.Q)}}{${W.fs(p.Q)}} = ${W.f(W.pct(ok))}$$\n\nThe bigger the loss, the longer the climb back.`,
        err: { uguale: 'The same percentage is not enough: after the loss it is figured on a lower amount, so it wins back less.', doppio: 'It is not double the loss: the climb back is the money lost divided by the new price.', suuno: 'You divided by an amount higher than the starting price: divide by the price after the loss.' }
      }
    },
    raddoppio: {
      liv: 2, tema: 'tempo', forma: 'anni',
      par: R => ({ C: scegli(R, [100, 200, 300, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 8000, 10000, 20000, 50000]), r: scegli(R, [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15]) }),
      ok: p => Math.log(2) / Math.log(1 + p.r / 100),
      err: { cento: p => 100 / p.r, meta: p => 50 / p.r, triplo: p => 144 / p.r },
      it: {
        q: (p, W) => `Hai ${W.soldi(p.C)} investiti ${W.alp(p.r)} l'anno, con gli interessi che restano investiti. Dopo circa quanti anni diventano ${W.soldi(2 * p.C)}?`,
        exp: (p, W, ok) => `C'è una scorciatoia, la **regola del 72**: dividi 72 per il tasso e trovi più o meno gli anni che servono per raddoppiare.\n\n$$\\text{anni} \\approx \\frac{72}{r}$$\n\n\\(r\\) = tasso annuo, scritto come numero (${p.r} per ${W.ilp(p.r)}).\n\n$$\\frac{72}{${p.r}} ${72 % p.r ? '\\approx' : '='} ${W.fn(72 / p.r, 1)}$$\n\nIl conto esatto con l'interesse composto dà ${W.n(Math.log(2) / Math.log(1 + p.r / 100), 1, true)} anni: la risposta giusta è **circa ${W.anni(ok)}**.`,
        err: { cento: 'Hai diviso 100 per il tasso: varrebbe se gli interessi non rendessero a loro volta. Con l\'interesse composto si fa prima.', meta: 'Troppo presto: in questi anni il capitale non è ancora raddoppiato. La scorciatoia è 72 diviso il tasso.', triplo: 'Troppo tardi: in questi anni il capitale è circa quadruplicato. La scorciatoia è 72 diviso il tasso.' }
      },
      en: {
        q: (p, W) => `You have ${W.soldi(p.C)} invested at ${W.pct(p.r)} a year, with the interest staying invested. After about how many years does it become ${W.soldi(2 * p.C)}?`,
        exp: (p, W, ok) => `There is a shortcut, the **rule of 72**: divide 72 by the rate and you get roughly the years it takes to double.\n\n$$\\text{years} \\approx \\frac{72}{r}$$\n\n\\(r\\) = annual rate, written as a number (${p.r} for ${W.pct(p.r)}).\n\n$$\\frac{72}{${p.r}} ${72 % p.r ? '\\approx' : '='} ${W.fn(72 / p.r, 1)}$$\n\nThe exact compound interest calculation gives ${W.n(Math.log(2) / Math.log(1 + p.r / 100), 1, true)} years: the right answer is **about ${W.anni(ok)}**.`,
        err: { cento: 'You divided 100 by the rate: that would hold if the interest did not earn interest itself. With compound interest it takes less time.', meta: 'Too soon: in these years the money has not doubled yet. The shortcut is 72 divided by the rate.', triplo: 'Too late: in these years the money has grown to about four times. The shortcut is 72 divided by the rate.' }
      }
    },
    dividendo: {
      liv: 1, tema: 'azioni', forma: 'pct',
      par: R => { const P = scegli(R, [5, 8, 10, 15, 16, 20, 25, 30, 40, 50, 60, 80, 125, 150, 200, 250, 400]), y = scegli(R, [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8]), D = P * y / 100; return intero(D * 100) ? { P, D: giro(D, 2) } : null; },
      ok: p => p.D / p.P * 100,
      err: { inverso: p => p.P / p.D, solodiv: p => p.D, dieci: p => p.D / p.P * 1000 },
      it: {
        q: (p, W) => `Un'azione costa ${W.soldi(p.P)} e paga un dividendo di ${W.soldi(p.D)} l'anno. Quanto rende il solo dividendo, in percentuale del prezzo?`,
        exp: (p, W, ok) => `Il rendimento da dividendo dice quanto incassi ogni anno rispetto a quello che spendi per comprare l'azione.\n\n$$\\text{rendimento} = \\frac{D}{P}$$\n\n\\(D\\) = dividendo di un anno, \\(P\\) = prezzo dell'azione.\n\n$$\\frac{${W.fs(p.D)}}{${W.fn(p.P)}} = ${W.f(W.pct(ok))}$$`,
        err: { inverso: 'Hai diviso il prezzo per il dividendo: va fatto il contrario, dividendo diviso prezzo.', solodiv: 'Questo è il dividendo in valuta, non in percentuale: va diviso per il prezzo.', dieci: 'C\'è uno zero di troppo: dividendo diviso prezzo, poi per 100.' }
      },
      en: {
        q: (p, W) => `A stock costs ${W.soldi(p.P)} and pays a dividend of ${W.soldi(p.D)} a year. How much does the dividend alone return, as a percentage of the price?`,
        exp: (p, W, ok) => `The dividend yield tells you how much you collect each year compared with what you spend to buy the stock.\n\n$$\\text{yield} = \\frac{D}{P}$$\n\n\\(D\\) = one year's dividend, \\(P\\) = price of the stock.\n\n$$\\frac{${W.fs(p.D)}}{${W.fn(p.P)}} = ${W.f(W.pct(ok))}$$`,
        err: { inverso: 'You divided the price by the dividend: it goes the other way, dividend divided by price.', solodiv: 'This is the dividend in money, not as a percentage: divide it by the price.', dieci: 'There is one zero too many: dividend divided by price, then times 100.' }
      }
    },
    cedola: {
      liv: 3, tema: 'obbligazioni', forma: 'pct2',
      par: R => ({ c: scegli(R, [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7]), P: scegli(R, [70, 75, 80, 85, 90, 95, 105, 110, 115, 120, 125]) }),
      ok: p => p.c / p.P * 100,
      err: { nominale: p => p.c, rovescio: p => p.c * p.P / 100, sconto: p => p.c + (100 - p.P) },
      it: {
        q: (p, W) => `Un'obbligazione paga ogni anno una cedola di ${W.soldi(p.c)} per ogni ${W.soldi(100)} di valore nominale. Oggi sul mercato costa ${W.soldi(p.P)}. Se la compri oggi, quanto ti rende la cedola rispetto a quello che paghi?`,
        exp: (p, W, ok) => `La cedola è fissa, ma tu paghi il prezzo di oggi: è su quello che va misurata. Si chiama **rendimento immediato**.\n\n$$\\text{rendimento immediato} = \\frac{c}{P}$$\n\n\\(c\\) = cedola di un anno, \\(P\\) = prezzo di oggi.\n\n$$\\frac{${W.fs(p.c)}}{${W.fn(p.P)}} = ${W.f(W.pct(ok, 2))}$$\n\n${p.P < 100 ? 'Il prezzo è sotto 100: la stessa cedola pesa di più su una spesa più bassa.' : 'Il prezzo è sopra 100: la stessa cedola pesa di meno su una spesa più alta.'}`,
        err: { nominale: 'Questa è la cedola rispetto al valore nominale: tu però non paghi 100, paghi il prezzo di oggi.', rovescio: 'Hai moltiplicato la cedola per il prezzo: va divisa per il prezzo.', sconto: 'Hai aggiunto alla cedola la differenza tra 100 e il prezzo: quella si incassa (o si perde) alla scadenza, non ogni anno.' }
      },
      en: {
        q: (p, W) => `A bond pays a coupon of ${W.soldi(p.c)} every year for each ${W.soldi(100)} of face value. Today it costs ${W.soldi(p.P)} on the market. If you buy it today, how much does the coupon return compared with what you pay?`,
        exp: (p, W, ok) => `The coupon is fixed, but you pay today's price: that is what it should be measured against. It is called the **current yield**.\n\n$$\\text{current yield} = \\frac{c}{P}$$\n\n\\(c\\) = one year's coupon, \\(P\\) = today's price.\n\n$$\\frac{${W.fs(p.c)}}{${W.fn(p.P)}} = ${W.f(W.pct(ok, 2))}$$\n\n${p.P < 100 ? 'The price is below 100: the same coupon weighs more on a lower outlay.' : 'The price is above 100: the same coupon weighs less on a higher outlay.'}`,
        err: { nominale: 'This is the coupon compared with the face value: but you do not pay 100, you pay today’s price.', rovescio: 'You multiplied the coupon by the price: divide it by the price.', sconto: 'You added the gap between 100 and the price to the coupon: that is collected (or lost) at maturity, not every year.' }
      }
    },
    portafoglio: {
      liv: 2, tema: 'rischio', forma: 'seg2',
      par: R => { const w = scegli(R, [20, 25, 30, 40, 60, 70, 75, 80]), a = scegli(R, [-20, -10, 6, 8, 10, 12, 15, 20]), b = scegli(R, [-2, 1, 2, 3, 4, 5]); return { w, a, b }; },
      ok: p => (p.w * p.a + (100 - p.w) * p.b) / 100,
      err: { media: p => (p.a + p.b) / 2, soloazioni: p => p.w * p.a / 100, somma: p => p.a + p.b },
      it: {
        q: (p, W) => `Hai ${W.ilp(p.w)} dei tuoi soldi in azioni e il resto in obbligazioni. In un anno le azioni fanno ${W.seg(p.a)} e le obbligazioni ${W.seg(p.b)}. Quanto ha reso tutto il portafoglio?`,
        exp: (p, W, ok) => `Ogni parte conta per il **peso** che ha nel portafoglio: è una media pesata.\n\n$$R_p = w_A \\times R_A + w_O \\times R_O$$\n\n\\(w_A\\) = quota in azioni, \\(R_A\\) = rendimento delle azioni, \\(w_O\\) = quota in obbligazioni, \\(R_O\\) = rendimento delle obbligazioni.\n\n$$R_p = ${W.fn(p.w / 100, 2, true)} \\times ${p.a < 0 ? '(' + W.f(W.pct(p.a)) + ')' : W.f(W.pct(p.a))} + ${W.fn(1 - p.w / 100, 2, true)} \\times ${p.b < 0 ? '(' + W.f(W.pct(p.b)) + ')' : W.f(W.pct(p.b))} = ${W.f(W.seg(ok, 2))}$$`,
        err: { media: 'Hai fatto la media semplice dei due rendimenti: andrebbe bene solo con metà dei soldi da una parte e metà dall\'altra.', soloazioni: 'Hai contato solo le azioni: manca la parte in obbligazioni.', somma: 'Hai sommato i due rendimenti: ognuno va prima moltiplicato per la sua quota.' }
      },
      en: {
        q: (p, W) => `You have ${W.pct(p.w)} of your money in stocks and the rest in bonds. In one year the stocks return ${W.seg(p.a)} and the bonds ${W.seg(p.b)}. How much did the whole portfolio return?`,
        exp: (p, W, ok) => `Each part counts for the **weight** it has in the portfolio: it is a weighted average.\n\n$$R_p = w_S \\times R_S + w_B \\times R_B$$\n\n\\(w_S\\) = share in stocks, \\(R_S\\) = return on the stocks, \\(w_B\\) = share in bonds, \\(R_B\\) = return on the bonds.\n\n$$R_p = ${W.fn(p.w / 100, 2, true)} \\times ${p.a < 0 ? '(' + W.f(W.pct(p.a)) + ')' : W.f(W.pct(p.a))} + ${W.fn(1 - p.w / 100, 2, true)} \\times ${p.b < 0 ? '(' + W.f(W.pct(p.b)) + ')' : W.f(W.pct(p.b))} = ${W.f(W.seg(ok, 2))}$$`,
        err: { media: 'You took the simple average of the two returns: that would work only with half the money on each side.', soloazioni: 'You counted only the stocks: the bond part is missing.', somma: 'You added the two returns: each one must first be multiplied by its share.' }
      }
    },
    totale: {
      liv: 2, tema: 'azioni', forma: 'seg',
      par: R => { const A = scegli(R, [20, 25, 40, 50, 80, 100, 200]), g = scegli(R, [-20, -10, -5, 5, 10, 15, 20, 30]), d = scegli(R, [1, 2, 3, 4, 5]), B = A * (1 + g / 100), D = A * d / 100; return intero(B * 2) && intero(D * 100) ? { A, B: giro(B, 2), D: giro(D, 2) } : null; },
      ok: p => (p.B - p.A + p.D) / p.A * 100,
      err: { soloprezzo: p => (p.B - p.A) / p.A * 100, solodiv: p => p.D / p.A * 100, suarrivo: p => (p.B - p.A + p.D) / p.B * 100 },
      it: {
        q: (p, W) => `Compri un'azione a ${W.soldi(p.A)}. Dopo un anno vale ${W.soldi(p.B)} e nel frattempo hai incassato ${W.soldi(p.D)} di dividendo. Quanto hai guadagnato o perso in tutto, in percentuale di quello che hai speso?`,
        exp: (p, W, ok) => `Il **rendimento totale** mette insieme le due cose: quanto è cambiato il prezzo e quanto hai incassato di dividendo.\n\n$$R = \\frac{P_1 - P_0 + D}{P_0}$$\n\n\\(P_0\\) = prezzo a cui hai comprato, \\(P_1\\) = prezzo dopo un anno, \\(D\\) = dividendo incassato.\n\n$$R = \\frac{${W.fs(p.B)} - ${W.fn(p.A)} + ${W.fs(p.D)}}{${W.fn(p.A)}} = ${W.f(W.seg(ok))}$$`,
        err: { soloprezzo: 'Hai guardato solo il prezzo: manca il dividendo incassato.', solodiv: 'Hai contato solo il dividendo: manca quanto è cambiato il prezzo.', suarrivo: 'Hai diviso per il prezzo finale: il rendimento si calcola su quello che hai speso all\'inizio.' }
      },
      en: {
        q: (p, W) => `You buy a stock at ${W.soldi(p.A)}. After one year it is worth ${W.soldi(p.B)} and in the meantime you collected ${W.soldi(p.D)} in dividends. How much did you gain or lose in total, as a percentage of what you spent?`,
        exp: (p, W, ok) => `The **total return** puts the two things together: how much the price changed and how much you collected in dividends.\n\n$$R = \\frac{P_1 - P_0 + D}{P_0}$$\n\n\\(P_0\\) = price you bought at, \\(P_1\\) = price after one year, \\(D\\) = dividend collected.\n\n$$R = \\frac{${W.fs(p.B)} - ${W.fn(p.A)} + ${W.fs(p.D)}}{${W.fn(p.A)}} = ${W.f(W.seg(ok))}$$`,
        err: { soloprezzo: 'You looked only at the price: the dividend you collected is missing.', solodiv: 'You counted only the dividend: the change in price is missing.', suarrivo: 'You divided by the final price: the return is figured on what you spent at the start.' }
      }
    },
    margine: {
      liv: 1, tema: 'azienda', forma: 'pct',
      par: R => { const Ri = scegli(R, [20000, 30000, 40000, 50000, 60000, 80000, 100000, 120000, 150000, 200000, 250000, 300000, 400000, 500000, 800000, 1000000, 2000000, 5000000]), m = 2 + Math.floor(R() * 44); return { R: Ri, C: Math.round(Ri * (100 - m) / 100) }; },
      ok: p => (p.R - p.C) / p.R * 100,
      err: { costi: p => p.C / p.R * 100, suicosti: p => (p.R - p.C) / p.C * 100, rapporto: p => p.R / p.C * 100 },
      it: {
        q: (p, W) => `In un anno un'azienda incassa ${W.soldi(p.R)} dalle vendite e spende ${W.soldi(p.C)}. Che parte delle vendite le resta come utile, in percentuale?`,
        exp: (p, W, ok) => `È il **margine di utile**: quanto resta in tasca all'azienda per ogni 100 di vendite.\n\n$$\\text{margine} = \\frac{R - C}{R}$$\n\n\\(R\\) = ricavi (quello che incassa dalle vendite), \\(C\\) = costi.\n\n$$\\frac{${W.fn(p.R)} - ${W.fn(p.C)}}{${W.fn(p.R)}} = ${W.f(W.pct(ok))}$$`,
        err: { costi: 'Questa è la parte delle vendite che se ne va in costi: l\'utile è quello che resta.', suicosti: 'Hai diviso l\'utile per i costi: il margine si calcola sulle vendite.', rapporto: 'Hai diviso le vendite per i costi: prima va trovato l\'utile, poi lo si divide per le vendite.' }
      },
      en: {
        q: (p, W) => `In one year a company takes in ${W.soldi(p.R)} from sales and spends ${W.soldi(p.C)}. What share of its sales is left as profit, as a percentage?`,
        exp: (p, W, ok) => `This is the **profit margin**: how much the company keeps for every 100 of sales.\n\n$$\\text{margin} = \\frac{R - C}{R}$$\n\n\\(R\\) = revenue (what it takes in from sales), \\(C\\) = costs.\n\n$$\\frac{${W.fn(p.R)} - ${W.fn(p.C)}}{${W.fn(p.R)}} = ${W.f(W.pct(ok))}$$`,
        err: { costi: 'This is the share of sales that goes to costs: the profit is what is left.', suicosti: 'You divided the profit by the costs: the margin is figured on sales.', rapporto: 'You divided sales by costs: first find the profit, then divide it by sales.' }
      }
    }
  };

  function lontano(v, altri, ok, F) { const soglia = Math.max(F.abs, F.rel * Math.abs(ok)); return altri.every(u => Math.abs(v - u) >= soglia - 1e-9); }
  function creaCalcolo(T, R) {
    const F = FORMA[T.forma];
    for (let giri = 0; giri < 300; giri++) {
      const p = T.par(R); if (!p) continue;
      const ok = giro(T.ok(p), F.d); if (!isFinite(ok)) continue;
      const sb = [];
      for (const k of mescola(R, Object.keys(T.err))) {
        const x = T.err[k](p); if (x == null || !isFinite(x)) continue;
        const v = giro(x, F.d); if (!F.segno && v <= 0) continue;
        if (lontano(v, [ok].concat(sb.map(s => s.v)), ok, F)) sb.push({ k, v });
        if (sb.length === 2) break;
      }
      if (sb.length < 2) continue;
      const o = mescola(R, [{ k: 'ok', v: ok }].concat(sb));
      return { p, o, a: o.findIndex(x => x.k === 'ok') };
    }
    return null;   // il collaudo controlla che non succeda mai
  }

  // =====================================================================================================
  // TABELLE DI FATTI (fonti in dev/ordine/FONTI_GIOCHI.md)
  // =====================================================================================================
  // Persone: chi (domanda → nome) e cosa (nome → idea). `piu`: il nome è di due persone.
  const PERSONE = [
    { id: 'smith', nome: 'Adam Smith',
      it: { q: 'Chi ha scritto «La ricchezza delle nazioni», il libro del 1776 da cui parte l\'economia moderna?', cosa: '«La ricchezza delle nazioni» e l\'immagine della mano invisibile', exp: '**Adam Smith** pubblicò «La ricchezza delle nazioni» nel 1776. Lì compare l\'immagine della mano invisibile: chi cerca il proprio guadagno finisce spesso per fare anche l\'interesse degli altri.' },
      en: { q: 'Who wrote ‘The Wealth of Nations’, the 1776 book where modern economics begins?', cosa: '‘The Wealth of Nations’ and the image of the invisible hand', exp: '**Adam Smith** published ‘The Wealth of Nations’ in 1776. It contains the image of the invisible hand: people seeking their own gain often end up serving the interest of others too.' } },
    { id: 'ricardo', nome: 'David Ricardo',
      it: { q: 'Chi ha spiegato il vantaggio comparato, cioè perché a due paesi conviene commerciare anche quando uno dei due è più bravo in tutto?', cosa: 'Il vantaggio comparato nel commercio tra paesi', exp: '**David Ricardo** espose il vantaggio comparato nel 1817: a ogni paese conviene produrre ciò in cui è relativamente più bravo e scambiare il resto.' },
      en: { q: 'Who explained comparative advantage, that is, why two countries gain from trading even when one of them is better at everything?', cosa: 'Comparative advantage in trade between countries', exp: '**David Ricardo** set out comparative advantage in 1817: each country gains by producing what it is relatively better at and trading for the rest.' } },
    { id: 'keynes', nome: 'John Maynard Keynes',
      it: { q: 'Chi ha scritto la «Teoria generale» del 1936, sostenendo che nelle crisi lo Stato può sostenere la spesa quando famiglie e imprese la tagliano?', cosa: 'La «Teoria generale»: nelle crisi lo Stato può sostenere la spesa', exp: '**John Maynard Keynes** pubblicò la «Teoria generale dell\'occupazione, dell\'interesse e della moneta» nel 1936, negli anni della Grande Depressione.' },
      en: { q: 'Who wrote the 1936 ‘General Theory’, arguing that in a slump the government can support spending when households and businesses cut back?', cosa: 'The ‘General Theory’: in a slump the government can support spending', exp: '**John Maynard Keynes** published ‘The General Theory of Employment, Interest and Money’ in 1936, during the Great Depression.' } },
    { id: 'marx', nome: 'Karl Marx',
      it: { q: 'Chi ha scritto «Il Capitale», il cui primo volume uscì nel 1867?', cosa: '«Il Capitale», una critica del capitalismo', exp: '**Karl Marx** pubblicò il primo volume de «Il Capitale» nel 1867.' },
      en: { q: 'Who wrote ‘Capital’ (‘Das Kapital’), whose first volume came out in 1867?', cosa: '‘Capital’, a critique of capitalism', exp: '**Karl Marx** published the first volume of ‘Capital’ in 1867.' } },
    { id: 'friedman', nome: 'Milton Friedman',
      it: { q: 'Quale economista, premio Nobel nel 1976, è il nome più noto del monetarismo, l\'idea che l\'inflazione dipenda dalla quantità di moneta in circolazione?', cosa: 'Il monetarismo: l\'inflazione dipende dalla quantità di moneta', exp: '**Milton Friedman**, premio Nobel per l\'economia nel 1976, sosteneva che l\'inflazione nasce quando la moneta in circolazione cresce più in fretta della produzione.' },
      en: { q: 'Which economist, a 1976 Nobel laureate, is the best-known name in monetarism, the idea that inflation depends on the amount of money in circulation?', cosa: 'Monetarism: inflation depends on the amount of money', exp: '**Milton Friedman**, winner of the 1976 Nobel Prize in economics, argued that inflation arises when the money in circulation grows faster than output.' } },
    { id: 'markowitz', nome: 'Harry Markowitz',
      it: { q: 'Chi ha mostrato nel 1952 come costruire un portafoglio guardando insieme rendimento e rischio, dando una base matematica alla diversificazione?', cosa: 'La teoria del portafoglio: diversificare riduce il rischio', exp: '**Harry Markowitz** pubblicò «Portfolio Selection» nel 1952: il rischio di un portafoglio dipende da come i titoli si muovono tra loro, non solo dal rischio di ciascuno.' },
      en: { q: 'Who showed in 1952 how to build a portfolio by looking at return and risk together, giving diversification a mathematical basis?', cosa: 'Portfolio theory: diversifying reduces risk', exp: '**Harry Markowitz** published ‘Portfolio Selection’ in 1952: the risk of a portfolio depends on how its securities move together, not only on the risk of each one.' } },
    { id: 'sharpe', nome: 'William Sharpe',
      it: { q: 'Quale economista dà il nome all\'indice che misura quanto rendimento in più ottieni per ogni unità di rischio che corri?', cosa: 'L\'indice che confronta il rendimento con il rischio corso', exp: '**William Sharpe** propose negli anni Sessanta l\'indice che porta il suo nome: rendimento in più rispetto a un investimento senza rischio, diviso per il rischio corso.' },
      en: { q: 'Which economist gave his name to the ratio that measures how much extra return you get for each unit of risk you take?', cosa: 'The ratio that compares return with the risk taken', exp: '**William Sharpe** proposed in the 1960s the ratio that bears his name: the return above a risk-free investment, divided by the risk taken.' } },
    { id: 'fama', nome: 'Eugene Fama',
      it: { q: 'Chi ha formulato l\'ipotesi dei mercati efficienti, secondo cui i prezzi contengono già le informazioni disponibili?', cosa: 'L\'ipotesi dei mercati efficienti: i prezzi contengono già le informazioni', exp: '**Eugene Fama** è l\'economista legato all\'ipotesi dei mercati efficienti: se i prezzi riflettono già le informazioni disponibili, battere il mercato con regolarità è molto difficile.' },
      en: { q: 'Who formulated the efficient market hypothesis, which says prices already contain the available information?', cosa: 'The efficient market hypothesis: prices already contain the information', exp: '**Eugene Fama** is the economist tied to the efficient market hypothesis: if prices already reflect the available information, beating the market consistently is very hard.' } },
    { id: 'kahneman', nome: 'Daniel Kahneman',
      it: { q: 'Quale psicologo, premio Nobel per l\'economia nel 2002, ha mostrato con Amos Tversky che una perdita pesa più di un guadagno della stessa cifra?', cosa: 'Con Tversky: una perdita pesa più di un guadagno uguale', exp: '**Daniel Kahneman** studiò con Amos Tversky come le persone decidono davvero. Nel 2002 ricevette il Nobel per l\'economia.' },
      en: { q: 'Which psychologist, winner of the 2002 Nobel Prize in economics, showed with Amos Tversky that a loss weighs more than a gain of the same size?', cosa: 'With Tversky: a loss weighs more than an equal gain', exp: '**Daniel Kahneman** studied with Amos Tversky how people really decide. In 2002 he received the Nobel Prize in economics.' } },
    { id: 'graham', nome: 'Benjamin Graham',
      it: { q: 'Chi ha scritto «L\'investitore intelligente» (1949) ed è considerato il padre dell\'investimento basato sul valore?', cosa: '«L\'investitore intelligente»: comprare a meno di quanto vale', exp: '**Benjamin Graham** pubblicò «L\'investitore intelligente» nel 1949. Tra i suoi allievi ci fu Warren Buffett.' },
      en: { q: 'Who wrote ‘The Intelligent Investor’ (1949) and is considered the father of value investing?', cosa: '‘The Intelligent Investor’: buying for less than it is worth', exp: '**Benjamin Graham** published ‘The Intelligent Investor’ in 1949. Warren Buffett was one of his students.' } },
    { id: 'bogle', nome: 'John Bogle',
      it: { q: 'Chi ha fondato Vanguard e lanciato nel 1976 il primo fondo indicizzato aperto ai piccoli risparmiatori?', cosa: 'Il primo fondo indicizzato per i piccoli risparmiatori', exp: '**John Bogle** fondò Vanguard e nel 1976 lanciò il primo fondo aperto a tutti che si limitava a copiare un indice di Borsa, con costi bassi.' },
      en: { q: 'Who founded Vanguard and in 1976 launched the first index fund open to small investors?', cosa: 'The first index fund for small investors', exp: '**John Bogle** founded Vanguard and in 1976 launched the first fund open to everyone that simply copied a stock index, at low cost.' } },
    { id: 'malthus', nome: 'Thomas Malthus',
      it: { q: 'Chi sostenne nel 1798 che la popolazione tende a crescere più in fretta del cibo disponibile?', cosa: 'La popolazione tende a crescere più in fretta del cibo', exp: '**Thomas Malthus** pubblicò il «Saggio sul principio di popolazione» nel 1798.' },
      en: { q: 'Who argued in 1798 that population tends to grow faster than the food supply?', cosa: 'Population tends to grow faster than the food supply', exp: '**Thomas Malthus** published ‘An Essay on the Principle of Population’ in 1798.' } },
    { id: 'schumpeter', nome: 'Joseph Schumpeter',
      it: { q: 'Chi ha reso celebre l\'espressione «distruzione creatrice», con cui le imprese e i prodotti nuovi prendono il posto di quelli vecchi?', cosa: 'La distruzione creatrice: il nuovo prende il posto del vecchio', exp: '**Joseph Schumpeter** rese celebre l\'espressione «distruzione creatrice» nel libro «Capitalismo, socialismo e democrazia» del 1942.' },
      en: { q: 'Who made famous the phrase ‘creative destruction’, by which new firms and products take the place of old ones?', cosa: 'Creative destruction: the new takes the place of the old', exp: '**Joseph Schumpeter** made the phrase ‘creative destruction’ famous in his 1942 book ‘Capitalism, Socialism and Democracy’.' } },
    { id: 'pareto', nome: 'Vilfredo Pareto',
      it: { q: 'Quale economista italiano dà il nome alla situazione in cui non si può far stare meglio qualcuno senza far stare peggio qualcun altro?', cosa: 'Nessuno può stare meglio senza che un altro stia peggio', exp: '**Vilfredo Pareto** dà il nome all\'ottimo paretiano: una situazione in cui ogni miglioramento per qualcuno costerebbe un peggioramento a qualcun altro.' },
      en: { q: 'Which Italian economist gave his name to the situation where no one can be made better off without making someone else worse off?', cosa: 'No one can be better off without someone else being worse off', exp: '**Vilfredo Pareto** gave his name to Pareto efficiency: a situation where any improvement for someone would cost someone else a loss.' } },
    { id: 'fisher', nome: 'Irving Fisher',
      it: { q: 'Quale economista dà il nome all\'equazione che lega tasso nominale, tasso reale e inflazione?', cosa: 'L\'equazione che lega tasso nominale, tasso reale e inflazione', exp: '**Irving Fisher** dà il nome all\'equazione che separa il tasso che vedi (nominale) da quello che resta dopo l\'inflazione (reale).' },
      en: { q: 'Which economist gave his name to the equation that links the nominal rate, the real rate and inflation?', cosa: 'The equation that links the nominal rate, the real rate and inflation', exp: '**Irving Fisher** gave his name to the equation that separates the rate you see (nominal) from what is left after inflation (real).' } },
    { id: 'modigliani', nome: 'Franco Modigliani',
      it: { q: 'Quale economista italiano, premio Nobel nel 1985, firmò con Merton Miller il teorema sul rapporto tra i debiti di un\'impresa e il suo valore?', cosa: 'Con Miller: il teorema sul rapporto tra debiti e valore dell\'impresa', exp: '**Franco Modigliani** e Merton Miller pubblicarono il loro teorema nel 1958. Modigliani ricevette il Nobel per l\'economia nel 1985.' },
      en: { q: 'Which Italian economist, a 1985 Nobel laureate, wrote with Merton Miller the theorem on the relation between a firm’s debt and its value?', cosa: 'With Miller: the theorem on the relation between debt and firm value', exp: '**Franco Modigliani** and Merton Miller published their theorem in 1958. Modigliani received the Nobel Prize in economics in 1985.' } },
    { id: 'pacioli', nome: 'Luca Pacioli',
      it: { q: 'Quale frate matematico descrisse in un libro del 1494 la partita doppia, il metodo con cui si tengono ancora oggi i conti delle aziende?', cosa: 'La prima descrizione a stampa della partita doppia', exp: '**Luca Pacioli** descrisse la partita doppia nella «Summa de arithmetica», stampata a Venezia nel 1494. Il metodo era già usato dai mercanti: lui lo mise per iscritto.' },
      en: { q: 'Which friar and mathematician described double-entry bookkeeping, the method still used to keep company accounts, in a 1494 book?', cosa: 'The first printed description of double-entry bookkeeping', exp: '**Luca Pacioli** described double-entry bookkeeping in the ‘Summa de arithmetica’, printed in Venice in 1494. Merchants already used the method: he put it in writing.' } },
    { id: 'nash', nome: 'John Nash',
      it: { q: 'Quale matematico dà il nome all\'equilibrio in cui a nessun giocatore conviene cambiare mossa da solo?', cosa: 'L\'equilibrio in cui a nessuno conviene cambiare mossa da solo', exp: '**John Nash** dà il nome all\'equilibrio più usato nella teoria dei giochi. Nel 1994 ricevette il Nobel per l\'economia.' },
      en: { q: 'Which mathematician gave his name to the equilibrium where no player gains by changing their move alone?', cosa: 'The equilibrium where no one gains by changing their move alone', exp: '**John Nash** gave his name to the most widely used equilibrium in game theory. In 1994 he received the Nobel Prize in economics.' } },
    { id: 'minsky', nome: 'Hyman Minsky',
      it: { q: 'Quale economista sostenne che i periodi di calma spingono a fare troppi debiti, e che così la stabilità prepara la crisi successiva?', cosa: 'La stabilità spinge a fare troppi debiti e prepara la crisi', exp: '**Hyman Minsky** è l\'economista dell\'ipotesi dell\'instabilità finanziaria. Il momento in cui i debiti accumulati fanno scattare la crisi viene chiamato «momento Minsky».' },
      en: { q: 'Which economist argued that calm periods push people to take on too much debt, so that stability prepares the next crisis?', cosa: 'Stability pushes people into too much debt and prepares the crisis', exp: '**Hyman Minsky** is the economist of the financial instability hypothesis. The moment when built-up debt sets off the crisis is called a ‘Minsky moment’.' } },
    { id: 'blackscholes', nome: 'Fischer Black e Myron Scholes', nomeEn: 'Fischer Black and Myron Scholes', piu: true,
      it: { q: 'Chi pubblicò nel 1973 la formula più famosa per calcolare il prezzo delle opzioni?', cosa: 'La formula del 1973 per il prezzo delle opzioni', exp: '**Fischer Black e Myron Scholes** pubblicarono la loro formula nel 1973. Nello stesso anno Robert Merton ne ampliò la teoria.' },
      en: { q: 'Who published in 1973 the most famous formula for pricing options?', cosa: 'The 1973 formula for pricing options', exp: '**Fischer Black and Myron Scholes** published their formula in 1973. In the same year Robert Merton extended the theory.' } }
  ];
  // Eventi: quando (domanda → anno) e prima (quale dei tre è avvenuto per primo). `evita`: anni che non devono comparire tra le risposte sbagliate.
  const EVENTI = [
    { id: 'mps', anno: 1472,
      it: { q: 'A quale anno fa risalire le sue origini il Monte dei Paschi di Siena, considerata la banca più antica ancora in attività?', nome: 'La nascita a Siena del Monte Pio, poi Monte dei Paschi', exp: 'Il Monte dei Paschi fa risalire le sue origini al **1472**, quando a Siena nacque il Monte Pio. Il nome di oggi arrivò nel 1624. È considerata la banca più antica ancora in attività.' },
      en: { q: 'To what year does Monte dei Paschi di Siena, considered the oldest bank still in business, trace its origins?', nome: 'The founding in Siena of the Monte Pio, later Monte dei Paschi', exp: 'Monte dei Paschi traces its origins to **1472**, when the Monte Pio was set up in Siena. Today’s name came in 1624. It is considered the oldest bank still in business.' } },
    { id: 'voc', anno: 1602,
      it: { q: 'In che anno nacque la Compagnia olandese delle Indie Orientali, considerata la prima società con azioni scambiate in Borsa?', nome: 'La nascita della Compagnia olandese delle Indie Orientali', exp: 'La Compagnia olandese delle Indie Orientali nacque nel **1602**. Le sue azioni si scambiavano ad Amsterdam: è considerata la prima società quotata.' },
      en: { q: 'In what year was the Dutch East India Company founded, considered the first company with shares traded on an exchange?', nome: 'The founding of the Dutch East India Company', exp: 'The Dutch East India Company was founded in **1602**. Its shares were traded in Amsterdam: it is considered the first publicly traded company.' } },
    { id: 'tulipani', anno: 1637,
      it: { q: 'In che anno scoppiò in Olanda la bolla dei tulipani, quando i prezzi dei bulbi crollarono di colpo?', nome: 'Lo scoppio della bolla dei tulipani in Olanda', exp: 'I prezzi dei bulbi di tulipano crollarono nel febbraio del **1637**: è una delle prime bolle speculative di cui si ha notizia.' },
      en: { q: 'In what year did the tulip bubble burst in Holland, when bulb prices suddenly collapsed?', nome: 'The bursting of the tulip bubble in Holland', exp: 'Tulip bulb prices collapsed in February **1637**: it is one of the first speculative bubbles on record.' } },
    { id: 'boe', anno: 1694,
      it: { q: 'In che anno fu fondata la Banca d\'Inghilterra?', nome: 'La fondazione della Banca d\'Inghilterra', exp: 'La Banca d\'Inghilterra fu fondata nel **1694**: è una delle banche centrali più antiche del mondo.' },
      en: { q: 'In what year was the Bank of England founded?', nome: 'The founding of the Bank of England', exp: 'The Bank of England was founded in **1694**: it is one of the oldest central banks in the world.' } },
    { id: 'buttonwood', anno: 1792,
      it: { q: 'In che anno un gruppo di agenti firmò a New York l\'accordo di Buttonwood, da cui nacque la Borsa di Wall Street?', nome: 'L\'accordo di Buttonwood a New York', exp: 'L\'accordo di Buttonwood fu firmato a New York nel **1792**: da quel gruppo di agenti nacque la Borsa di New York.' },
      en: { q: 'In what year did a group of brokers in New York sign the Buttonwood Agreement, from which the Wall Street stock exchange was born?', nome: 'The Buttonwood Agreement in New York', exp: 'The Buttonwood Agreement was signed in New York in **1792**: the New York Stock Exchange grew out of that group of brokers.' } },
    { id: 'fed', anno: 1913,
      it: { q: 'In che anno fu creata la Federal Reserve, la banca centrale degli Stati Uniti?', nome: 'La nascita della Federal Reserve', exp: 'La Federal Reserve fu creata con una legge del dicembre **1913**.' },
      en: { q: 'In what year was the Federal Reserve, the central bank of the United States, created?', nome: 'The creation of the Federal Reserve', exp: 'The Federal Reserve was created by a law passed in December **1913**.' } },
    { id: 'crollo29', anno: 1929,
      it: { q: 'In che anno ci fu il grande crollo di Wall Street a cui seguì la Grande Depressione?', nome: 'Il grande crollo di Wall Street', exp: 'La Borsa di New York crollò nell\'ottobre del **1929**. Seguì la Grande Depressione.' },
      en: { q: 'In what year was the great Wall Street crash that was followed by the Great Depression?', nome: 'The great Wall Street crash', exp: 'The New York stock market crashed in October **1929**. The Great Depression followed.' } },
    { id: 'bretton', anno: 1944,
      it: { q: 'In che anno furono firmati gli accordi di Bretton Woods, che legarono le monete al dollaro e il dollaro all\'oro?', nome: 'Gli accordi di Bretton Woods', exp: 'Gli accordi di Bretton Woods furono firmati nel luglio del **1944**. Da lì nacquero anche il Fondo monetario internazionale e la Banca mondiale.' },
      en: { q: 'In what year were the Bretton Woods agreements signed, tying currencies to the dollar and the dollar to gold?', nome: 'The Bretton Woods agreements', exp: 'The Bretton Woods agreements were signed in July **1944**. The International Monetary Fund and the World Bank also came out of them.' } },
    { id: 'nixon', anno: 1971,
      it: { q: 'In che anno gli Stati Uniti sospesero la conversione del dollaro in oro, chiudendo di fatto il sistema di Bretton Woods?', nome: 'La fine della conversione del dollaro in oro', exp: 'Il presidente Nixon sospese la conversione del dollaro in oro nell\'agosto del **1971**.' },
      en: { q: 'In what year did the United States suspend the conversion of the dollar into gold, in effect ending the Bretton Woods system?', nome: 'The end of the dollar’s conversion into gold', exp: 'President Nixon suspended the conversion of the dollar into gold in August **1971**.' } },
    { id: 'lunedinero', anno: 1987,
      it: { q: 'In che anno ci fu il «lunedì nero», quando la Borsa di New York perse più del 20% in un solo giorno?', nome: 'Il «lunedì nero» della Borsa di New York', exp: 'Il 19 ottobre **1987** l\'indice Dow Jones perse più del 20% in una sola seduta.' },
      en: { q: 'In what year was ‘Black Monday’, when the New York stock market lost more than 20% in a single day?', nome: '‘Black Monday’ on the New York stock market', exp: 'On October 19, **1987**, the Dow Jones index lost more than 20% in a single session.' } },
    { id: 'maastricht', anno: 1992, evita: [1993],
      it: { q: 'In che anno fu firmato il Trattato di Maastricht, che aprì la strada all\'euro?', nome: 'La firma del Trattato di Maastricht', exp: 'Il Trattato di Maastricht fu firmato nel febbraio del **1992** ed entrò in vigore l\'anno dopo.' },
      en: { q: 'In what year was the Maastricht Treaty signed, opening the way to the euro?', nome: 'The signing of the Maastricht Treaty', exp: 'The Maastricht Treaty was signed in February **1992** and came into force the following year.' } },
    { id: 'bce', anno: 1998, evita: [1999],
      it: { q: 'In che anno è nata la Banca centrale europea?', nome: 'La nascita della Banca centrale europea', exp: 'La Banca centrale europea è nata il 1° giugno **1998**, pochi mesi prima dell\'euro.' },
      en: { q: 'In what year was the European Central Bank established?', nome: 'The establishment of the European Central Bank', exp: 'The European Central Bank was established on June 1, **1998**, a few months before the euro.' } },
    { id: 'euro', anno: 1999, evita: [1998, 2002],
      it: { q: 'In che anno è nato l\'euro, all\'inizio solo per i conti e i pagamenti elettronici?', nome: 'La nascita dell\'euro', exp: 'L\'euro è nato il 1° gennaio **1999**, all\'inizio solo per i conti e i pagamenti elettronici. Banconote e monete sono arrivate tre anni dopo.' },
      en: { q: 'In what year was the euro launched, at first only for accounts and electronic payments?', nome: 'The launch of the euro', exp: 'The euro was launched on January 1, **1999**, at first only for accounts and electronic payments. Banknotes and coins arrived three years later.' } },
    { id: 'dotcom', anno: 2000, evita: [1999, 2001, 2002],
      it: { q: 'In che anno la bolla delle società di internet (dot-com) toccò il massimo e cominciò a sgonfiarsi?', nome: 'Lo scoppio della bolla delle società di internet', exp: 'L\'indice Nasdaq toccò il massimo nel marzo del **2000**, poi cominciò una lunga discesa.' },
      en: { q: 'In what year did the internet company (dot-com) bubble peak and begin to deflate?', nome: 'The bursting of the dot-com bubble', exp: 'The Nasdaq index peaked in March **2000**, then began a long decline.' } },
    { id: 'contanti', anno: 2002, evita: [1999],
      it: { q: 'In che anno sono entrate in circolazione le banconote e le monete in euro?', nome: 'L\'arrivo di banconote e monete in euro', exp: 'Banconote e monete in euro sono entrate in circolazione il 1° gennaio **2002**.' },
      en: { q: 'In what year did euro banknotes and coins come into circulation?', nome: 'The arrival of euro banknotes and coins', exp: 'Euro banknotes and coins came into circulation on January 1, **2002**.' } },
    { id: 'lehman', anno: 2008, evita: [2007, 2009],
      it: { q: 'In che anno fallì la banca d\'affari americana Lehman Brothers?', nome: 'Il fallimento di Lehman Brothers', exp: 'Lehman Brothers dichiarò fallimento il 15 settembre **2008**: fu il momento più acuto della crisi finanziaria.' },
      en: { q: 'In what year did the U.S. investment bank Lehman Brothers go bankrupt?', nome: 'The bankruptcy of Lehman Brothers', exp: 'Lehman Brothers filed for bankruptcy on September 15, **2008**: it was the sharpest moment of the financial crisis.' } },
    { id: 'bitcoin', anno: 2009, evita: [2008],
      it: { q: 'In che anno è stato creato il primo blocco di Bitcoin?', nome: 'Il primo blocco di Bitcoin', exp: 'Il primo blocco di Bitcoin è stato creato nel gennaio del **2009**.' },
      en: { q: 'In what year was the first Bitcoin block created?', nome: 'The first Bitcoin block', exp: 'The first Bitcoin block was created in January **2009**.' } },
    { id: 'draghi', anno: 2012, evita: [2011],
      it: { q: 'In che anno Mario Draghi, presidente della BCE, disse che la banca avrebbe fatto «tutto il necessario» per salvare l\'euro?', nome: 'Il discorso di Draghi sul «tutto il necessario» per l\'euro', exp: 'Mario Draghi lo disse a Londra il 26 luglio **2012** («whatever it takes»). Dopo quel discorso la pressione sui titoli di Stato dei paesi più in difficoltà cominciò a scendere.' },
      en: { q: 'In what year did Mario Draghi, president of the ECB, say the bank would do ‘whatever it takes’ to save the euro?', nome: 'Draghi’s ‘whatever it takes’ speech on the euro', exp: 'Mario Draghi said it in London on July 26, **2012**. After that speech the pressure on the government bonds of the countries in most trouble began to ease.' } }
  ];
  // Monete: moneta (paese → moneta) e paese (moneta → paese). Ogni nome di moneta compare in una sola riga.
  const MONETE = [
    { id: 'jp', it: { paese: 'Giappone', di: 'del Giappone', val: 'Yen', il: 'lo yen', inn: 'in yen' }, en: { paese: 'Japan', di: 'Japan', val: 'Yen', il: 'the yen', la: 'the yen' } },
    { id: 'gb', it: { paese: 'Regno Unito', di: 'del Regno Unito', val: 'Sterlina', il: 'la sterlina', inn: 'in sterline' }, en: { paese: 'United Kingdom', di: 'the United Kingdom', val: 'Pound sterling', il: 'the pound sterling', la: 'the pound sterling' } },
    { id: 'ch', it: { paese: 'Svizzera', di: 'della Svizzera', val: 'Franco', il: 'il franco svizzero', inn: 'in franchi' }, en: { paese: 'Switzerland', di: 'Switzerland', val: 'Franc', il: 'the Swiss franc', la: 'the franc' } },
    { id: 'cn', it: { paese: 'Cina', di: 'della Cina', val: 'Yuan', il: 'lo yuan (renminbi)', inn: 'in yuan' }, en: { paese: 'China', di: 'China', val: 'Yuan', il: 'the yuan (renminbi)', la: 'the yuan' } },
    { id: 'in', it: { paese: 'India', di: 'dell\'India', val: 'Rupia', il: 'la rupia indiana', inn: 'in rupie' }, en: { paese: 'India', di: 'India', val: 'Rupee', il: 'the Indian rupee', la: 'the rupee' } },
    { id: 'br', it: { paese: 'Brasile', di: 'del Brasile', val: 'Real', il: 'il real', inn: 'in real' }, en: { paese: 'Brazil', di: 'Brazil', val: 'Real', il: 'the real', la: 'the real' } },
    { id: 'mx', it: { paese: 'Messico', di: 'del Messico', val: 'Peso', il: 'il peso messicano', inn: 'in pesos' }, en: { paese: 'Mexico', di: 'Mexico', val: 'Peso', il: 'the Mexican peso', la: 'the peso' } },
    { id: 'za', it: { paese: 'Sudafrica', di: 'del Sudafrica', val: 'Rand', il: 'il rand', inn: 'in rand' }, en: { paese: 'South Africa', di: 'South Africa', val: 'Rand', il: 'the rand', la: 'the rand' } },
    { id: 'kr', it: { paese: 'Corea del Sud', di: 'della Corea del Sud', val: 'Won', il: 'il won', inn: 'in won' }, en: { paese: 'South Korea', di: 'South Korea', val: 'Won', il: 'the won', la: 'the won' } },
    { id: 'pl', it: { paese: 'Polonia', di: 'della Polonia', val: 'Zloty', il: 'lo zloty', inn: 'in zloty' }, en: { paese: 'Poland', di: 'Poland', val: 'Zloty', il: 'the zloty', la: 'the zloty' } },
    { id: 'th', it: { paese: 'Thailandia', di: 'della Thailandia', val: 'Baht', il: 'il baht', inn: 'in baht' }, en: { paese: 'Thailand', di: 'Thailand', val: 'Baht', il: 'the baht', la: 'the baht' } },
    { id: 'se', it: { paese: 'Svezia', di: 'della Svezia', val: 'Corona', il: 'la corona svedese', inn: 'in corone' }, en: { paese: 'Sweden', di: 'Sweden', val: 'Krona', il: 'the Swedish krona', la: 'the krona' } }
  ];
  // Indici di Borsa: indice (indice → paese) e borsa (paese → indice).
  const INDICI = [
    { id: 'mib', nome: 'FTSE MIB', it: { paese: 'Italia', agg: 'italiane', exp: 'Il **FTSE MIB** è l\'indice delle principali società della Borsa di Milano.' }, en: { paese: 'Italy', agg: 'Italian', exp: 'The **FTSE MIB** is the index of the leading companies on the Milan stock exchange.' } },
    { id: 'dax', nome: 'DAX', it: { paese: 'Germania', agg: 'tedesche', exp: 'Il **DAX** è l\'indice delle principali società della Borsa di Francoforte.' }, en: { paese: 'Germany', agg: 'German', exp: 'The **DAX** is the index of the leading companies on the Frankfurt stock exchange.' } },
    { id: 'cac', nome: 'CAC 40', it: { paese: 'Francia', agg: 'francesi', exp: 'Il **CAC 40** è l\'indice delle principali società della Borsa di Parigi.' }, en: { paese: 'France', agg: 'French', exp: 'The **CAC 40** is the index of the leading companies on the Paris stock exchange.' } },
    { id: 'ftse', nome: 'FTSE 100', it: { paese: 'Regno Unito', agg: 'britanniche', exp: 'Il **FTSE 100** è l\'indice delle principali società della Borsa di Londra.' }, en: { paese: 'United Kingdom', agg: 'British', exp: 'The **FTSE 100** is the index of the leading companies on the London Stock Exchange.' } },
    { id: 'ibex', nome: 'IBEX 35', it: { paese: 'Spagna', agg: 'spagnole', exp: 'L\'**IBEX 35** è l\'indice delle principali società della Borsa di Madrid.' }, en: { paese: 'Spain', agg: 'Spanish', exp: 'The **IBEX 35** is the index of the leading companies on the Madrid stock exchange.' } },
    { id: 'nikkei', nome: 'Nikkei 225', it: { paese: 'Giappone', agg: 'giapponesi', exp: 'Il **Nikkei 225** è l\'indice più seguito della Borsa di Tokyo.' }, en: { paese: 'Japan', agg: 'Japanese', exp: 'The **Nikkei 225** is the most widely followed index of the Tokyo Stock Exchange.' } },
    { id: 'sp500', nome: 'S&P 500', it: { paese: 'Stati Uniti', agg: 'americane', exp: 'L\'**S&P 500** raccoglie 500 grandi società quotate negli Stati Uniti.' }, en: { paese: 'United States', agg: 'U.S.', exp: 'The **S&P 500** covers 500 large companies listed in the United States.' } },
    { id: 'smi', nome: 'SMI', it: { paese: 'Svizzera', agg: 'svizzere', exp: 'L\'**SMI** (Swiss Market Index) è l\'indice delle principali società quotate in Svizzera.' }, en: { paese: 'Switzerland', agg: 'Swiss', exp: 'The **SMI** (Swiss Market Index) is the index of the leading companies listed in Switzerland.' } },
    { id: 'aex', nome: 'AEX', it: { paese: 'Paesi Bassi', agg: 'olandesi', exp: 'L\'**AEX** è l\'indice delle principali società della Borsa di Amsterdam.' }, en: { paese: 'Netherlands', agg: 'Dutch', exp: 'The **AEX** is the index of the leading companies on the Amsterdam stock exchange.' } },
    { id: 'ibov', nome: 'Ibovespa', it: { paese: 'Brasile', agg: 'brasiliane', exp: 'L\'**Ibovespa** è l\'indice principale della Borsa di San Paolo.' }, en: { paese: 'Brazil', agg: 'Brazilian', exp: 'The **Ibovespa** is the main index of the São Paulo stock exchange.' } },
    { id: 'kospi', nome: 'KOSPI', it: { paese: 'Corea del Sud', agg: 'sudcoreane', exp: 'Il **KOSPI** è l\'indice principale della Borsa della Corea del Sud.' }, en: { paese: 'South Korea', agg: 'South Korean', exp: 'The **KOSPI** is the main index of the South Korean stock exchange.' } },
    { id: 'sensex', nome: 'Sensex', it: { paese: 'India', agg: 'indiane', exp: 'Il **Sensex** è l\'indice più noto della Borsa di Mumbai.' }, en: { paese: 'India', agg: 'Indian', exp: 'The **Sensex** is the best-known index of the Bombay Stock Exchange in Mumbai.' } }
  ];
  const perId = lista => { const m = {}; lista.forEach(x => { m[x.id] = x; }); return m; };
  const P_ID = perId(PERSONE), E_ID = perId(EVENTI), M_ID = perId(MONETE), I_ID = perId(INDICI);
  const ULTIMO_ANNO = 2025;   // gli anni sbagliati non vanno oltre

  // uno giusto e due sbagliati presi dalla stessa tabella, poi mescolati
  function terna(R, lista) {
    const m = mescola(R, lista), giusto = m[0], o = mescola(R, [giusto, m[1], m[2]]);
    return { p: { f: giusto.id }, o: o.map(x => ({ k: x.id })), a: o.indexOf(giusto) };
  }
  const FATTI = {
    chi: { liv: 2, tema: 'storia', crea: R => terna(R, PERSONE) },
    cosa: { liv: 2, tema: 'storia', crea: R => terna(R, PERSONE) },
    moneta: { liv: 1, tema: 'mondo', crea: R => terna(R, MONETE) },
    paese: { liv: 1, tema: 'mondo', crea: R => terna(R, MONETE) },
    indice: { liv: 2, tema: 'mondo', crea: R => terna(R, INDICI) },
    borsa: { liv: 2, tema: 'mondo', crea: R => terna(R, INDICI) },
    quando: { liv: 3, tema: 'storia', crea: R => {
      const e = scegli(R, EVENTI), eta = 2026 - e.anno, largo = Math.max(8, Math.min(60, Math.round(eta * 0.15))), anni = [e.anno];
      for (let giri = 0; giri < 400 && anni.length < 3; giri++) {
        const y = e.anno + (R() < 0.5 ? -1 : 1) * (4 + Math.floor(R() * (largo - 3)));
        if (y > ULTIMO_ANNO || (e.evita || []).indexOf(y) >= 0 || anni.some(a => Math.abs(a - y) < 4)) continue;
        anni.push(y);
      }
      if (anni.length < 3) return null;
      const o = mescola(R, anni);
      return { p: { f: e.id }, o: o.map(y => ({ k: y === e.anno ? 'ok' : 'anno', v: y })), a: o.indexOf(e.anno) };
    } },
    prima: { liv: 3, tema: 'storia', crea: R => {
      for (let giri = 0; giri < 200; giri++) {
        const t = mescola(R, EVENTI).slice(0, 3);
        if (Math.abs(t[0].anno - t[1].anno) < 5 || Math.abs(t[0].anno - t[2].anno) < 5 || Math.abs(t[1].anno - t[2].anno) < 5) continue;
        const primo = t.slice().sort((x, y) => x.anno - y.anno)[0];
        return { p: { f: primo.id }, o: t.map(x => ({ k: x.id })), a: t.indexOf(primo) };
      }
      return null;
    } }
  };
  // le parole dei fatti, per lingua
  const nomeP = (x, en) => en && x.nomeEn ? x.nomeEn : x.nome;
  const PAROLE = {
    chi: (N, L, en) => { const x = P_ID[N.p.f]; return { q: x[L].q, options: N.o.map(o => nomeP(P_ID[o.k], en)), exp: x[L].exp }; },
    cosa: (N, L, en) => { const x = P_ID[N.p.f]; return { q: en ? (x.piu ? `What are ${nomeP(x, en)} known for?` : `What is ${nomeP(x, en)} known for?`) : (x.piu ? `Per che cosa sono ricordati ${x.nome}?` : `Per che cosa è ricordato ${x.nome}?`), options: N.o.map(o => P_ID[o.k][L].cosa), exp: x[L].exp }; },
    moneta: (N, L, en) => { const x = M_ID[N.p.f][L]; return { q: en ? `What is the official currency of ${x.di}?` : `Qual è la moneta ufficiale ${x.di}?`, options: N.o.map(o => M_ID[o.k][L].val), exp: en ? `The official currency of ${x.di} is **${x.il}**.` : `La moneta ufficiale ${x.di} è **${x.il}**.` }; },
    paese: (N, L, en) => { const x = M_ID[N.p.f][L]; return { q: en ? `Which of these countries uses ${x.la}?` : `In quale di questi paesi si paga ${x.inn}?`, options: N.o.map(o => M_ID[o.k][L].paese), exp: en ? `The official currency of **${x.di}** is ${x.il}.` : `La moneta ufficiale **${x.di}** è ${x.il}.` }; },
    indice: (N, L, en) => { const x = I_ID[N.p.f]; return { q: en ? `The ${x.nome} index follows the leading stocks of which country?` : `L'indice ${x.nome} raccoglie le principali azioni di quale paese?`, options: N.o.map(o => I_ID[o.k][L].paese), exp: x[L].exp }; },
    borsa: (N, L, en) => { const x = I_ID[N.p.f]; return { q: en ? `Which of these indexes follows the leading ${x[L].agg} stocks?` : `Quale di questi indici raccoglie le principali azioni ${x[L].agg}?`, options: N.o.map(o => I_ID[o.k].nome), exp: x[L].exp }; },
    quando: (N, L) => { const x = E_ID[N.p.f]; return { q: x[L].q, options: N.o.map(o => String(o.v)), exp: x[L].exp }; },
    prima: (N, L, en) => {
      const righe = N.o.map(o => E_ID[o.k]).sort((x, y) => x.anno - y.anno).map(x => `• ${x.anno}: ${x[L].nome}`).join('\n');
      return { q: en ? 'Which of these happened first?' : 'Quale di questi fatti è avvenuto per primo?', options: N.o.map(o => E_ID[o.k][L].nome), exp: (en ? 'In order of time:' : 'In ordine di tempo:') + '\n' + righe };
    }
  };

  // =====================================================================================================
  // LE DUE FUNZIONI CHE SI USANO DA FUORI
  // =====================================================================================================
  const LINGUE = ['it', 'en'];
  const tipi = Object.keys(STAMPI).map(id => ({ id, fam: 'calcolo', liv: STAMPI[id].liv, tema: STAMPI[id].tema })).concat(Object.keys(FATTI).map(id => ({ id, fam: 'fatti', liv: FATTI[id].liv, tema: FATTI[id].tema })));
  // il nucleo di una domanda: { v, t: tipo, s: seme, fam, liv, p: dati, o: risposte [{ k, v }], a: posizione della giusta }
  function crea(tipo, seme) {
    const s = seme >>> 0, R = caso(s), T = STAMPI[tipo], F = FATTI[tipo];
    const x = T ? creaCalcolo(T, R) : F ? F.crea(R) : null;
    return x ? { v: V, t: tipo, s, fam: T ? 'calcolo' : 'fatti', liv: (T || F).liv, p: x.p, o: x.o, a: x.a } : null;
  }
  // le parole: { q, options, ans, exp, note: per ogni risposta sbagliata la riga che dice quale errore è (o null), key, lang }
  function testo(N, lingua, valuta) {
    const L = LINGUE.indexOf(lingua) >= 0 ? lingua : 'it', W = penna(L, valuta), T = STAMPI[N.t];
    let r;
    if (T) {
      const ok = N.o[N.a].v;
      r = { q: T[L].q(N.p, W), options: N.o.map(o => W.valore(T.forma, o.v)), exp: T[L].exp(N.p, W, ok), note: N.o.map(o => o.k === 'ok' ? null : T[L].err[o.k]) };
    } else { r = PAROLE[N.t](N, L, W.en); r.note = N.o.map(() => null); }
    r.ans = N.a; r.key = `gen:${N.t}:${N.s}`; r.lang = L;
    return r;
  }
  // l'impronta di una domanda: due domande con la stessa impronta sono la stessa domanda (serve a non ripeterle in una partita)
  const GRUPPO = { chi: 'P', cosa: 'P', moneta: 'M', paese: 'M', indice: 'I', borsa: 'I', quando: 'E' };
  const impronta = N => N.t === 'prima' ? 'prima|' + N.o.map(o => o.k).sort().join('+') : GRUPPO[N.t] ? GRUPPO[N.t] + '|' + N.p.f : N.t + '|' + JSON.stringify(N.p);
  return { V, LINGUE, tipi, crea, testo, impronta, caso, giro, STAMPI, FATTI, tabelle: { PERSONE, EVENTI, MONETE, INDICI } };
})();
// =====================================================================================================
// LA SERIE: domande generate senza fine (motore in p44_motore.js). Tre errori e la partita finisce.
// =====================================================================================================
// Tutto sul telefono: niente rete, niente arbitro. Il record resta nei dati salvati (serie.best).
const SERIE_VITE = 3;
const D_CUORE = 'M12 20.5s-7.5-4.7-7.5-10.4A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.7c0 5.7-7.5 10.4-7.5 10.4z';
const D_SENZAFINE = 'M6.5 8.5C4.6 8.5 3 10.1 3 12s1.6 3.5 3.5 3.5c3.5 0 7.5-7 11-7 1.9 0 3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5c-3.5 0-7.5-7-11-7z';
const semeNuovo = () => { try { return crypto.getRandomValues(new Uint32Array(1))[0]; } catch (e) { return Math.floor(Math.random() * 4294967296); } };
const serieStato = () => { const v = s2get().serie; return v && typeof v.best === 'number' ? v : { best: 0, n: 0, last: 0 }; };
// la domanda numero n (da 0): prima le facili, poi entrano le medie e le difficili; mai due volte di fila lo stesso tipo, mai lo stesso fatto in una partita
function serieDomanda(n, viste, ultimo) {
  const tetto = n < 4 ? 1 : n < 10 ? 2 : 3;
  const adatti = GEN.tipi.filter(t => t.liv <= tetto && t.id !== ultimo), alti = adatti.filter(t => t.liv === tetto);
  for (let giri = 0; giri < 80; giri++) {
    const rosa = alti.length && Math.random() < 0.5 ? alti : adatti;   // metà delle volte dal livello più alto raggiunto: così la partita sale
    const tipo = rosa[Math.floor(Math.random() * rosa.length)], N = GEN.crea(tipo.id, semeNuovo());
    if (!N || viste.has(GEN.impronta(N))) continue;
    viste.add(GEN.impronta(N));
    return Object.assign(GEN.testo(N, LANG, CUR), { tipo: tipo.id });
  }
  viste.clear(); return serieDomanda(n, viste, null);   // partita lunghissima, finite le domande nuove: si ricomincia a pescare
}
function SerieRun({ nav }) {
  useS2();
  const viste = useRef(new Set()), partenza = useRef(serieStato().best), scrollRef = useRef(null);
  const [q, setQ] = useState(() => serieDomanda(0, viste.current, null));
  const [n, setN] = useState(0), [okN, setOkN] = useState(0), [vite, setVite] = useState(SERIE_VITE), [sel, setSel] = useState(null), [fb, setFb] = useState(null), [tab, setTab] = useState('case'), [fine, setFine] = useState(false);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [n]);
  const best = serieStato().best;
  if (fine) {
    const record = okN > partenza.current;
    const ancora = () => { viste.current.clear(); partenza.current = serieStato().best; setQ(serieDomanda(0, viste.current, null)); setN(0); setOkN(0); setVite(SERIE_VITE); setSel(null); setFb(null); setFine(false); };
    return html`<${Flow} bg=${MENTA} top=${html`<${TopBar} onClose=${nav.back} title=""/>`}
      foot=${html`<${Btn} cls="lg" bg="#fff" onClick=${ancora}>Play again<//><div style="text-align:center;margin-top:6px"><button type="button" class="o-link" onClick=${nav.back}>Back to Practice</button></div>`}>
      <div class="o-col o-pad" style="align-items:center;text-align:center;padding-top:6px"><${Rally} pose=${record ? 'festeggia' : 'pensa'} w=${250} alt=""/>
        <h1 class="o-pop" style="font-size:40px;line-height:44px;font-weight:800;letter-spacing:-.02em;margin-top:-6px">${record ? 'New record!' : 'Run over'}</h1>
        <p class="o-body" style="margin-top:8px;max-width:300px">${record ? (partenza.current > 0 ? `Your record was ${partenza.current} before.` : 'This is your first run: from now on it is the number to beat.') : okN === 0 ? 'Three mistakes before one correct answer. That is what the explanations are for: try again.' : `Your record is still ${best}.`}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;margin-top:24px">
          <div class="o-col" style="padding:10px 14px;background:${GIALLO};border:2.5px solid ${INK};border-radius:18px;text-align:left"><span style="font-size:13px;font-weight:700">Correct answers</span><span style="font-size:22px;line-height:26px;font-weight:800">${okN}</span></div>
          <div class="o-col" style="padding:10px 14px;background:#fff;border:2.5px solid ${INK};border-radius:18px;text-align:left"><span class="o-s">Points</span><span style="font-size:22px;line-height:26px;font-weight:800">+${okN * 5} XP</span></div></div>
      </div><//>`;
  }
  const locked = !!fb;
  const next = () => {
    if (vite <= 0) { s2set(s => ({ serie: Object.assign({}, serieStato(), { n: (serieStato().n || 0) + 1, last: okN }) })); return setFine(true); }
    const k = n + 1; setQ(serieDomanda(k, viste.current, q.tipo)); setN(k); setSel(null); setFb(null); setTab('case');
  };
  const check = () => {
    if (sel === q.ans) {
      const tot = okN + 1; setOkN(tot); addXp(5);
      if (tot > serieStato().best) s2set(s => ({ serie: Object.assign({}, serieStato(), { best: tot }) }));
      return setFb('ok');
    }
    setVite(v => v - 1); setFb('ko');   // nel gioco la spiegazione dopo un errore c'è sempre: non conta nel limite gratis del giorno
  };
  // dopo un errore la spiegazione comincia dalla riga che dice quale errore è (se la risposta scelta nasce da un errore tipico)
  const qFb = fb === 'ko' && q.note[sel] ? Object.assign({}, q, { exp: q.note[sel] + '\n\n' + q.exp }) : q;
  const cuori = html`<span class="o-rowf" role="img" aria-label=${`Lives left: ${vite} of ${SERIE_VITE}`} style="gap:3px;flex:none">${[0, 1, 2].map(k => html`<span key=${k} style=${{ display: 'flex', opacity: k < vite ? 1 : 0.28 }}>${PathIco(D_CUORE, 22, 2.2, k < vite ? ROSA : 'none', INK)}</span>`)}</span>`;
  const over = fb === 'ok' ? html`<${FeedbackSheet} ok=${true} q=${qFb} xp=${5} onNext=${next}/>` : fb === 'ko' ? html`<${FeedbackSheet} ok=${false} q=${qFb} onNext=${next}/>` : null;
  return html`<${Flow} scrollRef=${scrollRef}
    top=${html`<${TopBar} onClose=${nav.back} mid=${html`<span class="o-grow" style="font-size:15px;line-height:20px;font-weight:800;white-space:nowrap">Correct: ${okN}</span>`} right=${cuori}/>`}
    foot=${html`<div class="o-rowf" style="gap:12px"><${IBtn} lg=${true} icon=${Ico(Calculator, 24, 2.2)} onClick=${nav.openCalc} label="Calculator"/><div class="o-grow"><${Btn} cls="lg" bg=${MENTA} disabled=${sel == null || locked} onClick=${check}>Check<//></div></div>`} over=${over}>
    <div class="o-test"><${QuestionBody} key=${n} q=${q} label=${`Question ${n + 1}`} sel=${sel} onSel=${setSel} locked=${locked} tab=${tab} setTab=${setTab}/></div><//>`;
}

// =====================================================================================================
// SFIDE, AI COACH, PROFILO, ALBUM, IMPOSTAZIONI, PRO, CATALOGO
// =====================================================================================================
// quello che oggi è davvero riservato a Pro (i test e il loro report sono per tutti, da quando non c'è più la simulazione d'esame)
const PRO_POINTS = ['Unlimited explanations', 'Practice on your weak spots', 'Calculator keys, step by step'];
const PRO_YEAR = CUR + '34.99', PRO_MONTH = CUR + '5.99';
const PRO_TRIAL_LINE = `7-day trial, then ${PRO_YEAR} a year.`;
function startPro(plan) { s2set({ pro: { since: Date.now(), plan: plan || 'year' } }); try { K.setIsPro(true); } catch (e) {} }
function stopPro() { s2set({ pro: null }); try { K.setIsPro(false); } catch (e) {} }
const Avatar = ({ ch, bg = '#fff', size = 40 }) => html`<span style=${{ width: size, height: size, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, border: `2px solid ${INK}`, borderRadius: '50%', fontSize: size * 0.4, fontWeight: 800 }}>${ch}</span>`;

function SfideScreen({ nav }) {
  useS2(); useTick();
  const [skip, setSkip] = useState(0);
  const lg = league(), me = lg.me;
  const rival = RIVALS[(RIVALS.indexOf(duelRival()) + skip) % RIVALS.length];
  const above = lg.rows[me.pos - 2];
  const ord = n => `#${n}`;
  const init = (userName() || 'T')[0].toUpperCase();
  return html`<${Room} color=${PESCA} tab="sfide" go=${nav.tab}
    rally=${html`<${Rally} pose="sfida" alt="Rally wearing a mask" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div class="o-col" style="align-items:flex-start;gap:14px;padding-top:4px;max-width:210px"><h1 class="o-h1">Challenges</h1><${Pill}>You're ${ord(me.pos)} in the league<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px;align-items:center;text-align:center">
      <div class="o-rowf" style="gap:14px;align-items:flex-start">
        <span class="o-col" style="align-items:center;gap:6px"><${Avatar} ch=${init} bg=${PESCA} size=${56}/><span class="o-s" style="color:${INK};font-weight:700">You</span></span>
        <span style="margin-top:14px;padding:3px 12px;background:${INK};color:#fff;border-radius:999px;font-size:14px;font-weight:800;transform:rotate(-4deg)">vs</span>
        <span class="o-col" style="align-items:center;gap:6px"><${Avatar} ch=${rival[0]} size=${56}/><span class="o-s" style="color:${INK};font-weight:700">${rival}</span></span></div>
      <div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">${rival} challenged you</div><div class="o-body o-mut">5 questions from your paths.<br/>Whoever gets more right wins.</div></div>
      <div class="o-rowf" style="gap:10px;width:100%"><div class="o-grow"><${Btn} bg=${PESCA} onClick=${() => nav.go('sfida', { rival })}>Accept challenge<//></div>
        <button type="button" class="o-btn flat" style="width:auto;background:#fff" onClick=${() => setSkip(skip + 1)}>Later</button></div>
    </div>
    ${SFIDE_ON && html`<div class="o-card o-col" style="gap:10px;margin-top:16px">
      <div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">Challenge a friend live</div>
      <p class="o-body o-mut">Lightning: the same 5 questions on both phones. The point goes to whoever answers correctly first.</p>
      <div class="o-col" style="gap:2px;width:100%;margin-top:4px;align-items:center"><${Btn} bg=${PESCA} onClick=${() => nav.go('live', { nuova: true })}>Create a challenge<//>
        <button type="button" class="o-link" onClick=${() => nav.go('live', {})}>I already have a code</button></div>
    </div>`}</div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:8px"><h2 class="o-h2">${lg.name}</h2><span class="o-lab">Ends Sunday</span></div>
      ${lg.rows.map(r => html`<div key=${r.name} class="o-rowf" style=${Object.assign({ gap: 12, height: 54, padding: '0 10px', borderRadius: 16 }, r.me ? { background: T_PESCA, border: `2.5px solid ${INK}` } : { border: '2.5px solid transparent' })}>
        <span style="width:22px;font-size:15px;font-weight:800;text-align:center">${r.pos}</span><${Avatar} ch=${r.me ? init : r.name[0]} bg=${r.me ? PESCA : '#fff'} size=${36}/>
        <span class="o-grow" style="font-size:17px;font-weight:700">${r.name}</span><span style="font-size:16px;font-weight:800">${fmtInt(r.xp)} XP</span></div>`)}
      <p class="o-s" style="margin-top:12px">${above ? `You need ${fmtInt(above.xp - me.xp + 1)} XP to pass ${above.name}.` : 'You\'re at the top of the league.'} Trial league: for now the others are simulated opponents.</p>
    <//>
  <//>`;
}
function duelQuestions() { const st = startedCourses(); const pool = (st.length ? st : misCourses()).flatMap(misLessons); const done = pool.filter(l => isHad(l.key)); const src = allQuestions(done).length >= 5 ? done : pool; return K.flShuffle(allQuestions(src)).slice(0, 5); }
function DuelRun({ nav, rival }) {
  const qs = useMemo(duelQuestions, []);
  const [i, setI] = useState(0), [sel, setSel] = useState(null), [show, setShow] = useState(false), [mine, setMine] = useState([]), [his, setHis] = useState([]), [el, setEl] = useState(0);
  const n = qs.length, q = qs[i], lim = q ? Math.round(q.lesson.course.pace / 2) : 30;
  const bot = useMemo(() => ({ t: 5 + Math.random() * Math.max(4, lim - 14), ok: Math.random() < 0.62 }), [i]);
  const t0 = useRef(Date.now()), fired = useRef(false), init = (userName() || 'T')[0].toUpperCase();
  const confirm = () => {
    if (fired.current || !q) return; fired.current = true;
    const ok = sel === q.ans; if (sel != null) recordAnswer(q, ok);
    const m2 = [...mine, ok], h2 = [...his, bot.ok]; setMine(m2); setHis(h2); setShow(true);
    setTimeout(() => {
      if (i < n - 1) { fired.current = false; t0.current = Date.now(); setEl(0); setSel(null); setShow(false); setI(i + 1); }
      else { const a = m2.filter(Boolean).length, b = h2.filter(Boolean).length, xp = a > b ? 30 : a === b ? 10 : 5; addXp(xp); s2set(s => ({ duel: { w: s.duel.w + (a > b ? 1 : 0), l: s.duel.l + (a < b ? 1 : 0), last: Date.now() } })); nav.replace('sfidaFine', { rival, a, b, xp }); }
    }, 1500);
  };
  useEffect(() => { const h = setInterval(() => { const e = (Date.now() - t0.current) / 1000; setEl(e); if (e >= lim && !fired.current) confirm(); }, 250); return () => clearInterval(h); }, [i, sel, mine, his]);
  if (!q) return html`<${Flow} top=${html`<${TopBar} onClose=${nav.back} title="Challenge"/>`}><p class="o-pad o-body" style="padding-top:20px">To challenge someone you need at least one lesson with a question.</p><//>`;
  const left = Math.max(0, Math.ceil(lim - el)), a = mine.filter(Boolean).length, b = his.filter(Boolean).length;
  const dot = (v, k) => html`<i key=${k} style=${{ width: 12, height: 12, borderRadius: '50%', border: `2px solid ${INK}`, background: v === true ? INK : v === false ? '#fff' : 'transparent', borderStyle: v == null ? 'dashed' : 'solid' }}></i>`;
  return html`<${Flow} bg="#fff" top=${html`<div style="flex:none;background:${PESCA};border-bottom:2.5px solid ${INK};padding-bottom:58px;position:relative">
      <${Rally} pose="sfida" w=${110} alt="" style="position:absolute;right:6px;top:calc(var(--otop) - 7px)"/>
      <${TopBar} onClose=${nav.back} title=${'Challenge with ' + rival}/></div>
    <div class="o-pad" style="flex:none;margin-top:-46px;position:relative"><div class="o-card s" style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:12px 16px">
      <span class="o-col" style="align-items:center;gap:2px"><${Avatar} ch=${init} bg=${PESCA}/><span class="o-s">You</span><span style="font-size:30px;line-height:32px;font-weight:800">${a}</span></span>
      <span class="o-col" style="align-items:center;gap:6px"><span class="o-s" style="font-weight:700">Question ${i + 1} of ${n}</span>
        <span class="o-mono" role="timer" style=${{ padding: '3px 14px', background: left <= 5 ? ROSA : T_PESCA, border: `2px solid ${INK}`, borderRadius: 999, fontSize: 17, fontWeight: 600 }}>${fmtClock(left)}</span>
        <span class="o-rowf" style="gap:5px">${Array.from({ length: n }, (_, k) => dot(mine[k], k))}</span></span>
      <span class="o-col" style="align-items:center;gap:2px"><${Avatar} ch=${rival[0]} bg=${LILLA}/><span class="o-s">${rival}</span><span style="font-size:30px;line-height:32px;font-weight:800">${b}</span></span></div></div>`}
    foot=${html`<${Btn} cls="lg" bg=${PESCA} disabled=${sel == null || show} onClick=${confirm}>Confirm<//>`}>
    <div class="o-duel o-pad" style="padding-top:14px;padding-bottom:16px">
      <div style="display:flex;justify-content:flex-end;min-height:28px">${(show || el >= bot.t) && html`<span class="o-fade" style="padding:2px 12px;background:${MENTA};border:2px solid ${INK};border-radius:999px;font-size:13px;line-height:18px;font-weight:800">${rival} has already answered</span>`}</div>
      <div style="margin-top:10px"><${Rich} text=${q.q} cls="q" lang=${q.lang}/></div>
      <div style="margin-top:16px"><${Options} q=${q} sel=${sel} onSel=${setSel} locked=${show}/></div>
    </div>
  <//>`;
}
function DuelDone({ nav, rival, a, b, xp }) {
  const [msg, setMsg] = useState(false);
  const lg = league(), win = a > b, draw = a === b, init = (userName() || 'T')[0].toUpperCase();
  return html`<div class="o-scr" style="background:repeating-conic-gradient(from 5deg at 50% 200px, #FFD7BA 0deg 10deg, ${PESCA} 10deg 20deg)"><div class="o-scroll"><div class="o-col o-pad" style="min-height:100%;align-items:center">
    <div style="width:240px;height:240px;flex:none;margin-top:calc(var(--otop) + 21px);background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:5px 5px 0 ${INK};display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <${Rally} pose=${win ? 'festeggia' : draw ? 'occhiolino' : 'triste'} w=${228} alt="" style="margin-bottom:-18px"/></div>
    <h1 class="o-pop" style="font-size:44px;line-height:48px;font-weight:800;letter-spacing:-.02em;margin-top:22px">${win ? 'You won!' : draw ? 'Tie' : 'Not this time'}</h1>
    <div class="o-rowf" style="gap:clamp(6px,3.1vw,12px);margin-top:18px;padding:12px clamp(10px,5.2vw,20px);max-width:100%;background:#fff;border:2.5px solid ${INK};border-radius:22px;box-shadow:5px 5px 0 ${INK};transform:rotate(-2deg)">
      <${Avatar} ch=${init} bg=${PESCA}/><span style="font-size:15px;font-weight:700">You</span><span style="font-size:clamp(26px,9.75vw,38px);line-height:40px;font-weight:800;letter-spacing:-.02em;margin:0 clamp(0px,1.55vw,6px);white-space:nowrap">${a} to ${b}</span><span style="font-size:15px;font-weight:700">${rival}</span><${Avatar} ch=${rival[0]} bg=${LILLA}/></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;margin-top:24px">
      <div class="o-col" style="align-items:center;padding:10px;background:${GIALLO};border:2.5px solid ${INK};border-radius:18px"><span style="font-size:20px;line-height:24px;font-weight:800">+${xp} XP</span><span style="font-size:13px;font-weight:700">${win ? 'for the win' : draw ? 'for the tie' : 'for trying'}</span></div>
      <div class="o-col" style="align-items:center;padding:10px;background:#fff;border:2.5px solid ${INK};border-radius:18px"><span style="font-size:20px;line-height:24px;font-weight:800">Rank #${lg.me.pos}</span><span style="font-size:13px;font-weight:700">in ${lg.name}</span></div></div>
    <div style="flex:1 1 16px;min-height:16px"></div>
    <div class="o-col" style="gap:12px;width:100%"><${Btn} cls="lg" bg="#fff" onClick=${() => nav.replace('sfida', { rival })}>Rematch<//>
      <${Btn} cls="lg ink" onClick=${() => (SFIDE_ON ? nav.replace('live', { nuova: true }) : setMsg(true))}>${Ico(Link2, 20)} Challenge a friend live<//></div>
    ${msg && html`<p class="o-s o-fade" style="text-align:center;margin-top:8px;color:${INK}">Challenges with friends start as soon as the referee is online.</p>`}
    <div style="padding:2px 0 max(22px,calc(env(safe-area-inset-bottom) + 8px))"><button type="button" class="o-link" onClick=${nav.back}>Back to challenges</button></div>
  </div></div></div>`;
}

// ---- AI Coach: la chat è quella dell'app, dentro la nuova cornice ----
// I suggerimenti seguono l'obiettivo.
const COACH = {
  zero: ['Rally answers in simple words, with everyday examples.', ['What is inflation? Give me an example', 'Simple or compound interest: what\'s the difference?', 'Why does money in a drawer lose value?']],
  invest: ['Rally explains financial instruments with examples in numbers: returns, costs, time.', ['What\'s the difference between a stock and a bond?', 'How much do a fund\'s costs weigh over twenty years?', 'What does diversifying mean? Give me an example']],
  work: ['Rally helps you read a financial statement or an economic news story.', ['How do I tell if a company is really making money?', 'Why can a profitable company run out of cash?', 'What changes for a company when rates go up?']]
};
function coachAsk() { const g = COACH[misGet().goal] ? misGet().goal : 'zero'; return { lead: COACH[g][0], ask: [...COACH[g][1], 'Ask me three questions about my latest lessons'] }; }
function CoachScreen({ nav }) {
  const [hist, setHist] = useState(false), [pending, setPending] = useState(null);
  const chats = K.chats || [], active = chats.find(c => c.id === K.activeChatId);
  const Chat = K.AiChatModal, coach = coachAsk();
  const newChat = first => {
    const now = new Date().toISOString(), nm = userName();
    const c = { id: `chat_${Date.now()}`, title: first ? first.slice(0, 40) : 'New conversation', createdAt: now, updatedAt: now, messages: [{ role: 'assistant', content: `Hi${nm ? ' ' + nm : ''}! Ask me about a word you don't know, a question about money or an example with numbers.`, timestamp: now }] };
    K.setChats(prev => [c, ...prev].slice(0, 50)); K.setActiveChatId(c.id); setPending(first ? { id: c.id, text: first } : null); setHist(false);
  };
  const fmt = d => { try { return new Date(d).toLocaleDateString(LOC, { day: 'numeric', month: 'short' }); } catch (e) { return ''; } };
  return html`<${Room} color=${LILLA} tab="coach" go=${nav.tab} headH=${140}
    rally=${html`<${Rally} pose="coach" alt="Rally with headphones" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div class="o-col" style="align-items:flex-start;gap:14px;padding-top:4px;max-width:210px"><h1 class="o-h1">AI Coach</h1>
      <div class="o-rowf" style="gap:8px"><button type="button" onClick=${() => newChat()} aria-label="New conversation"><${Pill}>${active ? 'New chat' : 'Ask me anything'}<//></button>
        ${chats.length > 0 && html`<button type="button" class="o-ib" style="width:34px;height:34px;border-radius:11px" onClick=${() => setHist(true)} aria-label="Conversations">${Ico(History, 17, 2.4)}</button>`}</div></div>`}>
    <${Sheet} pad=${false} style=${{ paddingTop: 18 }}>
      ${active && Chat ? html`<div class="o-coach"><${Chat} key=${active.id} variant="page" chatId=${active.id} chats=${chats} setChats=${K.setChats} onClose=${() => {}} initialMessage=${pending && pending.id === active.id ? pending.text : null} onInitialSent=${() => setPending(null)} orBack=${{ tab: 'coach', chat: active.id }} quick=${coach.ask}/></div>`
        : html`<div class="o-col" style="gap:10px;padding-bottom:140px"><h2 class="o-h2">What do you want to understand today?</h2><p class="o-body o-mut" style="margin-bottom:6px">${coach.lead}</p>
          ${coach.ask.map(t => html`<button key=${t} type="button" class="o-rowf" onClick=${() => newChat(t)} style="gap:12px;width:100%;min-height:54px;padding:8px 14px;border:2.5px solid ${INK};border-radius:18px;font-size:15px;line-height:20px;font-weight:700"><span class="o-grow">${t}</span>${PathIco(D_NEXT, 20, 2.6)}</button>`)}
          <div style="margin-top:8px"><${Btn} bg=${LILLA} onClick=${() => newChat()}>Write your own question<//></div><p class="o-s" style="text-align:center;margin-top:6px">Suggestions follow your path.</p></div>`}
    <//>
    ${hist && html`<${BSheet} onClose=${() => setHist(false)} label="Conversations"><h2 class="o-big" style="margin-bottom:6px;flex:none">Conversations</h2>
      <div class="o-scroll" style="flex:0 1 auto;max-height:60vh">${chats.map((c, k) => html`<${Row} key=${c.id} icon=${PathIco(D_TABS.coach, 20, 2.4)} ibg=${c.id === K.activeChatId ? LILLA : null} title=${(c.isQuizChat ? 'Question: ' : '') + (c.title || 'Conversation')} sub=${fmt(c.updatedAt || c.createdAt)}
        last=${k === chats.length - 1} onClick=${() => { K.setActiveChatId(c.id); setHist(false); }} right=${html`<span role="button" tabindex="0" aria-label="Delete" onClick=${e => { e.stopPropagation(); K.deleteChat(c.id, e); }} style="width:36px;height:36px;display:flex;align-items:center;justify-content:center">${Ico(Trash2, 18)}</span>`}/>`)}</div><//>`}
  <//>`;
}

// ---- profilo e album ----
// le figurine dell'album: quelle del proprio percorso, più quelle già prese nelle altre unità dei propri percorsi
const allStickers = () => { const album = K.albumLoad(), mine = new Set(misAll()); return misCourses().flatMap(c => c.lessons).filter(l => mine.has(l) || album[l.key]); };
function ProfiloScreen({ nav }) {
  useS2(); useTick();
  const album = K.albumLoad(), now = Date.now(), all = allStickers(), have = all.filter(l => album[l.key]);
  const recent = have.slice().sort((a, b) => album[b.key].t - album[a.key].t).slice(0, 8), cur = currentCourse();
  const name = userName() || 'Profile', lg = league();
  const cells = Array.from({ length: 8 }, (_, k) => recent[k] || null);
  return html`<${Room} color=${ROSA} tab="profilo" go=${nav.tab} headH=${140}
    rally=${html`<${Rally} pose="moneta" alt="Rally with a coin" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div class="o-col" style="align-items:flex-start;gap:14px;padding-top:4px;max-width:210px"><h1 class="o-h1" style=${name.length > 8 ? { fontSize: 34, lineHeight: '36px' } : null}>${name}</h1><${Pill}>${lg.name}<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px"><span style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">Your album</span><span class="o-lab">${have.length} of ${all.length} stickers</span></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${cells.map((l, k) => { const st = l ? stickerState(l, album, now) : 'manca', em = l && lessonEmoji(l);
        return html`<span key=${k} style=${{ aspectRatio: '1 / 0.92', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, fontSize: em ? 24 : 17, fontWeight: 800, overflow: 'hidden',
          background: !l ? 'transparent' : st === 'dorata' ? GIALLO : st === 'sbiadisce' ? T_GR : ROSA, border: l ? `2.5px solid ${INK}` : `2px dashed ${INK}`, filter: st === 'sbiadisce' ? 'grayscale(1)' : 'none' }}>${l ? (em || stickerSym(l)) : '?'}</span>`; })}</div>
      <${Btn} bg=${ROSA} onClick=${() => nav.go('album')}>Open the album<//>
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <${Stats3} items=${[[streakDays(), 'day streak'], [fmtInt((K.stats && K.stats.xp) || 0), 'XP points'], [(cur ? coursePct(cur) : 0) + '%', cur ? 'of ' + misName(cur) : 'of the path']]}/>
      <div style="height:2px;background:${SEP};margin:18px 0 0"></div>
      <${Row} icon=${Ico(Crown, 22)} ibg=${GIALLO} title="FinLearn Pro" sub=${K.isPro ? 'Active' : 'Try it free for 7 days'} chev=${true} onClick=${() => nav.go('pro')}/>
      <${Row} icon=${Ico(SlidersHorizontal, 22)} title="Settings" sub="Your path, language and data" chev=${true} last=${true} onClick=${() => nav.go('impostazioni')}/>
    <//>
  <//>`;
}
function AlbumScreen({ nav }) {
  useS2(); useTick();
  const album = K.albumLoad(), now = Date.now(), all = allStickers(), have = all.filter(l => album[l.key]).length;
  const groups = misCourses().flatMap(c => c.units.filter(u => misUnits(c).includes(u) || unitLessons(u).some(l => album[l.key])).map(u => ({ id: u.id, name: u.name.replace('Management', 'Mgmt'), lessons: unitLessons(u) })));
  const firstWith = groups.find(g => g.lessons.some(l => album[l.key])) || groups[0];
  const [gid, setGid] = useState(firstWith.id);
  const g = groups.find(x => x.id === gid) || groups[0], due = dueLessons();
  const leg = [[AZ, 'solid', 'Alive'], [T_GR, 'solid', 'Fading'], [GIALLO, 'solid', 'Golden'], ['transparent', 'dashed', 'Missing']];
  return html`<${Room} color=${ROSA} tabs=${false} headH=${150}
    rally=${html`<${Rally} pose="moneta" w=${200} alt="" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Back"/></div>
      <div class="o-col" style="align-items:flex-start;gap:12px;margin-top:14px;max-width:210px"><h1 class="o-h1">Album</h1><${Pill}>${have} of ${all.length} stickers<//></div>`}>
    <${Sheet} pad=${false} style=${{ paddingTop: 18 }}>
      <div class="o-scroll" style="display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;margin:0 -23px;padding:0 23px 2px;flex:none">${groups.map(x => html`<button key=${x.id} type="button" class=${'o-chip' + (x.id === gid ? ' on' : '')} onClick=${() => setGid(x.id)}>${x.name}</button>`)}</div>
      <div class="o-rowf" style="gap:14px;margin:14px 0 14px;flex-wrap:wrap">${leg.map(([bg, bs, t]) => html`<span key=${t} class="o-rowf" style="gap:6px;font-size:13px;font-weight:700;color:${MUT}"><i style=${{ width: 13, height: 13, background: bg, border: `2px ${bs} ${INK}`, borderRadius: 4 }}></i>${t}</span>`)}</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px 12px;justify-items:center;padding-bottom:${due.length ? 120 : 40}px">
        ${g.lessons.map(l => html`<${Sticker} key=${l.key} l=${l} state=${stickerState(l, album, now)} w=${104} big=${true} onClick=${() => nav.go('lezione', { key: l.key })}/>`)}</div>
    <//>
    ${due.length > 0 && html`<div class="o-foot" style="position:absolute;left:0;right:0;bottom:0;background:linear-gradient(rgba(255,255,255,0),#fff 28%);padding-top:26px"><${Btn} cls="lg" bg=${ROSA} onClick=${() => nav.go('pratica', { mode: 'ravviva' })}>${due.length === 1 ? 'Refresh the one that\'s fading' : `Refresh the ${due.length} that are fading`}<//></div>`}
  <//>`;
}

// ---- impostazioni ----
// Le voci che sono "i dati dell'utente": tutte quelle dell'app, tranne quelle che non devono uscire dal telefono né entrarci da un file:
// gli account di prova di una volta, la chiave di OpenRouter (e il codice usato mentre la si collega), l'identità del telefono nelle sfide dal vivo.
const dataKeyOk = k => typeof k === 'string' && /^(finlearn_|fl2_)/.test(k) && k !== 'finlearn_users' && !/^finlearn_or_(key|pkce)$/.test(k) && k !== 'finlearn_sfide_pid';
function saveFile(blob, name) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function downloadData() {
  try {
    const out = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (dataKeyOk(k)) out[k] = localStorage.getItem(k); }
    const name = `finlearn-data-${dayKey()}.json`, blob = new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' });
    // iPhone con l'app sulla schermata Home: lì lo scaricamento diretto non è affidabile, si passa da "Condividi" (dove c'è "Salva su File")
    try {
      if (navigator.standalone === true && typeof File === 'function' && navigator.canShare) { const f = new File([blob], name, { type: 'application/json' });
        if (navigator.canShare({ files: [f] })) { navigator.share({ files: [f] }).catch(e => { if (!e || e.name !== 'AbortError') { try { saveFile(blob, name); } catch (x) {} } }); return; } }
    } catch (e) {}
    saveFile(blob, name);
  } catch (e) {}
}
// Ricarica un file creato da "Scarica i miei dati": serve per cambiare telefono, o indirizzo dell'app, senza perdere i progressi.
// Il file va controllato, non creduto: entrano solo le voci dell'app con un valore di testo (mai account di prova, chiave di OpenRouter, identità nelle sfide),
// e progressi, utente e dati devono avere la forma giusta. Se qualcosa non torna non si scrive niente.
// I dati che c'erano prima sul telefono vengono sostituiti, non mescolati: le voci che il file non ha si tolgono (così non restano, per esempio, le chat di un altro).
const RESTORE_MAX = 8 * 1024 * 1024;
const RESTORE_ERR = { big: 'The file is too large to be a FinLearn backup.', file: 'This file is not a FinLearn backup.', empty: 'There is no progress to restore in this file.', write: 'I couldn\'t save the data on this phone: it may be out of space.' };
const restoreKeyOk = k => dataKeyOk(k) && k.length <= 80 && /^(finlearn_|fl2_)[\w.:-]+$/.test(k);
const jsonKind = t => { try { const v = JSON.parse(t); return v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v; } catch (e) { return 'bad'; } };
function restoreRead(text) {
  let j; try { j = JSON.parse(text); } catch (e) { throw new Error('file'); }
  if (!j || typeof j !== 'object' || Array.isArray(j)) throw new Error('file');
  const out = {}; let n = 0;
  for (const k of Object.keys(j)) { if (!restoreKeyOk(k) || typeof j[k] !== 'string') continue; out[k] = j[k]; n++; }
  if (!n) throw new Error('file');
  if (out.fl2_state != null) { let st; try { st = JSON.parse(out.fl2_state); } catch (e) { throw new Error('file'); } if (!st || typeof st !== 'object' || Array.isArray(st) || st.v !== 1) throw new Error('file'); }
  // l'utente e i suoi dati: se ci sono devono essere leggibili, altrimenti il file è rovinato
  if (out.finlearn_user != null) { let u = null; try { u = JSON.parse(out.finlearn_user); } catch (e) { /* sotto */ } if (!u || typeof u !== 'object' || Array.isArray(u) || typeof u.uid !== 'string' || !/^[\w-]{1,64}$/.test(u.uid)) throw new Error('file'); }
  for (const k of Object.keys(out)) { if (/^finlearn_data_/.test(k) && jsonKind(out[k]) !== 'object') throw new Error('file'); if (/^finlearn_chats_/.test(k) && jsonKind(out[k]) !== 'array') throw new Error('file'); }
  if (out.fl2_state == null && !Object.keys(out).some(k => /^finlearn_(data_|chats_|album|activity)/.test(k))) throw new Error('empty');
  return out;
}
function restoreData(file) {
  return new Promise((res, rej) => {
    if (!file || file.size > RESTORE_MAX) return rej(new Error('big'));
    const r = new FileReader();
    r.onerror = () => rej(new Error('file'));
    r.onload = () => { let out; try { out = restoreRead(String(r.result)); } catch (e) { return rej(e); }
      // prima si mettono da parte i dati di adesso: se la scrittura si ferma a metà si torna com'era
      const prima = {}, nuove = Object.keys(out);
      try {
        for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (dataKeyOk(k)) prima[k] = localStorage.getItem(k); }
        // chi è l'utente su questo telefono resta com'è se il file non lo dice
        for (const k of Object.keys(prima)) if (!(k in out) && k !== 'finlearn_user') localStorage.removeItem(k);
        for (const k of nuove) localStorage.setItem(k, out[k]);
        res(nuove.length);
      } catch (e) {
        try { for (const k of nuove) if (!(k in prima)) localStorage.removeItem(k); for (const k of Object.keys(prima)) localStorage.setItem(k, prima[k]); } catch (x) { /* niente */ }
        rej(new Error('write'));
      } };
    r.readAsText(file);
  });
}
// il campo (invisibile) che fa scegliere il file: sta dentro un'etichetta che fa da pulsante. Se il file va bene la pagina si ricarica con i dati nuovi.
function RestoreInput({ busy, onBusy, onErr }) {
  return html`<input type="file" accept="application/json,.json" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none" disabled=${!!busy} onChange=${e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return; onBusy();
    restoreData(f).then(() => { try { location.reload(); } catch (x) {} }).catch(x => onErr(RESTORE_ERR[x && x.message] || RESTORE_ERR.file)); }}/>`;
}
// ---- AI Coach con OpenRouter: collega, scegli il modello, scollega ----
const orModelLabel = id => { const t = id === K.FL_OR_FREE ? 'Automatic (free)' : K.flOrModelName(id); return t.length > 28 ? t.slice(0, 27) + '…' : t; };
function OrSheet({ onClose }) {
  const or = K.useFlOr(), F = K.flOR;
  const [busy, setBusy] = useState(false), [err, setErr] = useState(null), [paste, setPaste] = useState(false), [txt, setTxt] = useState(''), [page, setPage] = useState(null);
  // pagina della chiave su OpenRouter: l'indirizzo si prepara prima, così il tocco apre subito la pagina
  useEffect(() => { let on = true; if (or.on) F.keyPage().then(u => { if (on) setPage(u); }, () => {}); return () => { on = false; }; }, [or.on]);
  const connect = async () => { setBusy(true); setErr(null); try { await F.start({ screen: 'impostazioni' }); } catch (e) { setErr(K.flOrMsg(e)); setBusy(false); } };
  const use = async () => { setBusy(true); setErr(null); try { await F.paste(txt); setTxt(''); setPaste(false); } catch (e) { setErr(K.flOrMsg(e)); } setBusy(false); };
  if (or.on) return html`<${BSheet} onClose=${onClose} label="OpenRouter"><div class="o-scroll" style="flex:0 1 auto"><h2 class="o-big">OpenRouter is connected</h2>
    <p class="o-body o-mut" style="margin-top:6px">Rally answers using your OpenRouter account. The key stays on this device.</p>
    <div class="o-row last" style="min-height:64px;gap:12px;margin-top:6px"><span class="o-grow o-col" style="gap:2px"><span class="o-t" style="font-size:15px">Only providers that don't keep your questions</span><span class="o-s">With free models there often aren't any: Rally might not answer.</span></span><${Sw} on=${F.priv()} onChange=${v => F.setPriv(v)} label="Only providers that don't keep your questions"/></div>
    <div class="o-col" style="gap:10px;margin-top:10px">
      <a class="o-btn lg flat" href=${page || 'https://openrouter.ai/keys'} target="_blank" rel="noopener noreferrer" style="background:#fff;text-decoration:none">Manage the key on OpenRouter</a>
      <${Btn} cls="lg flat" bg=${ROSA} onClick=${() => { F.disconnect(); onClose(); }}>Disconnect from this device<//></div>
    <p class="o-s" style="margin-top:10px">If you disconnect, the key stays in your OpenRouter account: you delete it from the keys page.</p></div><//>`;
  return html`<${BSheet} onClose=${onClose} label="Connect OpenRouter"><div class="o-scroll" style="flex:0 1 auto"><h2 class="o-big">Connect OpenRouter</h2>
    <div class="o-col o-body" style="gap:8px;margin-top:8px">
      <p>Rally answers with an AI model that runs on your OpenRouter account. With free models you pay nothing: OpenRouter only sets a limit on questions per minute and per day.</p>
      <p>The key stays on this device and your questions go straight from here to OpenRouter, without passing through FinLearn.</p>
      <p>With free models, whoever runs the model may keep your questions and use them: don't write personal data in them.</p></div>
    ${err && html`<p class="o-s" role="alert" style="color:#B3261E;font-weight:700;margin-top:10px">${err}</p>`}
    <div style="margin-top:14px"><${Btn} cls="lg" bg=${LILLA} disabled=${busy} onClick=${connect}>${busy && !paste ? 'Opening OpenRouter…' : 'Connect OpenRouter'}<//></div>
    ${paste ? html`<div class="o-col" style="gap:10px;margin-top:14px"><input class="o-inp" type="password" value=${txt} onChange=${e => setTxt(e.target.value)} placeholder="sk-or-… or the code" aria-label="OpenRouter key or code" autocomplete="off" autocapitalize="off" spellcheck="false"/>
      <${Btn} cls="lg flat" bg="#fff" disabled=${busy || !txt.trim()} onClick=${use}>${busy ? 'Checking…' : 'Use this one'}<//></div>`
      : html`<div style="text-align:center"><button type="button" class="o-link" onClick=${() => setPaste(true)}>I have a key or a code</button></div>`}
  </div><//>`;
}
function ModelSheet({ onClose }) {
  const or = K.useFlOr(), F = K.flOR;
  const [list, setList] = useState(null), [err, setErr] = useState(null), [all, setAll] = useState(false), [q, setQ] = useState('');
  useEffect(() => { let on = true; F.models().then(m => { if (on) setList(m); }, e => { if (on) setErr(K.flOrMsg(e)); }); return () => { on = false; }; }, []);
  const pick = id => { F.setModel(id); onClose(); };
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean), MAX = 120;
  // prima i gratis, poi quelli a pagamento dal più economico
  const shown = (list || []).filter(m => (all || m.free) && words.every(w => (m.name + ' ' + m.id).toLowerCase().includes(w))).sort((a, b) => (a.free === b.free ? (a.free ? 0 : K.flOrCost(a) - K.flOrCost(b)) : a.free ? -1 : 1));
  const tick = id => (or.model === id ? html`<span style="flex:none;margin-right:4px">${PathIco(D_CHECK, 22, 3)}</span>` : null);
  return html`<${BSheet} onClose=${onClose} label="Model"><h2 class="o-big" style="flex:none">Model</h2>
    <p class="o-s" style="margin-top:4px;flex:none">Free models cost nothing. Paid ones use the credits in your OpenRouter account.</p>
    <div class="o-rowf" style="gap:8px;margin-top:12px;flex:none">${[[false, 'Free'], [true, 'All']].map(([v, t]) => html`<button key=${t} type="button" class=${'o-chip' + (all === v ? ' on' : '')} aria-pressed=${all === v ? 'true' : 'false'} onClick=${() => setAll(v)}>${t}</button>`)}</div>
    <input class="o-inp" value=${q} onChange=${e => setQ(e.target.value)} placeholder="Search for a model" aria-label="Search for a model" style="margin-top:10px;flex:none;height:48px"/>
    <div class="o-scroll" style="flex:0 1 auto;max-height:52vh;margin-top:6px">
      <${Row} title="Automatic (free)" sub="Each time, OpenRouter picks a free model that's available." onClick=${() => pick(K.FL_OR_FREE)} right=${tick(K.FL_OR_FREE)}/>
      ${err && html`<p class="o-s" role="alert" style="color:#B3261E;font-weight:700;padding:10px 0">${err}</p>`}
      ${!list && !err && html`<p class="o-s" style="padding:10px 0">Loading the list of models…</p>`}
      ${shown.slice(0, MAX).map((m, k) => html`<${Row} key=${m.id} title=${m.free ? K.flOrNice(m.name) + ' · free' : m.name + ' · paid'} sub=${K.flOrPrice(m)} last=${k === Math.min(shown.length, MAX) - 1} onClick=${() => pick(m.id)} right=${tick(m.id)}/>`)}
      ${list && shown.length > MAX && html`<p class="o-s" style="padding:10px 0">There are ${shown.length - MAX} more: type to search for them.</p>`}
      ${list && !shown.length && html`<p class="o-s" style="padding:10px 0">No model with that name.</p>`}
    </div><//>`;
}
function SettingsScreen({ nav, sheet: sheet0 }) {
  const s = useS2(), set = s.settings, u = K.user || {}, or = K.useFlOr();
  const [sheet, setSheet] = useState(sheet0 || null), [nm, setNm] = useState(userName()), [load, setLoad] = useState(null);
  const m = misGet(), P = misP(), nk = (m.known || []).length, [pick, setPick] = useState(m.goal);
  const upd = p => s2set(x => ({ settings: Object.assign({}, x.settings, p) }));
  const flags = Object.keys(s.flags || {}).length;
  const H = t => html`<h2 class="o-h2" style="font-size:18px;margin:26px 0 2px">${t}</h2>`;
  const R = (label, value, onClick, right, last) => html`<${onClick ? 'button' : 'div'} type=${onClick ? 'button' : undefined} class=${'o-row' + (last ? ' last' : '')} style="min-height:52px;gap:10px" onClick=${onClick}>
    <span class="o-grow o-t" style="font-size:16px">${label}</span>${value != null && html`<span style="font-size:15px;font-weight:600;color:${MUT};text-align:right">${value}</span>`}${right || (onClick && PathIco(D_NEXT, 20, 2.6))}<//>`;
  // "Cancella tutti i dati" toglie dal telefono tutto quello che l'app ci ha scritto (anche la chiave di OpenRouter e gli account di prova di una volta);
  // restano solo lingua e paese (fl_lang, fl_country), che non dicono niente di chi usa l'app
  const wipe = () => { try { const ks = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^(finlearn_|fl2_)/.test(k)) ks.push(k); } ks.forEach(k => localStorage.removeItem(k)); } catch (e) {}
    try { sessionStorage.removeItem('finlearn_sfida_invito'); } catch (e) {} K.onLogout(); setTimeout(() => { try { location.reload(); } catch (e) {} }, 50); };
  return html`<${Flow} top=${html`<${TopBar} onBack=${nav.back} mid=${html`<h1 class="o-grow" style="font-size:28px;line-height:32px;font-weight:800;letter-spacing:-.02em">Settings</h1>`}/>`}>
    <div class="o-pad" style="padding-bottom:max(30px,calc(env(safe-area-inset-bottom) + 14px))">
      <div style="margin-top:18px;padding:14px 16px 12px;border:2.5px solid ${INK};border-radius:24px;box-shadow:4px 4px 0 ${INK}">
        <h2 class="o-h2" style="margin-bottom:2px">Your path</h2>
        ${R('Goal', P.goal, () => { setPick(m.goal); setSheet('obiettivo'); })}
        ${R('Level', nk ? 'I know a little already' : 'Starting from zero', () => setSheet('livello'))}
        ${R('Your paths', misCourses().map(misName).join(', '), () => nav.go('catalogo'))}
        ${R('Minutes per day', `${set.goalMin} minutes`, () => setSheet('goal'), null, true)}
        <p style="margin-top:4px;padding:10px 14px;background:${T_GR};border-radius:14px;font-size:13px;line-height:18px;font-weight:600">What you find in Learn, Practice, Challenges and AI Coach depends on this. If you change it, your progress stays.</p></div>
      ${H('Study')}
      ${R('Reminders', 'Coming soon', null)}
      ${R('Language', LANG === 'en' ? 'English' : 'Italiano', () => setSheet('lang'), null, LANG !== 'en')}
      ${LANG === 'en' && R('Country', COUNTRY === 'US' ? 'United States' : 'Italy', () => setSheet('country'), null, true)}
      ${H('AI Coach')}
      ${R('OpenRouter', or.on ? 'Connected' : 'Not connected', () => setSheet('or'))}
      ${R('Model', orModelLabel(or.model), () => setSheet('model'), null, true)}
      ${H('Your data')}
      ${R('Name', userName() || 'Add', () => setSheet('name'))}
      ${R('Plan', K.isPro ? 'Pro' : 'Free', () => nav.go('pro'), K.isPro ? null : html`<span class="o-tag" style="padding:3px 11px;font-size:13px">Upgrade to Pro</span>`)}
      ${R('Download my data', null, downloadData)}
      ${R('Restore my data', null, () => { setLoad(null); setSheet('load'); })}
      ${R('Erase all data', null, () => setSheet('del'), null, true)}
      ${H('Help')}
      ${R('Flagged questions', flags ? String(flags) : 'None', flags ? () => setSheet('flags') : null)}
      ${R('Rules and privacy', null, () => setSheet('priv'), null, true)}
      <p class="o-s" style="text-align:center;margin-top:26px">FinLearn 2.0 · ${K.VERSION || ''}</p>
    </div>
    ${sheet === 'obiettivo' && (() => { const tp = MIS_PATHS[pick], tn = misGoalLessons(pick).length, dn = courses().flatMap(c => c.lessons).filter(l => isDone(l.key)).length, same = pick === m.goal;
      return html`<${BSheet} onClose=${() => setSheet(null)} label="Change goal"><h2 class="o-big">What do you want to do now?</h2>
        <p class="o-body o-mut" style="margin:6px 0 16px">This changes what you see in the app, not what you've already done.</p>
        <div role="radiogroup" aria-label="Goal" class="o-col" style="gap:10px">${GOALS.map(([id, t, , I]) => html`<button key=${id} type="button" role="radio" aria-checked=${pick === id ? 'true' : 'false'} onClick=${() => setPick(id)} class="o-rowf"
          style=${{ gap: 12, width: '100%', minHeight: 60, padding: '8px 14px', border: `2.5px solid ${INK}`, borderRadius: 18, background: pick === id ? T_AZ : '#fff', boxShadow: pick === id ? `4px 4px 0 ${INK}` : 'none', textAlign: 'left' }}>
          <span class="o-ibox" style="width:36px;height:36px;border-radius:11px">${Ico(I, 20)}</span><span class="o-grow" style="font-size:16px;line-height:20px;font-weight:800">${t}</span>
          ${id === m.goal && pick !== id ? html`<span class="o-tag" style="background:${T_GR}">Current</span>`
            : html`<span style=${{ width: 26, height: 26, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: `2.5px solid ${INK}`, background: pick === id ? INK : '#fff', color: '#fff' }}>${pick === id && PathIco(D_CHECK, 14, 3.6)}</span>`}</button>`)}</div>
        <p style="margin:14px 0 16px;padding:12px 16px;background:${T_GR};border-radius:16px;font-size:14px;line-height:20px;font-weight:600">${same ? 'Right now your path is ' : 'Your path becomes '}<b style="font-weight:800">${tp.name}</b>, ${plural(tn, 'lezione', 'lezioni')}.${!same && dn ? (dn === 1 ? ' The lesson you\'ve already done stays done, with its sticker.' : ` The ${dn} you've already done stay done, with their stickers.`) : ''}${!same && tp.course !== P.course ? ` ${courseById(P.course).name} leaves the app: you can add it back anytime from Discover, with your progress.` : ''}</p>
        <div class="o-col" style="gap:10px"><${Btn} cls="lg" disabled=${same} onClick=${() => { misSetGoal(pick); setSheet(null); nav.toast(`Done: your path is now ${tp.name}.`); }}>Change goal<//><${Btn} cls="lg flat" bg="#fff" onClick=${() => setSheet(null)}>Cancel<//></div><//>`; })()}
    ${sheet === 'livello' && html`<${BSheet} onClose=${() => setSheet(null)} label="Level"><h2 class="o-big">Where are you starting from?</h2>
      <p class="o-body o-mut" style="margin:6px 0 16px">${nk ? `Rally has marked you as already knowing ${nk === 1 ? 'one unit' : (NUM_IT[nk] || nk) + ' units'}. Retake the 5 questions to recalculate where you start.` : 'You\'re following the path from the first unit. With 5 questions Rally lets you skip what you already know.'}</p>
      <div class="o-col" style="gap:10px"><${Btn} cls="lg" onClick=${() => { setSheet(null); nav.go('livello'); }}>Take the 5 questions<//>
        ${nk > 0 && html`<${Btn} cls="lg flat" bg="#fff" onClick=${() => { s2set(() => ({ mis: Object.assign({}, misGet(), { known: [], level: 'zero' }) })); setSheet(null); }}>Start over from the beginning<//>`}</div><//>`}
    ${sheet === 'goal' && html`<${BSheet} onClose=${() => setSheet(null)} label="Minutes per day"><h2 class="o-big">How much time do you have each day?</h2>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px">${[5, 10, 20].map(m => html`<button key=${m} type="button" class="o-col" onClick=${() => { upd({ goalMin: m }); setSheet(null); }} style=${{ alignItems: 'center', padding: '12px 0', border: `2.5px solid ${INK}`, borderRadius: 18, background: set.goalMin === m ? AZ : '#fff', boxShadow: set.goalMin === m ? `3px 3px 0 ${INK}` : 'none' }}><span style="font-size:26px;line-height:30px;font-weight:800">${m}</span><span class="o-s" style="color:${INK}">minutes</span></button>`)}</div><//>`}
    ${sheet === 'lang' && html`<${BSheet} onClose=${() => setSheet(null)} label="Language"><h2 class="o-big" style="margin-bottom:6px">Language</h2>
      ${[['Italiano', 'it'], ['English', 'en'], ['Français', null], ['Español', null], ['Deutsch', null], ['中文', null]].map(([l, code], k) => html`<button key=${l} type="button" class="o-row" disabled=${!code} onClick=${() => { if (code && code !== LANG) setLangPref(code); else setSheet(null); }} style=${{ minHeight: 50, width: '100%', borderBottom: k < 5 ? `2px solid ${SEP}` : 0 }}><span class="o-grow o-t" lang=${code || undefined} style=${{ color: code ? INK : DIMT, textAlign: 'left' }}>${l}</span>${code === LANG ? PathIco(D_CHECK, 22, 3) : code ? null : html`<span class="o-s">Coming soon</span>`}</button>`)}<//>`}
    ${sheet === 'country' && html`<${BSheet} onClose=${() => setSheet(null)} label="Country"><h2 class="o-big" style="margin-bottom:6px">Country</h2>
      <p class="o-body o-mut" style="margin:0 0 12px">Rules on taxes, pensions and banking change from one country to another, and so do the lessons you see. Your progress stays.</p>
      ${COUNTRIES.map(([c, n, d], k) => html`<button key=${c} type="button" class="o-row" onClick=${() => { if (c !== COUNTRY) setCountryPref(c); else setSheet(null); }} style=${{ minHeight: 60, width: '100%', borderBottom: k < 1 ? `2px solid ${SEP}` : 0 }}><span class="o-grow o-col" style="gap:1px;text-align:left"><span class="o-t">${n}</span><span class="o-s">${d}</span></span>${c === COUNTRY && PathIco(D_CHECK, 22, 3)}</button>`)}<//>`}
    ${sheet === 'name' && html`<${BSheet} onClose=${() => setSheet(null)} label="Name"><h2 class="o-big">What's your name?</h2>
      <input class="o-inp" value=${nm} onChange=${e => setNm(e.target.value)} placeholder="Your name" maxlength="24" aria-label="Name" style="margin-top:16px"/>
      <div style="margin-top:14px"><${Btn} cls="lg" onClick=${() => { s2set({ name: firstName(nm) }); setSheet(null); }}>Save<//></div><//>`}
    ${sheet === 'load' && html`<${BSheet} onClose=${() => setSheet(null)} label="Restore my data"><h2 class="o-big">Restore your data</h2>
      <p class="o-body o-mut" style="margin-top:6px">Choose the file you saved with ‘Download my data’. The progress now on this phone is replaced by what is in the file.</p>
      ${load && load.err && html`<p role="alert" style="margin-top:12px;padding:10px 14px;background:${T_ROSA};border-radius:14px;font-size:15px;line-height:20px;font-weight:700">${load.err}</p>`}
      <div class="o-col" style="gap:10px;margin-top:16px">
        <label class="o-btn lg" style=${{ background: AZ, cursor: 'pointer', opacity: load && load.busy ? 0.5 : 1 }}>${load && load.busy ? 'One moment…' : 'Choose the file'}
          <${RestoreInput} busy=${load && load.busy} onBusy=${() => setLoad({ busy: true })} onErr=${t => setLoad({ err: t })}/></label>
        <${Btn} cls="lg flat" bg="#fff" onClick=${() => setSheet(null)}>Cancel<//></div><//>`}
    ${sheet === 'flags' && html`<${BSheet} onClose=${() => setSheet(null)} label="Flagged questions"><h2 class="o-big" style="flex:none">Flagged questions</h2><p class="o-body o-mut" style="margin:6px 0 8px;flex:none">They also end up in the "Download my data" file.</p>
      <div class="o-scroll" style="flex:0 1 auto;max-height:50vh">${Object.keys(s.flags || {}).map(k => { const l = lessonByKey(k.split('#')[0]); return html`<div key=${k} class="o-row" style="min-height:48px"><span class="o-grow o-t" style="font-size:15px">${l ? l.title : k}</span><span class="o-s">${l && l.code ? l.code : ''}</span></div>`; })}</div>
      <div style="margin-top:12px;flex:none"><${Btn} cls="lg flat" bg="#fff" onClick=${() => { s2set({ flags: {} }); setSheet(null); }}>Clear the list<//></div><//>`}
    ${sheet === 'priv' && html`<${BSheet} onClose=${() => setSheet(null)} label="Rules and privacy"><h2 class="o-big">Rules and privacy</h2>
      <div class="o-col o-body" style="gap:10px;margin-top:10px"><p>Your progress, answers and conversations are saved only on this device.</p><p>If you connect OpenRouter, the questions you ask the AI Coach go from here to OpenRouter and the provider of the model you chose. FinLearn doesn't receive them.</p><p>In live challenges your name and your answers pass through FinLearn's referee, on Cloudflare, only for the length of the game: at the end everything is deleted.</p><p>No ads and no data sold.</p><p>FinLearn is for learning: what you read here is not advice on how to invest your money.</p></div>
      <div style="margin-top:16px"><${Btn} cls="lg" onClick=${() => setSheet(null)}>Got it<//></div><//>`}
    ${sheet === 'or' && html`<${OrSheet} onClose=${() => setSheet(null)}/>`}
    ${sheet === 'model' && html`<${ModelSheet} onClose=${() => setSheet(null)}/>`}
    ${sheet === 'del' && html`<${BSheet} onClose=${() => setSheet(null)} label="Erase all data"><h2 class="o-big">Erase everything?</h2><p class="o-body o-mut" style="margin-top:6px">You delete progress, stickers, points and conversations from this device. This can't be undone.</p>
      <div class="o-col" style="gap:10px;margin-top:16px"><${Btn} cls="lg" onClick=${() => setSheet(null)}>Keep everything<//><${Btn} cls="lg flat" bg=${ROSA} onClick=${wipe}>${Ico(Trash2, 20)} Erase everything<//></div><//>`}
  <//>`;
}

// ---- FinLearn Pro ----
function ProScreen({ nav }) {
  useS2();
  const [plan, setPlan] = useState('year');
  const pro = !!K.isPro;
  const card = (id, name, price, sub, tag) => html`<button type="button" aria-pressed=${plan === id ? 'true' : 'false'} onClick=${() => setPlan(id)} class="o-col" style=${{ position: 'relative', padding: '12px 14px 12px', gap: 2, border: `2.5px solid ${INK}`, borderRadius: 20, background: plan === id ? '#fff' : T_GIALLO, boxShadow: plan === id ? `4px 4px 0 ${INK}` : 'none' }}>
    ${tag && html`<span style="position:absolute;right:-6px;top:-13px;padding:2px 10px;background:#fff;border:2px solid ${INK};border-radius:999px;font-size:12px;line-height:16px;font-weight:800;transform:rotate(4deg)">${tag}</span>`}
    <span style="font-size:15px;font-weight:800">${name}</span><span style="font-size:24px;line-height:28px;font-weight:800;letter-spacing:-.01em">${price}</span><span class="o-s">${sub}</span></button>`;
  return html`<div class="o-scr" style="background:repeating-conic-gradient(from 5deg at 50% 200px, #FFE066 0deg 10deg, ${GIALLO} 10deg 20deg)"><div class="o-scroll"><div class="o-col" style="min-height:100%">
    <${TopBar} onClose=${nav.back} title=""/>
    <div class="o-col o-pad" style="align-items:center;flex:1 0 auto">
      <div style="width:200px;height:200px;flex:none;margin-top:-28px;background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:5px 5px 0 ${INK};display:flex;align-items:flex-end;justify-content:center;overflow:hidden"><${Rally} pose="re" w=${196} alt="Rally wearing a crown" style="margin-bottom:-14px"/></div>
      <h1 style="font-size:42px;line-height:46px;font-weight:800;letter-spacing:-.02em;margin-top:16px">FinLearn Pro</h1>
      <p style="font-size:16px;line-height:22px;font-weight:700;margin-top:4px">${pro ? 'It\'s on. Happy studying.' : 'All of finance, without limits.'}</p>
      <div class="o-card s" style="width:100%;padding:4px 18px;margin-top:18px">${PRO_POINTS.map((t, k) => html`<div key=${t} class="o-rowf" style=${{ gap: 12, minHeight: 46, padding: '6px 0', borderBottom: k < PRO_POINTS.length - 1 ? `2px solid ${SEP}` : 0 }}>
        <span style="width:24px;height:24px;flex:none;display:flex;align-items:center;justify-content:center;background:${INK};border-radius:50%;color:#fff">${PathIco(D_CHECK, 14, 3.4)}</span><span class="o-t">${t}</span></div>`)}</div>
      ${!pro && html`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;margin-top:22px">${card('year', 'Yearly', PRO_YEAR, CUR + '2.92 a month', 'Best value')}${card('month', 'Monthly', PRO_MONTH, 'a month')}</div>`}
      <div style="flex:1 1 16px;min-height:16px"></div>
      <div style="width:100%">${pro ? html`<${Btn} cls="lg flat" bg="#fff" onClick=${() => { stopPro(); }}>Back to the free plan<//>`
        : html`<${Btn} cls="lg ink" onClick=${() => { startPro(plan); nav.back(); nav.toast('Pro is on. No charge: payments aren\'t connected yet.'); }}>Try it free for 7 days<//>`}</div>
      <p style="font-size:14px;line-height:20px;font-weight:700;text-align:center;padding:10px 0 max(22px,calc(env(safe-area-inset-bottom) + 8px))">${pro ? 'Trial version of the app: Pro turns on without payment.' : `Then ${plan === 'year' ? PRO_YEAR + ' a year' : PRO_MONTH + ' a month'}. No charge for now: payments aren't connected yet.`}</p>
    </div></div></div></div>`;
}

// ---- Scopri: i percorsi della propria app e tutte le materie, divise in categorie che si aprono (MATERIE) ----
function CatalogScreen({ nav }) {
  useS2();
  const [open, setOpen] = useState(null);
  const mine = misCourses();
  const H = (t, s) => html`<h2 class="o-h2" style="font-size:18px;margin:24px 0 ${s ? 2 : 10}px">${t}</h2>${s && html`<p class="o-s" style="margin-bottom:10px">${s}</p>`}`;
  const tile = c => html`<span class="o-ibox" style=${{ width: 48, height: 48, borderWidth: 2.5, borderRadius: 15, fontSize: 22, background: c.id === misP().course ? misP().color : c.color || AZ }}>${misIcon(c, 24)}</span>`;
  const two = (t, s, mut) => html`<span class="o-grow o-col" style="gap:1px"><span style="font-size:16px;line-height:21px;font-weight:800;color:${mut ? MUT : INK}">${t}</span><span class="o-s">${s}</span></span>`;
  const box = 'gap:10px;width:100%;min-height:60px;padding:8px 12px 8px 14px;border-radius:16px;text-align:left;';
  const item = (x, k) => { const c = x.course && courseById(x.course);
    if (c) return html`<button key=${k} type="button" class="o-rowf" onClick=${() => nav.go(inMyApp(c.id) ? 'percorso' : 'scheda', { course: c.id })} style="${box}border:2px solid ${INK};background:#fff">${two(c.name, plural(c.lessons.length, 'short lesson', 'short lessons'))}${inMyApp(c.id) && html`<span class="o-tag" style="background:${MENTA}">In your app</span>`}${PathIco(D_NEXT, 20, 2.6)}</button>`;
    if (x.levels) return html`<button key=${k} type="button" class="o-rowf" onClick=${() => nav.go('schedaMateria', { id: x.id })} style="${box}border:2px solid ${INK};background:#fff"><span class="o-grow o-col" style="gap:2px"><span class="o-rowf" style="gap:8px"><span style="font-size:16px;line-height:21px;font-weight:800">${x.name}</span><span class="o-tag">Up next</span></span><span class="o-s">${x.sub}</span></span>${PathIco(D_NEXT, 20, 2.6)}</button>`;
    return html`<div key=${k} class="o-rowf" style="${box}border:2px dashed ${INK};background:${T_BG}">${two(x.name, x.sub, true)}<span style="flex:none;font-size:12px;line-height:16px;font-weight:800;color:${MUT}">Coming soon</span></div>`; };
  return html`<${Flow} top=${html`<${TopBar} onBack=${nav.back} mid=${html`<h1 class="o-grow" style="font-size:28px;line-height:32px;font-weight:800;letter-spacing:-.02em">Paths</h1>`}/>`}>
    <div class="o-pad" style="padding-top:2px;padding-bottom:max(30px,calc(env(safe-area-inset-bottom) + 14px))">
      ${mine.length > 0 && html`${H('In your app')}<div class="o-col" style="gap:12px">${mine.map(c => { const ls = misLessons(c), d = hadCount(ls), pct = coursePct(c);
        return html`<button key=${c.id} type="button" class="o-col" onClick=${() => { s2set({ cur: c.id }); nav.go('percorso', { course: c.id }); }} style="gap:10px;width:100%;padding:14px 16px;border:2.5px solid ${INK};border-radius:22px;box-shadow:4px 4px 0 ${INK};text-align:left">
          <span class="o-rowf" style="gap:12px;width:100%">${tile(c)}<span class="o-grow o-col" style="gap:1px"><span style="font-size:17px;line-height:22px;font-weight:800">${misName(c)}</span><span class="o-s">${d} of ${ls.length} lessons done</span></span><span style="font-size:15px;font-weight:800">${pct}%</span></span>
          <span style="display:block;width:100%"><${Bar} pct=${pct} label=${`${pct} percent of the path`}/></span></button>`; })}</div>`}
      ${H('All subjects', 'Tap a category to see what\'s inside.')}
      <div class="o-col" style="gap:10px">${MATERIE.map(g => { const on = open === g.id;
        return html`<div key=${g.id} style="border:2.5px solid ${INK};border-radius:22px;background:#fff;box-shadow:${on ? '4px 4px 0 ' + INK : 'none'}">
          <button type="button" class="o-rowf" aria-expanded=${on ? 'true' : 'false'} onClick=${() => setOpen(on ? null : g.id)} style="gap:12px;width:100%;padding:12px 12px 12px 14px;text-align:left">
            <span class="o-ibox" style=${{ width: 48, height: 48, borderWidth: 2.5, borderRadius: 15, background: g.color }}>${Ico(g.ico, 24)}</span>
            <span class="o-grow o-col" style="gap:1px"><span style="font-size:17px;line-height:22px;font-weight:800">${g.name}</span><span class="o-s">${g.sub}</span></span>
            <span aria-label=${plural(g.items.length, 'subject', 'subjects')} style="flex:none;min-width:26px;height:26px;padding:0 7px;display:flex;align-items:center;justify-content:center;border:2px solid ${INK};border-radius:999px;font-size:13px;font-weight:800">${g.items.length}</span>
            <span style=${{ flex: 'none', display: 'flex', transform: on ? 'rotate(90deg)' : 'none' }}>${PathIco(D_NEXT, 22, 2.6)}</span></button>
          ${on && html`<div class="o-col" style="gap:8px;padding:0 12px 14px">${g.items.map(item)}</div>`}</div>`; })}</div>
      <button type="button" class="o-rowf" onClick=${() => nav.tab('coach')} style="gap:12px;width:100%;padding:14px 16px;margin-top:22px;background:${T_GR};border-radius:16px;text-align:left"><span class="o-grow o-t">Can't find a topic? Ask Rally.</span>${PathIco(D_NEXT, 22, 2.6)}</button>
    </div>
  <//>`;
}
// scheda di una materia in arrivo: i livelli (uno per volta) e i capitoli, che sono domande
function MateriaScreen({ nav, id }) {
  const M = MATERIE.flatMap(g => g.items).find(x => x.levels && x.id === id) || MATERIE.flatMap(g => g.items).find(x => x.levels);
  const [lv, setLv] = useState(0); const L = M.levels[lv], tot = L.parts.reduce((s, p) => s + p[1].length, 0); let n = 0;
  return html`<${Room} color=${M.color || AZ} tabs=${false} headH=${176}
    rally=${html`<${Rally} pose="insegna" alt="" style="position:absolute;right:-14px;top:calc(var(--otop) + 27px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Back"/></div>
      <div class="o-col" style="align-items:flex-start;gap:12px;margin-top:22px;max-width:190px"><h1 class="o-h1m">${M.name}</h1><${Pill}>${M.levels.length === 2 ? 'Two levels' : 'Coming soon'}<//></div>`}>
    <${Sheet} pad=${false} style=${{ paddingTop: 22 }}>
      <div class="o-rowf" style="gap:8px;flex-wrap:wrap">${M.levels.map((x, k) => html`<button key=${k} type="button" class=${'o-chip' + (lv === k ? ' on' : '')} aria-pressed=${lv === k ? 'true' : 'false'} onClick=${() => setLv(k)}>${k + 1} · ${x.tab}</button>`)}</div>
      <h2 class="o-h2" style="font-size:22px;line-height:26px;margin:18px 0 14px">${L.name}</h2>
      <${Stats3} items=${[[tot, 'chapters'], ['5-8', 'minutes per lesson'], [tot, 'labs']]}/>
      <div style="height:2px;background:${SEP};margin:18px 0"></div>
      <h2 class="o-h2" style="font-size:18px;margin-bottom:10px">What you'll learn</h2>
      <ul class="o-col" style="gap:8px;list-style:none">${L.learn.map(t => html`<li key=${t} class="o-rowf" style="gap:12px;align-items:flex-start">${PathIco(D_CHECK, 20, 3)}<span class="o-t" style="font-size:15px;font-weight:600">${t}</span></li>`)}</ul>
      <h2 class="o-h2" style="font-size:18px;margin:22px 0 4px">Chapters</h2>
      <p class="o-s" style="margin-bottom:4px">Each chapter answers one question.</p>
      ${L.parts.map(([t, qs]) => html`<div key=${t}>${t && html`<p class="o-lab" style="margin:12px 0 6px">${t}</p>`}<ol class="o-col" style="gap:8px;list-style:none;padding:0;margin-top:${t ? 0 : 10}px">${qs.map(q => { n++;
        return html`<li key=${q} class="o-rowf" style="gap:12px;min-height:48px;padding:6px 14px 6px 10px;border:2px dashed ${INK};border-radius:14px;background:${T_BG}"><span style="width:28px;height:28px;flex:none;display:flex;align-items:center;justify-content:center;border:2px solid ${INK};border-radius:999px;background:#fff;font-size:13px;font-weight:800">${n}</span><span style="font-size:15px;line-height:20px;font-weight:700">${q}</span></li>`; })}</ol></div>`)}
      <p class="o-s" style="text-align:center;font-size:14px;font-weight:700;color:${INK};margin-top:22px">Chapters arrive one at a time.</p>
      <div style="padding:12px 0 max(30px,calc(env(safe-area-inset-bottom) + 12px))"><${Btn} cls="lg" disabled=${true}>Coming soon<//></div>
    <//>
  <//>`;
}
// Le 5 domande rifatte dalle Impostazioni: stessa regola della registrazione
function LevelScreen({ nav }) {
  const m = misGet(), pl = useMemo(() => placementFor(m.goal), []), n = pl.items.length, exam = pl.course.group === 'cert';
  const [qi, setQi] = useState(0), [sel, setSel] = useState(null), [res, setRes] = useState([]), [known, setKnown] = useState(null);
  const answer = () => { const it = pl.items[qi], ok = sel === it.q.ans, r = [...res, ok]; recordAnswer(it.q, ok); setRes(r); setSel(null); if (qi < n - 1) setQi(qi + 1); else setKnown(placementKnown(pl, r)); };
  const apply = k => { s2set(() => ({ mis: Object.assign({}, misGet(), { known: k, level: k.length ? 'some' : 'zero' }) })); nav.back(); };
  if (known) { const ok = res.filter(Boolean).length, nk = known.length, startU = pl.units[nk] || pl.course.units[0];
    const text = exam ? 'For an exam you don\'t skip anything. The questions you get wrong come back under weak spots, in Practice.'
      : nk ? `${nk === 1 ? 'You already know the first unit: Rally marks it as done' : `You already know the first ${NUM_IT[nk] || nk} units: Rally marks them as done`}. Everything stays open: review it whenever you like.` : 'Better to start from the first unit, so no gaps are left.';
    return html`<${Flow} top=${html`<${TopBar} onClose=${nav.back} title=""/>`}
      foot=${html`<div class="o-col" style="align-items:center;gap:2px"><div style="width:100%"><${Btn} cls="lg" onClick=${() => (exam ? nav.back() : apply(known))}>${exam ? 'Got it' : nk ? 'Start here' : 'Start from the beginning'}<//></div>
        ${!exam && html`<button type="button" class="o-link" onClick=${nav.back}>Leave everything as it is</button>`}</div>`}>
      <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px"><${Rally} pose="occhiolino" w=${190} alt="" style="position:absolute;right:-14px;top:-10px"/>
        <div class="o-col" style="position:relative;align-items:flex-start;gap:12px;min-height:162px;max-width:214px"><${Pill}>${ok} of ${res.length} correct<//><h1 class="o-big">${nk || exam ? 'Start from ' + startU.name : 'Start from the beginning'}</h1></div>
        <p class="o-body o-mut" style="position:relative">${text}</p></div><//>`; }
  const q = pl.items[qi].q;
  return html`<${Flow} top=${html`<${TopBar} onClose=${nav.back} n=${n} i=${qi}/>`} foot=${html`<${Btn} cls="lg" disabled=${sel == null} onClick=${answer}>${qi < n - 1 ? 'Next' : 'See where you start'}<//>`}>
    <div class="o-test"><div class="o-pad" style="padding-top:18px;padding-bottom:20px"><span class="o-lab">Question ${qi + 1} of ${n}</span>
      <div style="margin-top:6px"><${Rich} key=${'q' + qi} text=${q.q} cls="q" lang=${q.lang}/></div>
      <div style="margin-top:14px"><${Options} key=${'o' + qi} q=${q} sel=${sel} onSel=${setSel} locked=${false}/></div></div></div><//>`;
}
// ---- scheda di un percorso ----
function CourseSheetScreen({ nav, course }) {
  useS2(); useTick();
  const c = courseById(course) || currentCourse(), album = K.albumLoad(), now = Date.now(), mineC = inMyApp(c.id);
  const mins = c.lessons.reduce((n, l) => n + l.minutes, 0), started = doneCount(c.lessons) > 0, nx = nextLesson(c);
  const go = () => { misAddCourse(c.id); s2set(x => ({ cur: c.id, started: Array.from(new Set([...(x.started || []), c.id])) })); if (nx) nav.replace('lezione', { key: nx.key }); else nav.replace('percorso', { course: c.id }); };
  return html`<${Room} color=${c.color || AZ} tabs=${false} headH=${176}
    rally=${html`<${Rally} pose="insegna" alt="" style="position:absolute;right:-14px;top:calc(var(--otop) + 27px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Back"/></div>
      <div class="o-col" style="align-items:flex-start;gap:12px;margin-top:22px;max-width:190px"><h1 class="o-h1m">${c.name}</h1><${Pill}>${c.tagline}<//></div>`}>
    <${Sheet} pad=${false} style=${{ paddingTop: 24 }}>
      <${Stats3} items=${[[c.lessons.length, 'lessons'], [c.units.length, c.group === 'cert' ? 'topics' : 'units'], [mins < 90 ? mins + ' min' : Math.round(mins / 60) + ' hours', 'in total']]}/>
      <div style="height:2px;background:${SEP};margin:18px 0"></div>
      <h2 class="o-h2" style="font-size:18px;margin-bottom:10px">What you'll learn</h2>
      <ul class="o-col" style="gap:8px;list-style:none">${c.learn.map(t => html`<li key=${t} class="o-rowf" style="gap:12px;align-items:flex-start">${PathIco(D_CHECK, 20, 3)}<span class="o-t" style="font-size:15px;font-weight:600">${t}</span></li>`)}</ul>
      <h2 class="o-h2" style="font-size:18px;margin:22px 0 12px">Stickers to win</h2>
      <div class="o-scroll" style="display:flex;gap:10px;overflow-x:auto;overflow-y:hidden;margin:0 -23px;padding:2px 23px 6px;flex:none">${c.lessons.slice(0, 8).map((l, k) => { const st = stickerState(l, album, now), em = lessonEmoji(l);
        return html`<span key=${l.key} style=${{ width: 50, height: 50, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, fontSize: em ? 22 : 16, fontWeight: 800, background: st !== 'manca' || k === 0 ? (c.color || AZ) : 'transparent', border: st !== 'manca' || k === 0 ? `2.5px solid ${INK}` : `2px dashed ${INK}`, boxShadow: st !== 'manca' || k === 0 ? `3px 3px 0 ${INK}` : 'none', transform: k === 0 ? 'rotate(-4deg)' : 'none' }}>${st !== 'manca' || k < 2 ? (em || stickerSym(l)) : '?'}</span>`; })}</div>
      <div style="flex:1 1 20px;min-height:20px"></div>
      <p class="o-s" style="text-align:center;font-size:14px;font-weight:700;color:${INK};margin-top:22px">All lessons are free.</p>
      <div style="padding:12px 0 max(30px,calc(env(safe-area-inset-bottom) + 12px))"><${Btn} cls="lg" onClick=${go}>${!mineC ? 'Add to my app and start' : started ? 'Continue the path' : 'Start the path'}<//></div>
    <//>
  <//>`;
}

// =====================================================================================================
// SFIDE DAL VIVO · modalità Lampo: due telefoni e un arbitro su Cloudflare (codice in sfide/)
// =====================================================================================================
// L'arbitro manda la stessa domanda ai due telefoni, riceve le risposte e decide chi prende il punto.
// Ogni telefono dice all'arbitro la lingua della sua app (`lang` nel saluto) e riceve la domanda in quella lingua:
// un'app italiana e una inglese giocano la stessa partita, con la risposta giusta nella stessa posizione.
// Questo telefono misura il proprio tempo di reazione: da quando la domanda compare sullo schermo al tocco.
const SFIDE_HOST = 'finlearn-sfide.finlearn27.workers.dev';   // l'arbitro su Cloudflare; dallo stesso indirizzo esce anche l'app
const SFIDE_LOCALE = /^(127\.0\.0\.1|localhost)$/.test(location.hostname);
// In prova sul computer l'arbitro è su 127.0.0.1:8787. Dal vecchio indirizzo su GitHub l'arbitro è su Cloudflare.
// Da ogni altro indirizzo (Cloudflare oggi, un dominio nostro domani) app e arbitro stanno insieme: si usa lo stesso indirizzo della pagina.
const SFIDE_WS = SFIDE_LOCALE ? 'ws://127.0.0.1:8787' : /\.github\.io$/.test(location.hostname) ? 'wss://' + SFIDE_HOST : 'wss://' + location.host;
const SFIDE_ON = SFIDE_LOCALE || !/SOTTODOMINIO/.test(SFIDE_HOST);
const SFIDE_V = 1;
const LIVE_RE = /^[A-HJ-NP-Z2-9]{6}$/;
const LIVE_CORSI = [
  { id: 'basi', name: 'Finance basics', sub: 'Each player in their app\'s language, 24 seconds per question' }
];
// invito: il link …/app/#sfida=CODICE apre l'app e porta nella stanza (il codice si toglie subito dall'indirizzo)
const LIVE_INV = 'finlearn_sfida_invito', LIVE_PID = 'finlearn_sfide_pid';
try {
  const m = location.hash.match(/^#sfida=([A-Za-z0-9]{6})$/);
  if (m) { sessionStorage.setItem(LIVE_INV, m[1].toUpperCase()); history.replaceState(null, '', location.pathname + location.search); }
} catch (e) {}
function liveInvito() { try { const c = sessionStorage.getItem(LIVE_INV); sessionStorage.removeItem(LIVE_INV); return c && LIVE_RE.test(c) ? c : null; } catch (e) { return null; } }
// per ogni stanza il telefono ha un codice suo, segreto: serve per rientrare nello stesso posto se cade la connessione
function livePids() { try { return JSON.parse(localStorage.getItem(LIVE_PID) || '{}') || {}; } catch (e) { return {}; } }
function livePidSave(codice, pid) {
  try { const a = livePids(); delete a[codice]; a[codice] = pid; const k = Object.keys(a); k.slice(0, Math.max(0, k.length - 6)).forEach(x => { delete a[x]; }); localStorage.setItem(LIVE_PID, JSON.stringify(a)); } catch (e) {}
}
function liveNewPid() { const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'; return Array.from(crypto.getRandomValues(new Uint8Array(20)), x => c[x & 63]).join(''); }
const liveSec = ms => (ms / 1000).toFixed(2).replace('.', DEC) + ' s';
const liveGap = ms => { if (ms >= 1000) return liveSec(ms); const c = Math.max(1, Math.round(ms / 10)); return c === 1 ? '1 hundredth of a second' : c + ' hundredths of a second'; };
// i messaggi di errore dell'arbitro arrivano in italiano: l'app usa i suoi, nella sua lingua, scelti dal codice dell'errore
const LIVE_ERR = {
  nontrovata: 'This challenge no longer exists. Ask for a new link.', piena: 'This challenge already has two players.', iniziata: 'This challenge has already started.',
  versione: 'Update FinLearn: close the app, open it again and try again.', scaduta: 'The challenge expired: nobody joined in time.', finita: 'The challenge is over.',
  riprova: 'I couldn\'t create the challenge: try again.', formato: 'Invalid message.', troppi: 'Too many messages in a short time.'
};
const livePts = n => (n < 0 ? '−' + Math.abs(n) : String(n));

// collegamento all'arbitro: si riapre da solo se cade (rete, app in secondo piano), con attese sempre più lunghe
class LiveConn {
  constructor(opt, onMsg, onNet) { this.opt = opt; this.onMsg = onMsg; this.onNet = onNet; this.codice = opt.codice || null; this.pid = (this.codice && livePids()[this.codice]) || liveNewPid(); this.ws = null; this.tent = 0; this.fermo = false; this.timer = null; this.hb = null; }
  url() { return SFIDE_WS + '/stanza?' + (this.codice ? 'codice=' + this.codice : 'nuova=1&corso=' + encodeURIComponent(this.opt.corso)); }
  apri() {
    if (this.fermo) return;
    clearTimeout(this.timer);
    let ws; try { ws = new WebSocket(this.url()); } catch (e) { this.riprova(); return; }
    this.ws = ws; this.onNet(this.tent ? 'ricollego' : 'collego');
    ws.onopen = () => { this.send({ t: 'ciao', pid: this.pid, nome: this.opt.nome, v: SFIDE_V, lang: LANG }); clearInterval(this.hb); this.hb = setInterval(() => this.raw('{"t":"hb"}'), 20000); };
    ws.onmessage = ev => {
      let m = null; try { m = JSON.parse(ev.data); } catch (e) { return; }
      if (!m || m.t === 'hb') return;
      if (m.t === 'ping') { this.send({ t: 'pong', s: m.s }); return; }   // subito, prima di disegnare: misura la rete
      if (m.t === 'benvenuto') { this.codice = m.codice; this.corso = m.corso; livePidSave(m.codice, this.pid); this.tent = 0; this.onNet('ok'); }
      // Stati Uniti: nelle Basi l'euro del testo inglese diventa dollaro, come nelle lezioni (non dove l'euro è proprio l'euro: m.eu)
      if (m.t === 'domanda') { this.dollari = COUNTRY === 'US' && this.corso === 'basi' && m.l === 'en' && !m.eu; if (this.dollari) { m.q = usDollars(m.q); m.o = usDollars(m.o); } }
      if (m.t === 'esito' && this.dollari && m.e) m.e = usDollars(m.e);
      if (m.t === 'errore') this.fermo = true;
      this.onMsg(m, performance.now());
    };
    ws.onclose = ev => {
      clearInterval(this.hb); if (this.ws !== ws) return; this.ws = null;
      if (this.fermo || ev.code === 4000 || ev.code === 4001) { this.fermo = true; this.onNet('chiuso'); return; }
      this.riprova();
    };
  }
  riprova() {
    if (this.fermo) return;
    this.tent++;
    if (this.tent > 12) { this.fermo = true; this.onNet('irraggiungibile'); return; }
    this.onNet('ricollego');
    this.timer = setTimeout(() => this.apri(), Math.min(8000, 500 * Math.pow(1.6, this.tent)));
  }
  ora() { if (!this.fermo && (!this.ws || this.ws.readyState > 1)) { clearTimeout(this.timer); this.tent = Math.max(1, this.tent); this.apri(); } }
  send(o) { this.raw(JSON.stringify(o)); }
  raw(s) { try { if (this.ws && this.ws.readyState === 1) { this.ws.send(s); return true; } } catch (e) {} return false; }
  chiudi(esco) { if (esco) this.send({ t: 'esco' }); this.fermo = true; clearTimeout(this.timer); clearInterval(this.hb); const ws = this.ws; this.ws = null; try { if (ws) ws.close(1000); } catch (e) {} }
}

function LiveScreen({ nav, codice: cod0, nuova }) {
  const known = userName();
  const [vista, setVista] = useState(cod0 ? 'entra' : nuova ? 'scegli' : 'codice');
  // le domande arrivano dai percorsi che si hanno nell'app
  const corsi = LIVE_CORSI.filter(c => inMyApp(c.id)).length ? LIVE_CORSI.filter(c => inMyApp(c.id)) : LIVE_CORSI;
  const [corso, setCorso] = useState(() => { const c = currentCourse(); return c && corsi.some(x => x.id === c.id) ? c.id : corsi[0].id; });
  const [cod, setCod] = useState(cod0 || ''), [nm, setNm] = useState(known);
  const [st, setSt] = useState({}), [net, setNet] = useState(''), [ask, setAsk] = useState(false), [xp, setXp] = useState(null), [, tick] = useState(0);
  const conn = useRef(null), last = useRef(null), t0 = useRef({}), pend = useRef(null), ioRef = useRef(0), xpDone = useRef(null);
  const nmOk = !!(firstName(nm) || known);

  const onMsg = (m, at) => {
    if (m.t === 'benvenuto') {
      setSt(s => Object.assign({}, s, { benv: m }));
    } else if (m.t === 'stanza') { ioRef.current = m.io; setSt(s => Object.assign({}, s, { stanza: m })); }
    else if (m.t === 'via') { t0.current = {}; pend.current = null; setSt(s => Object.assign({}, s, { via: at + m.ms, dom: null, esito: null, fine: null, chiusa: false, risp: {}, mia: null, storia: [] })); }
    else if (m.t === 'domanda') {
      // risposta data mentre la rete era caduta: si rimanda se la domanda è ancora aperta
      const p = pend.current; if (p && p.i === m.i && m.mia == null && conn.current) conn.current.send({ t: 'risposta', i: p.i, c: p.c, ms: p.ms });
      setSt(s => Object.assign({}, s, { dom: Object.assign({}, m, { at }), esito: s.esito && s.esito.i === m.i ? s.esito : null,
        risp: Object.fromEntries((m.altri || []).map(x => [x.p, x.ok])), mia: m.mia != null ? m.mia : (p && p.i === m.i ? p.c : (s.dom && s.dom.i === m.i ? s.mia : null)) }));
    } else if (m.t === 'risposto') {
      if (m.p === ioRef.current) pend.current = null;
      setSt(s => (s.dom && s.dom.i === m.i ? Object.assign({}, s, { risp: Object.assign({}, s.risp, { [m.p]: m.ok }) }) : s));
    } else if (m.t === 'esito') { pend.current = null; m.at = at; setSt(s => Object.assign({}, s, { esito: m, storia: [...(s.storia || []).filter(x => x.i !== m.i), m] })); }
    else if (m.t === 'fine') setSt(s => Object.assign({}, s, { fine: m, storia: m.storia || s.storia }));
    else if (m.t === 'errore') setSt(s => (m.e === 'finita' && s.fine ? Object.assign({}, s, { chiusa: true }) : Object.assign({}, s, { err: m })));
  };
  const start = o => {
    const nome = firstName(nm) || known;
    if (nome && nome !== s2get().name) s2set({ name: nome });
    if (conn.current) conn.current.chiudi(false);
    last.current = o; t0.current = {}; pend.current = null; xpDone.current = null;
    setSt({}); setNet('collego'); setXp(null); setVista('gioco');
    const c = new LiveConn({ codice: o.codice || null, corso: o.corso || 'basi', nome }, onMsg, setNet);
    conn.current = c; c.apri();
  };
  const leave = () => { if (conn.current) conn.current.chiudi(true); conn.current = null; nav.back(); };
  useEffect(() => { if (vista === 'entra' && known && SFIDE_ON) start({ codice: cod0 }); }, []);
  useEffect(() => () => { if (conn.current) conn.current.chiudi(true); }, []);
  // tornando sull'app (o quando torna la rete) ci si ricollega subito
  useEffect(() => {
    const f = () => { if (document.visibilityState === 'visible' && conn.current) conn.current.ora(); };
    document.addEventListener('visibilitychange', f); window.addEventListener('online', f);
    return () => { document.removeEventListener('visibilitychange', f); window.removeEventListener('online', f); };
  }, []);

  const S = st.stanza, io = S ? S.io : 0, op = io === 0 ? 1 : 0, g = S ? S.g : [], gMe = g[io], gOp = g[op];
  const opName = gOp ? gOp.nome : 'your friend', codice = st.benv ? st.benv.codice : cod;
  const dom = st.dom, es = st.esito && dom && st.esito.i === dom.i ? st.esito : null;
  const fase = st.err ? 'errore' : net === 'irraggiungibile' ? 'rete' : st.fine ? 'fine' : net === 'chiuso' ? 'chiuso' : dom ? (es ? 'esito' : 'domanda') : st.via ? 'via' : S ? 'stanza' : 'collego';
  const corre = fase === 'via' || fase === 'domanda';
  useEffect(() => { if (!corre) return; const h = setInterval(() => tick(x => x + 1), 200); return () => clearInterval(h); }, [corre]);
  // il cronometro parte quando la domanda è sullo schermo (il fotogramma dopo il disegno)
  React.useLayoutEffect(() => {
    if (!dom || t0.current[dom.i] != null) return;
    const i = dom.i; requestAnimationFrame(() => { if (t0.current[i] == null) t0.current[i] = performance.now(); });
  }, [dom && dom.i]);
  // fine partita: punti esperienza una volta sola
  useEffect(() => {
    const f = st.fine; if (!f || xpDone.current === f) return; xpDone.current = f;
    const win = f.vince === io, draw = f.vince === 'pari', mine = f.uscito === io, n = mine || !(f.storia || []).length ? 0 : win ? 30 : draw ? 10 : 5;
    addXp(n); setXp(n);
    if (!mine) s2set(s => ({ duel: { w: s.duel.w + (win ? 1 : 0), l: s.duel.l + (!win && !draw ? 1 : 0), last: Date.now() } }));
  }, [st.fine]);

  const tap = k => {
    if (!dom || es || st.mia != null) return;
    const now = performance.now(); if (now > dom.at + dom.ms) return;
    const ms = Math.max(0, Math.round(now - (t0.current[dom.i] != null ? t0.current[dom.i] : dom.at)));
    pend.current = { i: dom.i, c: k, ms };
    setSt(s => Object.assign({}, s, { mia: k }));
    if (conn.current) conn.current.send({ t: 'risposta', i: dom.i, c: k, ms });
  };
  const link = () => location.origin + location.pathname + '#sfida=' + codice;
  const copy = async (t, msg) => { try { await navigator.clipboard.writeText(t); nav.toast(msg); } catch (e) { nav.toast('The code is ' + codice); } };
  const share = async () => {
    const url = link(), text = `I challenge you on FinLearn: 5 questions, and the point goes to whoever answers correctly first. The code is ${codice}.`;
    if (navigator.share) { try { await navigator.share({ title: 'Challenge on FinLearn', text, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    copy(url, 'Link copied');
  };

  // ---- prima di collegarsi: scelta delle domande, codice, nome ----
  const nameField = !known && html`<div class="o-col" style="gap:8px"><label class="o-lab" for="live-nome">Your name</label>
    <input id="live-nome" class="o-inp" value=${nm} onInput=${e => setNm(e.target.value)} placeholder="How your friend will see you" maxlength="20" autocomplete="given-name"/></div>`;
  const topSetup = html`<${TopBar} onClose=${nav.back} title="Live challenge"/>`;
  if (!SFIDE_ON && vista !== 'gioco') return html`<${Flow} top=${topSetup}><div class="o-pad o-col" style="gap:10px;padding-top:12px"><h1 class="o-h1m">Almost ready</h1><p class="o-body o-mut">Live challenges start as soon as the referee is online.</p></div><//>`;
  if (vista === 'scegli') return html`<${Flow} top=${topSetup} foot=${html`<${Btn} cls="lg" bg=${PESCA} disabled=${!nmOk} onClick=${() => start({ corso })}>Create the challenge<//>`}>
    <div class="o-pad o-col o-duel" style="gap:22px;padding-top:12px;padding-bottom:20px">
      <div class="o-col" style="gap:8px"><h1 class="o-h1m">Lightning</h1>
        <p class="o-body o-mut">5 questions, the same on both phones. The point goes to whoever answers correctly first. If you get it wrong you lose a point, and the other player can still answer.</p></div>
      ${corsi.length > 1 ? html`<div class="o-col" style="gap:10px" role="radiogroup" aria-label="Which path the questions come from">
        ${corsi.map(c => html`<button key=${c.id} type="button" role="radio" aria-checked=${corso === c.id ? 'true' : 'false'} class=${'o-opt' + (corso === c.id ? ' sel' : '')} onClick=${() => setCorso(c.id)}>
          <span class="l">${corso === c.id ? PathIco(D_CHECK, 20, 3) : ''}</span><span class="x"><span style="display:block">${c.name}</span><span class="o-s" style="display:block;margin-top:2px;font-weight:600">${c.sub}</span></span></button>`)}</div>` : html`<p class="o-s" style="font-size:14px;line-height:20px">The questions come from ${corsi[0].name}. ${corsi[0].sub}.</p>`}
      ${nameField}
    </div><//>`;
  if (vista === 'codice' || (vista === 'entra' && !known)) {
    const c6 = cod.length === 6, okCod = LIVE_RE.test(cod);
    return html`<${Flow} top=${topSetup} foot=${html`<${Btn} cls="lg" bg=${PESCA} disabled=${!okCod || !nmOk} onClick=${() => start({ codice: cod })}>Join the challenge<//>`}>
      <div class="o-pad o-col" style="gap:22px;padding-top:12px;padding-bottom:20px">
        <div class="o-col" style="gap:8px"><h1 class="o-h1m">${vista === 'entra' ? 'You\'ve been challenged' : 'Join a challenge'}</h1>
          <p class="o-body o-mut">${vista === 'entra' ? 'Type your name and join: the challenge starts when you are both ready.' : 'Type the 6-character code you were sent.'}</p></div>
        <div class="o-col" style="gap:8px"><label class="o-lab" for="live-cod">Challenge code</label>
          <input id="live-cod" class="o-inp o-mono" value=${cod} onInput=${e => setCod(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))} readonly=${vista === 'entra'}
            inputmode="text" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" maxlength="6" style="height:64px;font-size:28px;letter-spacing:.24em;text-align:center"/>
          ${c6 && !okCod && html`<p class="o-s" role="alert">Codes never contain I, O, 0 or 1: check that you typed it correctly.</p>`}</div>
        ${nameField}
      </div><//>`;
  }

  // ---- collegati ----
  const banner = net === 'ricollego' && fase !== 'fine' && html`<div role="status" class="o-fade" style="position:absolute;left:20px;right:20px;top:calc(var(--otop) + 54px);z-index:8;padding:10px 14px;background:${GIALLO};border:2.5px solid ${INK};border-radius:16px;font-size:15px;line-height:20px;font-weight:800;text-align:center">Connection lost: reconnecting…</div>`;
  const exitSheet = ask && html`<${BSheet} onClose=${() => setAsk(false)} label="Leave the challenge"><h2 class="o-big">Do you want to leave the challenge?</h2>
    <p class="o-body o-mut" style="margin-top:6px">If you leave now, the game goes to ${opName}.</p>
    <div class="o-col" style="gap:10px;margin-top:16px"><${Btn} cls="lg" bg=${PESCA} onClick=${() => setAsk(false)}>Stay<//><${Btn} cls="lg flat" bg="#fff" onClick=${leave}>Leave<//></div><//>`;
  const closeBtn = () => (fase === 'via' || fase === 'domanda' || fase === 'esito' ? setAsk(true) : leave());

  if (fase === 'errore' || fase === 'rete' || fase === 'chiuso') {
    const msg = fase === 'errore' ? (LIVE_ERR[st.err.e] || st.err.m) : fase === 'rete' ? 'I can\'t reach the challenge referee. Check your connection and try again.' : 'The connection to the challenge closed. If it is still open, rejoin with the code.';
    return html`<${Flow} top=${html`<${TopBar} onClose=${leave} title="Live challenge"/>`} foot=${html`<div class="o-col" style="gap:10px">
        ${fase !== 'errore' && last.current && html`<${Btn} cls="lg" bg=${PESCA} onClick=${() => start(last.current.codice || !codice ? last.current : { codice })}>Try again<//>`}
        <${Btn} cls="lg flat" bg="#fff" onClick=${leave}>Back to challenges<//></div>`}>
      <div class="o-pad o-col" style="align-items:center;text-align:center;gap:14px;padding-top:24px"><${Rally} pose="triste" w=${170} alt=""/>
        <p class="o-body" role="alert" style="font-size:17px;line-height:24px;font-weight:700;max-width:320px">${msg}</p></div><//>`;
  }
  if (fase === 'collego') return html`<${Flow} top=${html`<${TopBar} onClose=${leave} title="Live challenge"/>`}>
    <div class="o-pad o-col" style="align-items:center;text-align:center;gap:14px;padding-top:24px"><${Rally} pose="telefono" w=${170} alt=""/><p class="o-body" role="status">Connecting to the referee…</p></div><//>`;

  if (fase === 'stanza') {
    const two = g.length === 2, iReady = gMe && gMe.pronto;
    const who = (x, me) => html`<div class="o-rowf" style="gap:12px;min-height:56px">
      <${Avatar} ch=${(x.nome || '?')[0].toUpperCase()} bg=${me ? PESCA : LILLA} size=${40}/>
      <span class="o-grow o-col" style="gap:1px"><span class="o-t">${me ? 'You' : x.nome}</span>${!(x.pronto && x.via) && html`<span class="o-s">${!x.via ? 'Offline' : me && !two ? 'In the room' : 'Not ready yet'}</span>`}</span>
      ${x.pronto && x.via && html`<span class="o-tag" style="background:${MENTA}">Ready</span>`}</div>`;
    return html`<${Flow} top=${html`<div style="flex:none;background:${PESCA};position:relative"><${TopBar} onClose=${closeBtn} title="Live challenge"/></div>`}
      foot=${two ? html`<${Btn} cls="lg" bg=${PESCA} disabled=${iReady || !(gOp && gOp.via)} onClick=${() => conn.current && conn.current.send({ t: 'pronto' })}>${iReady ? `Waiting for ${opName}…` : 'I\'m ready'}<//>` : null} over=${banner}>
      <div style="background:${PESCA};padding:4px 20px 26px;border-bottom:2.5px solid ${INK}">
        ${two ? html`<h1 class="o-h1m">${opName} is in the room</h1><p class="o-body" style="margin-top:8px">When you are both ready, the countdown starts.</p>`
          : html`<h1 class="o-h1m">Send the code</h1><p class="o-body" style="margin-top:8px">Your friend joins with the link or by typing the code in the Challenges tab, under ‘I already have a code’.</p>`}</div>
      <div class="o-pad o-col" style="gap:18px;padding-top:20px;padding-bottom:20px">
        ${!two && html`<div class="o-card s o-col" style="align-items:center;gap:4px;padding:16px">
            <span class="o-lab">Challenge code</span>
            <span class="o-mono" aria-label=${'Code ' + codice.split('').join(' ')} style="font-size:40px;line-height:48px;letter-spacing:.2em;font-weight:600;margin-right:-.2em">${codice}</span></div>
          <div class="o-col" style="gap:4px;align-items:center"><${Btn} cls="lg" bg=${PESCA} onClick=${share}>${Ico(Share2, 20)} Send the link<//>
            <button type="button" class="o-link" onClick=${() => copy(codice, 'Code copied')}>Copy the code only</button></div>`}
        <div class="o-col">${gMe && who(gMe, true)}${gOp ? who(gOp, false) : html`<div class="o-rowf" style="gap:12px;min-height:56px">
          <span style="width:40px;height:40px;flex:none;border:2px dashed ${INK};border-radius:50%"></span><span class="o-s">Waiting for your friend…</span></div>`}</div>
        <p class="o-s">Finance Basics questions. 5 questions: the point goes to whoever answers correctly first; a wrong answer costs a point.</p>
        ${!two && html`<p class="o-s">On iPhone the link opens in Safari, not in the app: if FinLearn is on your Home Screen, typing the code is quicker.</p>`}
      </div><//>`;
  }

  if (fase === 'via') {
    const left = Math.max(0, Math.ceil((st.via - performance.now()) / 1000));
    return html`<${Flow} bg=${PESCA} top=${html`<${TopBar} onClose=${closeBtn} title=${'Lightning with ' + opName}/>`} over=${html`${banner}${exitSheet}`}>
      <div class="o-pad o-col" style="align-items:center;text-align:center;gap:22px;padding-top:30px">
        <div role="timer" aria-live="assertive" class="o-pop" key=${left} style="width:180px;height:180px;display:flex;align-items:center;justify-content:center;background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:5px 5px 0 ${INK};font-size:${left ? 96 : 56}px;line-height:1;font-weight:800">${left || 'Go!'}</div>
        <p class="o-body" style="font-size:17px;line-height:24px;font-weight:700;max-width:300px">The point goes to whoever answers correctly first. If you get it wrong you lose a point.</p></div><//>`;
  }

  if (fase === 'domanda' || fase === 'esito') {
    const n = dom.n, now = es ? es.at : performance.now(), expired = !es && now > dom.at + dom.ms, left = Math.max(0, Math.ceil((dom.at + dom.ms - now) / 1000));
    const lastEs = (st.storia || []).slice(-1)[0], pts = es ? es.punti : lastEs ? lastEs.punti : g.map(x => x.punti), myOk = st.risp ? st.risp[io] : undefined, opOk = st.risp ? st.risp[op] : undefined;
    const dot = k => { const v = (st.storia || []).find(x => x.i === k), bg = !v ? 'transparent' : v.punto === io ? PESCA : v.punto === op ? LILLA : v.punto === 'pari' ? GIALLO : '#fff';
      return html`<i key=${k} style=${{ width: 12, height: 12, borderRadius: '50%', border: `2px ${v ? 'solid' : 'dashed'} ${INK}`, background: bg }}></i>`; };
    const rich = dom.o.some(o => /\\\(|\*\*|\$\$/.test(o)), big = dom.o.every(o => String(o).length <= 14), opC = es && es.r[op] ? es.r[op].c : null;
    let chip = null;
    if (!es) {
      if (st.mia != null) chip = myOk === false ? [ROSA, 'Wrong: you lose a point'] : myOk === true ? [MENTA, 'Right! Let\'s see who was faster'] : [T_PESCA, 'Answer sent'];
      else if (opOk === false) chip = [GIALLO, `${opName} got it wrong: your turn`];
      else if (opOk === true) chip = [T_GR, `${opName} answered`];
      else if (expired) chip = [T_GR, 'Time\'s up'];
    }
    const res = es && (() => {
      const head = es.punto === io ? 'Point to you' : es.punto === op ? `Point to ${opName}` : es.punto === 'pari' ? 'Tie: one point each' : 'No point';
      const a = es.r[io], b = es.r[op], both = a && b && a.ok && b.ok;
      const gap = both && es.punto !== 'pari' ? (es.punto === io ? `You were faster, by ${liveGap(Math.abs(a.ms - b.ms))}` : `${opName} was faster by ${liveGap(Math.abs(a.ms - b.ms))}`) : null;
      const line = (r, name, me) => html`<div class="o-rowf" style="gap:10px;min-height:30px">
        <span class="o-grow" style="font-size:15px;font-weight:700">${name}</span>
        ${r ? html`<span class="o-rowf" style="gap:6px;font-size:16px;font-weight:800">${PathIco(r.ok ? D_CHECK : D_X, 18, 3)}${liveSec(r.ms)}${!r.ok && html`<span style="padding:0 8px;background:${ROSA};border:2px solid ${INK};border-radius:999px;font-size:13px">−1</span>`}</span>`
          : html`<span class="o-s">No answer</span>`}</div>`;
      return html`<div class="o-card s o-pop" role="status" style=${{ padding: '12px 16px', background: es.punto === io ? MENTA : es.punto === op ? T_LILLA : es.punto === 'pari' ? T_GIALLO : '#fff' }}>
        <div style="font-size:20px;line-height:24px;font-weight:800">${head}</div>
        <div class="o-col" style="margin-top:6px">${line(a, 'You', true)}${line(b, opName, false)}</div>
        ${gap && html`<p class="o-s" style="margin-top:4px;color:${INK}">${gap}</p>`}</div>`;
    })();
    return html`<${Flow} bg="#fff" top=${html`<div style="flex:none;background:${PESCA};border-bottom:2.5px solid ${INK};padding-bottom:58px;position:relative">
        <${Rally} pose="sfida" w=${110} alt="" style="position:absolute;right:6px;top:calc(var(--otop) - 7px)"/>
        <${TopBar} onClose=${closeBtn} title=${'Lightning with ' + opName} right=${html`<span aria-hidden="true" style="width:84px;flex:none"></span>`}/></div>
      <div class="o-pad" style="flex:none;margin-top:-46px;position:relative"><div class="o-card s" style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:12px 16px">
        <span class="o-col" style="align-items:center;gap:2px"><${Avatar} ch=${((gMe && gMe.nome) || 'T')[0].toUpperCase()} bg=${PESCA}/><span class="o-s">You</span><span style="font-size:30px;line-height:32px;font-weight:800">${livePts(pts[io] || 0)}</span></span>
        <span class="o-col" style="align-items:center;gap:6px"><span class="o-s" style="font-weight:700">Question ${dom.i + 1} of ${n}</span>
          <span class="o-mono" role="timer" aria-label=${es ? 'Question closed' : `${left} seconds`} style=${{ padding: '3px 14px', background: !es && left <= 5 ? ROSA : T_PESCA, border: `2px solid ${INK}`, borderRadius: 999, fontSize: 17, fontWeight: 600 }}>${fmtClock(left)}</span>
          <span class="o-rowf" style="gap:5px" role="img" aria-label="Points question by question">${Array.from({ length: n }, (_, k) => dot(k))}</span></span>
        <span class="o-col" style="align-items:center;gap:2px"><${Avatar} ch=${opName[0].toUpperCase()} bg=${LILLA}/><span class="o-s" style="max-width:96px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${opName}</span><span style="font-size:30px;line-height:32px;font-weight:800">${livePts(pts[op] || 0)}</span></span></div></div>`}
      over=${html`${banner}${exitSheet}`}>
      <div class="o-duel o-pad" style="padding-top:12px;padding-bottom:20px">
        <div aria-live="polite" style="min-height:30px;display:flex;justify-content:flex-end">${chip && html`<span class="o-fade" key=${chip[1]} style=${{ padding: '3px 12px', background: chip[0], border: `2px solid ${INK}`, borderRadius: 999, fontSize: 13, lineHeight: '18px', fontWeight: 800 }}>${chip[1]}</span>`}</div>
        ${res && html`<div style="margin-top:6px">${res}</div>`}
        <div style="margin-top:12px"><${Rich} text=${dom.q} cls=${dom.q.length > 160 ? '' : 'q'} lang=${dom.l}/></div>
        <div class="o-col" style="gap:10px;margin-top:16px">${dom.o.map((o, k) => {
          let state = '', note = null;
          if (es) { state = k === es.a ? 'ok' : k === st.mia ? 'ko' : 'dim'; note = [k === st.mia ? 'You' : null, k === opC ? opName : null].filter(Boolean).join(' and ') || null; }
          else if (st.mia === k) { state = myOk === true ? 'ok' : myOk === false ? 'ko' : 'sel'; note = 'You'; }
          else if (st.mia != null || expired) state = 'dim';
          return html`<${Opt} key=${k} letter=${L3[k]} text=${o} rich=${rich} big=${big} lang=${dom.l} state=${state} note=${note} disabled=${st.mia != null || !!es || expired} onClick=${() => tap(k)}/>`;
        })}</div>
      </div><//>`;
  }

  // ---- fine ----
  const f = st.fine, win = f.vince === io, draw = f.vince === 'pari', heLeft = f.uscito === op;
  const canRe = f.uscito == null && !st.chiusa && gOp && gOp.via && S && S.fase === 'fine';
  const reLabel = gMe && gMe.rivincita ? `Waiting for ${opName}…` : gOp && gOp.rivincita ? 'Accept the rematch' : 'Rematch';
  return html`<div class="o-scr" style="background:repeating-conic-gradient(from 5deg at 50% 200px, #FFD7BA 0deg 10deg, ${PESCA} 10deg 20deg)"><div class="o-scroll"><div class="o-col o-pad" style="min-height:100%;align-items:center">
    <div style="width:220px;height:220px;flex:none;margin-top:calc(var(--otop) + 18px);background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:5px 5px 0 ${INK};display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <${Rally} pose=${win ? 'festeggia' : draw ? 'occhiolino' : 'triste'} w=${208} alt="" style="margin-bottom:-16px"/></div>
    <h1 class="o-pop" style="font-size:44px;line-height:48px;font-weight:800;letter-spacing:-.02em;margin-top:20px;text-align:center">${win ? 'You won!' : draw ? 'Tie' : 'Not this time'}</h1>
    ${heLeft && html`<p class="o-body" style="margin-top:6px;font-weight:700">${opName} left the challenge.</p>`}
    <div class="o-rowf" style="gap:12px;margin-top:16px;padding:12px 20px;background:#fff;border:2.5px solid ${INK};border-radius:22px;box-shadow:5px 5px 0 ${INK};transform:rotate(-2deg)">
      <${Avatar} ch=${((gMe && gMe.nome) || 'T')[0].toUpperCase()} bg=${PESCA}/><span style="font-size:15px;font-weight:700">You</span>
      <span style="font-size:36px;line-height:40px;font-weight:800;letter-spacing:-.02em;margin:0 6px;white-space:nowrap">${livePts(f.punti[io] || 0)} to ${livePts(f.punti[op] || 0)}</span>
      <span style="font-size:15px;font-weight:700;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${opName}</span><${Avatar} ch=${opName[0].toUpperCase()} bg=${LILLA}/></div>
    ${xp != null && xp > 0 && html`<span class="o-pill" style="margin-top:20px;background:${GIALLO}">+${xp} XP</span>`}
    ${(f.storia || []).length > 0 && html`<div class="o-card s" style="width:100%;margin-top:20px;padding:6px 16px">${f.storia.map(v => {
      const w = v.punto === 'pari' ? null : v.punto, r = w != null && v.r[w] ? v.r[w] : null;
      const t = v.punto === io ? 'Point to you' : v.punto === op ? `Point to ${opName}` : v.punto === 'pari' ? 'Tie, one point each' : 'No point';
      return html`<div key=${v.i} class="o-row" style="min-height:48px;gap:12px"><span style="width:26px;height:26px;flex:none;display:flex;align-items:center;justify-content:center;border:2px solid ${INK};border-radius:50%;font-size:13px;font-weight:800;background:${v.punto === io ? PESCA : v.punto === op ? LILLA : v.punto === 'pari' ? GIALLO : '#fff'}">${v.i + 1}</span>
        <span class="o-grow o-t" style="font-size:15px">${t}</span><span class="o-s" style="color:${INK};font-weight:700">${r ? liveSec(r.ms) : ''}</span></div>`;
    })}</div>`}
    <div style="flex:1 1 16px;min-height:16px"></div>
    <div class="o-col" style="gap:12px;width:100%;margin-top:18px">
      ${canRe ? html`<${Btn} cls="lg" bg="#fff" disabled=${gMe && gMe.rivincita} onClick=${() => conn.current && conn.current.send({ t: 'rivincita' })}>${reLabel}<//>`
        : html`<${Btn} cls="lg" bg="#fff" onClick=${() => { if (conn.current) conn.current.chiudi(true); conn.current = null; nav.replace('live', { nuova: true }); }}>New challenge<//>`}
      ${!canRe && html`<p class="o-s" style="text-align:center;color:${INK}">${heLeft || (gOp && !gOp.via) ? `${opName} is no longer in the room.` : 'The room is closed.'} To play again, create a new challenge.</p>`}</div>
    <div style="padding:2px 0 max(22px,calc(env(safe-area-inset-bottom) + 8px))"><button type="button" class="o-link" onClick=${leave}>Back to challenges</button></div>
  </div></div>${banner}</div>`;
}

// =====================================================================================================
// APERTURA e PRIMO GIORNO (fuori dall'app vera e propria: non usano il kit)
// =====================================================================================================
// il marchio dell'app, come FinLearnWordmark nel tema chiaro
function Wordmark({ size = 60, arrowRef, headRef }) {
  return html`<span aria-label="FinLearn" style=${{ fontFamily: "'Nunito','Bricolage Grotesque',system-ui,sans-serif", fontWeight: 900, fontSize: size, letterSpacing: '-.02em', lineHeight: 1, color: '#FFB020', display: 'inline-flex', alignItems: 'flex-end' }}>
    <span style="color:#16203A">f<span style="position:relative;display:inline-block">ı<svg viewBox="0 0 20 20" aria-hidden="true" style="position:absolute;left:50%;top:-.04em;width:.42em;height:.42em;transform:translateX(-46%);overflow:visible">
      <polyline ref=${arrowRef} points="3,15 8,9 11,12 16,5" fill="none" stroke="#22C55E" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path ref=${headRef} d="M18.6 2.2 L11.6 4.2 L17 9.4 Z" fill="#22C55E" stroke="#22C55E" stroke-width="1.6" stroke-linejoin="round"/></svg></span>n</span>learn</span>`;
}

// Apertura: le otto candele dello splash storico crescono una dopo l'altra, la linea di tendenza si disegna,
// compaiono Rally, marchio e motto; la base del grafico fa da barra di caricamento. Stessi tempi di prima (circa 3 secondi).
const SPL = { W: 390, H: 844, DUR: 3.15, x0: 27, sx: 1.68, y0: 424, sy: 2.95, w: 28, base: 700, rules: [460, 541, 622], gy: 214, logo: 240, fs: 66, tag: 328, rs: 124,
  can: [[22, 60, 1, 0], [30, 48, 1, .12], [18, 52, 0, .24], [34, 36, 1, .36], [26, 30, 1, .48], [16, 38, 0, .6], [40, 14, 1, .72], [32, 8, 1, .84]],
  line: [[12, 68], [37, 55], [62, 58], [87, 42], [112, 38], [137, 44], [162, 22], [187, 16]] };
function splashChart(t) {
  const G = SPL, seg = (a, b) => clamp((t - a) / (b - a), 0, 1), out = x => 1 - Math.pow(1 - x, 3), quint = x => 1 - Math.pow(1 - x, 5), f = v => (+v).toFixed(1);
  const X = u => G.x0 + u * G.sx, Y = u => G.y0 + u * G.sy, XA = X(0), XB = X(200), BG = T_BG;
  const pts = G.line.map(q => [X(q[0]), Y(q[1])]); let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let s = ''; const g = seg(0, .35).toFixed(2);
  G.rules.forEach(y => { s += `<path d="M${f(XA)} ${y}H${f(XB)}" stroke="#DDE3EC" stroke-width="1.5" opacity="${g}"/>`; });
  const fl = out(seg(1.8, 2.8));
  s += `<rect x="${f(XA)}" y="${G.base - 2}" width="${f(XB - XA)}" height="4" rx="2" fill="#D3DAE5" opacity="${g}"/>`;
  if (fl > 0) s += `<rect x="${f(XA)}" y="${G.base - 2}" width="${f(Math.max((XB - XA) * fl, 4))}" height="4" rx="2" fill="${INK}"/>`;
  G.can.forEach(([h, y, up, d], i) => {
    const x = seg(d, d + .6); if (x <= 0) return;
    const k = quint(x), cx = X(i * 25 + 12), yb = Y(y + h), hh = Math.max(h * G.sy * k, 1), ym = Y(y + h / 2), wl = (h / 2 + 6) * G.sy * k;
    s += `<path d="M${f(cx)} ${f(ym - wl)}V${f(ym + wl)}" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
    s += `<rect x="${f(cx - G.w / 2)}" y="${f(yb - hh)}" width="${G.w}" height="${f(hh)}" rx="3" fill="${up ? '#10B981' : '#F43F5E'}" stroke="${INK}" stroke-width="2"/>`;
  });
  const p = out(seg(.3, 1.9));
  if (p > 0) { const d = 'M' + pts.map(q => f(q[0]) + ' ' + f(q[1])).join('L'), da = ` fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${f(len)}" stroke-dashoffset="${f(len * (1 - p))}"/>`;
    s += `<path d="${d}" stroke="${BG}" stroke-width="6.4"${da}<path d="${d}" stroke="${INK}" stroke-width="3"${da}`; }
  const a = seg(1.84, 1.96);
  if (a > 0) { const q = pts[pts.length - 1], r = seg(1.9, 2.55);
    if (r > 0 && r < 1) s += `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(5.5 + 15 * out(r))}" fill="none" stroke="${INK}" stroke-width="1.5" opacity="${(.45 * (1 - r)).toFixed(2)}"/>`;
    s += `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="5.5" fill="${INK}" stroke="${BG}" stroke-width="2.4" opacity="${a.toFixed(2)}"/>`; }
  return s;
}
export function OrdineSplash({ onComplete }) {
  const R = useRef({}).current;
  const [sc, setSc] = useState(() => (typeof window === 'undefined' ? 1 : Math.min(window.innerWidth / SPL.W, window.innerHeight / SPL.H)));
  useEffect(() => {
    ordInjectCss();
    const onRes = () => setSc(Math.min(window.innerWidth / SPL.W, window.innerHeight / SPL.H)); window.addEventListener('resize', onRes);
    let reduce = false; try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1), out = x => 1 - Math.pow(1 - x, 3), io = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const t0 = performance.now(); let raf = 0, over = false;
    const draw = t => {
      if (R.chart) R.chart.innerHTML = splashChart(t);
      const a = out(seg(t, .2, .75)); if (R.rally) { R.rally.style.opacity = a.toFixed(3); R.rally.style.transform = `translateY(${(10 * (1 - a)).toFixed(2)}px)`; }
      const blink = (t > 1.24 && t < 1.32) || (t > 2.18 && t < 2.26), down = t > 1.39 && t < 2.31;
      if (R.p0) { R.p0.style.opacity = blink || down ? 0 : 1; R.p1.style.opacity = !blink && down ? 1 : 0; R.p2.style.opacity = blink ? 1 : 0; }
      const l = out(seg(t, .7, 1.2)); if (R.logo) { R.logo.style.opacity = l.toFixed(3); R.logo.style.transform = `translateY(${(12 * (1 - l)).toFixed(2)}px)`; }
      const w = io(seg(t, .95, 1.4)); if (R.arrow) { R.arrow.setAttribute('stroke-dasharray', '20.7'); R.arrow.setAttribute('stroke-dashoffset', (20.7 * (1 - w)).toFixed(2)); R.arrow.style.opacity = w > 0 ? 1 : 0; }
      if (R.head) R.head.style.opacity = out(seg(t, 1.34, 1.5)).toFixed(3);
      const g = out(seg(t, 1.2, 1.7)); if (R.tag) { R.tag.style.opacity = g.toFixed(3); R.tag.style.transform = `translateY(${(6 * (1 - g)).toFixed(2)}px)`; }
      if (R.stage) R.stage.style.opacity = (1 - io(seg(t, 2.62, 3.12))).toFixed(3);
    };
    const end = () => { if (!over) { over = true; onComplete && onComplete(); } };
    const tick = now => { const t = (now - t0) / 1000; draw(reduce ? 2.5 : t); if (t < (reduce ? 1.4 : SPL.DUR)) raf = requestAnimationFrame(tick); else end(); };
    draw(0); raf = requestAnimationFrame(tick);
    const safety = setTimeout(end, 6000);   // se la scheda è in secondo piano i fotogrammi non arrivano: l'app parte lo stesso
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); window.removeEventListener('resize', onRes); };
  }, []);
  const rw = 228 * SPL.rs / 160, rx = SPL.W / 2 - SPL.rs / 2 - 34 * SPL.rs / 160, ry = SPL.gy - 163 * SPL.rs / 160 - 44 * SPL.rs / 160;
  const im = (n, k, o) => html`<img ref=${el => { R[k] = el; }} src=${'rally/' + n + '.svg'} alt="" width=${rw} style=${{ position: 'absolute', left: 0, top: 0, width: rw, height: 'auto', opacity: o }}/>`;
  return html`<div style="position:fixed;inset:0;z-index:60;background:${T_BG};overflow:hidden" role="img" aria-label="FinLearn is opening">
    <div ref=${el => { R.stage = el; }} style=${{ position: 'absolute', left: '50%', top: '50%', width: SPL.W, height: SPL.H, marginLeft: -SPL.W / 2, marginTop: -SPL.H / 2, transform: `scale(${sc.toFixed(4)})`, transformOrigin: '50% 50%' }}>
      <svg ref=${el => { R.chart = el; }} viewBox="0 0 390 844" style="position:absolute;left:0;top:0;width:390px;height:844px;overflow:visible"></svg>
      <div ref=${el => { R.rally = el; }} style=${{ position: 'absolute', left: rx, top: ry, width: rw, opacity: 0 }}>${im('calmo', 'p0', 1)}${im('calmo-giu', 'p1', 0)}${im('calmo-chiusi', 'p2', 0)}</div>
      <div ref=${el => { R.logo = el; }} style=${{ position: 'absolute', left: 0, right: 0, top: SPL.logo, display: 'flex', justifyContent: 'center', opacity: 0 }}><${Wordmark} size=${SPL.fs} arrowRef=${el => { R.arrow = el; }} headRef=${el => { R.head = el; }}/></div>
      <div ref=${el => { R.tag = el; }} style=${{ position: 'absolute', left: 0, right: 0, top: SPL.tag, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontFamily: "'IBM Plex Mono',ui-monospace,monospace", fontWeight: 500, fontSize: 10.5, lineHeight: '14px', letterSpacing: '.32em', textTransform: 'uppercase', color: MUT, whiteSpace: 'nowrap', opacity: 0 }}>
        <i style="display:block;width:26px;height:1.5px;background:${INK};border-radius:1px"></i><span style="margin-right:-.32em">Bull market your knowledge</span><i style="display:block;width:26px;height:1.5px;background:${INK};border-radius:1px"></i></div>
    </div></div>`;
}

// Primo giorno: benvenuto, obiettivo, punto di partenza, (5 domande), "Ecco la tua FinLearn".
// `auth` arriva da app.js (accesso di prova, salvato sul dispositivo); `pre` porta i dati che servono prima dell'accesso.
const GOALS = [['zero', 'Understand finance from scratch', 'Money, interest, inflation', Sprout], ['invest', 'Invest my savings', 'Stocks, bonds, funds', TrendingUp], ['work', 'Use it at work', 'Financial statements, valuation, rates', Briefcase]];
// i paesi tra cui scegliere (solo in inglese): decidono lezioni e valuta
const COUNTRIES = [['US', 'United States', 'Dollars and US rules'], ['IT', 'Italy', 'Euros and Italian rules']];
function Choice({ on, onClick, icon, title, sub }) {
  return html`<button type="button" role="radio" aria-checked=${on ? 'true' : 'false'} onClick=${onClick} class="o-rowf" style=${{ gap: 14, width: '100%', minHeight: 72, padding: '12px 16px', border: `2.5px solid ${INK}`, borderRadius: 20, background: on ? T_AZ : '#fff', boxShadow: on ? `4px 4px 0 ${INK}` : 'none' }}>
    ${icon && html`<span class="o-ibox" style="width:42px;height:42px;border-radius:13px;font-size:15px">${icon}</span>`}
    <span class="o-grow o-col" style="gap:2px"><span style="font-size:17px;line-height:22px;font-weight:800">${title}</span><span class="o-s" style="font-size:14px;line-height:19px">${sub}</span></span>
    <span style=${{ width: 28, height: 28, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: `2.5px solid ${INK}`, background: on ? INK : '#fff', color: '#fff' }}>${on && PathIco(D_CHECK, 15, 3.6)}</span></button>`;
}

// Le unità del percorso in fila, come le vede chi ha appena scelto: la sai già, parti da qui, in arrivo. Per un esame, sotto ogni materia ci sono i moduli.
function PathRoute({ c, first }) {
  const stops = misStops(c), known = misGet().known || [], exam = c.group === 'cert', startU = first ? first.unit : null;
  const one = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
  const node = (kind, n) => html`<span aria-hidden="true" style=${{ width: 26, height: 26, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: 12, lineHeight: 1, fontWeight: 800,
    background: kind === 'start' ? GIALLO : kind === 'known' ? MENTA : kind === 'soon' ? T_BG : '#fff', border: `2px ${kind === 'soon' ? 'dashed' : 'solid'} ${INK}` }}>${kind === 'known' ? PathIco(D_CHECK, 13, 4) : kind === 'soon' ? null : n}</span>`;
  const modName = (u, sec) => { let n = sec.name; if (n.startsWith(u.name + ': ')) n = n.slice(u.name.length + 2); return n.length > 38 && n.includes(': ') ? n.split(': ')[0] : n; };
  const lastU = stops.length ? stops[stops.length - 1].u : null, tail = exam && lastU ? 22 + lastU.sections.length * 22 : 18;
  let num = 0;
  return html`<div style="position:relative;margin-top:16px"><span aria-hidden="true" style=${{ position: 'absolute', left: 12, top: 20, bottom: tail, width: 2, background: INK }}></span>
    <ol class="o-col" style=${{ position: 'relative', gap: exam ? 12 : 8, listStyle: 'none', margin: 0, padding: 0 }}>${stops.map(s => {
      if (s.soon) return html`<li key=${s.soon.id} class="o-rowf" style="gap:12px;min-height:37px">${node('soon')}
        <span class="o-grow o-col" style="color:${MUT}"><span style="font-size:16px;line-height:20px;font-weight:700">${s.soon.name}</span><span style="font-size:13px;line-height:17px;font-weight:600"><b style="font-weight:800">Coming soon:</b> ${s.soon.sub}</span></span></li>`;
      const u = s.u, ls = unitLessons(u), kn = known.includes(u.id), st = u === startU; num++;
      const sub = exam ? `${plural(ls.length, 'lezione', 'lezioni')} in ${plural(u.sections.length, 'module', 'modules')}` : kn ? `You already know this: ${plural(ls.length, 'lesson marked as done', 'lessons marked as done')}` : (MIS_SUB[u.id] || plural(ls.length, 'lezione', 'lezioni'));
      const row = st ? html`<div class="o-rowf" style="gap:12px;margin:0 -10px;padding:8px 7.5px;background:${T_AZ};border:2.5px solid ${INK};border-radius:16px;box-shadow:3px 3px 0 ${INK}">${node('start', num)}
          <span class="o-grow o-col"><span class="o-rowf" style="gap:8px"><span class="o-grow" style=${Object.assign({ fontSize: 16, lineHeight: '20px', fontWeight: 800 }, one)}>${u.name}</span><span class="o-tag" style="flex:none;line-height:14px;padding:1px 8px">Start here</span></span>
            <span style=${Object.assign({ fontSize: 13, lineHeight: '17px', fontWeight: 600 }, one)}>${sub}</span></span></div>`
        : html`<div class="o-rowf" style="gap:12px;min-height:37px">${node(kn ? 'known' : 'todo', num)}
          <span class="o-grow o-col"><span style=${Object.assign({ fontSize: 16, lineHeight: '20px', fontWeight: 700 }, one)}>${u.name}</span><span style=${Object.assign({ fontSize: 13, lineHeight: '17px', fontWeight: 600, color: MUT }, one)}>${sub}</span></span></div>`;
      return html`<li key=${u.id} class="o-col" style=${{ gap: st ? 8 : 4 }}>${row}
        ${exam && html`<ul class="o-col" style="list-style:none;margin:0;padding:0 0 0 38px">${u.sections.map(sec => html`<li key=${sec.id} class="o-rowf" style="gap:8px;min-height:22px"><span class="o-grow" lang="en" style=${Object.assign({ fontSize: 13, lineHeight: '18px', fontWeight: 600 }, one)}>${modName(u, sec)}</span>
          <span style="flex:none;font-size:13px;line-height:18px;font-weight:600;color:${MUT};font-variant-numeric:tabular-nums" aria-label=${plural(sec.lessons.length, 'lezione', 'lezioni')}>${sec.lessons.length}</span></li>`)}</ul>`}</li>`; })}</ol></div>`;
}
// Quante lezioni e quante unità ha il percorso di oggi, in una riga
function pathMeta(c) {
  const ls = misLessons(c), soon = misStops(c).filter(s => s.soon).length;
  if (c.group === 'cert') return `${plural(ls.length, 'lezione', 'lezioni')}, domande in inglese`;
  return soon ? `${plural(ls.length, 'lesson ready', 'lessons ready')}, ${soon} units coming soon` : `${plural(ls.length, 'short lesson', 'short lessons')} in ${misUnits(c).length} units`;
}
const NUM_IT = ['', 'one', 'two', 'three', 'four', 'five'];
// i passi della registrazione (in STEPS_REG il percorso scelto è già una bozza da mostrare)
const STEPS_REG = ['goal', 'start', 'quiz', 'esito', 'pronta'], STEPS_ALL = ['country'].concat(STEPS_REG);

export function OrdineWelcome({ auth, onAuth, pre }) {
  const [step, setStep] = useState(() => { try { const r = sessionStorage.getItem('fl_resume'); if (r) { sessionStorage.removeItem('fl_resume'); return r; } } catch (e) { /* niente */ } return 'welcome'; }), [goal, setGoal] = useState('zero'), [start, setStart] = useState('zero'), [mins, setMins] = useState(10);
  const [pl, setPl] = useState(null), [qi, setQi] = useState(0), [sel, setSel] = useState(null), [res, setRes] = useState([]), [known, setKnown] = useState([]);
  const [busy, setBusy] = useState(false), [err, setErr] = useState(null), [rest, setRest] = useState(null);   // rest: ricarica di un salvataggio
  if (!K) K = Object.assign({ losProgress: [], albumLoad: () => ({}) }, pre || {});   // prima dell'accesso: i dati dei percorsi e poco altro
  ordInjectCss();
  useOrdFit();
  // durante la registrazione il percorso scelto è una bozza: le schermate lo leggono come se fosse già salvato
  const draft = useMemo(() => ({ goal, level: start, known, more: [], add: [], t: 0 }), [goal, start, known]);
  const inReg = STEPS_REG.includes(step);
  MIS_DRAFT = inReg ? draft : null;
  useEffect(() => () => { MIS_DRAFT = null; }, []);
  const P = MIS_PATHS[goal], course = inReg ? courseById(P.course) : null, N = 3, iStart = 1;
  const first = inReg ? nextLesson(course) : null;
  const enter = async fn => { setBusy(true); setErr(null); try { const r = await fn(); onAuth(r.user, r.data); } catch (e) { setErr((e && e.message) || 'That didn\'t work. Try again.'); setBusy(false); } };
  const create = () => { const now = Date.now();
    s2set(s => ({ onboard: { goal, start, level: true, t: now }, mis: { goal, level: start, known, more: [], add: [], t: now, go: first ? first.key : null }, cur: P.course, settings: Object.assign({}, s.settings, { goalMin: mins }) }));
    enter(() => auth.guest()); };
  const [cty, setCty] = useState(COUNTRY);
  const pickCountry = () => { try { localStorage.setItem('fl_country', cty); } catch (e) { /* niente */ } if (cty === COUNTRY) { setStep('goal'); return; } try { sessionStorage.setItem('fl_resume', 'goal'); } catch (e) { /* niente */ } setCountryPref(cty); };
  const pickGoal = id => { setGoal(id); setKnown([]); };
  const fromStart = () => { if (start === 'some') { setPl(placementFor(goal)); setQi(0); setRes([]); setSel(null); setKnown([]); setStep('quiz'); } else { setKnown([]); setStep('pronta'); } };
  const answer = () => { const it = pl.items[qi], ok = sel === it.q.ans, r = [...res, ok];
    try { recordAnswer(it.q, ok); } catch (e) {}
    setRes(r); setSel(null);
    if (qi < pl.items.length - 1) setQi(qi + 1); else { setKnown(placementKnown(pl, r)); setStep('esito'); } };
  const head = (pose, lab, title, minH = 156) => html`<${Rally} pose=${pose} w=${190} alt="" style="position:absolute;right:-14px;top:-10px"/>
    <div class="o-col" style=${{ gap: 6, position: 'relative', minHeight: minH, maxWidth: 200 }}><span class="o-lab">${lab}</span><h1 class="o-big" style="font-size:30px;line-height:34px">${title}</h1></div>`;
  let body;
  // benvenuto. Sotto «Inizia» c'è «Ho già un salvataggio»: chi cambia telefono (o arriva dal vecchio indirizzo) riparte dal file di "Scarica i miei dati"
  if (!STEPS_ALL.includes(step)) body = html`<div class="o-scr" style="background:${AZ};overflow-y:auto;overflow-x:hidden">
    <div class="o-top o-hero">
      <button type="button" class="o-link" style="position:absolute;right:16px;top:14px;display:inline-flex;align-items:center;gap:6px" aria-label="Language · Lingua" onClick=${() => setLangPref(LANG === 'en' ? 'it' : 'en')}>${Ico(Languages, 18)}<span lang=${LANG === 'en' ? 'it' : 'en'}>${LANG === 'en' ? 'Italiano' : 'English'}</span></button>
      <div style="margin-top:22px"><${Wordmark} size=${34}/></div>
      <div class="o-hero-c">
        <${Rally} pose="saluta" w=${250} alt="Rally, the FinLearn mascot, waving" style="margin-bottom:-6px;max-width:92%"/>
        <span class="o-hero-p"><${Pill} rot=${-8}>Hi, I'm Rally<//></span></div></div>
    <div class="o-sheet o-col" style="flex:none;padding-top:28px;padding-bottom:max(26px,calc(env(safe-area-inset-bottom) + 10px))">
      <h1 style="font-size:30px;line-height:34px;font-weight:800;letter-spacing:-.02em;text-wrap:balance">Learn finance, ten minutes a day</h1>
      <p class="o-body o-mut" style="margin-top:10px;font-size:16px;line-height:23px">From the basics up, with short lessons, challenges and stickers to collect.</p>
      <div style="margin-top:22px"><${Btn} cls="lg" onClick=${() => setStep(LANG === 'en' && !LS.raw('fl_country') ? 'country' : 'goal')}>Get started<//></div>
      <label class="o-link" style=${{ display: 'block', position: 'relative', marginTop: 8, textAlign: 'center', cursor: 'pointer', opacity: rest && rest.busy ? 0.5 : 1 }}>${rest && rest.busy ? 'One moment…' : 'I have a backup'}
        <${RestoreInput} busy=${rest && rest.busy} onBusy=${() => setRest({ busy: true })} onErr=${t => setRest({ err: t })}/></label>
      ${rest && rest.err && html`<p role="alert" style="margin-top:4px;padding:10px 14px;background:${T_ROSA};border-radius:14px;font-size:15px;line-height:20px;font-weight:700">${rest.err}</p>`}</div></div>`;
  else if (step === 'country') body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep('welcome')} title=""/>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px">${head('indica', 'Your country', 'Where do you live?')}
      <div role="radiogroup" aria-label="Where do you live" class="o-col" style="gap:12px;position:relative">${COUNTRIES.map(([id, t, s]) => html`<${Choice} key=${id} on=${cty === id} onClick=${() => setCty(id)} title=${t} sub=${s}/>`)}</div>
      <p class="o-body o-mut" style="margin-top:18px">Rules on taxes, pensions and banking change from one country to another, and so do the lessons you see. You can change it anytime in Settings.</p>
      <div style="margin-top:20px"><${Btn} cls="lg" onClick=${pickCountry}>Continue<//></div></div><//>`;
  else if (step === 'goal') body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep('welcome')} n=${N} i=${0}/>`} foot=${html`<${Btn} cls="lg" onClick=${() => setStep('start')}>Continue<//>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px">${head('indica', `Step 1 of ${N}`, 'What do you want to do with FinLearn?')}
      <div role="radiogroup" aria-label="What do you want to do with FinLearn" class="o-col" style="gap:12px;position:relative">${GOALS.map(([id, t, s, I]) => html`<${Choice} key=${id} on=${goal === id} onClick=${() => pickGoal(id)} icon=${Ico(I, 22)} title=${t} sub=${s}/>`)}</div>
      <p class="o-body o-mut" style="margin-top:18px">What you pick here decides what you find in the app. You can change it anytime without losing your progress.</p></div><//>`;
  else if (step === 'start') body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep('goal')} n=${N} i=${iStart}/>`} foot=${html`<${Btn} cls="lg" onClick=${fromStart}>${start === 'some' ? 'Take the 5 questions' : 'Continue'}<//>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px">${head('occhiolino', `Step ${iStart + 1} of ${N}`, 'Where are you starting from?')}
      <div role="radiogroup" aria-label="Where are you starting from" class="o-col" style="gap:12px;position:relative">
        <${Choice} on=${start === 'zero'} onClick=${() => setStart('zero')} title="Starting from zero" sub="I begin with the first lesson."/>
        <${Choice} on=${start === 'some'} onClick=${() => setStart('some')} title="I know a little already" sub="Five questions, and Rally lets you skip what you already know."/></div>
      <h2 class="o-h2" style="margin:28px 0 12px">How much time do you have each day?</h2>
      <div role="radiogroup" aria-label="Minutes per day" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">${[5, 10, 20].map(m => html`<button key=${m} type="button" role="radio" aria-checked=${mins === m ? 'true' : 'false'} onClick=${() => setMins(m)} class="o-col"
        style=${{ alignItems: 'center', padding: '10px 0 12px', border: `2.5px solid ${INK}`, borderRadius: 18, background: mins === m ? AZ : '#fff', boxShadow: mins === m ? `4px 4px 0 ${INK}` : 'none' }}><span style="font-size:26px;line-height:30px;font-weight:800">${m}</span><span style="font-size:14px;font-weight:700">minutes</span></button>`)}</div>
      <p class="o-body o-mut" style="margin-top:16px">You can change your level and minutes anytime in Settings.</p></div><//>`;
  else if (step === 'quiz') { const q = pl.items[qi].q, n = pl.items.length;
    body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep('start')} n=${n} i=${qi}/>`} foot=${html`<${Btn} cls="lg" disabled=${sel == null} onClick=${answer}>${qi < n - 1 ? 'Next' : 'See where you start'}<//>`}>
      <div class="o-test"><div class="o-pad" style="padding-top:18px;padding-bottom:20px"><span class="o-lab">Question ${qi + 1} of ${n}</span>
        <div style="margin-top:6px"><${Rich} key=${'q' + qi} text=${q.q} cls="q" lang=${q.lang}/></div>
        <div style="margin-top:14px"><${Options} key=${'o' + qi} q=${q} sel=${sel} onSel=${setSel} locked=${false}/></div></div></div><//>`; }
  else if (step === 'esito') { const ok = res.filter(Boolean).length, nk = known.length, startU = first ? first.unit : course.units[0];
    const text = nk === 1 ? 'You already know the first unit: Rally marks it as done. It stays open, so you can review it whenever you like.'
      : nk > 1 ? `You already know the first ${NUM_IT[nk] || nk} units: Rally marks them as done. They stay open, so you can review them whenever you like.`
      : 'Better to start from the first unit, so no gaps are left. The lessons are short.';
    body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep('start')} n=${N} i=${iStart}/>`}
      foot=${html`<div class="o-col" style="align-items:center;gap:2px"><div style="width:100%"><${Btn} cls="lg" onClick=${() => setStep('pronta')}>${nk ? 'Start here' : 'Continue'}<//></div>
        ${nk > 0 && html`<button type="button" class="o-link" onClick=${() => { setKnown([]); setStep('pronta'); }}>I'd rather start from the beginning</button>`}</div>`}>
      <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px"><${Rally} pose="occhiolino" w=${190} alt="" style="position:absolute;right:-14px;top:-10px"/>
        <div class="o-col" style="position:relative;align-items:flex-start;gap:12px;min-height:162px;max-width:214px"><${Pill}>${ok} of ${res.length} correct<//><h1 class="o-big">${nk || exam ? 'Start from ' + startU.name : 'Start from the beginning'}</h1></div>
        <p class="o-body o-mut" style="margin-bottom:14px;position:relative">${text}</p>
        ${html`<div class="o-col" style="gap:4px">${pl.units.map((u, k) => { const kn = known.includes(u.id), st = u === startU;
          return html`<div key=${u.id} class="o-rowf" style=${{ gap: 12, minHeight: st ? 62 : 58, padding: '0 10px', border: `2.5px solid ${st ? INK : '#fff'}`, borderRadius: 16, background: st ? T_AZ : '#fff', boxShadow: st ? `3px 3px 0 ${INK}` : 'none' }}>
            <span class="o-ibox" style=${{ width: 40, height: 40, borderRadius: 13, fontSize: 15, background: kn ? MENTA : '#fff' }}>${kn ? PathIco(D_CHECK, 20, 3) : k + 1}</span>
            <span class="o-grow o-col" style="gap:1px"><span class="o-t" style=${{ fontWeight: st ? 800 : 700 }}>${u.name}</span><span class="o-s" style=${st ? { color: INK } : null}>${plural(unitLessons(u).length, 'lezione', 'lezioni')}</span></span>
            ${kn ? html`<span class="o-tag" style="background:${T_MENTA}">You already know this</span>` : st ? html`<span class="o-tag">Start here</span>` : null}</div>`; })}</div>`}</div><//>`; }
  else if (step === 'pronta') body = html`<div class="o-scr" style="background:${AZ}"><${TopBar} onBack=${() => setStep(start === 'some' && pl ? 'esito' : 'start')} n=${N} i=${N}/>
    <div class="o-scroll"><div class="o-col" style="min-height:100%">
      <div style="position:relative;flex:none"><${Rally} pose="festeggia" w=${200} alt="" style="position:absolute;right:-12px;top:0"/>
        <div class="o-col" style="position:relative;align-items:flex-start;gap:12px;padding:18px 20px 22px;max-width:230px"><h1 style="font-size:34px;line-height:36px;font-weight:800;letter-spacing:-.02em">Here is your FinLearn</h1><${Pill}>${P.pill}<//></div></div>
      <div class="o-sheet o-col" style="flex:1 0 auto;padding-bottom:22px">
        <div class="o-rowf" style="gap:12px"><span class="o-ibox" style=${{ width: 48, height: 48, borderWidth: 2.5, borderRadius: 15, background: P.color, fontSize: 22 }}>${P.ico ? Ico(P.ico, 24) : course.badge}</span>
          <div class="o-grow o-col" style="gap:1px"><h2 style="font-size:20px;line-height:24px;font-weight:800">${P.name}</h2><span class="o-s">${pathMeta(course)}</span></div></div>
        <${PathRoute} c=${course} first=${first}/></div></div></div>
    <div class="o-foot" style="border-top:2px solid ${SEP}">${err && html`<p class="o-s" style="color:#B3261E;font-weight:700;margin-bottom:8px;text-align:center" role="alert">${err}</p>`}
      <${Btn} cls="lg" disabled=${busy} onClick=${create}>${busy ? 'One moment…' : known.length && first ? 'Start from ' + first.title : 'Start the first lesson'}<//>
      <p class="o-s" style="text-align:center;margin-top:10px">You can change your goal anytime in Settings.</p></div></div>`;
  return html`<div class="o-app">${body}</div>`;
}

// =====================================================================================================
// GUSCIO DELL'APP: schede in basso, pila delle schermate, calcolatrice e chat sopra tutto
// =====================================================================================================
const SCREENS = {
  percorso: p => html`<${PercorsoScreen} ...${p}/>`,
  lezione: p => html`<${LessonScreen} nav=${p.nav} lessonKey=${p.key} at=${p.at} ask=${p.ask}/>`,
  testInizio: p => html`<${TestIntro} ...${p}/>`,
  testRun: p => html`<${TestRun} ...${p}/>`,
  testFine: p => html`<${TestDone} ...${p}/>`,
  testRev: p => html`<${TestReview} ...${p}/>`,
  pratica: p => html`<${PracticeRun} ...${p}/>`,
  deboli: p => html`<${WeakScreen} ...${p}/>`,
  sfida: p => html`<${DuelRun} ...${p}/>`,
  sfidaFine: p => html`<${DuelDone} ...${p}/>`,
  live: p => html`<${LiveScreen} ...${p}/>`,
  album: p => html`<${AlbumScreen} ...${p}/>`,
  articolo: p => html`<${ArticleScreen} ...${p}/>`,
  notizie: p => html`<${NewsArchiveScreen} ...${p}/>`,
  impostazioni: p => html`<${SettingsScreen} ...${p}/>`,
  pro: p => html`<${ProScreen} ...${p}/>`,
  catalogo: p => html`<${CatalogScreen} ...${p}/>`,
  livello: p => html`<${LevelScreen} ...${p}/>`,
  scheda: p => html`<${CourseSheetScreen} ...${p}/>`,
  schedaMateria: p => html`<${MateriaScreen} ...${p}/>`
};
// ---- trasloco ----
// L'app è nata su GitHub (…github.io/app) e adesso esce da Cloudflare, dallo stesso indirizzo dell'arbitro. I progressi stanno nel telefono, legati all'indirizzo:
// chi apre ancora quello vecchio viene avvisato e accompagnato (scarica i dati lì, li ricarica nel nuovo). L'avviso compare solo se il nuovo indirizzo risponde davvero.
const NUOVA_CASA = 'https://' + SFIDE_HOST + '/';
const VECCHIA_CASA = /\.github\.io$/.test(location.hostname);
function useTrasloco() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!VECCHIA_CASA) return; try { if (sessionStorage.getItem('fl_trasloco')) return; } catch (e) { /* niente */ }
    const im = new Image(); im.onload = () => setOn(true); im.src = NUOVA_CASA + 'icon-192.png?t=' + Date.now();   // un'icona dell'app che si carica: il nuovo indirizzo c'è
    return () => { im.onload = null; };
  }, []);
  return [on, () => { try { sessionStorage.setItem('fl_trasloco', '1'); } catch (e) { /* niente */ } setOn(false); }];
}
let NAV_ID = 0;
export function OrdineApp({ kit }) {
  const s = useS2();
  K = Object.assign({}, kit, { isPro: !!kit.isPro || !!s.pro });
  MIS_DRAFT = null;   // la bozza della registrazione non deve restare viva dentro l'app
  ordInjectCss();
  kit.useFlScreenLock();
  useOrdFit();
  const [tab, setTab] = useState('home'), [sub, setSub] = useState('allenati'), [stack, setStack] = useState([]);
  const [calc, setCalc] = useState(false), [ai, setAi] = useState(null), [toast, setToast] = useState(null);
  const [trasl, traslDopo] = useTrasloco();
  const tabRef = useRef(tab); tabRef.current = tab;
  const nav = useMemo(() => ({
    tab: id => { setStack([]); setTab(id); if (id === 'allenati') setSub('allenati'); },
    sub: id => setSub(id),
    go: (name, params) => setStack(st => [...st, { name, params: params || {}, id: ++NAV_ID }]),
    back: () => setStack(st => st.slice(0, -1)),
    replace: (name, params) => setStack(st => [...st.slice(0, -1), { name, params: params || {}, id: ++NAV_ID }]),
    openCalc: () => setCalc(true),
    toast: msg => { setToast(msg); setTimeout(() => setToast(t => (t === msg ? null : t)), 3600); },
    askAI: (q, picked, preset) => {
      const now = new Date().toISOString(), id = `quiz_${Date.now()}`, plain = K.flPlain(q.q), right = L3[q.ans];
      const cq = { picked, correct: right, q: plain, opts: q.options.map(K.flPlain), topic: `${q.lesson.unit.name} · ${q.lesson.title}${picked ? ` (the student has already answered ${picked}; the correct answer is ${right}: you can explain it openly)` : ''}` };
      const first = picked ? `Question: "${plain}"\n\nYou answered ${picked}; the right answer is ${right}. What would you like to understand? I can explain why, redo the math, or give you a trick to remember it.` : `You're working on:\n\n"${plain}"\n\nHow can I help?`;
      K.setChats(prev => [{ id, title: `Quiz: ${plain.slice(0, 35)}...`, createdAt: now, updatedAt: now, isQuizChat: true, quizQuestion: plain, messages: [{ role: 'assistant', content: first, timestamp: now }] }, ...prev].slice(0, 50));
      setAi({ id, q: cq, preset: preset || null, back: { tab: tabRef.current, chat: id } });
    },
    // chat su una pagina (o una domanda) di lezione: una sola per pagina, se c'è già si riapre
    askAbout: ({ id, title, ctx, first, back }) => {
      const now = new Date().toISOString();
      if (!(K.chats || []).some(c => c.id === id)) K.setChats(prev => [{ id, title, createdAt: now, updatedAt: now, isLessonChat: true, messages: [{ role: 'assistant', content: first, timestamp: now }] }, ...prev].slice(0, 50));
      setAi({ id, q: ctx, preset: null, back: back || null });
    }
  }), []);
  // ritorno da OpenRouter (la pagina si è ricaricata): si riapre il punto da cui era partito il collegamento
  useEffect(() => {
    const go = () => {
      const b = K.flOR && K.flOR.takeBack(); if (!b) return;
      if (b.lesson && lessonByKey(b.lesson)) { setStack([]); setTab('home'); nav.go('lezione', { key: b.lesson, at: b.at || 0, ask: true }); }
      else if (b.screen === 'impostazioni') { setStack([]); setTab('profilo'); nav.go('impostazioni', { sheet: 'or' }); }
      else if (b.tab) { nav.tab(b.tab); if (b.tab === 'coach' && b.chat && (K.chats || []).some(c => c.id === b.chat)) K.setActiveChatId(b.chat); }
    };
    go(); window.addEventListener('fl-or', go); return () => window.removeEventListener('fl-or', go);
  }, []);
  // link di una sfida dal vivo (…#sfida=CODICE): si apre direttamente la stanza
  useEffect(() => { const c = liveInvito(); if (c) { setStack([]); setTab('sfide'); nav.go('live', { codice: c }); } }, []);
  // primo ingresso: nome per chi usava già l'app, test di livello per chi ha detto "so già qualcosa"
  useEffect(() => {
    const st = s2get(), u = kit.user || {};
    if (!st.name && (!u.displayName || u.displayName === 'Google User') && !u.guest && ((kit.losProgress || []).length || Object.keys(kit.albumLoad()).length)) s2set({ name: 'Stefano' });
    // su misura: chi usava già l'app riceve il percorso ricavato da quello che aveva scelto o iniziato (non perde niente)
    if (!st.mis || !MIS_PATHS[st.mis.goal]) s2set({ mis: misDerive(st) });
    // appena registrato: "Inizia la prima lezione" porta dritto alla lezione
    else if (st.mis.go) { const k = st.mis.go; s2set(x => ({ mis: Object.assign({}, x.mis, { go: null }) })); if (lessonByKey(k)) nav.go('lezione', { key: k }); }
  }, []);
  const top = stack.length - 1;
  const tabScreen = tab === 'home' ? html`<${HomeScreen} nav=${nav}/>` : tab === 'allenati' ? (sub === 'test' ? html`<${TestScreen} nav=${nav}/>` : html`<${AllenatiScreen} nav=${nav}/>`)
    : tab === 'sfide' ? html`<${SfideScreen} nav=${nav}/>` : tab === 'coach' ? html`<${CoachScreen} nav=${nav}/>` : html`<${ProfiloScreen} nav=${nav}/>`;
  const layer = (on, child, key, anim) => html`<div key=${key} class=${anim ? 'o-in' : ''} style=${{ position: 'absolute', inset: 0, visibility: on ? 'visible' : 'hidden', pointerEvents: on ? 'auto' : 'none' }} aria-hidden=${on ? undefined : 'true'}>${child}</div>`;
  const Calc = kit.TICalculator, Chat = kit.AiChatModal;
  return html`<${React.Fragment}><div class="o-app">
    ${layer(top < 0, tabScreen, 'tab:' + tab + ':' + sub, false)}
    ${stack.map((e, k) => layer(k === top, SCREENS[e.name] ? SCREENS[e.name](Object.assign({ nav }, e.params)) : null, 'st' + e.id, true))}
    <${TermHost}/>
    ${trasl && html`<${BSheet} onClose=${traslDopo} label="FinLearn has a new address"><h2 class="o-big">FinLearn has a new address</h2>
      <p class="o-body o-mut" style="margin-top:6px">This address will be switched off soon. Two steps and your progress comes with you.</p>
      <ol class="o-body" style="margin:12px 0 0;padding-left:22px;display:flex;flex-direction:column;gap:6px;font-weight:600"><li>Download your data with the button below.</li><li>Open the new address and tap ‘I have a backup’.</li></ol>
      <div class="o-col" style="gap:10px;margin-top:16px"><${Btn} cls="lg" onClick=${downloadData}>Download my data<//>
        <a class="o-btn lg flat" style="background:#fff;text-decoration:none" href=${NUOVA_CASA} target="_blank" rel="noopener">Open the new address</a>
        <button type="button" class="o-link" style="align-self:center" onClick=${traslDopo}>Later</button></div><//>`}
    ${toast && html`<div class="o-toast o-fade" role="status">${toast}</div>`}
  </div>
  ${calc && Calc && html`<${Calc} onClose=${() => setCalc(false)}/>`}
  ${ai && Chat && html`<${Chat} key=${ai.id} variant="quiz" chatId=${ai.id} chats=${K.chats} setChats=${K.setChats} currentQuestion=${ai.q} initialMessage=${ai.preset} orBack=${ai.back} onClose=${() => setAi(null)}/>`}<//>`;
}
