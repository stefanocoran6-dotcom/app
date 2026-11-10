// FinLearn · grafica "In ordine" (FinLearn 2.0)
// Modulo separato dall'app storica: app.js gli passa dati e funzioni con `kit` e lo mostra al posto della vecchia grafica.
// Nessun passaggio di compilazione: i modelli sono scritti con html`...` (libreria htm, inclusa qui sotto).
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronDown, Check, Calculator, Clock, Timer, Lock, Play, Flag, Crown, SlidersHorizontal, Target, Link2, EyeOff, Wallet, Sprout, Briefcase,
  GraduationCap, Compass, LayoutGrid, FileText, ArrowUp, Plus, TrendingUp, PieChart, Star, Zap, RotateCcw, Table2, Percent, BarChart3, Scale, Coins, Bell, Languages, Download,
  Trash2, LogOut, Info, Shuffle, User, Palette, History, Lightbulb, Share2 } from 'lucide-react';

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
.o-tab{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border-radius:18px;font-size:11px;line-height:14px;font-weight:700;color:#fff;text-align:center}
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
.o-ovl{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;justify-content:flex-end;background:rgba(26,26,26,.45)}
.o-bs{position:relative;max-height:92%;display:flex;flex-direction:column;border:2.5px solid ${INK};border-bottom:0;border-radius:28px 28px 0 0;margin:0 -3px;padding:18px 23px max(20px,calc(env(safe-area-inset-bottom) + 6px));background:#fff}
.o-toast{position:absolute;left:20px;right:20px;bottom:calc(96px + env(safe-area-inset-bottom));z-index:30;padding:12px 16px;background:${INK};color:#fff;border-radius:16px;font-size:15px;line-height:20px;font-weight:700;text-align:center}
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
.o-chip2{display:block;padding:5px 9px;background:${T_GR};border-radius:10px;font-size:13px;line-height:17px;font-weight:700;text-align:left}
.o-goal{display:flex;align-items:center;gap:12px;padding:12px 14px;background:${T_GIALLO};border:2.5px solid ${INK};border-radius:18px}
.o-goal.ok{background:${MENTA}}
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
@media (prefers-reduced-motion: reduce){.o-in,.o-up,.o-fade,.o-pop,.o-shake{animation:none}}
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
const S2_DEF = { v: 1, name: '', onboard: null, started: [], cur: null, basi: [], expl: { d: '', n: 0 }, tests: {}, ans: {}, duel: { w: 0, l: 0, last: null }, xp: {}, gold: {}, seen: {},
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
const fmtInt = n => Math.round(n).toLocaleString('it-IT');
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

// Lezioni di "Basi della finanza" (generate da dev/ordine/basi_src.py)
const BASI_UNITS = [{"id":"basi-u1","sid":"basi-s1","name":"I soldi nel tempo","lessons":[{"key":"basi-1-1","sym":"€","title":"A cosa servono i soldi","minutes":4,"pages":[{"t":"Tre lavori in uno","x":"I soldi fanno tre lavori.\n\n• **Mezzo di scambio**: li dai in cambio di quello che ti serve, senza dover barattare.\n• **Unità di conto**: sono il metro con cui confronti i prezzi. Un caffè costa 1,30 €, un libro 18 €.\n• **Riserva di valore**: li metti da parte oggi per spenderli domani."},{"t":"Il terzo lavoro è il più fragile","x":"Come riserva di valore i soldi non sono perfetti: se i prezzi salgono, con la stessa cifra compri meno cose.\n\nÈ il motivo per cui esistono **interessi** e **investimenti**: servono a far sì che i soldi messi da parte non perdano terreno."}],"note":"I soldi servono per pagare, per misurare i prezzi e per conservare valore. Il terzo lavoro è quello che l'inflazione mette alla prova.","ex":[{"type":"mcq","q":"Metti 500 € in un cassetto per comprare una bici tra un anno. Quale lavoro stai chiedendo ai soldi?","options":["Mezzo di scambio","Unità di conto","Riserva di valore"],"ans":2,"exp":"Li stai conservando per spenderli più avanti: è la funzione di **riserva di valore**. Diventeranno mezzo di scambio solo il giorno in cui paghi la bici."}]},{"key":"basi-1-2","sym":"%","title":"Interesse semplice","minutes":4,"pages":[{"t":"Il prezzo del tempo","x":"Se presti dei soldi, chi li riceve ti paga un compenso: l'**interesse**. Si misura con un **tasso**, cioè una percentuale all'anno.\n\nCon l'**interesse semplice** il tasso si applica sempre e solo alla cifra di partenza, il **capitale**."},{"t":"Un esempio","x":"Presti 1.000 € al 5% l'anno per 3 anni.\n\n• Ogni anno maturi 1.000 × 5% = **50 €**.\n• In 3 anni: 50 × 3 = **150 €** di interessi.\n• Alla fine hai 1.000 + 150 = **1.150 €**.\n\n$$I = C \\times i \\times t$$\n\nDove \\(C\\) è il capitale, \\(i\\) il tasso annuo e \\(t\\) gli anni."}],"note":"Interesse semplice: capitale × tasso × anni. Gli interessi sono uguali ogni anno.","ex":[{"type":"mcq","q":"Presti 2.000 € al 3% l'anno, a interesse semplice, per 4 anni. Quanti interessi maturi in tutto?","options":["60 €","240 €","251 €"],"ans":1,"exp":"Ogni anno: 2.000 × 3% = 60 €. In 4 anni: 60 × 4 = **240 €**. La risposta 60 € è un solo anno; 251 € è l'interesse composto, che vediamo nella prossima lezione."}]},{"key":"basi-1-3","sym":"%%","title":"L'interesse composto","minutes":5,"pages":[{"t":"L'interesse composto","x":"Ogni anno gli interessi si sommano al capitale. L'anno dopo fruttano anche loro.","widget":"compound"},{"t":"La formula","x":"Dopo \\(t\\) anni al tasso \\(i\\) il capitale \\(C\\) diventa:\n\n$$M = C \\times (1 + i)^t$$\n\nCon 1.000 € al 5%:\n\n• dopo 1 anno: 1.000 × 1,05 = **1.050 €**\n• dopo 2 anni: 1.050 × 1,05 = **1.102,50 €**\n• dopo 20 anni: 1.000 × 1,05²⁰ = **2.653 €**\n\nA interesse semplice dopo 20 anni avresti 2.000 €: i 653 € in più sono **interessi sugli interessi**."}],"note":"Conta più il tempo della cifra di partenza: gli interessi sugli interessi crescono piano all'inizio e in fretta dopo.","ex":[{"type":"mcq","q":"Metti 1.000 € al 5% l'anno. Quanto hai dopo 2 anni?","options":["1.100,00 €","1.102,50 €","1.050,00 €"],"ans":1,"exp":"Il primo anno arrivi a 1.050 €. Nel secondo anno il 5% si calcola su 1.050 €: sono 52,50 €, non 50. Totale **1.102,50 €**. Chi risponde 1.100 € ha contato il 5% due volte sui 1.000 € di partenza."},{"type":"mcq","q":"Metti 2.000 € al 4% l'anno con l'interesse composto. Quanto hai dopo 3 anni?","options":["2.240,00 €","2.163,20 €","2.249,73 €"],"ans":2,"exp":"| Anno | Conto | Fine anno |\n|---|---|---|\n| 1 | 2.000,00 × 1,04 | 2.080,00 |\n| 2 | 2.080,00 × 1,04 | 2.163,20 |\n| 3 | 2.163,20 × 1,04 | 2.249,73 |\n\nL'errore tipico è contare il 4% ogni anno sui 2.000 € di partenza: così arrivi a 2.240 €."}]},{"key":"basi-1-4","sym":"↑","title":"L'inflazione","minutes":4,"pages":[{"t":"I prezzi che salgono","x":"L'**inflazione** è l'aumento generale dei prezzi nel tempo. Se è al 3% l'anno, quello che oggi costa 100 € tra un anno costa in media 103 €.\n\nI tuoi soldi non cambiano numero, ma comprano meno cose: scende il **potere d'acquisto**."},{"t":"Un esempio","x":"Hai 1.000 € fermi sul conto, che rende lo 0%. L'inflazione è al 3%.\n\n• Tra un anno hai ancora 1.000 €.\n• Ma per comprare le stesse cose ne servono 1.030.\n• Il tuo potere d'acquisto è sceso di circa il **3%**.\n\nIn 10 anni, a questo ritmo, 1.000 € comprano quello che oggi compri con circa 744 €."}],"note":"Con l'inflazione i soldi fermi perdono potere d'acquisto, anche se la cifra sul conto non scende.","ex":[{"type":"mcq","q":"L'inflazione è al 3% l'anno e il tuo conto rende l'1%. Dopo un anno, che cosa è successo al tuo potere d'acquisto?","options":["È salito dell'1%","È rimasto uguale","È sceso di circa il 2%"],"ans":2,"exp":"Il conto è cresciuto dell'1%, ma i prezzi del 3%: in termini reali hai perso circa il **2%** (per la precisione 1,01 / 1,03 − 1 = −1,94%)."}]},{"key":"basi-1-5","sym":"r","title":"Tasso reale","minutes":4,"pages":[{"t":"Nominale e reale","x":"Il tasso che leggi sul contratto è il **tasso nominale**. Quello che conta per quanto puoi comprare è il **tasso reale**, cioè il nominale ripulito dall'inflazione.\n\nPer cifre piccole basta una sottrazione:\n\n$$\\text{reale} \\approx \\text{nominale} - \\text{inflazione}$$"},{"t":"Il conto esatto","x":"La formula precisa divide invece di sottrarre:\n\n$$1 + r = \\frac{1 + n}{1 + \\pi}$$\n\nDove \\(r\\) è il tasso reale, \\(n\\) il tasso nominale e \\(\\pi\\) l'inflazione.\n\nCon un nominale del 5% e un'inflazione del 2%:\n\n• approssimato: 5% − 2% = **3%**\n• esatto: 1,05 / 1,02 − 1 = **2,94%**\n\nPiù i tassi sono alti, più la differenza tra i due conti si allarga."}],"note":"Tasso reale ≈ tasso nominale − inflazione. Se il reale è negativo, stai perdendo potere d'acquisto.","ex":[{"type":"mcq","q":"Un titolo rende il 4% l'anno e l'inflazione è al 6%. Quanto vale all'incirca il tasso reale?","options":["−2%","+2%","+10%"],"ans":0,"exp":"Reale ≈ 4% − 6% = **−2%**. Il titolo ti paga, ma meno di quanto salgono i prezzi: in termini reali perdi."}]}]},{"id":"basi-u2","sid":"basi-strumenti","name":"Gli strumenti","lessons":[{"key":"basi-2-1","sym":"AZ","title":"Azioni","minutes":4,"pages":[{"t":"Un pezzo di azienda","x":"Un'**azione** è una quota di proprietà di un'azienda. Se l'azienda ha emesso 1.000 azioni e tu ne hai 10, sei proprietario dell'1%.\n\nChi ha azioni guadagna in due modi:\n\n• il **dividendo**, cioè la parte di utile che l'azienda distribuisce ai soci;\n• l'aumento del **prezzo**, se l'azione vale di più quando la rivendi."},{"t":"Niente è promesso","x":"Né il dividendo né il prezzo sono garantiti. Se l'azienda va male il dividendo può sparire e il prezzo scendere.\n\nIn cambio di questo rischio, sul lungo periodo le azioni hanno reso in media più delle obbligazioni."}],"note":"Azione = quota di proprietà. Rende con dividendi e crescita del prezzo, senza garanzie.","ex":[{"type":"mcq","q":"Un'azienda ha 2.000 azioni in circolazione e tu ne possiedi 50. Quale quota dell'azienda è tua?","options":["0,25%","2,5%","25%"],"ans":1,"exp":"50 / 2.000 = 0,025, cioè il **2,5%**."}]},{"key":"basi-2-2","sym":"OB","title":"Obbligazioni","minutes":5,"pages":[{"t":"Un prestito che puoi rivendere","x":"Un'**obbligazione** è un prestito che fai a un'azienda o a uno Stato. In cambio ricevi:\n\n• una **cedola**, cioè l'interesse pagato a scadenze fisse;\n• il **rimborso** del capitale alla scadenza.\n\nUn BTP a 10 anni con cedola 3% su 1.000 € ti paga 30 € l'anno e ti restituisce 1.000 € dopo 10 anni."},{"t":"Meno sorprese, non zero","x":"Rispetto a un'azione sai già quanto incasserai, se chi ha emesso il titolo paga. I rischi sono due:\n\n• che l'emittente **non paghi** (rischio di credito);\n• che i **tassi salgano**: le nuove obbligazioni rendono di più e la tua, se la vendi prima della scadenza, vale meno."}],"note":"Obbligazione = prestito. Cedole fisse e rimborso a scadenza; il prezzo scende quando i tassi salgono.","ex":[{"type":"match","pairs":[["Azione","Una quota di proprietà di un'azienda"],["Obbligazione","Un prestito a un'azienda o a uno Stato"],["Dividendo","La parte di utile pagata ai soci"],["Inflazione","I prezzi che salgono nel tempo"]]},{"type":"mcq","q":"I tassi d'interesse scendono. Che cosa succede di solito al prezzo delle obbligazioni già in circolazione?","options":["Scende","Resta uguale","Sale"],"ans":2,"exp":"Le obbligazioni già emesse pagano cedole più alte di quelle nuove, quindi valgono di più: il prezzo **sale**. Tassi e prezzi delle obbligazioni si muovono in direzioni opposte."}]},{"key":"basi-2-4","sym":"ETF","title":"Fondi ed ETF","minutes":5,"pages":[{"t":"Tanti titoli in un colpo solo","x":"Un **fondo comune** raccoglie i soldi di tanti risparmiatori e li investe in molti titoli insieme. Tu non compri le singole azioni o obbligazioni: compri **quote** del fondo.\n\nIl valore di una quota si calcola così:\n\n$$\\text{quota} = \\frac{\\text{patrimonio}}{\\text{numero di quote}}$$\n\nSe il fondo ha un patrimonio di 10 milioni di euro diviso in 1 milione di quote, ogni quota vale **10 €**. Con 500 € ne compri 50."},{"t":"Che cosa cambia con un ETF","x":"Un **ETF** è un fondo che si compra e si vende in borsa come un'azione e che di solito **replica un indice**, cioè un paniere di titoli scelto con una regola fissa (per esempio le 500 maggiori aziende americane).\n\n• Un fondo **attivo** ha un gestore che sceglie i titoli e costa di più, spesso tra l'1% e il 2% l'anno.\n• Un ETF che replica un indice non sceglie nulla e costa meno, spesso tra lo 0,1% e lo 0,3% l'anno.\n\nIn entrambi i casi hai molti titoli diversi con una sola operazione."}],"note":"Un fondo mette insieme i soldi di tanti e compra molti titoli. Un ETF è un fondo quotato in borsa che replica un indice e costa poco.","ex":[{"type":"mcq","q":"Un fondo ha un patrimonio di 50 milioni di euro diviso in 2 milioni di quote. Quanto vale una quota?","options":["2,50 €","25 €","100 €"],"ans":1,"exp":"50.000.000 / 2.000.000 = **25 €** per quota."},{"type":"mcq","q":"Che cosa fa un ETF che replica un indice?","options":["Sceglie ogni giorno i titoli migliori","Garantisce il capitale investito","Compra i titoli dell'indice, senza scegliere"],"ans":2,"exp":"Compra i titoli che compongono l'indice, nelle stesse proporzioni, **senza scegliere**. Per questo costa poco. Non garantisce il capitale: se l'indice scende, scende anche l'ETF."}]},{"key":"basi-2-5","sym":"CC","title":"Conti, depositi e liquidità","minutes":4,"pages":[{"t":"Dove stanno i soldi di tutti i giorni","x":"• Il **conto corrente** serve per incassare e pagare. Rende poco o niente.\n• Il **conto deposito** è fatto per lasciare ferma una somma: in cambio la banca ti paga un interesse. Spesso i soldi sono **vincolati**: se li ritiri prima della scadenza perdi gli interessi, in tutto o in parte, e in certi casi non puoi ritirarli affatto.\n\nEsempio: 5.000 € su un conto deposito al 3% per un anno rendono 5.000 × 3% = **150 €** prima delle tasse. In Italia l'imposta sugli interessi è del 26%: te ne restano **111 €**."},{"t":"La liquidità","x":"**Liquidità** vuol dire quanto in fretta trasformi qualcosa in denaro senza perderci. Il conto corrente è liquidissimo. Una casa no: per venderla servono mesi.\n\nPer gli imprevisti serve un **fondo di emergenza**: soldi liquidi pari a qualche mese di spese. Una regola diffusa è tenerne da 3 a 6 mesi.\n\nSe spendi 1.500 € al mese, il fondo di emergenza va da 4.500 € a 9.000 €. Solo quello che avanza ha senso investirlo."}],"note":"I soldi che possono servirti presto stanno su strumenti liquidi. Il resto può lavorare su tempi più lunghi.","ex":[{"type":"mcq","q":"Spendi 1.200 € al mese e vuoi un fondo di emergenza che copra 4 mesi. Quanto devi tenere da parte?","options":["4.800 €","1.200 €","14.400 €"],"ans":0,"exp":"1.200 × 4 = **4.800 €**. 14.400 € sarebbero un anno intero di spese."}]}]},{"id":"basi-u3","sid":"basi-rischio","name":"Rischio, tempo e costi","lessons":[{"key":"basi-2-3","sym":"R","title":"Rischio e rendimento","minutes":4,"pages":[{"t":"Vanno insieme","x":"Nessuno ti paga di più senza chiederti qualcosa in cambio. Un rendimento atteso più alto arriva sempre con più **rischio**, cioè con risultati che possono allontanarsi molto dalla media, in su e in giù.\n\nSe qualcuno promette rendimenti alti senza rischio, manca un pezzo del racconto."},{"t":"Non tutte le uova nello stesso paniere","x":"**Diversificare** vuol dire dividere i soldi tra tanti titoli diversi. Se uno va male, pesa poco sul totale.\n\nLa diversificazione non toglie tutto il rischio: quello legato all'intero mercato resta. Toglie il rischio di puntare tutto sull'azienda sbagliata."}],"note":"Più rendimento atteso, più rischio. Diversificare riduce il rischio delle singole aziende, non quello del mercato.","ex":[{"type":"mcq","q":"Hai tutti i risparmi in azioni di una sola azienda. Qual è il modo più diretto per ridurre il rischio?","options":["Comprare altre azioni della stessa azienda","Dividere i soldi tra molte aziende diverse","Controllare il prezzo ogni giorno"],"ans":1,"exp":"Dividere i soldi tra molte aziende, cioè **diversificare**, fa sì che il guaio di una sola pesi poco sul totale."}]},{"key":"basi-3-2","sym":"½","title":"Diversificare con i numeri","minutes":5,"pages":[{"t":"Due titoli, due scenari","x":"Prendi due aziende che reagiscono in modo opposto alla stessa notizia. L'azienda A guadagna quando il petrolio sale, l'azienda B quando scende.\n\n| Scenario | A | B | Metà e metà |\n|---|---|---|---|\n| Petrolio su | +20% | −5% | +7,5% |\n| Petrolio giù | −10% | +15% | +2,5% |\n\nCon tutti i soldi su A il risultato va da +20% a −10%. Con metà su A e metà su B va da +7,5% a +2,5%: stesso mondo, molte meno sorprese."},{"t":"Come si fa il conto","x":"Il rendimento di un portafoglio è la media dei rendimenti dei titoli, pesata per quanto hai messo su ciascuno:\n\n$$R_p = w_A \\times R_A + w_B \\times R_B$$\n\nDove \\(R_p\\) è il rendimento del portafoglio, \\(w_A\\) e \\(w_B\\) le quote messe sui due titoli, che sommate fanno 1, e \\(R_A\\) e \\(R_B\\) i loro rendimenti.\n\nPetrolio su: 0,5 × 20% + 0,5 × (−5%) = **+7,5%**.\n\nLa diversificazione funziona quando i titoli **non si muovono tutti insieme**. Dieci aziende dello stesso settore diversificano poco."}],"note":"Mettere insieme titoli che non si muovono allo stesso modo riduce le oscillazioni del portafoglio.","ex":[{"type":"mcq","q":"Hai il 60% in un titolo che rende +10% e il 40% in un titolo che rende −5%. Quanto rende il portafoglio?","options":["+2,5%","+5%","+4%"],"ans":2,"exp":"0,6 × 10% + 0,4 × (−5%) = 6% − 2% = **+4%**. Il +2,5% sarebbe la media semplice, giusta solo con metà e metà."}]},{"key":"basi-3-3","sym":"T","title":"L'orizzonte temporale","minutes":5,"pages":[{"t":"Quando ti servono i soldi","x":"L'**orizzonte temporale** è il tempo che passa prima che quei soldi ti servano. È la prima domanda da farsi, prima ancora di scegliere lo strumento.\n\n• Soldi che servono **entro uno o due anni**, come l'anticipo per una casa: strumenti liquidi e stabili.\n• Soldi che servono **tra dieci anni o più**, come la pensione: possono stare su strumenti che oscillano, perché c'è tempo per recuperare."},{"t":"Perché una perdita pesa più di quanto sembra","x":"Se un investimento scende del 30%, per tornare al punto di partenza non basta un +30%.\n\nParti da 100 €. Dopo un −30% hai 70 €. Per tornare a 100 € ti servono 30 € su 70, cioè un **+42,9%**.\n\n$$\\text{recupero} = \\frac{1}{1 - \\text{perdita}} - 1$$\n\nCon una perdita del 50% il recupero necessario è del **100%**: i soldi devono raddoppiare. Per questo chi ha poco tempo davanti non può permettersi grandi oscillazioni."}],"note":"Più tardi ti servono i soldi, più oscillazioni puoi sopportare. Una perdita chiede sempre un recupero più grande in percentuale.","ex":[{"type":"mcq","q":"Un investimento perde il 50%. Di quanto deve salire per tornare al valore di partenza?","options":["Del 50%","Del 100%","Del 75%"],"ans":1,"exp":"Da 100 € scendi a 50 €. Per tornare a 100 € i 50 € devono raddoppiare: **+100%**."},{"type":"mcq","q":"Ti servono 20.000 € tra otto mesi per l'anticipo di una casa. Dove ha più senso tenerli?","options":["Su uno strumento liquido e stabile","In azioni, per farli crescere","In un fondo che investe in un solo settore"],"ans":0,"exp":"Otto mesi sono un orizzonte breve: se le azioni scendono non hai il tempo di recuperare. Servono strumenti **liquidi e stabili**."}]},{"key":"basi-3-4","sym":"−%","title":"I costi","minutes":5,"pages":[{"t":"Piccole percentuali, grandi cifre","x":"Ogni strumento ha un costo: commissioni di gestione, di acquisto, di vendita. Sembrano numeri piccoli perché sono espressi in percentuale all'anno, ma si pagano **ogni anno** e sul **totale** investito, non solo sui guadagni.\n\nIl rendimento prima dei costi si chiama **lordo**, quello che ti resta **netto**:\n\n$$\\text{netto} \\approx \\text{lordo} - \\text{costi}$$\n\nUn fondo che rende il 5% prima dei costi e costa l'1,5% l'anno ti lascia circa il **3,5%**."},{"t":"Trent'anni dopo","x":"Investi 10.000 € per 30 anni in due strumenti che rendono entrambi il 6% l'anno prima dei costi. Il primo costa lo 0,2% l'anno, il secondo il 2%. Ipotesi: nessun altro versamento, costi tolti ogni anno.\n\n| Costo annuo | Netto | Dopo 30 anni |\n|---|---|---|\n| 0,2% | 5,8% | 54.271 € |\n| 2,0% | 4,0% | 32.434 € |\n\nLa differenza è di circa **21.800 €**, più del doppio della cifra investita. È l'interesse composto che lavora al contrario: i costi tolgono soldi che avrebbero continuato a fruttare."}],"note":"I costi si pagano ogni anno e si compongono come gli interessi. A parità di strumento, quello che costa meno ti lascia di più.","ex":[{"type":"mcq","q":"Un fondo rende il 7% l'anno prima dei costi e costa l'1,8% l'anno. Quanto ti resta all'incirca?","options":["5,2%","8,8%","7%"],"ans":0,"exp":"7% − 1,8% = **5,2%** circa. I costi si tolgono dal rendimento, non si aggiungono."}]}]},{"id":"basi-u4","sid":"basi-debiti","name":"Debiti e prestiti","lessons":[{"key":"basi-4-1","sym":"P","title":"Come funziona un prestito","minutes":6,"flow":[{"type":"guess","q":"Prendi in prestito 3.310 € al 10% l'anno e li restituisci in 3 rate annuali uguali. Quanti interessi paghi in tutto?","after":"Molti dicono 993 €, cioè il 10% di 3.310 € per tre anni. Ma ogni rata restituisce anche un pezzo del debito, quindi gli interessi si calcolano su una cifra che scende. In tutto sono **683 €**: adesso vediamo da dove escono.","min":0,"max":1500,"step":10,"truth":683,"near":70,"unit":"€"},{"type":"page","t":"Capitale, interessi, rata","x":"La somma che ricevi è il **capitale**. In cambio paghi gli **interessi**, e di solito restituisci tutto con una **rata** sempre uguale.\n\nOgni rata ha due pezzi:\n\n• la **quota interessi**, calcolata sul debito che ti resta;\n• la **quota capitale**, che riduce il debito."},{"type":"page","t":"Il primo anno","x":"Il prestito è di 3.310 € al 10% l'anno e la rata è di 1.331 €.\n\n• Interessi: 10% di 3.310 € = **331 €**\n• Quota capitale: 1.331 − 331 = **1.000 €**\n• Debito che resta: 3.310 − 1.000 = **2.310 €**\n\nDella prima rata, circa un quarto se ne va in interessi."},{"type":"num","q":"Secondo anno. Il debito è sceso a 2.310 € e il tasso è sempre il 10%.\n\n| Anno | Interessi | Capitale | Debito residuo |\n|---|---|---|---|\n| 1 | 331 | 1.000 | 2.310 |\n| 2 | **?** | | |\n\nQuanti interessi paghi nel secondo anno?","ans":231,"unit":"€","tol":0.5,"dec":0,"exp":"10% di 2.310 € = **231 €**. Il resto della rata, 1.331 − 231 = 1.100 €, riduce il debito a 1.210 €."},{"type":"num","q":"Terzo anno. Restano 1.210 € di debito al 10% e la rata è sempre di 1.331 €.\n\n| Anno | Interessi | Capitale | Debito residuo |\n|---|---|---|---|\n| 1 | 331 | 1.000 | 2.310 |\n| 2 | 231 | 1.100 | 1.210 |\n| 3 | 121 | **?** | |\n\nQuanto capitale restituisci con l'ultima rata?","ans":1210,"unit":"€","tol":0.5,"dec":0,"exp":"Interessi: 10% di 1.210 € = 121 €. Quota capitale: 1.331 − 121 = **1.210 €**, cioè tutto il debito che restava. Il prestito è chiuso."},{"type":"page","t":"La rata resta uguale, dentro cambia","x":"| Anno | Interessi | Capitale | Debito residuo |\n|---|---|---|---|\n| 1 | 331 | 1.000 | 2.310 |\n| 2 | 231 | 1.100 | 1.210 |\n| 3 | 121 | 1.210 | 0 |\n\nAnno dopo anno gli interessi scendono e la quota capitale sale. In tutto paghi 331 + 231 + 121 = **683 €** di interessi.\n\nLa rata che fa tornare i conti si calcola così:\n\n$$R = C \\times \\frac{i}{1 - (1 + i)^{-n}}$$\n\nDove \\(R\\) è la rata, \\(C\\) il capitale, \\(i\\) il tasso per periodo e \\(n\\) il numero di rate."},{"type":"bucket","t":"Con il passare degli anni, sale o scende?","buckets":["Scende","Resta uguale","Sale"],"items":[["La quota interessi",0,"Gli interessi si calcolano sul debito che resta, e il debito cala a ogni rata."],["La rata",1,"In questo tipo di prestito la rata è la stessa dalla prima all'ultima."],["La quota capitale",2,"La rata è fissa e gli interessi scendono: quello che avanza per ridurre il debito cresce."],["Il debito residuo",0,"Ogni rata ne restituisce un pezzo."]]},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"La rata resta uguale, ma dentro cambia: prima più interessi, poi quasi solo capitale.","ex":[{"type":"mcq","q":"Prendi in prestito 5.000 € all'8% l'anno. Quanti interessi maturano nel primo anno?","options":["400 €","40 €","800 €"],"ans":0,"exp":"5.000 × 8% = **400 €**. Negli anni dopo gli interessi scendono, perché il debito residuo si riduce."},{"type":"mcq","q":"In un prestito a rata costante, com'è fatta la prima rata rispetto all'ultima?","options":["Ha meno interessi e più capitale","È uguale anche dentro","Ha più interessi e meno capitale"],"ans":2,"exp":"All'inizio il debito è al massimo, quindi gli interessi pesano di più e resta meno spazio per il capitale. Nell'esempio della lezione la prima rata ha 331 € di interessi, l'ultima 121 €."}],"pages":[]},{"key":"basi-4-2","sym":"TAN","title":"TAN e TAEG","minutes":5,"flow":[{"type":"guess","q":"Due prestiti, stessa cifra e stessa durata. Il prestito A ha un tasso del 5%, il prestito B del 6%. Quale ti costa meno?","after":"Il tasso da solo non basta: mancano le **spese**. Un prestito al 5% con spese alte può costare più di uno al 6% senza spese. Per questo ogni prestito ha due numeri, il TAN e il TAEG.","options":["Il prestito A","Il prestito B","Non si può dire"],"ans":2},{"type":"page","t":"Due sigle, due domande","x":"• Il **TAN**, tasso annuo nominale, è il puro tasso di interesse: dice quanto costa il denaro.\n• Il **TAEG**, tasso annuo effettivo globale, aggiunge al TAN le spese obbligatorie: dice quanto costa **il prestito**.\n\nPer confrontare due offerte si guarda il TAEG, non il TAN."},{"type":"bucket","t":"Entra nel TAEG o resta fuori?","buckets":["Entra nel TAEG","Resta fuori"],"items":[["Interessi sul prestito",0,"Gli interessi sono il primo pezzo del TAEG: è il TAN."],["Spese di istruttoria",0,"Sono spese obbligatorie per avere il prestito: entrano."],["Spese di incasso della rata",0,"Le paghi a ogni rata e non puoi evitarle: entrano."],["Assicurazione obbligatoria",0,"Se senza polizza il prestito non te lo danno, il suo costo entra."],["Assicurazione facoltativa",1,"Se puoi avere il prestito anche senza, non è un costo obbligatorio: resta fuori."],["Interessi di mora (per chi paga in ritardo)",1,"Li paghi solo se sei in ritardo con le rate: non fanno parte del costo previsto."],["Spese del notaio",1,"Nel mutuo le paghi davvero, ma per regola restano fuori dal TAEG: vanno contate a parte."]],"after":"Nel TAEG entra quello che sei obbligato a pagare per avere il prestito. Restano fuori i costi facoltativi, quelli che nascono da un tuo ritardo e le spese del notaio."},{"type":"num","q":"Prestito di 10.000 € per un anno, restituito tutto alla fine.\n\n• Interessi (TAN 6%): 600 €\n• Spese obbligatorie: 150 €, pagate insieme al rimborso\n\nQuanto vale il TAEG, in percentuale?","ans":7.5,"unit":"%","tol":0.05,"dec":2,"exp":"Costo totale: 600 + 150 = 750 €.\n\n$$\\text{TAEG} = \\frac{750}{10.000} = 7{,}5\\%$$\n\nIl TAN dice 6%, ma il prestito costa il 7,5%. Se le spese si pagassero subito, il TAEG salirebbe ancora un po', perché di fatto riceveresti meno di 10.000 €."},{"type":"ex","i":0},{"type":"ex","i":1}],"note":"Il TAN è il prezzo del denaro, il TAEG è il prezzo del prestito tutto compreso. Si confronta il TAEG.","ex":[{"type":"match","pairs":[["TAN","Il puro tasso di interesse del prestito"],["TAEG","Il costo annuo del prestito, spese comprese"],["Rata","La somma che paghi a ogni scadenza"],["Capitale","La cifra che hai preso in prestito"]]},{"type":"mcq","q":"Prestito A: TAN 5%, TAEG 8,2%. Prestito B: TAN 6%, TAEG 6,9%. Stessa cifra, stessa durata. Quale costa meno?","options":["Il prestito A","Il prestito B","Costano uguale"],"ans":1,"exp":"Conta il TAEG, che comprende le spese: **B** costa il 6,9% contro l'8,2% di A, anche se ha il TAN più alto."}],"pages":[]},{"key":"basi-4-3","sym":"M","title":"Il mutuo: fisso o variabile","minutes":6,"flow":[{"type":"guess","q":"Mutuo di 150.000 € in 25 anni. Se il tasso sale dal 3% al 5%, di quanto aumenta la rata mensile?","after":"Al 3% la rata è di **711 €**, al 5% di **877 €**: circa **166 € in più ogni mese**, per 25 anni. Sulle durate lunghe anche due punti di tasso pesano molto.","min":0,"max":400,"step":5,"truth":166,"near":20,"unit":"€"},{"type":"page","t":"Un prestito lungo, garantito dalla casa","x":"Il **mutuo** è un prestito di lunga durata, di solito tra 15 e 30 anni, garantito dalla casa: se smetti di pagare, la banca può rivalersi sull'immobile.\n\nQuesta garanzia si chiama **ipoteca**."},{"type":"page","t":"Fisso o variabile","x":"Il tasso può essere:\n\n• **fisso**: resta uguale per tutta la durata, e con lui la rata;\n• **variabile**: segue un tasso di riferimento del mercato più una maggiorazione fissa, lo **spread**. Se i tassi salgono, sale anche la rata.\n\nCon il fisso sai già oggi quanto pagherai. Con il variabile parti spesso da una rata più bassa, ma ti prendi il rischio che salga."},{"type":"bucket","t":"Fisso o variabile?","buckets":["Tasso fisso","Tasso variabile"],"items":[["La rata resta uguale fino alla fine",0,"È il tasso fisso che blocca la rata per tutta la durata."],["Segue un tasso di mercato più lo spread",1,"È proprio la definizione di tasso variabile."],["Se i tassi salgono, la rata sale",1,"Con il fisso la rata non si muove: succede solo con il variabile."],["Sai già oggi quanto pagherai tra 20 anni",0,"Solo il fisso ti dà questa certezza."],["Se i tassi scendono, paghi meno",1,"Il variabile segue il mercato anche quando scende."]]},{"type":"lever","t":"Trova una rata che ci sta","x":"Mutuo di 150.000 €. Muovi tasso e durata e guarda che cosa succede alla rata e agli interessi totali.","model":"mutuo","params":{"C":150000},"sliders":[{"id":"tasso","label":"Tasso","min":2,"max":6,"step":0.25,"start":5,"unit":"%","dec":2},{"id":"anni","label":"Durata","min":10,"max":30,"step":5,"start":20,"unit":"anni"}],"goals":[{"label":"Porta la rata a 800 € o meno","cond":[["rata","<=",800]],"hint":"Allungare la durata non basta: prova anche ad abbassare il tasso."},{"label":"Ora tieni anche gli interessi totali sotto 80.000 €","cond":[["rata","<=",800],["interessi","<",80000]],"hint":"Più anni vuol dire più interessi: prova ad abbassare ancora il tasso o ad accorciare la durata."}],"after":"Allungare la durata abbassa la rata, ma fa salire gli interessi totali. Per tenere basse tutte e due serve un tasso più basso: per questo conviene confrontare più offerte prima di firmare."},{"type":"ex","i":0}],"note":"Fisso: rata certa. Variabile: rata che segue i tassi di mercato. La scelta dipende da quanto margine hai se la rata sale.","ex":[{"type":"mcq","q":"Hai un mutuo a tasso variabile e i tassi di mercato salgono. Che cosa succede alla tua rata?","options":["Sale","Scende","Resta uguale"],"ans":0,"exp":"Il tasso variabile segue il mercato: se i tassi salgono, **sale** anche la rata. Con un tasso fisso sarebbe rimasta uguale."}],"pages":[]},{"key":"basi-4-4","sym":"!","title":"Quando il debito lavora contro di te","minutes":6,"flow":[{"type":"guess","q":"Hai 2.000 € di debito su una carta di credito al 18% l'anno. Per 5 anni paghi solo gli interessi. Quanto hai pagato in tutto alla fine?","after":"Ogni anno gli interessi sono 2.000 × 18% = 360 €. In 5 anni fanno **1.800 €**, e devi ancora tutti i 2.000 € di partenza.","min":0,"max":3000,"step":50,"truth":1800,"near":150,"unit":"€"},{"type":"page","t":"Il debito che non scende","x":"Su una carta di credito con rimborso a rate, detta **revolving**, il tasso è spesso molto alto e la rata minima è fatta quasi solo di interessi.\n\nSe paghi solo gli interessi, il debito resta fermo. Scende solo quando paghi di più."},{"type":"lever","t":"Chiudi il debito","x":"2.000 € di debito al 18% l'anno, cioè l'1,5% al mese. Decidi quanto pagare ogni mese.","model":"carta","params":{"debito":2000,"tasso":18},"sliders":[{"id":"rata","label":"Pagamento mensile","min":30,"max":200,"step":10,"start":30,"unit":"€"}],"goals":[{"label":"Chiudi il debito entro 2 anni","cond":[["mesi","<=",24]],"hint":"Con 30 € paghi solo gli interessi. Sali finché il tempo scende a 2 anni."}],"after":"Con 30 € al mese non finisci mai. Con 100 € chiudi in 2 anni e paghi circa 396 € di interessi. Più paghi ogni mese, meno ti costa il debito."},{"type":"page","t":"Quale debito chiudere per primo","x":"Rimborsare un debito equivale a un investimento sicuro che rende quanto il tasso del debito.\n\nHai 1.000 € liberi. Puoi metterli su un conto deposito al 3% o usarli per ridurre la carta al 18%.\n\n• Conto deposito: guadagni 30 € in un anno.\n• Carta: risparmi 180 € di interessi in un anno."},{"type":"order","t":"Hai dei soldi liberi: in che ordine li usi?","items":["Fondo di emergenza","Debiti con il tasso più alto","Investimenti"],"after":"È una regola pratica: prima la sicurezza, poi i debiti cari, poi il resto."},{"type":"num","q":"Hai un debito sulla carta al 18% l'anno e lo riduci di 500 €. Quanti interessi risparmi in un anno?","ans":90,"unit":"€","tol":0.5,"dec":0,"exp":"500 × 18% = **90 €** l'anno. Su un conto deposito al 3% gli stessi 500 € ne renderebbero 15."},{"type":"ex","i":0}],"note":"Un debito al 18% costa più di quanto rende quasi ogni investimento. Chiuderlo è il rendimento più sicuro che hai.","ex":[{"type":"mcq","q":"Hai 1.000 € liberi, un debito sulla carta al 18% e un conto deposito che rende il 3%. Che cosa conviene fare?","options":["Metterli sul conto deposito","È indifferente","Ridurre il debito sulla carta"],"ans":2,"exp":"Ridurre il debito ti fa risparmiare 180 € di interessi in un anno, contro i 30 € che guadagneresti sul conto deposito."}],"pages":[]}]},{"id":"basi-u5","sid":"basi-azienda","name":"Leggere un'azienda","lessons":[{"key":"basi-5-1","sym":"SP","title":"Lo stato patrimoniale","minutes":4,"pages":[{"t":"Una fotografia","x":"Lo **stato patrimoniale** fotografa un'azienda in un giorno preciso. Ha due lati che pesano sempre uguale.\n\n• Le **attività**: quello che l'azienda possiede, come cassa, magazzino e impianti.\n• Le **passività**: quello che deve ad altri, come i debiti con banche e fornitori.\n• Il **patrimonio netto**: quello che resta ai soci una volta pagati tutti i debiti.\n\n**Attività = Passività + Patrimonio netto**"},{"t":"Un esempio","x":"Un'azienda possiede:\n\n• cassa 50\n• magazzino 150\n• impianti 300\n\nTotale attività: **500**.\n\nDeve 320 a banche e fornitori. Il patrimonio netto è quello che avanza:\n\n500 − 320 = **180**\n\nSe l'azienda guadagna e non distribuisce gli utili, il patrimonio netto sale. Se perde, scende."}],"note":"Attività = passività + patrimonio netto. È un'uguaglianza che vale sempre, per ogni azienda.","ex":[{"type":"mcq","q":"Un'azienda ha attività per 800 e passività per 500. Quanto vale il patrimonio netto?","options":["1.300","500","300"],"ans":2,"exp":"800 − 500 = **300**. Sommare le due cifre è l'errore tipico: il patrimonio netto è quello che avanza dopo i debiti."},{"type":"mcq","q":"Un'azienda chiude l'anno in perdita e i soci non versano altri soldi. Che cosa succede al patrimonio netto?","options":["Scende","Sale","Resta uguale"],"ans":0,"exp":"La perdita riduce quello che resta ai soci: il patrimonio netto **scende**. Sale quando l'azienda guadagna e tiene gli utili in azienda."}]},{"key":"basi-5-2","sym":"CE","title":"Il conto economico","minutes":5,"pages":[{"t":"Un film, non una fotografia","x":"Il **conto economico** racconta un periodo, di solito un anno: quanto l'azienda ha incassato dalle vendite, i **ricavi**, e quanto ha speso, i **costi**. Quello che resta è l'**utile**.\n\nSi scende a gradini:\n\n• ricavi meno costo dei prodotti venduti = **margine lordo**\n• meno costi di struttura, come stipendi e affitti = **risultato operativo**\n• meno interessi e imposte = **utile netto**"},{"t":"Un esempio","x":"| Voce | Importo |\n|---|---|\n| Ricavi | 1.000 |\n| Costo dei prodotti venduti | −600 |\n| **Margine lordo** | 400 |\n| Costi di struttura | −250 |\n| **Risultato operativo** | 150 |\n| Interessi | −30 |\n| Imposte (30% di 120) | −36 |\n| **Utile netto** | 84 |\n\nIl **margine netto** è l'utile diviso i ricavi: 84 / 1.000 = **8,4%**. Dice quanti centesimi restano all'azienda per ogni euro venduto."}],"note":"Ricavi meno costi uguale utile. I margini, in percentuale sui ricavi, permettono di confrontare aziende di dimensioni diverse.","ex":[{"type":"match","pairs":[["Attività","Quello che l'azienda possiede"],["Passività","Quello che l'azienda deve ad altri"],["Patrimonio netto","Quello che resta ai soci"],["Utile","Ricavi meno costi"]]},{"type":"mcq","q":"Un'azienda ha ricavi per 2.000 e costi totali per 1.700. Quanto vale il margine netto?","options":["85%","15%","30%"],"ans":1,"exp":"Utile = 2.000 − 1.700 = 300. Margine netto = 300 / 2.000 = **15%**."}]},{"key":"basi-5-3","sym":"≠","title":"Utile non è cassa","minutes":5,"pages":[{"t":"Due orologi diversi","x":"Il conto economico registra ricavi e costi quando **nascono**, non quando i soldi si muovono. Questa regola si chiama **competenza**.\n\n• Vendi merce per 100 con pagamento a 90 giorni: il ricavo c'è subito, i soldi no.\n• Compri un macchinario da 1.000 che userai per 5 anni: paghi 1.000 subito, ma il conto economico ne conta 200 l'anno. Quella quota si chiama **ammortamento**.\n\nPer questo un'azienda può avere utile e restare senza soldi in cassa."},{"t":"Seguire i soldi","x":"Il **rendiconto finanziario** mostra i movimenti di cassa veri.\n\nUn'azienda chiude l'anno con un utile di 50. Ipotesi: tutti i costi sono stati pagati in contanti, ma i clienti devono ancora 80 di vendite già contate nei ricavi.\n\n• Utile: +50\n• Vendite non ancora incassate: −80\n• Variazione di cassa: **−30**\n\nL'azienda ha guadagnato, eppure ha 30 in meno in cassa. Chi valuta un'azienda guarda sempre tutti e due i numeri."}],"note":"L'utile misura quanto hai guadagnato, la cassa quanti soldi hai davvero. Possono andare in direzioni opposte.","ex":[{"type":"mcq","q":"Un'azienda ha un utile di 120. Tutti i costi sono pagati, ma i clienti devono ancora 200 di vendite già contate. Com'è variata la cassa?","options":["−80","+120","+320"],"ans":0,"exp":"120 − 200 = **−80**. L'utile c'è, ma i soldi non sono ancora entrati."}]},{"key":"basi-5-4","sym":"P/E","title":"Prezzo e valore","minutes":5,"pages":[{"t":"Quanto paghi per un euro di utile","x":"Il prezzo di un'azione da solo non dice se è cara. Un'azione da 30 € può essere più cara di una da 300 €.\n\nUn primo metro è il rapporto **prezzo/utili**, in inglese **P/E**:\n\n$$\\text{P/E} = \\frac{\\text{prezzo dell'azione}}{\\text{utile per azione}}$$\n\nSe l'azione costa 30 € e l'utile per azione è 2 €, il P/E è **15**: paghi 15 € per ogni euro di utile annuo."},{"t":"Come si legge","x":"Un P/E alto di solito vuol dire che il mercato si aspetta utili in forte crescita. Un P/E basso può voler dire un'occasione, oppure un'azienda in difficoltà.\n\n• Azienda A: prezzo 30 €, utile per azione 2 €, P/E 15.\n• Azienda B: prezzo 60 €, utile per azione 2 €, P/E 30.\n\nB costa il doppio per lo stesso utile di oggi. Ha senso solo se i suoi utili cresceranno molto più in fretta. Il P/E da solo non dà il verdetto: serve a fare la domanda giusta."}],"note":"Il P/E dice quanti euro paghi per un euro di utile. Si usa per confrontare aziende simili, non come giudizio finale.","ex":[{"type":"mcq","q":"Un'azione costa 48 € e l'utile per azione è 4 €. Quanto vale il P/E?","options":["12","44","192"],"ans":0,"exp":"48 / 4 = **12**: paghi 12 € per ogni euro di utile annuo."},{"type":"mcq","q":"Due aziende dello stesso settore: A ha un P/E di 10, B di 25. Che cosa dice il confronto?","options":["B guadagna più di A","A è di sicuro un affare","Per ogni euro di utile, B costa di più"],"ans":2,"exp":"Il P/E dice quanto paghi per un euro di utile: 25 € con B, 10 € con A. Non dice chi guadagna di più, e un P/E basso non è per forza un affare: può segnalare un'azienda in difficoltà."}]}]},{"id":"basi-u6","sid":"basi-economia","name":"L'economia intorno","lessons":[{"key":"basi-6-1","sym":"BC","title":"Banche centrali e tassi","minutes":4,"pages":[{"t":"Chi decide il prezzo del denaro","x":"Una **banca centrale**, come la BCE per l'euro o la Federal Reserve per il dollaro, decide i **tassi di riferimento**: quanto pagano le banche per farsi prestare denaro dalla banca centrale e quanto ricevono se lo depositano lì. Da quei tassi dipendono, a cascata, i tassi di mutui, prestiti e conti deposito.\n\nIl compito principale della BCE è tenere stabili i prezzi: il suo obiettivo è un'inflazione del 2% l'anno nel medio periodo."},{"t":"Tassi su, tassi giù","x":"• **Inflazione troppo alta**: la banca centrale **alza** i tassi. Prendere soldi in prestito costa di più, famiglie e aziende spendono meno, i prezzi rallentano.\n• **Economia debole**: **abbassa** i tassi. Il credito costa meno, consumi e investimenti ripartono.\n\nPer chi investe conta molto: quando i tassi salgono, le obbligazioni già in circolazione perdono valore e le rate dei mutui variabili aumentano. Quando scendono, succede il contrario."}],"note":"La banca centrale alza i tassi per frenare l'inflazione e li abbassa per sostenere l'economia. I mutui a tasso variabile e le obbligazioni sono i primi a risentirne.","ex":[{"type":"mcq","q":"L'inflazione è molto sopra l'obiettivo. Che cosa fa di solito la banca centrale?","options":["Abbassa i tassi","Alza i tassi","Lascia tutto fermo"],"ans":1,"exp":"Alza i tassi: il credito costa di più, la spesa rallenta e i prezzi smettono di correre."},{"type":"mcq","q":"La banca centrale abbassa i tassi. Che effetto ha di solito sui nuovi mutui?","options":["Costano meno","Costano di più","Nessun effetto"],"ans":0,"exp":"Se il denaro costa meno alle banche, di solito scendono anche i tassi che le banche chiedono ai clienti: i nuovi mutui **costano meno**."}]},{"key":"basi-6-2","sym":"FX","title":"I cambi","minutes":5,"pages":[{"t":"Il prezzo di una moneta","x":"Il **tasso di cambio** è il prezzo di una moneta espresso in un'altra. Se il cambio euro/dollaro è 1,10, con 1 € compri 1,10 $.\n\n• Se il cambio sale a 1,20 l'euro si è **rafforzato**: con 1 € compri più dollari.\n• Se scende a 1,00 l'euro si è **indebolito**."},{"t":"Il cambio dentro gli investimenti","x":"Chi compra titoli in un'altra moneta ha due rendimenti: quello del titolo e quello del cambio.\n\nCompri azioni americane per 1.100 $ quando il cambio è 1,10: spendi **1.000 €**. Ipotesi: dopo un anno le azioni valgono ancora 1.100 $, ma il cambio è salito a 1,20.\n\n$$\\frac{1.100}{1{,}20} = 916{,}67$$\n\nIn euro hai **916,67 €**: hai perso l'8,3% senza che il titolo si sia mosso. Questo è il **rischio di cambio**. Vale anche al contrario: se l'euro si indebolisce, guadagni."}],"note":"Con un titolo in valuta estera guadagni o perdi anche per il cambio. Euro più forte: i tuoi dollari valgono meno.","ex":[{"type":"mcq","q":"Hai 1.000 $. Il cambio euro/dollaro passa da 1,00 a 1,25. Quanto valgono adesso in euro?","options":["1.250 €","1.000 €","800 €"],"ans":2,"exp":"1.000 / 1,25 = **800 €**. L'euro si è rafforzato, quindi i tuoi dollari comprano meno euro."},{"type":"mcq","q":"Il cambio euro/dollaro passa da 1,10 a 1,00. Che cosa è successo all'euro?","options":["Si è rafforzato","Si è indebolito","Non è cambiato nulla"],"ans":1,"exp":"Prima con 1 € compravi 1,10 $, adesso solo 1,00 $: l'euro **si è indebolito**."}]},{"key":"basi-6-3","sym":"~","title":"Il ciclo economico","minutes":5,"pages":[{"t":"Il PIL e le sue stagioni","x":"Il **PIL**, prodotto interno lordo, è il valore di tutti i beni e i servizi prodotti in un Paese in un anno. È il termometro dell'economia.\n\nIl PIL non cresce in linea retta. Attraversa fasi che si ripetono:\n\n• **espansione**: il PIL cresce, le aziende assumono;\n• **picco**: l'economia è al massimo, spesso l'inflazione sale;\n• **recessione**: il PIL scende, la disoccupazione aumenta;\n• **ripresa**: si riparte dal punto più basso."},{"t":"Come si riconosce una recessione","x":"Una regola pratica molto usata: c'è **recessione** quando il PIL scende per due trimestri consecutivi.\n\nIl ciclo conta per chi investe:\n\n• in recessione gli utili delle aziende scendono e le azioni soffrono;\n• le banche centrali di solito abbassano i tassi, e questo aiuta le obbligazioni;\n• i mercati guardano avanti: spesso le azioni risalgono prima che la recessione sia finita.\n\nNessuno sa con certezza in che fase siamo finché non è passata. Per questo conviene un piano che regga in tutte le stagioni."}],"note":"L'economia alterna espansioni e recessioni. Due trimestri di PIL in calo sono la regola pratica per dire recessione.","ex":[{"type":"mcq","q":"Il PIL di un Paese scende per due trimestri di fila. Come si chiama questa fase?","options":["Espansione","Recessione","Inflazione"],"ans":1,"exp":"Due trimestri consecutivi di PIL in calo sono la regola pratica per dire **recessione**."},{"type":"mcq","q":"In una recessione, che cosa fanno di solito le banche centrali?","options":["Abbassano i tassi","Alzano i tassi","Chiudono le borse"],"ans":0,"exp":"Abbassano i tassi, per rendere il credito meno caro e far ripartire consumi e investimenti."}]}]}];

// =====================================================================================================
// DATI: percorsi, lezioni, figurine, punteggi
// =====================================================================================================
// "Basi della finanza": primo percorso non d'esame. Contenuti originali, brevi, con un esempio numerico per lezione.
// Le lezioni stanno in basi_src.py (che le controlla e scrive basi.json): build.sh le mette qui sopra come BASI_UNITS.
const BASI = {
  id: 'basi', name: 'Basi della finanza', badge: '€', color: AZ, group: 'basi', ready: true, pace: 48,
  tagline: 'Per chi parte da zero',
  learn: ['Come lavorano interessi, inflazione e tempo', 'Cosa sono azioni, obbligazioni, fondi ed ETF', 'Quanto pesano rischio, costi e debiti', 'Come si leggono un bilancio e le notizie di economia'],
  units: BASI_UNITS.map(u => ({ id: u.id, name: u.name, sections: [{ id: u.sid, name: u.name, lessons: u.lessons }] }))
};
// Percorsi non ancora pronti: compaiono nel catalogo come "in arrivo".
const COMING = [
  { id: 'risparmio', name: 'Risparmio e budget', group: 'basi', color: MENTA, icon: 'wallet' },
  { id: 'azob', name: 'Azioni e obbligazioni', group: 'invest', color: PESCA, icon: 'trend' },
  { id: 'fondi', name: 'Fondi ed ETF', group: 'invest', color: LILLA, icon: 'pie' },
  { id: 'cfa1', name: 'CFA Level I', group: 'cert' }, { id: 'frm1', name: 'FRM Part I', group: 'cert' }, { id: 'caia1', name: 'CAIA Level I', group: 'cert' }
];

let COURSES_MEMO = null;
const losMinutes = l => { const c = l.content || {}; const n = (c.introduction || '').length + (c.sections || []).reduce((s, x) => s + (x.content || '').length, 0); return clamp(Math.round(n / 900) + (l.question ? 2 : 1), 2, 20); };
function courses() {
  if (COURSES_MEMO) return COURSES_MEMO;
  const CFA = (K && K.CFA) || {};
  const units = ['equityValuation', 'portfolioManagement', 'equity'].filter(k => CFA[k]).map(k => {
    const t = CFA[k];
    return { id: k, name: t.name, sections: t.modules.map(m => ({
      id: m.id, name: m.title, num: m.number,
      lessons: m.los.map((l, i) => ({ key: `${m.id}-${l.id}`, kind: 'los', title: K.flShortTitle(l.title), code: (l.code || `LOS ${m.number}${l.id}`).replace(/^LOS\s*/, ''), los: l, minutes: losMinutes(l) }))
    })) };
  });
  const cfa2 = { id: 'cfa2', name: 'CFA Level II', badge: 'L2', color: AZ, group: 'cert', ready: true, pace: 90, tagline: 'Per chi prepara l\'esame',
    learn: ['Valutare un\'azione con dividendi, flussi di cassa, multipli e residual income', 'ETF, modelli multifattoriali, VaR e gestione attiva', 'Domande in inglese, come all\'esame'], units };
  COURSES_MEMO = [BASI, cfa2];
  // indici utili
  COURSES_MEMO.forEach(c => { c.lessons = []; c.units.forEach((u, ui) => u.sections.forEach(s => s.lessons.forEach(l => { l.course = c; l.unit = u; l.ui = ui; l.section = s; if (!l.kind) l.kind = 'base'; c.lessons.push(l); }))); });
  return COURSES_MEMO;
}
const courseById = id => courses().find(c => c.id === id);
let LESSON_MAP = null;
const lessonByKey = key => { if (!LESSON_MAP) { LESSON_MAP = {}; courses().forEach(c => c.lessons.forEach(l => { LESSON_MAP[l.key] = l; })); } return LESSON_MAP[key]; };
const isDone = key => (K.losProgress || []).includes(key) || s2get().basi.includes(key);
const doneCount = list => list.filter(l => isDone(l.key)).length;
const coursePct = c => c.lessons.length ? Math.round(doneCount(c.lessons) / c.lessons.length * 100) : 0;
const unitLessons = u => u.sections.flatMap(s => s.lessons);
const fmtDur = min => { if (min < 60) return `${min} minuti`; const h = Math.floor(min / 60), m = min % 60; return `${h} ${h === 1 ? 'ora' : 'ore'}${m ? ` e ${m} minuti` : ''}`; };
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
      if (s.type === 'page') steps.push({ k: 'page', title: s.t, text: s.x, widget: s.widget, first: !steps.length, note: i === lastPage ? l.note : null });
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
function startedCourses() { const s = s2get(); const out = new Set(s.started || []); if ((K.losProgress || []).length) out.add('cfa2'); if (s.basi.length) out.add('basi'); return courses().filter(c => out.has(c.id)); }
function currentCourse() {
  const s = s2get(); const st = startedCourses();
  if (s.cur && courseById(s.cur) && (st.some(c => c.id === s.cur))) return courseById(s.cur);
  return st[0] || null;
}
function nextLesson(c, unitId) {
  const s = s2get(); const album = K.albumLoad();
  let u = unitId ? c.units.find(x => x.id === unitId) : null;
  if (!u) {
    const lastKey = s.seen && s.seen[c.id]; const ll = lastKey && lessonByKey(lastKey);
    if (ll && ll.course === c) u = ll.unit;
    else { // unità della figurina presa più di recente
      let best = null; c.lessons.forEach(l => { const a = album[l.key]; if (a && (!best || a.t > best.t)) best = { t: a.t, u: l.unit }; }); u = best ? best.u : c.units[0];
    }
  }
  const order = [u, ...c.units.filter(x => x !== u)];
  for (const x of order) { const l = unitLessons(x).find(z => !isDone(z.key)); if (l) return l; }
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
function dueLessons() { const album = K.albumLoad(), now = Date.now(); return courses().flatMap(c => c.lessons).filter(l => stickerState(l, album, now) === 'sbiadisce').sort((x, y) => album[x.key].due - album[y.key].due); }
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

// ---- test ----
// kind: 'unit' (verifica di una sezione), 'level' (test di livello), 'mock' (simulazione), 'weak' (allenamento punti deboli), 'mix' (quiz misto)
function buildTest(kind, c, sec) {
  const sh = K.flShuffle;
  if (kind === 'unit') { const qs = sh(allQuestions(sec.lessons)).slice(0, 10); return { id: 'unit:' + sec.id, kind, course: c, section: sec, title: 'Verifica: ' + sec.name, qs, secs: qs.length * c.pace, pass: Math.ceil(qs.length * 0.7), timed: true }; }
  if (kind === 'level') { const qs = sh(allQuestions(c.lessons)).slice(0, 5); return { id: 'level:' + c.id, kind, course: c, title: 'Test di livello', qs, secs: qs.length * c.pace, pass: Math.ceil(qs.length * 0.6), timed: true }; }
  if (kind === 'mock') { const qs = sh(allQuestions(c.lessons)).slice(0, 44); return { id: 'mock:' + c.id, kind, course: c, title: 'Simulazione d\'esame', qs, secs: qs.length * 180, pass: Math.ceil(qs.length * 0.7), timed: true }; }
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
const RIVALS = ['Giulia', 'Luca', 'Marco', 'Sara', 'Paolo', 'Elena', 'Davide', 'Chiara', 'Matteo'];
const seedRnd = seed => { let x = 0; for (let i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) >>> 0; return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; };
function league() {
  const wk = weekKey(), start = new Date(wk + 'T00:00:00').getTime(), frac = clamp((Date.now() - start) / (7 * DAY), 0.02, 1);
  const mine = (s2get().xp || {})[wk] || 0;
  const rows = RIVALS.map((name, i) => { const r = seedRnd(wk + name); const target = 180 + Math.round(r() * 640); return { name, xp: Math.round(target * Math.pow(frac, 0.85) / 2) * 2 }; });
  rows.push({ name: 'Tu', xp: mine, me: true });
  rows.sort((a, b) => b.xp - a.xp || (a.me ? -1 : 1));
  rows.forEach((r, i) => { r.pos = i + 1; });
  return { rows, me: rows.find(r => r.me), name: 'Lega Azzurra' };
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
const TAB_NAMES = [['home', 'Impara'], ['allenati', 'Allenati'], ['sfide', 'Sfide'], ['coach', 'AI Coach'], ['profilo', 'Profilo']];

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
  if (n > 14) return html`<div class="o-bar o-grow" role="img" aria-label=${`Passo ${i + 1} di ${n}`} style="height:10px"><i style=${{ width: Math.round((i + 1) / n * 100) + '%', background: INK, borderRight: 0 }}></i></div>`;
  return html`<div class="o-seg" role="img" aria-label=${`Passo ${i + 1} di ${n}`} style=${{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
    ${Array.from({ length: n }, (_, k) => html`<i key=${k} class=${k < i ? 'd' : k === i ? 'c' : ''}></i>`)}</div>`;
}
// barra in alto delle schermate "a passi": chiudi/indietro + avanzamento (o titolo) + eventuale elemento a destra
function TopBar({ onClose, onBack, n, i, title, right, mid }) {
  return html`<div class="o-top o-pad" style="flex:none;background:inherit"><div class="o-rowf" style="height:44px;gap:14px">
    ${onBack ? html`<${IBtn} d=${D_BACK} onClick=${onBack} label="Indietro"/>` : onClose ? html`<${IBtn} d=${D_X} onClick=${onClose} label="Chiudi"/>` : null}
    ${mid || (n ? html`<${Seg} n=${n} i=${i}/>` : html`<span class="o-grow" style="font-size:15px;line-height:20px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${title}</span>`)}
    ${right || null}</div></div>`;
}
function TabBar({ tab, go }) {
  return html`<nav class="o-tabs" aria-label="Sezioni dell'app">${TAB_NAMES.map(([id, name]) => html`
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
function Rich({ text, cls = '', lang, bare, style }) {
  const RT = K && K.RichText;
  return html`<div class=${bare ? '' : 'o-rich ' + cls} lang=${lang} style=${style}>${RT ? html`<${RT} text=${text}/>` : String(text || '')}</div>`;
}
function Sw({ on, onChange, label }) {
  return html`<button type="button" role="switch" aria-checked=${on ? 'true' : 'false'} aria-label=${label} class=${'o-sw' + (on ? ' on' : '')} onClick=${() => onChange(!on)}><i></i></button>`;
}
// foglio dal basso sopra la schermata
function BSheet({ children, onClose, bg = '#fff', dim = true, label }) {
  return html`<div class="o-ovl o-fade" style=${dim ? null : { background: 'transparent', pointerEvents: 'none' }} onClick=${onClose} role="dialog" aria-label=${label}>
    <div class="o-bs o-up" style=${{ background: bg, pointerEvents: 'auto' }} onClick=${e => e.stopPropagation()}>${children}</div></div>`;
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
  <span class="o-rowf" style="gap:4px" aria-label=${`${streak} giorni di fila`}>${PathIco(D_FLAME, 18, 2.4, PESCA, INK)}${streak}</span>
  <span aria-hidden="true" style="width:2px;height:16px;background:${INK}"></span>
  <span class="o-rowf" style="gap:4px" aria-label=${`${xp} punti esperienza`}>${PathIco(D_STAR, 18, 2.4, GIALLO, INK)}${fmtInt(xp)}</span></div>`;
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
  return html`<${BSheet} onClose=${onClose} label="Data dell'esame">
    <h2 class="o-big">Quando hai l'esame?</h2>
    <p class="o-body o-mut" style="margin-top:6px">Rally conta i giorni che mancano e te li ricorda nella home.</p>
    <input class="o-inp" type="date" value=${v} onChange=${e => setV(e.target.value)} aria-label="Data dell'esame" style="margin-top:16px"/>
    <div style="margin-top:16px"><${Btn} cls="lg" onClick=${save}>Salva la data<//></div>
    ${cur && html`<div style="text-align:center;margin-top:4px"><button type="button" class="o-link" onClick=${() => { try { localStorage.removeItem('finlearn_exam_date'); } catch (e) {} onClose(); }}>Togli la data</button></div>`}
  <//>`;
}

function HomeScreen({ nav }) {
  useS2(); useTick();
  const [dateOpen, setDateOpen] = useState(false);
  const cur = currentCourse();
  if (!cur) return html`<${HomeEmpty} nav=${nav}/>`;
  const name = userName(), streak = streakDays(), xp = (K.stats && K.stats.xp) || 0;
  const next = nextLesson(cur), pct = coursePct(cur), ed = examDays();
  const isExam = cur.group === 'cert';
  const pill = isExam ? (ed != null && ed >= 0 ? (ed === 0 ? 'Esame oggi' : `Esame tra ${plural(ed, 'giorno', 'giorni')}`) : 'Metti la data dell\'esame') : (streak > 1 ? `${streak} giorni di fila` : 'Giorno ' + Math.max(1, streak));
  const others = startedCourses().filter(c => c !== cur);
  return html`<${Room} color=${AZ} tab="home" go=${nav.tab}
    rally=${html`<${Rally} pose="saluta" alt="Rally saluta" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div style="position:absolute;right:20px;top:0"><${StatPill} streak=${streak} xp=${xp}/></div>
      <div class="o-col" style="align-items:flex-start;gap:14px;padding-top:4px;max-width:210px">
        <h1 class="o-h1" style=${name.length > 9 ? { fontSize: 32, lineHeight: '34px' } : null}>Ciao${name ? html`,<br/>${name}` : '!'}</h1>
        ${isExam ? html`<button type="button" onClick=${() => setDateOpen(true)}><${Pill}>${pill}<//></button>` : html`<${Pill}>${pill}<//>`}
      </div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:16px">
      <button type="button" class="o-col" style="gap:10px;width:100%" onClick=${() => nav.go('percorso', { course: cur.id, unit: next ? next.unit.id : null })} aria-label=${`Apri ${cur.name}`}>
        <span class="o-rowf" style="gap:10px;width:100%"><span class="o-ibox" style="width:36px;height:36px;border-radius:11px;font-size:14px;background:${AZ}">${cur.badge}</span>
          <span class="o-grow" style="font-size:16px;line-height:20px;font-weight:800">${cur.name}</span><span style="font-size:14px;line-height:20px;font-weight:800">${pct}%</span></span>
        <span style="display:block;width:100%"><${Bar} pct=${pct} label=${`Percorso completato al ${pct}%`}/></span>
      </button>
      ${next ? html`<div class="o-col" style="gap:4px"><div class="o-big" style=${Object.assign({ overflowWrap: 'anywhere', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden' }, next.title.length > 44 ? { fontSize: 22, lineHeight: '27px', letterSpacing: '-.01em' } : null)}>${next.title}</div>
          <div class="o-body o-mut">${doneCount(cur.lessons) ? 'Prossima lezione' : 'Prima lezione'} di ${next.unit.name}, ${next.minutes} minuti</div></div>
        <${Btn} onClick=${() => nav.go('lezione', { key: next.key })}>${doneCount(cur.lessons) ? 'Riprendi la lezione' : 'Inizia la prima lezione'}<//>`
      : html`<div class="o-col" style="gap:4px"><div class="o-big">Percorso completato</div><div class="o-body o-mut">Hai preso tutte le figurine. Tienile vive con il ripasso.</div></div>
        <${Btn} onClick=${() => nav.tab('allenati')}>Vai al ripasso<//>`}
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <h2 class="o-h2" style="margin-bottom:4px">Gli argomenti di ${cur.name}</h2>
      ${cur.units.map(u => { const ls = unitLessons(u), d = doneCount(ls); return html`<${Row} key=${u.id} icon=${html`<span style="font-size:15px">${u.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()}</span>`}
        title=${u.name} sub=${`${d} di ${plural(ls.length, 'lezione', 'lezioni')}`} right=${html`<${Ring} pct=${ls.length ? d / ls.length * 100 : 0}/>`} onClick=${() => nav.go('percorso', { course: cur.id, unit: u.id })}/>`; })}
      ${others.length > 0 && html`<h2 class="o-h2" style="margin:22px 0 4px">Gli altri tuoi percorsi</h2>`}
      ${others.map(c => html`<${Row} key=${c.id} icon=${c.badge} title=${c.name} sub=${`${doneCount(c.lessons)} di ${plural(c.lessons.length, 'lezione', 'lezioni')}`} right=${html`<${Ring} pct=${coursePct(c)}/>`} onClick=${() => { s2set({ cur: c.id }); }}/>`)}
      <${Row} icon=${PathIco(D_PLUS, 22, 2.6)} ibg=${AZ} title="Scopri altri percorsi" sub="Dalle basi alle certificazioni" chev=${true} last=${true} onClick=${() => nav.go('catalogo')}/>
    <//>
    ${dateOpen && html`<${ExamDateSheet} onClose=${() => setDateOpen(false)}/>`}
  <//>`;
}

// Home del primo giorno: nessun percorso iniziato
function HomeEmpty({ nav }) {
  const s = useS2();
  const goal = (s.onboard && s.onboard.goal) || 'zero';
  const rec = goal === 'exam' ? courseById('cfa2') : courseById('basi');
  const first = rec.lessons[0], name = userName();
  const start = () => { s2set(x => ({ cur: rec.id, started: Array.from(new Set([...(x.started || []), rec.id])) })); nav.go('lezione', { key: first.key }); };
  return html`<${Room} color=${AZ} tab="home" go=${nav.tab}
    rally=${html`<${Rally} pose="saluta" alt="Rally saluta" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div class="o-col" style="align-items:flex-start;gap:14px;padding-top:4px;max-width:210px"><h1 class="o-h1">Ciao${name ? html`,<br/>${name}` : '!'}</h1><${Pill}>Giorno 1<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:16px">
      <div class="o-rowf" style="gap:14px;align-items:flex-start"><span class="o-ibox" style="width:56px;height:56px;border-width:2.5px;border-radius:16px;font-size:26px;background:${AZ};box-shadow:3px 3px 0 ${INK};transform:rotate(-4deg)">${rec.badge}</span>
        <div class="o-grow o-col" style="gap:2px"><span class="o-s">Il tuo primo percorso</span><span style="font-size:24px;line-height:28px;font-weight:800;letter-spacing:-.01em">${rec.name}</span><span class="o-s">${plural(rec.lessons.length, 'lezione breve', 'lezioni brevi')}${rec.id === 'basi' ? ', da zero' : ''}</span></div></div>
      <div class="o-rowf" style="gap:12px;justify-content:space-between;padding:12px 16px;background:${T_GR};border-radius:14px"><span class="o-t">${first.title}</span><span class="o-s" style="flex:none">${first.minutes} minuti</span></div>
      <${Btn} onClick=${start}>Inizia la prima lezione<//>
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <h2 class="o-h2" style="margin-bottom:4px">Oppure parti da qui</h2>
      ${rec.id !== 'cfa2' && html`<${Row} icon=${Ico(GraduationCap, 22)} ibg=${LILLA} title="Preparare un esame" sub="CFA Level II, domande come all'esame" chev=${true} onClick=${() => nav.go('scheda', { course: 'cfa2' })}/>`}
      ${rec.id !== 'basi' && html`<${Row} icon=${Ico(Sprout, 22)} ibg=${AZ} title="Capire la finanza da zero" sub="Soldi, interessi, inflazione" chev=${true} onClick=${() => nav.go('scheda', { course: 'basi' })}/>`}
      <${Row} icon=${Ico(TrendingUp, 22)} ibg=${PESCA} title="Investire i miei risparmi" sub="Azioni, obbligazioni, fondi: in arrivo" chev=${true} onClick=${() => nav.go('catalogo')}/>
      <${Row} icon=${Ico(LayoutGrid, 22)} title="Scopri tutti i percorsi" sub="Dalle basi agli esami" chev=${true} last=${true} onClick=${() => nav.go('catalogo')}/>
    <//>
  <//>`;
}

// ---- dentro un percorso: le sezioni dell'unità e le lezioni in fila ----
function PercorsoScreen({ nav, course, unit }) {
  useS2(); useTick();
  const c = courseById(course) || currentCourse() || courses()[0];
  const nx = nextLesson(c, unit);
  const [uid, setUid] = useState(unit || (nx ? nx.unit.id : c.units[0].id));
  const [pick, setPick] = useState(false);
  const u = c.units.find(x => x.id === uid) || c.units[0], ui = c.units.indexOf(u);
  const album = K.albumLoad(), now = Date.now(), tests = s2get().tests;
  const curL = unitLessons(u).find(l => !isDone(l.key));
  const curRef = useRef(null), scrollRef = useRef(null);
  useEffect(() => { const t = setTimeout(() => { const el = curRef.current, sc = scrollRef.current; if (el && sc) sc.scrollTop = Math.max(0, el.offsetTop - sc.clientHeight / 2 + 60); }, 40); return () => clearTimeout(t); }, [uid]);
  const line = solid => html`<span aria-hidden="true" style=${solid ? { position: 'absolute', left: 22, top: 44, bottom: -12, width: 4, background: INK } : { position: 'absolute', left: 22, top: 46, bottom: -10, width: 0, borderLeft: `4px dotted ${INK}` }}></span>`;
  const subOf = l => { const st = stickerState(l, album, now); return st === 'sbiadisce' ? 'Sta sbiadendo, ripassala' : st === 'dorata' ? 'Figurina dorata' : 'Figurina presa'; };
  return html`<${Room} color=${c.color || AZ} tab="home" go=${nav.tab} headH=${156} scrollRef=${scrollRef}
    rally=${html`<${Rally} pose="indica" w=${206} alt="Rally indica la prossima lezione" style="position:absolute;right:-20px;top:calc(var(--otop) + 6px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px;gap:12px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Torna a Impara"/><span style="font-size:15px;line-height:20px;font-weight:800">${c.name}</span></div>
      <div class="o-col" style="align-items:flex-start;gap:12px;margin-top:12px;max-width:225px">
        <h1 class="o-h1m" style=${u.name.length > 14 ? { fontSize: 26, lineHeight: '28px' } : null}>${u.name}</h1>
        <button type="button" onClick=${() => setPick(true)} aria-label="Cambia argomento"><${Pill}>Unità ${ui + 1} di ${c.units.length}<//></button>
      </div>`}>
    <${Sheet} style=${{ paddingTop: 22 }}>
      ${u.sections.map((sec, si) => { const d = doneCount(sec.lessons), qn = allQuestions(sec.lessons).length, tid = 'unit:' + sec.id, tr = tests[tid];
        return html`<section key=${sec.id} style=${{ marginBottom: 28 }}>
          <div class="o-col" style="gap:2px;margin-bottom:10px">${sec.num && html`<span class="o-s">Reading ${sec.num}</span>`}
            <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px"><h2 class="o-h2">${sec.name}</h2><span class="o-lab" style="flex:none">${d} su ${sec.lessons.length} fatte</span></div></div>
          <div class="o-col">
            ${sec.lessons.map((l, k) => { const done = isDone(l.key), isCur = l === curL, last = k === sec.lessons.length - 1 && qn < 3;
              if (isCur) return html`<div key=${l.key} ref=${curRef} style="position:relative;display:flex;align-items:flex-start;gap:14px;padding:8px 0">${!last && line(false)}
                <span style="width:48px;flex:none;display:flex;justify-content:center;padding-top:14px;position:relative"><span style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:${AZ};border:2.5px solid ${INK};border-radius:50%;box-shadow:0 0 0 5px #fff">${PathIco('M8 5l11 7-11 7z', 20, 2, INK, INK)}</span></span>
                <div class="o-grow o-col" style="gap:12px;padding:14px 16px 16px;background:#fff;border:2.5px solid ${INK};border-radius:22px;box-shadow:4px 4px 0 ${INK}">
                  <div class="o-col" style="gap:2px"><span style="font-size:20px;line-height:24px;font-weight:800;letter-spacing:-.01em;overflow-wrap:anywhere;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden">${l.title}</span><span class="o-lab" style="font-weight:600">Lezione ${k + 1}, ${l.minutes} minuti</span></div>
                  <${Btn} cls="sm" onClick=${() => nav.go('lezione', { key: l.key })}>Inizia<//></div></div>`;
              return html`<button key=${l.key} type="button" onClick=${() => nav.go('lezione', { key: l.key })} style="position:relative;min-height:56px;display:flex;align-items:center;gap:14px;padding:6px 0;width:100%">${!last && line(done)}
                <span style="width:48px;flex:none;display:flex;justify-content:center;position:relative">${done
                  ? html`<span style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:${INK};border:2px solid ${INK};border-radius:50%;color:#fff">${PathIco(D_CHECK, 20, 3)}</span>`
                  : html`<span style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:#fff;border:2px solid ${INK};border-radius:50%;font-size:15px;font-weight:800">${k + 1}</span>`}</span>
                <span class="o-grow o-col" style="gap:1px"><span class="o-t" style="overflow-wrap:anywhere">${l.title}</span><span class="o-s">${done ? subOf(l) : l.minutes + ' minuti'}</span></span></button>`; })}
            ${qn >= 3 && html`<button type="button" onClick=${() => nav.go('testInizio', { kind: 'unit', course: c.id, section: sec.id })} style="position:relative;min-height:56px;display:flex;align-items:center;gap:14px;padding:6px 0;width:100%">
              <span style="width:48px;flex:none;display:flex;justify-content:center"><span style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:${tr && tr.passedEver ? GIALLO : '#fff'};border:2px solid ${INK};border-radius:50%">${tr && tr.passedEver ? PathIco(D_STAR, 20, 2.2, INK, INK) : Ico(Flag, 18, 2.4)}</span></span>
              <span class="o-grow o-col" style="gap:1px"><span class="o-t">Verifica</span><span class="o-s">${tr && tr.passedEver ? `Superata con ${tr.best} su ${tr.n}: figurine dorate` : `${Math.min(10, qn)} domande, se passi le figurine diventano dorate`}</span></span></button>`}
          </div></section>`; })}
    <//>
    ${pick && html`<${BSheet} onClose=${() => setPick(false)} label="Argomenti">
      <h2 class="o-big" style="margin-bottom:6px">${c.name}</h2>
      ${c.units.map((x, k) => { const ls = unitLessons(x), d = doneCount(ls); return html`<${Row} key=${x.id} icon=${k + 1} ibg=${x === u ? AZ : null} title=${x.name} sub=${`${d} di ${ls.length} lezioni`} right=${html`<${Ring} pct=${ls.length ? d / ls.length * 100 : 0}/>`} last=${k === c.units.length - 1} onClick=${() => { setUid(x.id); setPick(false); }}/>`; })}
    <//>`}
  <//>`;
}

// ---- pezzi delle domande ----
const L3 = ['A', 'B', 'C', 'D'];
const splitCase = q => { const t = String(q.q || ''); const parts = t.split(/\n\s*\n/); return t.length > 260 && parts.length >= 2 ? { ctx: parts.slice(0, -1).join('\n\n'), ask: parts[parts.length - 1] } : null; };
const optState = (q, k, sel, locked) => !locked ? (sel === k ? 'sel' : '') : k === q.ans ? 'ok' : k === sel ? 'ko' : 'dim';
const optNote = (q, k, sel, locked) => !locked ? (sel === k ? 'La tua scelta' : null) : (k === sel ? (k === q.ans ? 'La tua scelta' : 'La tua risposta') : k === q.ans ? 'Quella giusta' : null);
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
      ${[['case', 'Il caso'], ['ask', label || 'Domanda']].map(([id, t]) => html`<button key=${id} type="button" role="tab" aria-selected=${tab === id ? 'true' : 'false'} onClick=${() => setTab(id)}
        style=${{ height: 40, borderRadius: 11, textAlign: 'center', fontSize: 15, fontWeight: 800, background: tab === id ? INK : 'transparent', color: tab === id ? '#fff' : INK }}>${t}</button>`)}</div>
    ${tab === 'case' ? html`<div style="margin-top:18px"><${Rich} text=${cs.ctx} lang=${q.lang}/></div>`
      : html`<div style="margin-top:18px"><${Rich} text=${cs.ask} cls="q" lang=${q.lang}/>
        <button type="button" onClick=${() => setOpen(!open)} aria-expanded=${open ? 'true' : 'false'} class="o-rowf" style="gap:10px;width:100%;min-height:48px;margin-top:14px;padding:0 14px;border:2.5px solid ${INK};border-radius:14px;font-size:15px;font-weight:800">
          ${Ico(Table2, 20)}<span class="o-grow">I dati del caso</span><span style=${{ transform: open ? 'rotate(180deg)' : 'none', display: 'flex' }}>${Ico(ChevronDown, 22, 2.6)}</span></button>
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
function FeedbackSheet({ ok, q, xp, onNext, nav, left, next = 'Continua' }) {
  const [flagged, setFlagged] = useState(false);
  const flag = () => { s2set(s => ({ flags: Object.assign({}, s.flags, { [q.key]: Date.now() }) })); setFlagged(true); };
  return html`<${BSheet} dim=${false} bg=${ok ? MENTA : ROSA} label=${ok ? 'Risposta giusta' : 'Risposta sbagliata'}>
    <div class="o-rowf" style="justify-content:space-between;gap:12px"><h2 style="font-size:30px;line-height:36px;font-weight:800;letter-spacing:-.02em">${ok ? 'Giusto!' : 'Non ancora'}</h2>
      ${ok ? (xp ? html`<${Pill} bg=${GIALLO} rot=${4}>+${xp} XP<//>` : null) : (left != null ? html`<${Pill} rot=${3}>Spiegazione ${FREE_EXPL - left} di ${FREE_EXPL}<//>` : null)}</div>
    ${q.exp && html`<div class="o-scroll" style="flex:0 1 auto;max-height:34vh;margin-top:6px"><${Rich} text=${q.exp} cls="sm"/></div>`}
    <div style="margin-top:14px;flex:none"><${Btn} cls="lg" bg="#fff" onClick=${onNext}>${ok ? next : 'Ho capito'}<//></div>
    ${!ok && html`<div style="text-align:center;flex:none">${flagged ? html`<span class="o-link" style="text-decoration:none">Segnalata, grazie</span>` : html`<button type="button" class="o-link" onClick=${flag}>Segnala un errore in questa domanda</button>`}</div>`}
  <//>`;
}
// foglio quando le spiegazioni gratis del giorno sono finite
function LimitSheet({ onPro, onSkip }) {
  return html`<${BSheet} label="Spiegazioni finite">
    <${Rally} pose="re" w=${150} alt="" style="position:absolute;right:14px;top:-128px"/>
    <div><${Pill} bg=${GIALLO} rot=${-3}>FinLearn Pro<//></div>
    <h2 class="o-big" style="margin-top:14px;font-size:24px;line-height:28px">Per oggi le spiegazioni sono finite</h2>
    <p class="o-body o-mut" style="margin-top:6px">Gratis ne hai ${FREE_EXPL} al giorno. Con Pro non finiscono mai.</p>
    <ul class="o-col" style="gap:10px;margin-top:14px;list-style:none">${PRO_POINTS.slice(0, 3).map(t => html`<li key=${t} class="o-rowf" style="gap:12px"><span style="width:24px;height:24px;flex:none;display:flex;align-items:center;justify-content:center;background:${GIALLO};border:2px solid ${INK};border-radius:8px">${PathIco(D_CHECK, 14, 3.4)}</span><span class="o-t">${t}</span></li>`)}</ul>
    <p class="o-t" style="margin-top:14px;font-size:14px">${PRO_TRIAL_LINE}</p>
    <div style="margin-top:12px"><${Btn} cls="lg" bg=${GIALLO} onClick=${onPro}>Prova Pro gratis<//></div>
    <div style="text-align:center"><button type="button" class="o-link" onClick=${onSkip}>Torno domani</button></div>
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
    <div class="o-col" style="gap:6px;position:relative;min-height:150px;max-width:190px"><h1 class="o-big">Abbina le coppie</h1><p class="o-lab">Tocca una parola, poi il suo significato.</p></div>
    <div style="display:grid;grid-template-columns:minmax(132px,43%) 1fr;gap:10px 12px;margin-top:18px;position:relative">
      ${pairs.map((p, i) => html`<${React.Fragment} key=${i}>
        <button type="button" aria-pressed=${a === i || ok.includes(i) ? 'true' : 'false'} disabled=${ok.includes(i)} onClick=${() => setA(a === i ? null : i)} style=${Object.assign(cell(a === i, ok.includes(i)), { fontSize: 16, fontWeight: 800 })}>${p[0]}${ok.includes(i) && tick}</button>
        <button type="button" disabled=${ok.includes(right[i])} onClick=${() => tapR(right[i])} style=${Object.assign(cell(false, ok.includes(right[i]), bad === right[i]), { fontSize: 14, lineHeight: '19px', fontWeight: ok.includes(right[i]) ? 700 : 600 })}>${pairs[right[i]][1]}${ok.includes(right[i]) && tick}</button>
      <//>`)}
    </div>
    <p class="o-lab" style="margin-top:16px" aria-live="polite">${ok.length === pairs.length ? 'Tutte le coppie sono a posto.' : `${plural(ok.length, 'coppia', 'coppie')} su ${pairs.length}.${a != null ? ` Hai scelto “${pairs[a][0]}”: ora tocca il significato.` : ''}`}</p>
  </div>`;
}
// grafico della lezione sull'interesse composto: 1.000 € al 5%, anni a scelta
function CompoundWidget() {
  const [n, setN] = useState(20);
  const C = 1000, i = 0.05, pts = [0, n / 4, n / 2, 3 * n / 4, n];
  const val = t => ({ cap: C, simple: C * i * t, extra: C * Math.pow(1 + i, t) - C - C * i * t });
  const tot = C * Math.pow(1 + i, n), H = 132;
  const eur = v => fmtInt(v) + ' €';
  const end = val(n);
  return html`<div class="o-card s o-col" style="padding:16px 18px;gap:10px;margin-top:16px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><span style="font-size:15px;line-height:20px;font-weight:800">1.000 € al 5% l'anno</span>
      <span class="o-col" style="align-items:flex-end"><span class="o-s">dopo ${n} anni</span><span style="font-size:15px;line-height:20px;font-weight:800">${eur(tot)}</span></span></div>
    <div role="img" aria-label=${`Dopo ${n} anni 1.000 euro diventano ${eur(tot)}`} style="display:flex;align-items:flex-end;justify-content:space-between;height:${H + 4}px;padding:0 10px;border-bottom:2.5px solid ${INK}">
      ${pts.map((t, k) => { const v = val(t), sc = H / tot; return html`<div key=${k} style="width:42px;display:flex;flex-direction:column;border:2px solid ${INK};border-bottom:0;border-radius:6px 6px 0 0;overflow:hidden">
        ${v.extra * sc >= 1 && html`<i style=${{ display: 'block', height: v.extra * sc, background: AZ, borderBottom: `2px solid ${INK}` }}></i>`}
        ${v.simple * sc >= 1 && html`<i style=${{ display: 'block', height: v.simple * sc, background: T_AZ, borderBottom: `2px solid ${INK}` }}></i>`}
        <i style=${{ display: 'block', height: v.cap * sc, background: '#fff' }}></i></div>`; })}
    </div>
    <div style="display:flex;justify-content:space-between;padding:0 10px;font-size:12px;line-height:16px;font-weight:700;color:${MUT}">${pts.map((t, k) => html`<span key=${k} style="width:42px;text-align:center;white-space:nowrap">${k === 0 ? 'oggi' : k === 4 ? `${t} anni` : t}</span>`)}</div>
    <label class="o-rowf" style="gap:12px;margin-top:2px"><span style="font-size:15px;font-weight:800">Anni</span>
      <input type="range" min="4" max="40" step="4" value=${n} onInput=${e => setN(+e.target.value)} onChange=${e => setN(+e.target.value)} style="flex:1;accent-color:${INK};height:28px"/><span style="width:24px;text-align:right;font-size:15px;font-weight:800">${n}</span></label>
    <div class="o-col" style="gap:4px;font-size:14px;line-height:20px;font-weight:700">
      ${[['#fff', 'I tuoi soldi', end.cap], [T_AZ, 'Interessi sui tuoi soldi', end.simple], [AZ, 'Interessi sugli interessi', end.extra]].map(([bg, t, v]) => html`<div key=${t} class="o-rowf" style="gap:8px"><i style=${{ width: 14, height: 14, flex: 'none', background: bg, border: `2px solid ${INK}`, borderRadius: 4 }}></i><span class="o-grow">${t}</span><span style="font-weight:800">${eur(v)}</span></div>`)}
    </div></div>`;
}

// ---- la lezione: pagine, riepilogo, esercizi, e alla fine la figurina ----
function LessonScreen({ nav, lessonKey }) {
  const l = lessonByKey(lessonKey);
  const steps = useMemo(() => lessonSteps(l), [lessonKey]);
  const [i, setI] = useState(0), [sel, setSel] = useState(null), [fb, setFb] = useState(null), [res, setRes] = useState({}), [tab, setTab] = useState('case');
  const [matched, setMatched] = useState(false), [done, setDone] = useState(null), [left, setLeft] = useState(null);
  const scrollRef = useRef(null);
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
  const next = () => { if (i < steps.length - 1) setI(i + 1); else finish(); };
  useEffect(() => { if (!steps.length) finish({}); }, []);
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
  const calcBtn = html`<${IBtn} lg=${true} icon=${Ico(Calculator, 24, 2.2)} onClick=${nav.openCalc} label="Calcolatrice"/>`;
  let body, foot;
  if (st.k === 'page') {
    body = html`<div class="o-pad" style="position:relative;padding-top:18px;padding-bottom:24px">
      ${st.head && html`<div class="o-lab" style="margin-bottom:4px">${st.head}</div>`}
      <h1 style="font-size:30px;line-height:34px;font-weight:800;letter-spacing:-.02em;text-wrap:balance;overflow-wrap:anywhere">${st.title}</h1>
      <div style="margin-top:12px"><${Rich} text=${st.text}/></div>
      ${st.widget === 'compound' && html`<${CompoundWidget}/>`}
      ${st.note && html`<div class="o-note" style="margin-top:18px">In breve: ${st.note}</div>`}
    </div>`;
    foot = html`<${Btn} cls="lg" onClick=${next}>Ho capito<//>`;
  } else if (st.k === 'recap') {
    body = html`<div class="o-pad" style="position:relative;padding-top:18px;padding-bottom:24px">
      <${Rally} pose="insegna" w=${170} alt="" style="position:absolute;right:-14px;top:-8px"/>
      <div style="position:relative;min-height:128px;max-width:200px"><div class="o-lab" style="margin-bottom:4px">${l.title}</div><h1 style="font-size:30px;line-height:34px;font-weight:800;letter-spacing:-.02em">In breve</h1></div>
      ${st.points.length > 0 && html`<div class="o-card s o-col" style="position:relative;padding:8px 18px;margin-top:10px">${st.points.map((t, k) => html`<div key=${k} class="o-rowf" style=${{ gap: 12, padding: '12px 0', borderBottom: k < st.points.length - 1 ? `2px solid ${SEP}` : 0, alignItems: 'flex-start' }}>
        <span style="width:24px;height:24px;flex:none;display:flex;align-items:center;justify-content:center;background:${INK};border-radius:50%;color:#fff;margin-top:1px">${PathIco(D_CHECK, 14, 3.4)}</span><${Rich} text=${t} cls="sm" style=${{ fontWeight: 700 }}/></div>`)}</div>`}
      ${st.tips.length > 0 && html`<div style="margin-top:16px;padding:12px 16px;background:${T_GIALLO};border-radius:16px"><div style="font-size:13px;line-height:18px;font-weight:800;margin-bottom:2px">All'esame</div>${st.tips.map((t, k) => html`<${Rich} key=${k} text=${String(t).replace(/^[^\wÀ-ÿ(]+\s*/, '')} cls="sm"/>`)}</div>`}
    </div>`;
    foot = html`<${Btn} cls="lg" onClick=${next}>${steps[i + 1] && steps[i + 1].k === 'q' ? 'Vai alla domanda' : 'Ho capito'}<//>`;
  } else if (st.k === 'match') {
    body = html`<${MatchExercise} key=${i} pairs=${st.pairs} onDone=${() => setMatched(true)}/>`;
    foot = html`<${Btn} cls="lg" disabled=${!matched} onClick=${next}>Continua<//>`;
  } else {
    const qn = steps.filter(s => s.k === 'q').length, qk = steps.slice(0, i + 1).filter(s => s.k === 'q').length;
    body = html`<${QuestionBody} key=${i} q=${st.q} label=${qn > 1 ? `Domanda ${qk} di ${qn}` : (l.kind === 'los' ? 'Domanda d\'esame' : 'Domanda')} sel=${sel} onSel=${setSel} locked=${locked} tab=${tab} setTab=${setTab}/>`;
    foot = html`<div class="o-rowf" style="gap:12px">${l.kind === 'los' && calcBtn}<div class="o-grow">${cs && tab === 'case'
      ? html`<${Btn} cls="lg" onClick=${() => setTab('ask')}>Vai alla domanda<//>` : html`<${Btn} cls="lg" disabled=${sel == null || locked} onClick=${check}>Controlla<//>`}</div></div>`;
  }
  const over = fb === 'ok' ? html`<${FeedbackSheet} ok=${true} q=${st.q} xp=${isDone(l.key) ? 5 : 10} onNext=${next}/>`
    : fb === 'ko' ? html`<${FeedbackSheet} ok=${false} q=${st.q} left=${left} onNext=${next}/>`
    : fb === 'limit' ? html`<${LimitSheet} onPro=${() => { startPro(); setLeft(null); setFb('ko'); }} onSkip=${next}/>` : null;
  return html`<${Flow} scrollRef=${scrollRef} top=${html`<${TopBar} onClose=${nav.back} n=${steps.length} i=${i}/>`} foot=${foot} over=${over}>${body}<//>`;
}
// lezione finita: figurina, punti, giorni di fila
function LessonDone({ nav, l, done, steps, res }) {
  const [rev, setRev] = useState(false);
  const streak = streakDays(), emoji = lessonEmoji(l);
  const wq = done.wrong.length ? steps[done.wrong[0]].q : null, wr = wq ? res[done.wrong[0]] : null;
  const goOn = () => { const s = s2get(); if (K.user && K.user.guest && !s.askedSave) { s2set({ askedSave: true }); nav.replace('salva'); } else nav.back(); };
  const conf = [[34, 96, GIALLO, 24, 0], [58, 176, '#fff', 0, 1], [26, 244, MENTA, -32, 0], [96, 70, ROSA, 0, 1], [-48, 88, ROSA, -18, 0], [-70, 170, GIALLO, 0, 1], [-38, 240, '#fff', 38, 0], [-104, 64, MENTA, 0, 1]];
  return html`<div class="o-scr" style="background:repeating-conic-gradient(from 5deg at 50% 190px, #A9D3FF 0deg 10deg, ${AZ} 10deg 20deg)">
    <div class="o-scroll"><div class="o-col" style="min-height:100%;align-items:center;position:relative;padding:0 20px">
      ${conf.map(([x, y, bg, rot, round], k) => html`<span key=${k} aria-hidden="true" style=${Object.assign({ position: 'absolute', top: y, background: bg, border: `2px solid ${INK}` }, x >= 0 ? { left: x } : { right: -x }, round ? { width: 13, height: 13, borderRadius: '50%' } : { width: 10, height: 18, borderRadius: 3, transform: `rotate(${rot}deg)` })}></span>`)}
      <${Rally} pose="festa-grad" w=${300} alt="Rally festeggia con il cappello da laureato" style="margin-top:calc(var(--otop) - 17px);position:relative"/>
      <h1 class="o-pop" style="font-size:44px;line-height:48px;font-weight:800;letter-spacing:-.02em;text-align:center;margin-top:-18px;position:relative">Lezione finita!</h1>
      <p style="font-size:16px;line-height:22px;font-weight:600;text-align:center;margin-top:6px">${done.first ? 'Hai una figurina nuova nel tuo album.' : 'Figurina ravvivata: resta a colori più a lungo.'}</p>
      <div style="display:flex;align-items:flex-start;justify-content:center;gap:20px;margin-top:26px;width:100%">
        <div class="o-col" style="width:168px;flex:none;padding:8px 8px 12px;gap:10px;background:#fff;border:2.5px solid ${INK};border-radius:20px;box-shadow:5px 5px 0 ${INK};transform:rotate(-5deg)">
          <div style="height:122px;display:flex;align-items:center;justify-content:center;background:${T_AZ};border:2px solid ${INK};border-radius:13px;font-size:${emoji ? 56 : 44}px;line-height:1;font-weight:800">${emoji || stickerSym(l)}</div>
          <div class="o-col" style="gap:1px;padding:0 4px"><span style="font-size:15px;line-height:20px;font-weight:800;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${l.title}</span>
            <span style="font-size:12px;line-height:16px;font-weight:600;color:${MUT};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.unit.name}${l.code ? ', n. ' + l.code : ''}</span></div></div>
        <div class="o-col" style="width:152px;flex:none;margin-top:6px;overflow:hidden;background:#fff;border:2.5px solid ${INK};border-radius:20px">
          <div class="o-col" style="padding:9px 14px 10px;border-bottom:2px solid ${INK};background:${GIALLO}"><span style="font-size:13px;line-height:18px;font-weight:700">Punti</span><span style="font-size:22px;line-height:26px;font-weight:800">+${done.xp} XP</span></div>
          ${done.qn > 0 && html`<div class="o-col" style="padding:9px 14px 10px;border-bottom:2px solid ${INK}"><span class="o-s">Risposte giuste</span><span style="font-size:22px;line-height:26px;font-weight:800">${done.okN} su ${done.qn}</span></div>`}
          <div class="o-col" style="padding:9px 14px 10px"><span class="o-s">Giorni di fila</span><span style="font-size:22px;line-height:26px;font-weight:800">${Math.max(1, streak)}</span></div></div>
      </div>
      <div style="flex:1 1 20px;min-height:20px"></div>
      ${wq && html`<button type="button" class="o-link" onClick=${() => setRev(true)}>Rivedi la domanda sbagliata</button>`}
      <div style="width:100%;padding:8px 0 max(34px,calc(env(safe-area-inset-bottom) + 12px))"><${Btn} cls="lg" bg="#fff" onClick=${goOn}>Continua<//></div>
    </div></div>
    ${rev && html`<${BSheet} onClose=${() => setRev(false)} label="Domanda sbagliata">
      <div class="o-scroll" style="flex:0 1 auto;max-height:70vh"><${Rich} text=${wq.q} cls="q" lang=${wq.lang}/>
        <div style="margin-top:14px"><${Options} q=${wq} sel=${wr ? wr.sel : null} onSel=${() => {}} locked=${true}/></div>
        ${wq.exp && html`<div style="margin-top:14px;padding:12px 14px;background:${T_BG};border-radius:14px"><div style="font-size:18px;font-weight:800;margin-bottom:4px">Perché</div><${Rich} text=${wq.exp} cls="sm"/></div>`}</div>
      <div style="margin-top:14px;flex:none"><${Btn} cls="lg" onClick=${() => setRev(false)}>Ho capito<//></div>
    <//>`}
  </div>`;
}

// ---- passi interattivi delle lezioni: stima prima di leggere, leve con un obiettivo, metti a posto, metti in ordine, calcola ----
// I dati di ogni passo stanno nelle lezioni (campo "flow"); qui c'è come si vedono e come rispondono al tocco.
const NBSP = ' ';
// numeri all'italiana, scritti allo stesso modo su ogni telefono: 1.331 · 7,5 · 87.584
const grp = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmtN = (v, d = 0) => { const s = Math.abs(Number(v)).toFixed(d).split('.'); return (v < 0 ? '−' : '') + grp(s[0]) + (s[1] ? ',' + s[1] : ''); };
const withUnit = (v, unit, d = 0) => fmtN(v, d) + (unit === '%' ? '%' : unit ? NBSP + unit : '');
const eur0 = x => fmtN(Math.round(x)) + NBSP + '€';
const mesiTxt = m => { const a = Math.floor(m / 12), r = m % 12; return a ? plural(a, 'anno', 'anni') + (r ? ' e ' + plural(r, 'mese', 'mesi') : '') : plural(r, 'mese', 'mesi'); };

// cursore con i due tasti meno e più: il dito lo trascina, i tasti servono per il passo fine
function Slider({ value, min, max, step, onChange, label, disabled }) {
  const p = clamp((value - min) / (max - min) * 100, 0, 100);
  const set = x => onChange(clamp(Math.round(Math.round(x / step) * step * 100) / 100, min, max));
  return html`<div class="o-rowf" style="gap:10px">
    <button type="button" class="o-stepb" aria-label=${'Meno: ' + label} disabled=${!!disabled || value <= min} onClick=${() => set(value - step)}>${PathIco('M5 12h14', 18, 3.2)}</button>
    <input type="range" class="o-range o-grow" aria-label=${label} min=${min} max=${max} step=${step} value=${value} disabled=${!!disabled} style=${{ '--p': p + '%' }} onInput=${e => set(+e.target.value)} onChange=${e => set(+e.target.value)}/>
    <button type="button" class="o-stepb" aria-label=${'Più: ' + label} disabled=${!!disabled || value >= max} onClick=${() => set(value + step)}>${PathIco(D_PLUS, 18, 3.2)}</button></div>`;
}

// "Prima di leggere": una stima (cursore) o una scelta, senza voto. La spiegazione parte da quello che hai risposto.
function GuessStep({ st, top, onNext, scrollRef }) {
  const choice = Array.isArray(st.options);
  const [v, setV] = useState(choice ? null : st.min), [moved, setMoved] = useState(false), [locked, setLocked] = useState(false);
  const rev = useRef(null);
  useEffect(() => { if (locked && rev.current && rev.current.scrollIntoView) { try { rev.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* niente */ } } }, [locked]);
  const u = x => withUnit(x, st.unit, st.dec || 0);
  const right = choice ? v === st.ans : Math.abs(v - st.truth) <= st.near;
  const verdict = choice ? (right ? 'Ci hai visto giusto' : 'Non proprio') : right ? 'Quasi centrato' : v > st.truth ? 'Meno di quanto pensavi' : 'Più di quanto pensavi';
  const pos = x => clamp((x - st.min) / (st.max - st.min) * 100, 0, 100);
  const mark = (x, bg, round) => html`<i style=${{ position: 'absolute', top: '50%', left: pos(x) + '%', width: round ? 24 : 20, height: round ? 24 : 20, marginLeft: round ? -12 : -10, marginTop: round ? -12 : -10, background: bg, border: `2.5px solid ${INK}`, borderRadius: round ? '50%' : 5, transform: round ? 'none' : 'rotate(45deg)' }}></i>`;
  const box = (lab, val, bg) => html`<div class="o-col o-grow" style=${{ padding: '10px 12px', border: `2px solid ${INK}`, borderRadius: 14, background: bg }}><span class="o-s" style=${{ color: INK }}>${lab}</span><span style="font-size:26px;line-height:32px;font-weight:800;white-space:nowrap">${val}</span></div>`;
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:24px">
    <div class="o-col" style="gap:6px"><span class="o-lab">Prima di leggere: secondo te?</span><${Rich} text=${st.q} cls="q"/></div>
    ${choice ? html`<div class="o-col" style="gap:10px;margin-top:16px">${st.options.map((o, k) => html`<${Opt} key=${k} letter=${L3[k]} text=${o}
        state=${!locked ? (v === k ? 'sel' : '') : k === st.ans ? 'ok' : k === v ? 'sel' : 'dim'} note=${k === v ? 'La tua scelta' : locked && k === st.ans ? 'Quella giusta' : null} disabled=${locked} onClick=${() => setV(k)}/>`)}</div>`
    : !locked ? html`<div class="o-card s o-col" style="margin-top:18px;padding:16px 16px 18px;gap:12px">
        <div class="o-col" style="align-items:center"><span class="o-s">La tua stima</span><span class="o-bign" aria-live="polite">${moved ? u(v) : '?'}</span></div>
        <${Slider} value=${v} min=${st.min} max=${st.max} step=${st.step} label="La tua stima" onChange=${x => { setV(x); setMoved(true); }}/>
        <div class="o-rowf" style="justify-content:space-between;padding:0 50px"><span class="o-s">${u(st.min)}</span><span class="o-s">${u(st.max)}</span></div></div>`
    : html`<div class="o-card s o-col" style="margin-top:18px;padding:16px 16px 14px;gap:12px">
        <div class="o-rowf" style="gap:10px;align-items:stretch">${box('La tua stima', u(v), '#fff')}${box('Il conto', u(st.truth), MENTA)}</div>
        <div role="img" aria-label=${`La tua stima è ${u(v)}, il conto dà ${u(st.truth)}`} style="position:relative;height:30px;margin:2px 14px 0">
          <i style="position:absolute;left:-14px;right:-14px;top:50%;height:12px;margin-top:-6px;background:#fff;border:2.5px solid ${INK};border-radius:99px"></i>${mark(v, '#fff', true)}${mark(st.truth, MENTA, false)}</div>
        <div class="o-rowf" style="justify-content:space-between"><span class="o-s">${u(st.min)}</span><span class="o-s">${u(st.max)}</span></div></div>`}
    ${locked && html`<div ref=${rev} class="o-in" style="margin-top:20px"><h2 style="font-size:24px;line-height:28px;font-weight:800;letter-spacing:-.02em">${verdict}</h2><div style="margin-top:6px"><${Rich} text=${st.after} cls="sm"/></div></div>`}
  </div>`;
  const foot = !locked ? html`<${Btn} cls="lg" disabled=${choice ? v == null : !moved} onClick=${() => setLocked(true)}>${choice ? 'Blocca la risposta' : 'Blocca la stima'}<//>` : html`<${Btn} cls="lg" onClick=${() => onNext()}>Continua<//>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${foot}>${body}<//>`;
}

// i conti dietro le leve: ogni modello dice come si calcola e che cosa mostrare
const LEVERS = {
  // mutuo a rata costante, rate mensili: leve "tasso" (% annuo) e "anni"; parametro C = capitale
  mutuo: {
    calc: (v, p) => { const j = v.tasso / 1200, m = v.anni * 12, rata = j > 0 ? p.C * j / (1 - Math.pow(1 + j, -m)) : p.C / m; return { rata, interessi: rata * m - p.C, base: p.C }; },
    view: o => ({ lab: 'Rata mensile', big: eur0(o.rata), sideLab: 'Interessi in tutto', side: eur0(o.interessi), bar: [o.base, o.interessi], barLab: ['Capitale', 'Interessi'] })
  },
  // debito su carta rimborsato con una cifra fissa al mese: leva "rata"; parametri debito e tasso (% annuo, diviso 12 per il mese)
  carta: {
    calc: (v, p) => { const j = p.tasso / 1200; let B = p.debito, n = 0, tot = 0; if (v.rata <= B * j + 1e-9) return { mesi: 9999, interessi: 0, base: p.debito, mai: true };
      while (B > 0.005 && n < 1200) { const due = B * (1 + j), pay = Math.min(v.rata, due); B = due - pay; tot += pay; n++; } return { mesi: n, interessi: tot - p.debito, base: p.debito, mai: false }; },
    view: o => o.mai ? { lab: 'Tempo per chiudere', big: 'Mai', sideLab: 'Con questa cifra', side: 'paghi solo gli interessi', bar: null, barLab: ['Debito', 'Interessi'] }
      : { lab: 'Tempo per chiudere', big: mesiTxt(o.mesi), sideLab: 'Interessi in tutto', side: eur0(o.interessi), bar: [o.base, o.interessi], barLab: ['Debito', 'Interessi'] }
  }
};
// "Muovi le leve": i numeri cambiano sotto il dito; si va avanti quando gli obiettivi sono raggiunti, uno alla volta
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
    <div class="o-col" style="gap:6px"><span class="o-lab">Muovi le leve</span><h1 class="o-q">${st.t}</h1><${Rich} text=${st.x} cls="sm"/></div>
    <div class="o-card s o-col" style="margin-top:14px;padding:14px 16px 14px;gap:10px" aria-live="polite">
      <div class="o-col"><span class="o-s">${w.lab}</span><span class="o-bign" style="font-size:38px;line-height:44px">${w.big}</span></div>
      <div class="o-rowf" style="justify-content:space-between;gap:12px;padding-top:8px;border-top:2px solid ${SEP}"><span class="o-s">${w.sideLab}</span><span style="font-size:17px;line-height:22px;font-weight:800;text-align:right">${w.side}</span></div>
      <div class="o-col" style=${{ gap: 4, opacity: w.bar ? 1 : 0.35 }}><div style="display:flex;height:16px;border:2px solid ${INK};border-radius:99px;overflow:hidden;background:${AZ}">
          ${w.bar && html`<i style=${{ width: w.bar[0] / tot * 100 + '%', background: '#fff', borderRight: `2px solid ${INK}` }}></i>`}</div>
        <div class="o-rowf" style="justify-content:space-between"><span class="o-s">${w.barLab[0]}</span><span class="o-s">${w.barLab[1]}</span></div></div>
    </div>
    <div class="o-col" style="gap:12px;margin-top:16px">${st.sliders.map(s => html`<div key=${s.id} class="o-col" style="gap:2px">
      <div class="o-rowf" style="justify-content:space-between"><span class="o-t">${s.label}</span><span class="o-t" style="font-weight:800">${withUnit(vals[s.id], s.unit, s.dec || 0)}</span></div>
      <${Slider} value=${vals[s.id]} min=${s.min} max=${s.max} step=${s.step} label=${s.label} onChange=${x => setVals(q => Object.assign({}, q, { [s.id]: x }))}/></div>`)}</div>
    <div class="o-col" style="gap:8px;margin-top:16px" aria-live="polite">
      ${st.goals.map((g, k) => k < got ? html`<div key=${k} class="o-goal ok"><span style="width:28px;height:28px;flex:none;display:flex;align-items:center;justify-content:center;background:${INK};border-radius:50%;color:#fff">${PathIco(D_CHECK, 16, 3.4)}</span><span class="o-t" style="font-weight:800">${g.label}</span></div>`
        : k === got ? html`<div key=${k} class="o-goal o-in">${Ico(Target, 26, 2.4)}<div class="o-col o-grow"><span class="o-s" style=${{ color: INK }}>Obiettivo${n > 1 ? ` ${k + 1} di ${n}` : ''}</span><span class="o-t" style="font-weight:800">${g.label}</span>
            ${hint && g.hint && html`<span class="o-s o-in" style=${{ color: INK, marginTop: 4 }}>${g.hint}</span>`}</div></div>` : null)}
    </div>
    ${all && html`<div ref=${end} class="o-in o-note" style="margin-top:12px">${st.after}</div>`}
  </div>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${html`<${Btn} cls="lg" disabled=${!all} onClick=${() => onNext()}>Continua<//>`}>${body}<//>`;
}

// "Metti al posto giusto": una voce alla volta, da toccare nel contenitore giusto. Se sbagli, sotto compare il perché.
function BucketStep({ st, top, onNext, scrollRef }) {
  const order = useMemo(() => K.flShuffle(st.items.map((x, i) => i)), [st]);
  const [n, setN] = useState(0), [put, setPut] = useState([]), [miss, setMiss] = useState(0), [missed, setMissed] = useState(false), [flash, setFlash] = useState(null), [why, setWhy] = useState(null), [sh, setSh] = useState(0);
  const N = order.length, cur = n < N ? st.items[order[n]] : null, nb = st.buckets.length;
  const tap = b => {
    if (!cur || (flash && flash.ok)) return;
    if (b === cur[1]) { setFlash({ b, ok: true }); setWhy(null); setTimeout(() => { setFlash(null); setPut(p => p.concat(order[n])); setMissed(false); setN(x => x + 1); }, 240); }
    else { if (!missed) { setMissed(true); setMiss(m => m + 1); } setWhy(cur[2] || `Non va in “${st.buckets[b]}”.`); setSh(x => x + 1); setFlash({ b, ok: false }); setTimeout(() => setFlash(f => (f && !f.ok ? null : f)), 420); }
  };
  const card = { alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 16, minHeight: 104, padding: '14px 16px', border: `2.5px solid ${INK}`, borderRadius: 22, textAlign: 'center' };
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:24px">
    <div class="o-col" style="gap:6px"><span class="o-lab">Metti al posto giusto</span><h1 class="o-q">${st.t}</h1></div>
    ${cur ? html`<div key=${n + '-' + sh} class=${'o-col ' + (missed ? 'o-shake' : 'o-in')} style=${Object.assign({ background: T_AZ }, card)}>
        <span class="o-s" style=${{ color: INK }}>${n + 1} di ${N}</span><span style="font-size:20px;line-height:26px;font-weight:800;text-wrap:balance">${cur[0]}</span></div>`
      : html`<div class="o-col o-pop" style=${Object.assign({ background: MENTA }, card)}><span style="font-size:22px;line-height:28px;font-weight:800">Tutto a posto</span><span class="o-s" style=${{ color: INK }}>${N - miss} su ${N} al primo colpo</span></div>`}
    <p aria-live="polite" style=${Object.assign({ minHeight: 44, marginTop: 10, fontSize: 14, lineHeight: '20px', fontWeight: 700 }, why ? { padding: '10px 14px', background: T_ROSA, borderRadius: 14, color: INK } : { padding: '10px 2px', color: MUT })}>${why || (cur ? 'Tocca il contenitore giusto.' : (st.after || ''))}</p>
    <div style=${{ display: 'grid', gridTemplateColumns: `repeat(${nb}, minmax(0, 1fr))`, gap: 10, marginTop: 8 }}>
      ${st.buckets.map((name, b) => html`<button key=${b} type="button" class=${'o-bucket' + (flash && flash.b === b ? (flash.ok ? ' ok' : ' ko') : '')} disabled=${!cur} aria-label=${'Metti in: ' + name} onClick=${() => tap(b)}>
        <span style=${{ fontSize: nb > 2 ? 15 : 16, lineHeight: '20px', fontWeight: 800, textAlign: 'center', padding: '2px 0 4px' }}>${name}</span>
        ${put.filter(i => st.items[i][1] === b).map(i => html`<span key=${i} class="o-chip2 o-pop">${st.items[i][0]}</span>`)}</button>`)}
    </div>
  </div>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${html`<${Btn} cls="lg" disabled=${!!cur} onClick=${() => onNext()}>Continua<//>`}>${body}<//>`;
}

// "Metti in ordine": le voci sono mescolate, si toccano dalla prima all'ultima
function OrderStep({ st, top, onNext, scrollRef }) {
  const pool = useMemo(() => { const id = st.items.map((x, i) => i); let p = K.flShuffle(id), g = 0; while (p.every((x, i) => x === i) && g++ < 8) p = K.flShuffle(id); return p; }, [st]);
  const [n, setN] = useState(0), [bad, setBad] = useState(null);
  const N = st.items.length, done = n >= N;
  const tap = i => { if (i === n) setN(n + 1); else { setBad(i); setTimeout(() => setBad(null), 420); } };
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:24px">
    <div class="o-col" style="gap:6px"><span class="o-lab">Metti in ordine</span><h1 class="o-q">${st.t}</h1><p class="o-lab">${st.x || 'Tocca le voci dalla prima all\'ultima.'}</p></div>
    <div class="o-col" style="gap:8px;margin-top:16px">${st.items.map((t, k) => html`<div key=${k} class=${'o-rowf' + (k === n - 1 ? ' o-pop' : '')} style=${{ gap: 12, minHeight: 54, padding: '8px 12px', borderRadius: 16, border: k < n ? `2.5px solid ${INK}` : `2.5px dashed ${k === n ? INK : DIM}`, background: k < n ? MENTA : 'transparent' }}>
      <span style=${{ width: 30, height: 30, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: k < n ? INK : 'transparent', border: k < n ? 0 : `2px solid ${k === n ? INK : DIM}`, color: k < n ? '#fff' : k === n ? INK : DIMT, fontSize: 14, fontWeight: 800 }}>${k + 1}</span>
      <span class="o-t" style=${{ fontWeight: 800 }}>${k < n ? t : ''}</span></div>`)}</div>
    ${!done && html`<div class="o-col" style="gap:10px;margin-top:18px" aria-label="Voci da ordinare">${pool.filter(i => i >= n).map(i => html`<button key=${i} type="button" class=${'o-opt' + (bad === i ? ' ko o-shake' : '')} onClick=${() => tap(i)}><span class="x" style="text-align:center">${st.items[i]}</span></button>`)}</div>`}
    ${done && st.after && html`<div class="o-in o-note" style="margin-top:16px">${st.after}</div>`}
  </div>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${html`<${Btn} cls="lg" disabled=${!done} onClick=${() => onNext()}>Continua<//>`}>${body}<//>`;
}

// "Calcola tu": il numero si scrive con il tastierino; vale come una domanda (punti e conteggio delle risposte giuste)
function NumStep({ st, l, top, onNext, repeat, scrollRef }) {
  const [s, setS] = useState(''), [fb, setFb] = useState(null);
  const dec = st.dec || 0;
  const press = k => { if (fb) return; setS(x => k === 'del' ? x.slice(0, -1) : k === ',' ? (dec && x && x.indexOf(',') < 0 ? x + ',' : x)
    : (x.replace(',', '').length >= 8 || (x.indexOf(',') >= 0 && x.split(',')[1].length >= dec)) ? x : x === '0' ? k : x + k); };
  const val = s ? parseFloat(s.replace(',', '.')) : NaN;
  const shown = s ? grp(s.split(',')[0]) + (s.indexOf(',') >= 0 ? ',' + (s.split(',')[1] || '') : '') : '';
  const ok = fb === 'ok', ansDec = (String(st.ans).split('.')[1] || '').length;
  const q = { key: l.key + '~' + st.n, exp: ok ? st.exp : `La risposta è **${withUnit(st.ans, st.unit, ansDec)}**.\n\n${st.exp || ''}` };
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', dec ? ',' : null, '0', 'del'];
  const body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:20px"><div class="o-col" style="gap:6px"><span class="o-lab">Calcola tu</span><${Rich} text=${st.q} cls="q"/></div></div>`;
  const foot = html`<div class="o-col" style="gap:10px">
    <div class="o-numd" aria-live="polite" aria-label=${s ? `Hai scritto ${shown} ${st.unit}` : 'Scrivi il numero'}><span style=${{ color: s ? INK : DIM }}>${shown || '?'}</span><span style="font-size:22px;line-height:28px;font-weight:800">${st.unit}</span></div>
    <div class="o-keys">${keys.map((k, j) => k == null ? html`<span key=${j}></span>` : html`<button key=${j} type="button" class="o-key" aria-label=${k === 'del' ? 'Cancella' : k === ',' ? 'Virgola' : k} onClick=${() => press(k)}>${k === 'del' ? PathIco('M20 6H9l-6 6 6 6h11zM12 10l4 4M16 10l-4 4', 24, 2.2) : k}</button>`)}</div>
    <${Btn} cls="lg" disabled=${isNaN(val) || !!fb} onClick=${() => setFb(Math.abs(val - st.ans) <= (st.tol || 0) + 1e-9 ? 'ok' : 'ko')}>Controlla<//></div>`;
  const over = fb ? html`<${FeedbackSheet} ok=${ok} q=${q} xp=${repeat ? 5 : 10} onNext=${() => onNext({ ok })}/>` : null;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${foot} over=${over}>${body}<//>`;
}
const ISTEPS = { guess: GuessStep, lever: LeverStep, bucket: BucketStep, order: OrderStep, num: NumStep };

// =====================================================================================================
// ALLENATI e TEST
// =====================================================================================================
const fmtClock = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const fmtSpan = s => s < 60 ? `${Math.round(s)} s` : `${Math.floor(s / 60)} min${Math.round(s % 60) ? ' ' + Math.round(s % 60) + ' s' : ''}`;
const AllenaSwitch = ({ on, nav }) => html`<div role="tablist" style="display:inline-flex;padding:3px;background:#fff;border:2px solid ${INK};border-radius:999px">
  ${[['allenati', 'Allenati'], ['test', 'Test']].map(([id, t]) => html`<button key=${id} type="button" role="tab" aria-selected=${on === id ? 'true' : 'false'} onClick=${() => nav.sub(id)}
    style=${{ height: 30, padding: '0 14px', borderRadius: 999, fontSize: 14, fontWeight: 800, background: on === id ? INK : 'transparent', color: on === id ? '#fff' : INK }}>${t}</button>`)}</div>`;
// miniatura di una figurina (album, allenati, profilo)
function Sticker({ l, state, w = 92, onClick, big }) {
  const emoji = lessonEmoji(l), miss = state === 'manca', fade = state === 'sbiadisce', gold = state === 'dorata';
  const tile = miss ? 'transparent' : gold ? GIALLO : fade ? T_GR : (l.course.id === 'basi' ? [AZ, GIALLO, MENTA, PESCA, LILLA][l.course.lessons.indexOf(l) % 5] : [AZ, MENTA, PESCA, LILLA, ROSA][(l.section.num || 0) % 5]);
  const inner = html`<span class="o-col" style=${{ width: w, gap: 6, padding: miss ? 6 : '6px 6px 8px', background: miss ? 'transparent' : '#fff', border: miss ? `2px dashed ${INK}` : `2.5px solid ${fade ? '#8A93A0' : INK}`, borderRadius: 16,
      boxShadow: miss || fade ? 'none' : `3px 3px 0 ${INK}`, transform: miss || fade ? 'none' : `rotate(${[-2, 2, -1, 1][(l.key.length + l.key.charCodeAt(l.key.length - 1)) % 4]}deg)`, color: fade ? DIMT : INK }}>
    <span style=${{ height: big ? 64 : 52, display: 'flex', alignItems: 'center', justifyContent: 'center', background: tile, border: miss ? `2px dashed ${INK}` : `2px solid ${fade ? '#8A93A0' : INK}`, borderRadius: 10, fontSize: emoji && !miss ? 26 : 20, lineHeight: 1, fontWeight: 800, filter: fade ? 'grayscale(1)' : 'none', opacity: fade ? .7 : 1 }}>${miss ? '?' : (emoji || stickerSym(l))}${gold && html`<span style="font-size:12px;margin-left:3px">★</span>`}</span>
    <span style="font-size:12px;line-height:15px;font-weight:700;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:30px;text-align:left;overflow-wrap:anywhere">${l.title}</span></span>`;
  return onClick ? html`<button type="button" onClick=${onClick} aria-label=${`${l.title}: ${state}`}>${inner}</button>` : inner;
}

function AllenatiScreen({ nav }) {
  useS2(); useTick();
  const album = K.albumLoad(), now = Date.now();
  const due = dueLessons(), have = Object.keys(album).length, streak = streakDays();
  const cur = currentCourse() || courses()[1];
  const weak = topicScores(cur)[0], mock = s2get().tests['mock:cfa2'];
  const mins = Math.max(2, Math.round(due.reduce((n, l) => n + (lessonQuestions(l).length ? 1.5 : 0.7), 0)));
  return html`<${Room} color=${MENTA} tab="allenati" go=${nav.tab}
    rally=${html`<${Rally} pose="allena" alt="Rally con la fascia in fronte" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div style="margin-top:-2px"><${AllenaSwitch} on="allenati" nav=${nav}/></div>
      <div class="o-col" style="align-items:flex-start;gap:14px;margin-top:10px;max-width:210px"><h1 class="o-h1">Allenati</h1><${Pill}>${streak > 0 ? `${plural(streak, 'giorno', 'giorni')} di fila` : 'Comincia oggi'}<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px">
      ${due.length > 0 ? html`<div style="display:flex;gap:10px;justify-content:center">${due.slice(0, 3).map(l => html`<${Sticker} key=${l.key} l=${l} state="sbiadisce" w=${96}/>`)}</div>
          <div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">${due.length === 1 ? 'Una figurina sta sbiadendo' : `${due.length} figurine stanno sbiadendo`}</div><div class="o-body o-mut">${due.length === 1 ? 'La ravvivi' : 'Le ravvivi'} in circa ${plural(mins, 'minuto', 'minuti')}.</div></div>
          <${Btn} bg=${MENTA} onClick=${() => nav.go('pratica', { mode: 'ravviva' })}>${due.length === 1 ? 'Ravviva la figurina' : 'Ravviva le figurine'}<//>`
        : have > 0 ? html`<div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">Le tue figurine sono tutte vive</div><div class="o-body o-mut">Nessun ripasso in scadenza. Se vuoi, tieniti in forma con un quiz misto.</div></div>
          <${Btn} bg=${MENTA} onClick=${() => nav.go('pratica', { mode: 'mix' })}>Fai un quiz misto<//>`
        : html`<div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">Qui ripassi quello che impari</div><div class="o-body o-mut">Ogni lezione finita diventa una figurina. Se non la ripassi sbiadisce, e la ravvivi da qui.</div></div>
          <${Btn} bg=${MENTA} onClick=${() => nav.tab('home')}>Vai alle lezioni<//>`}
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <h2 class="o-h2" style="margin-bottom:4px">Oppure scegli tu</h2>
      <${Row} icon=${PathIco(D_TABS.allenati, 22, 2.4)} title="Quiz misto" sub="10 domande dai tuoi percorsi" chev=${true} onClick=${() => nav.go('pratica', { mode: 'mix' })}/>
      <${Row} icon=${Ico(Target, 22)} title="Punti deboli" sub=${weak ? weak.name : 'Rally li trova dalle tue risposte'} chev=${true} onClick=${() => nav.go('deboli')}/>
      <${Row} icon=${Ico(Timer, 22)} title="Simulazione d'esame" sub=${mock ? `CFA Level II, ultimo punteggio ${Math.round(mock.ok / mock.n * 100)}%` : 'CFA Level II, 44 domande a tempo'} chev=${true} last=${true} onClick=${() => nav.go('testInizio', { kind: 'mock', course: 'cfa2' })}/>
    <//>
  <//>`;
}

// sezione consigliata per la prossima verifica: quella con più lezioni fatte tra le non ancora superate
function suggestedTest(c) {
  const tests = s2get().tests; let best = null;
  c.units.forEach(u => u.sections.forEach(sec => { if (allQuestions(sec.lessons).length < 3) return; const t = tests['unit:' + sec.id]; if (t && t.passedEver) return; const d = doneCount(sec.lessons); if (!best || d > best.d) best = { sec, d }; }));
  return best ? best.sec : null;
}
const testableSections = c => c.units.flatMap(u => u.sections).filter(sec => allQuestions(sec.lessons).length >= 3);
function TestScreen({ nav }) {
  useS2();
  const [list, setList] = useState(false);
  const c = currentCourse() || courses()[1], tests = s2get().tests, last = tests._last;
  const sug = suggestedTest(c), secs = testableSections(c), passed = secs.filter(x => tests['unit:' + x.id] && tests['unit:' + x.id].passedEver).length;
  const qn = sug ? Math.min(10, allQuestions(sug.lessons).length) : 0;
  return html`<${Room} color=${MENTA} tab="allenati" go=${nav.tab} headH=${176}
    rally=${html`<${Rally} pose="allena2" alt="Rally pronto per il test" style="position:absolute;right:-10px;top:calc(var(--otop) + 13px)"/>`}
    head=${html`<div style="margin-top:-2px"><${AllenaSwitch} on="test" nav=${nav}/></div>
      <div class="o-col" style="align-items:flex-start;gap:14px;margin-top:14px;max-width:200px"><h1 class="o-h1m">Mettiti alla prova</h1><${Pill}>${last ? `Ultimo test: ${last.ok} su ${last.n}` : 'Nessun test, per ora'}<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px">
      ${sug ? html`<div class="o-col" style="gap:3px"><span class="o-s">Consigliato adesso</span><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em;overflow-wrap:anywhere">Verifica: ${sug.name}</div>
          <div class="o-body o-mut">${c.name}, ${qn} domande, ${Math.round(qn * c.pace / 60)} minuti</div></div>
        <div class="o-rowf" style="gap:12px;padding:10px 14px;background:${T_GIALLO};border-radius:14px"><span style="width:28px;height:28px;flex:none;display:flex;align-items:center;justify-content:center;background:${GIALLO};border:2px solid ${INK};border-radius:9px">${PathIco(D_STAR, 16, 2, INK, INK)}</span><span class="o-t" style="font-size:15px">Se passi, le figurine diventano dorate.</span></div>
        <${Btn} bg=${MENTA} onClick=${() => nav.go('testInizio', { kind: 'unit', course: c.id, section: sug.id })}>Inizia la verifica<//>`
      : html`<div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800">Hai superato tutte le verifiche</div><div class="o-body o-mut">Resta la simulazione d'esame, quando ti senti pronto.</div></div>`}
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <h2 class="o-h2" style="margin-bottom:4px">Tutti i test</h2>
      <${Row} icon=${Ico(Compass, 22)} title="Test di livello" sub="5 domande per capire a che punto sei" chev=${true} onClick=${() => nav.go('testInizio', { kind: 'level', course: c.id })}/>
      <${Row} icon=${Ico(Flag, 22)} title="Verifiche di unità" sub=${`${c.name}: ${passed} ${passed === 1 ? 'superata' : 'superate'} su ${secs.length}`} chev=${true} onClick=${() => setList(true)}/>
      <${Row} icon=${Ico(Timer, 22)} title="Simulazione d'esame" sub="CFA Level II, 44 domande a tempo" tag=${K.isPro ? null : 'Pro'} chev=${true} last=${true} onClick=${() => nav.go('testInizio', { kind: 'mock', course: 'cfa2' })}/>
    <//>
    ${list && html`<${BSheet} onClose=${() => setList(false)} label="Verifiche di unità">
      <h2 class="o-big" style="margin-bottom:6px;flex:none">Verifiche di unità</h2>
      <div class="o-scroll" style="flex:0 1 auto;max-height:64vh">${secs.map((sec, k) => { const t = tests['unit:' + sec.id]; return html`<${Row} key=${sec.id} icon=${t && t.passedEver ? PathIco(D_STAR, 20, 2, INK, INK) : (sec.num || k + 1)} ibg=${t && t.passedEver ? GIALLO : null}
        title=${sec.name} sub=${t ? `${t.passedEver ? 'Superata' : 'Non ancora superata'}, migliore ${t.best} su ${t.n}` : `${Math.min(10, allQuestions(sec.lessons).length)} domande`} chev=${true} last=${k === secs.length - 1} onClick=${() => { setList(false); nav.go('testInizio', { kind: 'unit', course: c.id, section: sec.id }); }}/>`; })}</div>
    <//>`}
  <//>`;
}

function TestIntro({ nav, kind, course, section }) {
  const c = courseById(course) || courses()[1];
  const sec = section ? c.units.flatMap(u => u.sections).find(s => s.id === section) : null;
  const t = useMemo(() => buildTest(kind, c, sec), [kind, course, section]);
  const needPro = kind === 'mock' && !K.isPro;
  const start = () => { if (needPro) return nav.go('pro', { why: 'test' }); nav.replace('testRun', { test: t }); };
  const info = [[EyeOff, 'Niente aiuti: le spiegazioni arrivano alla fine.'], [Flag, 'Puoi segnare una domanda e tornarci dopo.'], [Calculator, 'La calcolatrice resta a portata di mano.']];
  return html`<${Flow} top=${html`<${TopBar} onClose=${nav.back} title=""/>`}
    foot=${html`<p class="o-s" style="text-align:center;margin-bottom:10px;font-size:14px;font-weight:700">${needPro ? 'La simulazione completa è nel piano Pro.' : 'Il tempo parte subito.'}</p><${Btn} cls="lg" bg=${needPro ? GIALLO : MENTA} disabled=${!t.qs.length} onClick=${start}>${needPro ? 'Scopri Pro' : 'Inizia'}<//>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px">
      <${Rally} pose="allena2" w=${196} alt="" style="position:absolute;right:-12px;top:-14px"/>
      <div class="o-col" style="gap:6px;position:relative;min-height:150px;max-width:205px"><span class="o-lab">${c.name}</span><h1 class="o-big" style="overflow-wrap:anywhere">${t.title}</h1></div>
      <div class="o-card s" style="position:relative;padding:6px 18px;margin-top:14px">
        ${[['Domande', t.qs.length], ['Tempo', fmtDur(Math.round(t.secs / 60))], ['Per passare', `${t.pass} giuste`]].map(([a, b], k) => html`<div key=${a} class="o-rowf" style=${{ height: 48, justifyContent: 'space-between', gap: 12, borderBottom: k < 2 ? `2px solid ${SEP}` : 0 }}><span style="font-size:15px;font-weight:600">${a}</span><span style="font-size:18px;font-weight:800">${b}</span></div>`)}
      </div>
      <div class="o-col" style="gap:14px;margin-top:20px">${info.map(([I, tx]) => html`<div key=${tx} class="o-rowf" style="gap:14px"><span class="o-ibox" style="width:36px;height:36px;border-radius:11px">${Ico(I, 18, 2.4)}</span><span class="o-t" style="font-size:15px;font-weight:600">${tx}</span></div>`)}</div>
      ${kind === 'unit' && html`<div class="o-rowf" style="gap:12px;padding:12px 14px;margin-top:20px;background:${T_GIALLO};border-radius:16px"><span style="width:32px;height:32px;flex:none;display:flex;align-items:center;justify-content:center;background:${GIALLO};border:2px solid ${INK};border-radius:10px">${PathIco(D_STAR, 18, 2, INK, INK)}</span><span class="o-t" style="font-size:15px">Se passi, le figurine dell'unità diventano dorate e restano vive più a lungo.</span></div>`}
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
    <div class="o-rowf" style="height:44px;gap:12px;justify-content:space-between"><${IBtn} d=${D_X} onClick=${() => setQuit(true)} label="Esci dal test"/>
      <span class="o-rowf o-mono" role="timer" style=${{ gap: 8, height: 40, padding: '0 16px', background: leftS <= 60 ? ROSA : '#fff', border: `2px solid ${INK}`, borderRadius: 999, boxShadow: `2px 2px 0 ${INK}`, fontSize: 17, fontWeight: 600 }}>${Ico(Clock, 18, 2.4)}${fmtClock(leftS)}</span>
      <span style="min-width:44px;text-align:right;font-size:14px;font-weight:800">${i + 1}/${n}</span></div>
    <div ref=${stripRef} class="o-scroll" style="display:flex;gap:6px;margin:14px -20px 0;padding:0 20px 2px;overflow-x:auto;overflow-y:hidden;flex:none">
      ${t.qs.map((_, k) => html`<button key=${k} type="button" onClick=${() => go(k)} aria-label=${`Domanda ${k + 1}${ans[k] != null ? ', risposta data' : ''}${flags[k] ? ', segnata' : ''}`} aria-current=${k === i ? 'true' : undefined}
        style=${{ width: 30, height: 30, flex: 'none', textAlign: 'center', border: `2px solid ${INK}`, borderRadius: 9, fontSize: 13, fontWeight: 800, background: k === i ? MENTA : flags[k] ? GIALLO : ans[k] != null ? INK : '#fff', color: k !== i && !flags[k] && ans[k] != null ? '#fff' : INK }}>${k + 1}</button>`)}</div>
    <p class="o-s" style="margin-top:8px;font-size:12px">Nero: risposta data. Giallo: segnata per dopo.</p></div>`;
  const foot = html`<div class="o-rowf" style="gap:12px">
    <${IBtn} lg=${true} icon=${Ico(Flag, 22, 2.4)} onClick=${() => setFlags(f => Object.assign({}, f, { [i]: !f[i] }))} label=${flags[i] ? 'Togli il segno' : 'Segna per dopo'} style=${flags[i] ? { background: GIALLO } : null}/>
    <${IBtn} lg=${true} icon=${Ico(Calculator, 24, 2.2)} onClick=${nav.openCalc} label="Calcolatrice"/>
    <div class="o-grow">${cs && tab === 'case' ? html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => setTab('ask')}>Vai alla domanda<//>`
      : i < n - 1 ? html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => go(i + 1)}>Avanti<//>` : html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => (answered < n ? setQuit('send') : submit())}>Consegna<//>`}</div></div>`;
  return html`<${Flow} scrollRef=${scrollRef} top=${top} foot=${foot}
    over=${quit && html`<${BSheet} onClose=${() => setQuit(false)} label="Conferma">
      <h2 class="o-big">${quit === 'send' ? `Mancano ${plural(n - answered, 'risposta', 'risposte')}` : 'Vuoi uscire dal test?'}</h2>
      <p class="o-body o-mut" style="margin-top:6px">${quit === 'send' ? 'Le domande senza risposta contano come sbagliate.' : 'Se esci adesso il test non viene salvato.'}</p>
      <div class="o-col" style="gap:10px;margin-top:16px"><${Btn} cls="lg" bg=${MENTA} onClick=${() => setQuit(false)}>${quit === 'send' ? 'Torno alle domande' : 'Continuo il test'}<//>
        <${Btn} cls="lg flat" bg="#fff" onClick=${quit === 'send' ? submit : nav.back}>${quit === 'send' ? 'Consegna lo stesso' : 'Esci'}<//></div><//>`}>
    <div class="o-test"><${QuestionBody} key=${i} q=${q} label=${cs ? `Domanda ${i + 1}` : null} sel=${ans[i] == null ? null : ans[i]} onSel=${k => setAns(a => Object.assign({}, a, { [i]: k }))} locked=${false} tab=${tab} setTab=${setTab} pose="pensa"/></div>
  <//>`;
}

function TestDone({ nav, test, res, result }) {
  const r = result, t = test, pct = Math.round(r.ok / r.n * 100), wrong = t.qs.map((q, k) => k).filter(k => !(res[k] && res[k].ok));
  const byLesson = t.kind === 'unit';
  return html`<${Room} color=${MENTA} tabs=${false} headH=${150}
    rally=${html`<${Rally} pose=${r.passed ? 'festa-grad' : 'triste'} w=${r.passed ? 210 : 196} alt="" style=${{ position: 'absolute', right: -8, top: `calc(var(--otop) + ${r.passed ? -9 : 5}px)` }}/>`}
    head=${html`<div class="o-col" style="align-items:flex-start;gap:14px;padding-top:6px;max-width:205px"><h1 class="o-h1m">${t.kind === 'level' ? 'Test finito' : r.passed ? 'Verifica superata' : 'Non ancora superata'}</h1>
      ${r.passed && t.kind === 'unit' ? html`<${Pill} bg=${GIALLO}>Figurine dorate<//>` : html`<${Pill}>${r.passed ? `+50 XP` : 'Si riprova quando vuoi'}<//>`}</div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:16px">
      <div class="o-rowf" style="gap:16px"><span style="position:relative;width:84px;height:84px;flex:none;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800">
          <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true" style="position:absolute;left:0;top:0"><circle cx="42" cy="42" r="38" fill="#fff" stroke=${INK} stroke-width="2.5"/><circle cx="42" cy="42" r="30" fill="none" stroke=${T_MENTA} stroke-width="9"/>
            ${pct > 0 && html`<circle cx="42" cy="42" r="30" fill="none" stroke=${r.passed ? MENTA : ROSA} stroke-width="9" stroke-dasharray=${`${(188.5 * pct / 100).toFixed(1)} 188.5`} transform="rotate(-90 42 42)"/>`}<circle cx="42" cy="42" r="24.5" fill="none" stroke=${INK} stroke-width="2"/></svg>
          <span style="position:relative">${pct}%</span></span>
        <div class="o-grow o-col" style="gap:2px"><span class="o-s" style="overflow-wrap:anywhere">${t.section ? t.section.name : t.course.name}</span><span style="font-size:28px;line-height:32px;font-weight:800;letter-spacing:-.02em">${r.ok} su ${r.n}</span>
          <span class="o-s">${r.passed ? `Ne bastavano ${t.pass}.` : `Ne servono ${t.pass}.`} Tempo: ${fmtSpan(r.secs)}.</span></div></div>
      ${wrong.length > 0 && html`<${Btn} bg="#fff" onClick=${() => nav.go('testRev', { test: t, res, wrong })}>${wrong.length === 1 ? 'Rivedi l\'errore' : `Rivedi i ${wrong.length} errori`}<//>`}
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet} pad=${false}>
      <h2 class="o-h2" style="margin-bottom:10px">${byLesson ? 'Domanda per domanda' : 'Per argomento'}</h2>
      ${byLesson ? t.qs.map((q, k) => html`<div key=${k} class="o-rowf" style=${{ gap: 12, minHeight: 44, padding: '6px 0', borderBottom: k < t.qs.length - 1 ? `2px solid ${SEP}` : 0 }}>
            <span style=${{ width: 26, height: 26, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: `2px solid ${INK}`, background: res[k] && res[k].ok ? MENTA : ROSA }}>${res[k] && res[k].ok ? PathIco(D_CHECK, 14, 3.4) : PathIco(D_X, 13, 3.4)}</span>
            <span class="o-grow o-t" style="font-size:15px;overflow-wrap:anywhere">${q.lesson.title}</span></div>`)
        : r.per.map((p, k) => html`<div key=${k} class="o-col" style="gap:6px;margin-bottom:16px"><div class="o-rowf" style="justify-content:space-between;gap:12px"><span class="o-t" style="font-size:15px;overflow-wrap:anywhere">${p.name}</span><span style="flex:none;font-size:15px;font-weight:800">${p.ok} su ${p.n}</span></div>
            <${Bar} pct=${p.ok / p.n * 100} bg=${p.ok / p.n >= 0.7 ? MENTA : p.ok / p.n >= 0.5 ? GIALLO : ROSA} h=${12}/></div>`)}
      <button type="button" class="o-rowf" onClick=${() => nav.go('deboli')} style="gap:12px;width:100%;padding:12px 16px;margin-top:14px;background:${T_GIALLO};border-radius:16px">
        <span class="o-grow o-col" style="gap:1px"><span class="o-t">Allenati sui punti deboli</span><span class="o-s" style="color:${INK}">Rally parte dagli argomenti dove sbagli di più</span></span>${!K.isPro && html`<span class="o-tag">Pro</span>`}${PathIco(D_NEXT, 22, 2.6)}</button>
      <div style="padding:20px 0 max(26px,calc(env(safe-area-inset-bottom) + 10px))"><${Btn} cls="lg" bg=${MENTA} onClick=${nav.back}>Continua<//></div>
    <//>
  <//>`;
}

function TestReview({ nav, test, res, wrong }) {
  const [k, setK] = useState(0);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [k]);
  const qi = wrong[k], q = test.qs[qi], r = res[qi];
  const keys = () => { if (!K.isPro) return nav.go('pro', { why: 'tasti' }); nav.askAI(q, r ? L3[r.sel] : null, 'Mostrami i tasti da premere sulla BA II Plus per risolvere questa domanda, un passo per riga.'); };
  return html`<${Flow} scrollRef=${scrollRef}
    top=${html`<${TopBar} onBack=${nav.back} mid=${html`<span class="o-grow" style="text-align:center;font-size:15px;font-weight:800">Errore ${k + 1} di ${wrong.length}</span>`} right=${html`<span class="o-chip" style="height:32px;font-size:13px">Domanda ${qi + 1}</span>`}/>`}
    foot=${html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => (k < wrong.length - 1 ? setK(k + 1) : nav.back())}>${k < wrong.length - 1 ? 'Prossimo errore' : 'Fine'}<//>`}>
    <div class="o-pad" style="padding-top:18px;padding-bottom:20px">
      <${Rich} text=${q.q} cls="q" lang=${q.lang}/>
      <div style="margin-top:14px"><${Options} q=${q} sel=${r ? r.sel : null} onSel=${() => {}} locked=${true}/></div>
      ${!r && html`<p class="o-s" style="margin-top:8px">Non avevi risposto a questa domanda.</p>`}
      ${q.exp && html`<div style="margin-top:18px;padding:16px;background:${T_BG};border-radius:20px"><div style="font-size:18px;line-height:24px;font-weight:800;margin-bottom:6px">Perché</div><${Rich} text=${q.exp} cls="sm"/></div>`}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px">
        <button type="button" class="o-btn sm flat" style="background:#fff;font-size:15px;padding:6px 8px" onClick=${keys}>Mostrami i tasti${!K.isPro && html`<span class="o-tag">Pro</span>`}</button>
        <button type="button" class="o-btn sm flat" style="background:#fff;font-size:15px" onClick=${() => nav.askAI(q, r ? L3[r.sel] : null)}>Chiedi a Rally</button></div>
      <${ReportLink} q=${q}/>
    </div>
  <//>`;
}
function ReportLink({ q }) {
  const [f, setF] = useState(false);
  return html`<div style="text-align:center;margin-top:6px">${f ? html`<span class="o-link" style="text-decoration:none">Segnalata, grazie</span>`
    : html`<button type="button" class="o-link" onClick=${() => { s2set(s => ({ flags: Object.assign({}, s.flags, { [q.key]: Date.now() }) })); setF(true); }}>Segnala un errore in questa domanda</button>`}</div>`;
}

// ---- allenamento con risposta subito: ravviva le figurine, quiz misto, punti deboli ----
function buildPractice(mode, sectionId) {
  const sh = K.flShuffle, all = courses().flatMap(c => c.lessons);
  if (mode === 'ravviva') return dueLessons().slice(0, 12).map(l => { const qs = lessonQuestions(l); return qs.length ? { q: qs[0], l } : { l, recap: true }; });
  if (mode === 'weak') { const sec = all.map(l => l.section).find(s => s.id === sectionId); const st = K.qStatsLoad(); const qs = allQuestions(sec ? sec.lessons : []);
    return sh(qs).sort((a, b) => ((st[a.key] && st[a.key].last === 0) ? 0 : 1) - ((st[b.key] && st[b.key].last === 0) ? 0 : 1)).slice(0, 8).map(q => ({ q, l: q.lesson })); }
  const started = startedCourses(); const pool = (started.length ? started : courses()).flatMap(c => c.lessons);
  const done = pool.filter(l => isDone(l.key)); const src = allQuestions(done).length >= 5 ? done : pool;
  return sh(allQuestions(src)).slice(0, 10).map(q => ({ q, l: q.lesson }));
}
function PracticeRun({ nav, mode, section }) {
  const items = useMemo(() => buildPractice(mode, section), [mode, section]);
  const [i, setI] = useState(0), [sel, setSel] = useState(null), [fb, setFb] = useState(null), [okN, setOkN] = useState(0), [left, setLeft] = useState(null), [tab, setTab] = useState('case'), [end, setEnd] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; setSel(null); setFb(null); setTab('case'); }, [i]);
  const titles = { ravviva: 'Figurine ravvivate', mix: 'Quiz finito', weak: 'Allenamento finito' };
  if (!items.length || end) {
    const qn = items.filter(x => x.q).length;
    return html`<${Flow} bg=${MENTA} top=${html`<${TopBar} onClose=${nav.back} title=""/>`} foot=${html`<${Btn} cls="lg" bg="#fff" onClick=${nav.back}>Continua<//>`}>
      <div class="o-col o-pad" style="align-items:center;text-align:center;padding-top:6px"><${Rally} pose=${items.length ? 'festeggia' : 'pensa'} w=${250} alt=""/>
        <h1 class="o-pop" style="font-size:40px;line-height:44px;font-weight:800;letter-spacing:-.02em;margin-top:-6px">${items.length ? titles[mode] : 'Niente da ripassare'}</h1>
        <p class="o-body" style="margin-top:8px;max-width:300px">${!items.length ? 'Qui non ci sono domande per ora. Finisci qualche lezione e torna.' : mode === 'ravviva' ? `${plural(items.length, 'figurina è tornata', 'figurine sono tornate')} a colori.` : 'Ogni risposta aggiorna i tuoi punti deboli.'}</p>
        ${items.length > 0 && html`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;margin-top:24px">
          <div class="o-col" style="padding:10px 14px;background:${GIALLO};border:2.5px solid ${INK};border-radius:18px;text-align:left"><span style="font-size:13px;font-weight:700">Punti</span><span style="font-size:22px;line-height:26px;font-weight:800">+${okN * 5} XP</span></div>
          <div class="o-col" style="padding:10px 14px;background:#fff;border:2.5px solid ${INK};border-radius:18px;text-align:left"><span class="o-s">Risposte giuste</span><span style="font-size:22px;line-height:26px;font-weight:800">${okN} su ${qn}</span></div></div>`}
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
    body = html`<div class="o-pad" style="padding-top:18px;padding-bottom:20px"><div class="o-lab" style="margin-bottom:4px">Ripasso veloce</div><h1 style="font-size:28px;line-height:32px;font-weight:800;letter-spacing:-.02em;overflow-wrap:anywhere">${it.l.title}</h1>
      <div class="o-card s o-col" style="padding:8px 18px;margin-top:16px">${(kp.length ? kp : [it.l.note || 'Riapri la lezione per ripassarla.']).map((t, k, a) => html`<div key=${k} class="o-rowf" style=${{ gap: 12, padding: '12px 0', alignItems: 'flex-start', borderBottom: k < a.length - 1 ? `2px solid ${SEP}` : 0 }}>
        <span style="width:24px;height:24px;flex:none;display:flex;align-items:center;justify-content:center;background:${INK};border-radius:50%;color:#fff;margin-top:1px">${PathIco(D_CHECK, 14, 3.4)}</span><${Rich} text=${t} cls="sm" style=${{ fontWeight: 700 }}/></div>`)}</div>
      <div style="text-align:center;margin-top:8px"><button type="button" class="o-link" onClick=${() => nav.go('lezione', { key: it.l.key })}>Riapri la lezione</button></div></div>`;
    foot = html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => { after(true); next(); }}>Ripassata<//>`;
  } else {
    body = html`<${QuestionBody} key=${i} q=${q} label=${`Domanda ${i + 1} di ${items.length}`} sel=${sel} onSel=${setSel} locked=${locked} tab=${tab} setTab=${setTab}/>`;
    foot = html`<div class="o-rowf" style="gap:12px"><${IBtn} lg=${true} icon=${Ico(Calculator, 24, 2.2)} onClick=${nav.openCalc} label="Calcolatrice"/><div class="o-grow">${cs && tab === 'case'
      ? html`<${Btn} cls="lg" bg=${MENTA} onClick=${() => setTab('ask')}>Vai alla domanda<//>` : html`<${Btn} cls="lg" bg=${MENTA} disabled=${sel == null || locked} onClick=${check}>Controlla<//>`}</div></div>`;
  }
  const over = fb === 'ok' ? html`<${FeedbackSheet} ok=${true} q=${q} xp=${5} onNext=${next}/>` : fb === 'ko' ? html`<${FeedbackSheet} ok=${false} q=${q} left=${left} onNext=${next}/>`
    : fb === 'limit' ? html`<${LimitSheet} onPro=${() => { startPro(); setLeft(null); setFb('ko'); }} onSkip=${next}/>` : null;
  return html`<${Flow} scrollRef=${scrollRef} top=${html`<${TopBar} onClose=${nav.back} n=${items.length} i=${i}/>`} foot=${foot} over=${over}><div class="o-test">${body}</div><//>`;
}

function WeakScreen({ nav }) {
  useS2();
  const c = currentCourse() || courses()[1];
  const sc = topicScores(c), weak = sc[0], pro = !!K.isPro;
  const col = s => s >= 80 ? MENTA : s >= 55 ? GIALLO : ROSA;
  const train = () => { if (!pro) return nav.go('pro', { why: 'deboli' }); nav.go('pratica', { mode: 'weak', section: weak.id }); };
  return html`<${Room} color=${MENTA} tabs=${false} headH=${168}
    rally=${html`<${Rally} pose="allena2" alt="" style="position:absolute;right:-10px;top:calc(var(--otop) + 9px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Indietro"/></div>
      <div class="o-col" style="align-items:flex-start;gap:14px;margin-top:22px;max-width:210px"><h1 class="o-h1m">Punti deboli</h1><${Pill} bg=${pro ? '#fff' : GIALLO}>${pro ? 'Dalle tue risposte' : 'Solo con Pro'}<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px">
      ${weak ? html`<div class="o-col" style="gap:3px"><span class="o-s">Il più debole adesso</span>
          <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px"><span style="font-size:24px;line-height:28px;font-weight:800;letter-spacing:-.01em;overflow-wrap:anywhere">${weak.name}</span><span style="flex:none;font-size:15px;font-weight:800">${weak.score} su 100</span></div></div>
        <${Bar} pct=${weak.score} bg=${col(weak.score)} label=${`${weak.score} su 100`}/>
        <p class="o-body o-mut">Hai sbagliato ${weak.n - weak.nok} ${weak.n - weak.nok === 1 ? 'risposta' : 'risposte'} su ${weak.n} in ${weak.unit.name}.</p>
        <${Btn} bg=${MENTA} onClick=${train}>Allenati ${plural(Math.max(4, Math.round(Math.min(8, allQuestions(weak.section.lessons).length) * c.pace / 60)), 'minuto', 'minuti')}<//>`
      : html`<div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800">Ancora niente da misurare</div><div class="o-body o-mut">Rispondi a qualche domanda: Rally guarda dove sbagli e ti dice da dove ripartire.</div></div>
        <${Btn} bg=${MENTA} onClick=${() => nav.go('pratica', { mode: 'mix' })}>Fai un quiz misto<//>`}
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet} pad=${false}>
      <h2 class="o-h2" style="margin-bottom:12px">Tutti gli argomenti</h2>
      ${sc.length === 0 && html`<p class="o-body o-mut">Compaiono qui dopo le prime risposte.</p>`}
      ${sc.map(x => html`<button key=${x.id} type="button" class="o-col" style="gap:6px;margin-bottom:16px;width:100%" onClick=${() => (pro ? nav.go('pratica', { mode: 'weak', section: x.id }) : nav.go('pro', { why: 'deboli' }))}>
        <span class="o-rowf" style="justify-content:space-between;gap:12px;width:100%"><span class="o-t" style="font-size:15px;overflow-wrap:anywhere">${x.name}</span><span style="flex:none;font-size:15px;font-weight:800">${x.score}</span></span>
        <span style="display:block;width:100%"><${Bar} pct=${x.score} bg=${col(x.score)}/></span></button>`)}
      <p class="o-s" style="padding:4px 0 max(30px,calc(env(safe-area-inset-bottom) + 14px))">Le risposte recenti pesano di più. Se non ripassi un argomento, il punteggio torna verso 50.</p>
    <//>
  <//>`;
}

// =====================================================================================================
// SFIDE, AI COACH, PROFILO, ALBUM, IMPOSTAZIONI, PRO, CATALOGO
// =====================================================================================================
const PRO_POINTS = ['Spiegazioni senza limite', 'Tutti i test, con il report per argomento', 'Allenamento sui tuoi punti deboli', 'I tasti della calcolatrice, passo per passo'];
const PRO_YEAR = '34,99 €', PRO_MONTH = '5,99 €';
const PRO_TRIAL_LINE = `7 giorni di prova, poi ${PRO_YEAR} l'anno.`;
function startPro(plan) { s2set({ pro: { since: Date.now(), plan: plan || 'anno' } }); try { K.setIsPro(true); } catch (e) {} }
function stopPro() { s2set({ pro: null }); try { K.setIsPro(false); } catch (e) {} }
const Avatar = ({ ch, bg = '#fff', size = 40 }) => html`<span style=${{ width: size, height: size, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, border: `2px solid ${INK}`, borderRadius: '50%', fontSize: size * 0.4, fontWeight: 800 }}>${ch}</span>`;

function SfideScreen({ nav }) {
  useS2(); useTick();
  const [skip, setSkip] = useState(0);
  const lg = league(), me = lg.me;
  const rival = RIVALS[(RIVALS.indexOf(duelRival()) + skip) % RIVALS.length];
  const above = lg.rows[me.pos - 2];
  const ord = n => `${n}°`;
  const init = (userName() || 'T')[0].toUpperCase();
  return html`<${Room} color=${PESCA} tab="sfide" go=${nav.tab}
    rally=${html`<${Rally} pose="sfida" alt="Rally con la maschera" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div class="o-col" style="align-items:flex-start;gap:14px;padding-top:4px;max-width:210px"><h1 class="o-h1">Sfide</h1><${Pill}>Sei ${ord(me.pos)} in lega<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px;align-items:center;text-align:center">
      <div class="o-rowf" style="gap:14px;align-items:flex-start">
        <span class="o-col" style="align-items:center;gap:6px"><${Avatar} ch=${init} bg=${PESCA} size=${56}/><span class="o-s" style="color:${INK};font-weight:700">Tu</span></span>
        <span style="margin-top:14px;padding:3px 12px;background:${INK};color:#fff;border-radius:999px;font-size:14px;font-weight:800;transform:rotate(-4deg)">contro</span>
        <span class="o-col" style="align-items:center;gap:6px"><${Avatar} ch=${rival[0]} size=${56}/><span class="o-s" style="color:${INK};font-weight:700">${rival}</span></span></div>
      <div class="o-col" style="gap:4px"><div style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">${rival} ti ha sfidato</div><div class="o-body o-mut">5 domande dai tuoi percorsi.<br/>Vince chi ne fa giuste di più.</div></div>
      <div class="o-rowf" style="gap:10px;width:100%"><div class="o-grow"><${Btn} bg=${PESCA} onClick=${() => nav.go('sfida', { rival })}>Accetta la sfida<//></div>
        <button type="button" class="o-btn flat" style="width:auto;background:#fff" onClick=${() => setSkip(skip + 1)}>Dopo</button></div>
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:8px"><h2 class="o-h2">${lg.name}</h2><span class="o-lab">Finisce domenica</span></div>
      ${lg.rows.map(r => html`<div key=${r.name} class="o-rowf" style=${Object.assign({ gap: 12, height: 54, padding: '0 10px', borderRadius: 16 }, r.me ? { background: T_PESCA, border: `2.5px solid ${INK}` } : { border: '2.5px solid transparent' })}>
        <span style="width:22px;font-size:15px;font-weight:800;text-align:center">${r.pos}</span><${Avatar} ch=${r.me ? init : r.name[0]} bg=${r.me ? PESCA : '#fff'} size=${36}/>
        <span class="o-grow" style="font-size:17px;font-weight:700">${r.name}</span><span style="font-size:16px;font-weight:800">${fmtInt(r.xp)} XP</span></div>`)}
      <p class="o-s" style="margin-top:12px">${above ? `Ti mancano ${fmtInt(above.xp - me.xp + 1)} XP per superare ${above.name}.` : 'Sei in testa alla lega.'} Lega di prova: per ora gli altri sono avversari simulati.</p>
    <//>
  <//>`;
}
function duelQuestions() { const st = startedCourses(); const pool = (st.length ? st : courses()).flatMap(c => c.lessons); const done = pool.filter(l => isDone(l.key)); const src = allQuestions(done).length >= 5 ? done : pool; return K.flShuffle(allQuestions(src)).slice(0, 5); }
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
  if (!q) return html`<${Flow} top=${html`<${TopBar} onClose=${nav.back} title="Sfida"/>`}><p class="o-pad o-body" style="padding-top:20px">Per sfidare qualcuno serve almeno una lezione con una domanda.</p><//>`;
  const left = Math.max(0, Math.ceil(lim - el)), a = mine.filter(Boolean).length, b = his.filter(Boolean).length;
  const dot = (v, k) => html`<i key=${k} style=${{ width: 12, height: 12, borderRadius: '50%', border: `2px solid ${INK}`, background: v === true ? INK : v === false ? '#fff' : 'transparent', borderStyle: v == null ? 'dashed' : 'solid' }}></i>`;
  return html`<${Flow} bg="#fff" top=${html`<div style="flex:none;background:${PESCA};border-bottom:2.5px solid ${INK};padding-bottom:58px;position:relative">
      <${Rally} pose="sfida" w=${110} alt="" style="position:absolute;right:6px;top:calc(var(--otop) - 7px)"/>
      <${TopBar} onClose=${nav.back} title=${'Sfida con ' + rival}/></div>
    <div class="o-pad" style="flex:none;margin-top:-46px;position:relative"><div class="o-card s" style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:12px 16px">
      <span class="o-col" style="align-items:center;gap:2px"><${Avatar} ch=${init} bg=${PESCA}/><span class="o-s">Tu</span><span style="font-size:30px;line-height:32px;font-weight:800">${a}</span></span>
      <span class="o-col" style="align-items:center;gap:6px"><span class="o-s" style="font-weight:700">Domanda ${i + 1} di ${n}</span>
        <span class="o-mono" role="timer" style=${{ padding: '3px 14px', background: left <= 5 ? ROSA : T_PESCA, border: `2px solid ${INK}`, borderRadius: 999, fontSize: 17, fontWeight: 600 }}>${fmtClock(left)}</span>
        <span class="o-rowf" style="gap:5px">${Array.from({ length: n }, (_, k) => dot(mine[k], k))}</span></span>
      <span class="o-col" style="align-items:center;gap:2px"><${Avatar} ch=${rival[0]} bg=${LILLA}/><span class="o-s">${rival}</span><span style="font-size:30px;line-height:32px;font-weight:800">${b}</span></span></div></div>`}
    foot=${html`<${Btn} cls="lg" bg=${PESCA} disabled=${sel == null || show} onClick=${confirm}>Conferma<//>`}>
    <div class="o-duel o-pad" style="padding-top:14px;padding-bottom:16px">
      <div style="display:flex;justify-content:flex-end;min-height:28px">${(show || el >= bot.t) && html`<span class="o-fade" style="padding:2px 12px;background:${MENTA};border:2px solid ${INK};border-radius:999px;font-size:13px;line-height:18px;font-weight:800">${rival} ha già risposto</span>`}</div>
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
    <h1 class="o-pop" style="font-size:44px;line-height:48px;font-weight:800;letter-spacing:-.02em;margin-top:22px">${win ? 'Hai vinto!' : draw ? 'Pareggio' : 'Stavolta no'}</h1>
    <div class="o-rowf" style="gap:12px;margin-top:18px;padding:12px 20px;background:#fff;border:2.5px solid ${INK};border-radius:22px;box-shadow:5px 5px 0 ${INK};transform:rotate(-2deg)">
      <${Avatar} ch=${init} bg=${PESCA}/><span style="font-size:15px;font-weight:700">Tu</span><span style="font-size:38px;line-height:40px;font-weight:800;letter-spacing:-.02em;margin:0 6px">${a} a ${b}</span><span style="font-size:15px;font-weight:700">${rival}</span><${Avatar} ch=${rival[0]} bg=${LILLA}/></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;margin-top:24px">
      <div class="o-col" style="align-items:center;padding:10px;background:${GIALLO};border:2.5px solid ${INK};border-radius:18px"><span style="font-size:20px;line-height:24px;font-weight:800">+${xp} XP</span><span style="font-size:13px;font-weight:700">${win ? 'per la vittoria' : draw ? 'per il pareggio' : 'per averci provato'}</span></div>
      <div class="o-col" style="align-items:center;padding:10px;background:#fff;border:2.5px solid ${INK};border-radius:18px"><span style="font-size:20px;line-height:24px;font-weight:800">${lg.me.pos}° posto</span><span style="font-size:13px;font-weight:700">in ${lg.name}</span></div></div>
    <div style="flex:1 1 16px;min-height:16px"></div>
    <div class="o-col" style="gap:12px;width:100%"><${Btn} cls="lg" bg="#fff" onClick=${() => nav.replace('sfida', { rival })}>Rivincita<//>
      <${Btn} cls="lg ink" onClick=${() => setMsg(true)}>${Ico(Link2, 20)} Sfida un amico con un link<//></div>
    ${msg && html`<p class="o-s o-fade" style="text-align:center;margin-top:8px;color:${INK}">Le sfide con gli amici arrivano insieme agli account online.</p>`}
    <div style="padding:2px 0 max(22px,calc(env(safe-area-inset-bottom) + 8px))"><button type="button" class="o-link" onClick=${nav.back}>Torna alle sfide</button></div>
  </div></div></div>`;
}

// ---- AI Coach: la chat è quella dell'app, dentro la nuova cornice ----
const COACH_ASK = ['Spiegami il residual income da zero', 'Differenza tra FCFF e FCFE', 'Come si calcola il VaR parametrico?', 'Interrogami con domande A, B, C'];
function CoachScreen({ nav }) {
  const [hist, setHist] = useState(false), [pending, setPending] = useState(null);
  const chats = K.chats || [], active = chats.find(c => c.id === K.activeChatId);
  const Chat = K.AiChatModal;
  const newChat = first => {
    const now = new Date().toISOString(), nm = userName();
    const c = { id: `chat_${Date.now()}`, title: first ? first.slice(0, 40) : 'Nuova conversazione', createdAt: now, updatedAt: now, messages: [{ role: 'assistant', content: `Ciao${nm ? ' ' + nm : ''}! Chiedimi un concetto da spiegare da zero, un esercizio o una domanda d'esame.`, timestamp: now }] };
    K.setChats(prev => [c, ...prev].slice(0, 50)); K.setActiveChatId(c.id); setPending(first ? { id: c.id, text: first } : null); setHist(false);
  };
  const fmt = d => { try { return new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }); } catch (e) { return ''; } };
  return html`<${Room} color=${LILLA} tab="coach" go=${nav.tab} headH=${140}
    rally=${html`<${Rally} pose="coach" alt="Rally con le cuffie" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div class="o-col" style="align-items:flex-start;gap:14px;padding-top:4px;max-width:210px"><h1 class="o-h1">AI Coach</h1>
      <div class="o-rowf" style="gap:8px"><button type="button" onClick=${() => newChat()} aria-label="Nuova conversazione"><${Pill}>${active ? 'Nuova chat' : 'Chiedimi tutto'}<//></button>
        ${chats.length > 0 && html`<button type="button" class="o-ib" style="width:34px;height:34px;border-radius:11px" onClick=${() => setHist(true)} aria-label="Conversazioni">${Ico(History, 17, 2.4)}</button>`}</div></div>`}>
    <${Sheet} pad=${false} style=${{ paddingTop: 18 }}>
      ${active && Chat ? html`<div class="o-coach"><${Chat} key=${active.id} variant="page" chatId=${active.id} chats=${chats} setChats=${K.setChats} onClose=${() => {}} initialMessage=${pending && pending.id === active.id ? pending.text : null} onInitialSent=${() => setPending(null)}/></div>`
        : html`<div class="o-col" style="gap:10px;padding-bottom:140px"><h2 class="o-h2">Cosa vuoi capire oggi?</h2><p class="o-body o-mut" style="margin-bottom:6px">Concetti spiegati da zero, esercizi passo per passo, domande come all'esame.</p>
          ${COACH_ASK.map(t => html`<button key=${t} type="button" class="o-rowf" onClick=${() => newChat(t)} style="gap:12px;width:100%;min-height:54px;padding:8px 14px;border:2.5px solid ${INK};border-radius:18px;font-size:15px;line-height:20px;font-weight:700"><span class="o-grow">${t}</span>${PathIco(D_NEXT, 20, 2.6)}</button>`)}
          <div style="margin-top:8px"><${Btn} bg=${LILLA} onClick=${() => newChat()}>Scrivi tu la domanda<//></div></div>`}
    <//>
    ${hist && html`<${BSheet} onClose=${() => setHist(false)} label="Conversazioni"><h2 class="o-big" style="margin-bottom:6px;flex:none">Conversazioni</h2>
      <div class="o-scroll" style="flex:0 1 auto;max-height:60vh">${chats.map((c, k) => html`<${Row} key=${c.id} icon=${PathIco(D_TABS.coach, 20, 2.4)} ibg=${c.id === K.activeChatId ? LILLA : null} title=${(c.isQuizChat ? 'Domanda: ' : '') + (c.title || 'Conversazione')} sub=${fmt(c.updatedAt || c.createdAt)}
        last=${k === chats.length - 1} onClick=${() => { K.setActiveChatId(c.id); setHist(false); }} right=${html`<span role="button" tabindex="0" aria-label="Elimina" onClick=${e => { e.stopPropagation(); K.deleteChat(c.id, e); }} style="width:36px;height:36px;display:flex;align-items:center;justify-content:center">${Ico(Trash2, 18)}</span>`}/>`)}</div><//>`}
  <//>`;
}

// ---- profilo e album ----
const allStickers = () => courses().flatMap(c => c.lessons);
function ProfiloScreen({ nav }) {
  useS2(); useTick();
  const album = K.albumLoad(), now = Date.now(), all = allStickers(), have = all.filter(l => album[l.key]);
  const recent = have.slice().sort((a, b) => album[b.key].t - album[a.key].t).slice(0, 8), cur = currentCourse();
  const name = userName() || 'Profilo', lg = league();
  const cells = Array.from({ length: 8 }, (_, k) => recent[k] || null);
  return html`<${Room} color=${ROSA} tab="profilo" go=${nav.tab} headH=${140}
    rally=${html`<${Rally} pose="moneta" alt="Rally con una moneta" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div class="o-col" style="align-items:flex-start;gap:14px;padding-top:4px;max-width:210px"><h1 class="o-h1" style=${name.length > 8 ? { fontSize: 34, lineHeight: '36px' } : null}>${name}</h1><${Pill}>${lg.name}<//></div>`}>
    <div class="o-pad" style="position:relative;z-index:1"><div class="o-card o-col" style="gap:14px">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px"><span style="font-size:22px;line-height:26px;font-weight:800;letter-spacing:-.01em">Il tuo album</span><span class="o-lab">${have.length} figurine su ${all.length}</span></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${cells.map((l, k) => { const st = l ? stickerState(l, album, now) : 'manca', em = l && lessonEmoji(l);
        return html`<span key=${k} style=${{ aspectRatio: '1 / 0.92', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, fontSize: em ? 24 : 17, fontWeight: 800, overflow: 'hidden',
          background: !l ? 'transparent' : st === 'dorata' ? GIALLO : st === 'sbiadisce' ? T_GR : ROSA, border: l ? `2.5px solid ${INK}` : `2px dashed ${INK}`, filter: st === 'sbiadisce' ? 'grayscale(1)' : 'none' }}>${l ? (em || stickerSym(l)) : '?'}</span>`; })}</div>
      <${Btn} bg=${ROSA} onClick=${() => nav.go('album')}>Apri l'album<//>
    </div></div>
    <div style="height:24px;flex:none"></div>
    <${Sheet}>
      <${Stats3} items=${[[streakDays(), 'giorni di fila'], [fmtInt((K.stats && K.stats.xp) || 0), 'punti XP'], [(cur ? coursePct(cur) : 0) + '%', cur ? 'di ' + cur.name : 'del percorso']]}/>
      <div style="height:2px;background:${SEP};margin:18px 0 0"></div>
      <${Row} icon=${Ico(Crown, 22)} ibg=${GIALLO} title="FinLearn Pro" sub=${K.isPro ? 'Attivo' : 'Provalo gratis per 7 giorni'} chev=${true} onClick=${() => nav.go('pro')}/>
      <${Row} icon=${Ico(SlidersHorizontal, 22)} title="Impostazioni" sub="Obiettivo, account e grafica" chev=${true} last=${true} onClick=${() => nav.go('impostazioni')}/>
    <//>
  <//>`;
}
function AlbumScreen({ nav }) {
  useS2(); useTick();
  const album = K.albumLoad(), now = Date.now(), all = allStickers(), have = all.filter(l => album[l.key]).length;
  const groups = courses().flatMap(c => c.units.map(u => ({ id: u.id, name: u.name.replace('Management', 'Mgmt'), lessons: unitLessons(u) })));
  const firstWith = groups.find(g => g.lessons.some(l => album[l.key])) || groups[0];
  const [gid, setGid] = useState(firstWith.id);
  const g = groups.find(x => x.id === gid) || groups[0], due = dueLessons();
  const leg = [[AZ, 'solid', 'Viva'], [T_GR, 'solid', 'Sbiadisce'], [GIALLO, 'solid', 'Dorata'], ['transparent', 'dashed', 'Manca']];
  return html`<${Room} color=${ROSA} tabs=${false} headH=${150}
    rally=${html`<${Rally} pose="moneta" w=${200} alt="" style="position:absolute;right:-10px;top:calc(var(--otop) + 4px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Indietro"/></div>
      <div class="o-col" style="align-items:flex-start;gap:12px;margin-top:14px;max-width:210px"><h1 class="o-h1">Album</h1><${Pill}>${have} figurine su ${all.length}<//></div>`}>
    <${Sheet} pad=${false} style=${{ paddingTop: 18 }}>
      <div class="o-scroll" style="display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;margin:0 -23px;padding:0 23px 2px;flex:none">${groups.map(x => html`<button key=${x.id} type="button" class=${'o-chip' + (x.id === gid ? ' on' : '')} onClick=${() => setGid(x.id)}>${x.name}</button>`)}</div>
      <div class="o-rowf" style="gap:14px;margin:14px 0 14px;flex-wrap:wrap">${leg.map(([bg, bs, t]) => html`<span key=${t} class="o-rowf" style="gap:6px;font-size:13px;font-weight:700;color:${MUT}"><i style=${{ width: 13, height: 13, background: bg, border: `2px ${bs} ${INK}`, borderRadius: 4 }}></i>${t}</span>`)}</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px 12px;justify-items:center;padding-bottom:${due.length ? 120 : 40}px">
        ${g.lessons.map(l => html`<${Sticker} key=${l.key} l=${l} state=${stickerState(l, album, now)} w=${104} big=${true} onClick=${() => nav.go('lezione', { key: l.key })}/>`)}</div>
    <//>
    ${due.length > 0 && html`<div class="o-foot" style="position:absolute;left:0;right:0;bottom:0;background:linear-gradient(rgba(255,255,255,0),#fff 28%);padding-top:26px"><${Btn} cls="lg" bg=${ROSA} onClick=${() => nav.go('pratica', { mode: 'ravviva' })}>${due.length === 1 ? 'Ravviva quella che sbiadisce' : `Ravviva le ${due.length} che sbiadiscono`}<//></div>`}
  <//>`;
}

// ---- impostazioni ----
function downloadData() {
  try {
    const out = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^(finlearn_|fl2_)/.test(k) && k !== 'finlearn_users') out[k] = localStorage.getItem(k); }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' })); a.download = `finlearn-dati-${dayKey()}.json`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  } catch (e) {}
}
function SettingsScreen({ nav }) {
  const s = useS2(), set = s.settings, u = K.user || {};
  const [sheet, setSheet] = useState(null), [nm, setNm] = useState(userName());
  const upd = p => s2set(x => ({ settings: Object.assign({}, x.settings, p) }));
  const flags = Object.keys(s.flags || {}).length;
  const access = u.guest ? 'Ospite' : u.provider === 'apple' ? 'Con Apple' : /^google_/.test(u.uid || '') || u.provider === 'google' ? 'Con Google' : 'Con l\'email';
  const H = t => html`<h2 class="o-h2" style="font-size:18px;margin:26px 0 2px">${t}</h2>`;
  const R = (label, value, onClick, right, last) => html`<${onClick ? 'button' : 'div'} type=${onClick ? 'button' : undefined} class=${'o-row' + (last ? ' last' : '')} style="min-height:52px;gap:10px" onClick=${onClick}>
    <span class="o-grow o-t" style="font-size:16px">${label}</span>${value != null && html`<span style="font-size:15px;font-weight:600;color:${MUT};text-align:right">${value}</span>`}${right || (onClick && PathIco(D_NEXT, 20, 2.6))}<//>`;
  const wipe = () => { try { const uid = u.uid; ['fl2_state', 'finlearn_los_progress', 'finlearn_album', 'finlearn_album_v1', 'finlearn_activity', 'finlearn_quiz_stats', 'finlearn_exam_date', 'finlearn_data_' + uid, 'finlearn_chats_' + uid].forEach(k => localStorage.removeItem(k)); } catch (e) {} K.onLogout(); setTimeout(() => { try { location.reload(); } catch (e) {} }, 50); };
  return html`<${Flow} top=${html`<${TopBar} onBack=${nav.back} mid=${html`<h1 class="o-grow" style="font-size:28px;line-height:32px;font-weight:800;letter-spacing:-.02em">Impostazioni</h1>`}/>`}>
    <div class="o-pad" style="padding-bottom:max(30px,calc(env(safe-area-inset-bottom) + 14px))">
      ${H('Studio')}
      ${R('Obiettivo al giorno', `${set.goalMin} minuti`, () => setSheet('goal'))}
      ${R('Promemoria', 'In arrivo', null)}
      ${R('Lingua delle spiegazioni', set.lang, () => setSheet('lang'))}
      ${R('Domande d\'esame', 'In inglese, come all\'esame', null, null, true)}
      ${H('Account')}
      ${R('Nome', userName() || 'Aggiungi', () => setSheet('name'))}
      ${R('Accesso', access, () => (u.guest ? nav.go('salva') : setSheet('account')))}
      ${R('Piano', K.isPro ? 'Pro' : 'Gratis', () => nav.go('pro'), K.isPro ? null : html`<span class="o-tag" style="padding:3px 11px;font-size:13px">Passa a Pro</span>`)}
      ${R('Scarica i miei dati', null, downloadData)}
      ${R('Elimina l\'account', null, () => setSheet('del'), null, true)}
      ${H('Aspetto')}
      ${R('Grafica', 'In ordine', () => setSheet('ui'), null, true)}
      ${H('Aiuto')}
      ${R('Domande segnalate', flags ? String(flags) : 'Nessuna', flags ? () => setSheet('flags') : null)}
      ${R('Regole e privacy', null, () => setSheet('priv'), null, true)}
      <p class="o-s" style="text-align:center;margin-top:26px">FinLearn 2.0 · ${K.VERSION || ''}</p>
    </div>
    ${sheet === 'goal' && html`<${BSheet} onClose=${() => setSheet(null)} label="Obiettivo"><h2 class="o-big">Quanto tempo hai al giorno?</h2>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px">${[5, 10, 20].map(m => html`<button key=${m} type="button" class="o-col" onClick=${() => { upd({ goalMin: m }); setSheet(null); }} style=${{ alignItems: 'center', padding: '12px 0', border: `2.5px solid ${INK}`, borderRadius: 18, background: set.goalMin === m ? AZ : '#fff', boxShadow: set.goalMin === m ? `3px 3px 0 ${INK}` : 'none' }}><span style="font-size:26px;line-height:30px;font-weight:800">${m}</span><span class="o-s" style="color:${INK}">minuti</span></button>`)}</div><//>`}
    ${sheet === 'lang' && html`<${BSheet} onClose=${() => setSheet(null)} label="Lingua"><h2 class="o-big" style="margin-bottom:6px">Lingua delle spiegazioni</h2>
      ${[['Italiano', true], ['English', false], ['Français', false], ['Español', false], ['Deutsch', false], ['中文', false]].map(([l, ok], k) => html`<div key=${l} class="o-row" style=${{ minHeight: 50, borderBottom: k < 5 ? `2px solid ${SEP}` : 0 }}><span class="o-grow o-t" style=${{ color: ok ? INK : DIMT }}>${l}</span>${ok ? PathIco(D_CHECK, 22, 3) : html`<span class="o-s">In arrivo</span>`}</div>`)}<//>`}
    ${sheet === 'name' && html`<${BSheet} onClose=${() => setSheet(null)} label="Nome"><h2 class="o-big">Come ti chiami?</h2>
      <input class="o-inp" value=${nm} onChange=${e => setNm(e.target.value)} placeholder="Il tuo nome" maxlength="24" aria-label="Nome" style="margin-top:16px"/>
      <div style="margin-top:14px"><${Btn} cls="lg" onClick=${() => { s2set({ name: firstName(nm) }); setSheet(null); }}>Salva<//></div><//>`}
    ${sheet === 'account' && html`<${BSheet} onClose=${() => setSheet(null)} label="Account"><h2 class="o-big">${u.displayName || 'Account'}</h2><p class="o-body o-mut" style="margin-top:4px">${u.email || ''}</p>
      <p class="o-body" style="margin-top:12px">Versione di prova: i tuoi dati restano su questo dispositivo.</p>
      <div style="margin-top:16px"><${Btn} cls="lg flat" bg="#fff" onClick=${() => { setSheet(null); K.onLogout(); }}>${Ico(LogOut, 20)} Esci dall'account<//></div><//>`}
    ${sheet === 'ui' && html`<${BSheet} onClose=${() => setSheet(null)} label="Grafica"><h2 class="o-big">Grafica dell'app</h2>
      <p class="o-body o-mut" style="margin-top:6px">Stai usando la grafica nuova, "In ordine". Quella di prima resta disponibile, con gli stessi progressi.</p>
      <div class="o-col" style="gap:10px;margin-top:16px"><${Btn} cls="lg" onClick=${() => setSheet(null)}>Tengo quella nuova<//><${Btn} cls="lg flat" bg="#fff" onClick=${() => K.setUi('figurine')}>Torna alla grafica precedente<//></div><//>`}
    ${sheet === 'flags' && html`<${BSheet} onClose=${() => setSheet(null)} label="Domande segnalate"><h2 class="o-big" style="flex:none">Domande segnalate</h2><p class="o-body o-mut" style="margin:6px 0 8px;flex:none">Finiscono anche nel file di "Scarica i miei dati".</p>
      <div class="o-scroll" style="flex:0 1 auto;max-height:50vh">${Object.keys(s.flags || {}).map(k => { const l = lessonByKey(k.split('#')[0]); return html`<div key=${k} class="o-row" style="min-height:48px"><span class="o-grow o-t" style="font-size:15px">${l ? l.title : k}</span><span class="o-s">${l && l.code ? l.code : ''}</span></div>`; })}</div>
      <div style="margin-top:12px;flex:none"><${Btn} cls="lg flat" bg="#fff" onClick=${() => { s2set({ flags: {} }); setSheet(null); }}>Svuota l'elenco<//></div><//>`}
    ${sheet === 'priv' && html`<${BSheet} onClose=${() => setSheet(null)} label="Regole e privacy"><h2 class="o-big">Regole e privacy</h2>
      <div class="o-col o-body" style="gap:10px;margin-top:10px"><p>I tuoi progressi, le risposte e le conversazioni sono salvati solo su questo dispositivo.</p><p>Niente pubblicità e nessun dato venduto.</p><p>FinLearn non è affiliata a CFA Institute. CFA® e Chartered Financial Analyst® sono marchi di CFA Institute.</p></div>
      <div style="margin-top:16px"><${Btn} cls="lg" onClick=${() => setSheet(null)}>Ho capito<//></div><//>`}
    ${sheet === 'del' && html`<${BSheet} onClose=${() => setSheet(null)} label="Elimina l'account"><h2 class="o-big">Eliminare tutto?</h2><p class="o-body o-mut" style="margin-top:6px">Cancelli da questo dispositivo progressi, figurine, punti e conversazioni. Non si può annullare.</p>
      <div class="o-col" style="gap:10px;margin-top:16px"><${Btn} cls="lg" onClick=${() => setSheet(null)}>Tengo tutto<//><${Btn} cls="lg flat" bg=${ROSA} onClick=${wipe}>${Ico(Trash2, 20)} Elimina account e dati<//></div><//>`}
  <//>`;
}

// ---- FinLearn Pro ----
function ProScreen({ nav }) {
  useS2();
  const [plan, setPlan] = useState('anno');
  const pro = !!K.isPro;
  const card = (id, name, price, sub, tag) => html`<button type="button" aria-pressed=${plan === id ? 'true' : 'false'} onClick=${() => setPlan(id)} class="o-col" style=${{ position: 'relative', padding: '12px 14px 12px', gap: 2, border: `2.5px solid ${INK}`, borderRadius: 20, background: plan === id ? '#fff' : T_GIALLO, boxShadow: plan === id ? `4px 4px 0 ${INK}` : 'none' }}>
    ${tag && html`<span style="position:absolute;right:-6px;top:-13px;padding:2px 10px;background:#fff;border:2px solid ${INK};border-radius:999px;font-size:12px;line-height:16px;font-weight:800;transform:rotate(4deg)">${tag}</span>`}
    <span style="font-size:15px;font-weight:800">${name}</span><span style="font-size:24px;line-height:28px;font-weight:800;letter-spacing:-.01em">${price}</span><span class="o-s">${sub}</span></button>`;
  return html`<div class="o-scr" style="background:repeating-conic-gradient(from 5deg at 50% 200px, #FFE066 0deg 10deg, ${GIALLO} 10deg 20deg)"><div class="o-scroll"><div class="o-col" style="min-height:100%">
    <${TopBar} onClose=${nav.back} title=""/>
    <div class="o-col o-pad" style="align-items:center;flex:1 0 auto">
      <div style="width:200px;height:200px;flex:none;margin-top:-28px;background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:5px 5px 0 ${INK};display:flex;align-items:flex-end;justify-content:center;overflow:hidden"><${Rally} pose="re" w=${196} alt="Rally con la corona" style="margin-bottom:-14px"/></div>
      <h1 style="font-size:42px;line-height:46px;font-weight:800;letter-spacing:-.02em;margin-top:16px">FinLearn Pro</h1>
      <p style="font-size:16px;line-height:22px;font-weight:700;margin-top:4px">${pro ? 'È attivo. Buono studio.' : 'Tutta la finanza, senza limiti.'}</p>
      <div class="o-card s" style="width:100%;padding:4px 18px;margin-top:18px">${PRO_POINTS.map((t, k) => html`<div key=${t} class="o-rowf" style=${{ gap: 12, minHeight: 46, padding: '6px 0', borderBottom: k < PRO_POINTS.length - 1 ? `2px solid ${SEP}` : 0 }}>
        <span style="width:24px;height:24px;flex:none;display:flex;align-items:center;justify-content:center;background:${INK};border-radius:50%;color:#fff">${PathIco(D_CHECK, 14, 3.4)}</span><span class="o-t">${t}</span></div>`)}</div>
      ${!pro && html`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;margin-top:22px">${card('anno', 'Annuale', PRO_YEAR, '2,92 € al mese', 'Consigliato')}${card('mese', 'Mensile', PRO_MONTH, 'al mese')}</div>`}
      <div style="flex:1 1 16px;min-height:16px"></div>
      <div style="width:100%">${pro ? html`<${Btn} cls="lg flat" bg="#fff" onClick=${() => { stopPro(); }}>Torna al piano gratis<//>`
        : html`<${Btn} cls="lg ink" onClick=${() => { startPro(plan); nav.back(); nav.toast('Pro è attivo. Nessun addebito: i pagamenti non sono ancora collegati.'); }}>Prova gratis per 7 giorni<//>`}</div>
      <p style="font-size:14px;line-height:20px;font-weight:700;text-align:center;padding:10px 0 max(22px,calc(env(safe-area-inset-bottom) + 8px))">${pro ? 'Versione di prova dell\'app: Pro si attiva senza pagamento.' : `Poi ${plan === 'anno' ? PRO_YEAR + ' l\'anno' : PRO_MONTH + ' al mese'}. Per ora nessun addebito: i pagamenti non sono ancora collegati.`}</p>
    </div></div></div></div>`;
}

// ---- catalogo e scheda di un percorso ----
const CAT_ICON = { wallet: Wallet, trend: TrendingUp, pie: PieChart };
function CatalogScreen({ nav }) {
  const [f, setF] = useState('all');
  const ready = courses(), groups = [['basi', 'Finanza di base'], ['invest', 'Investire'], ['cert', 'Certificazioni']];
  const chips = [['all', 'Tutti'], ['basi', 'Basi'], ['invest', 'Investire'], ['cert', 'Esami']];
  const tile = c => { const isReady = !!c.ready, I = CAT_ICON[c.icon];
    return html`<button key=${c.id} type="button" disabled=${!isReady} onClick=${() => nav.go('scheda', { course: c.id })} class="o-col" style=${{ gap: 8, padding: 8, minHeight: c.group === 'cert' ? 0 : 132, borderRadius: 18, background: isReady ? '#fff' : T_BG, border: isReady ? `2.5px solid ${INK}` : `2px dashed ${INK}`, boxShadow: isReady ? `4px 4px 0 ${INK}` : 'none' }}>
      ${c.group !== 'cert' && html`<span style=${{ height: 52, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isReady ? (c.color || AZ) : 'transparent', border: isReady ? `2px solid ${INK}` : `2px dashed ${DIM}`, borderRadius: 11, fontSize: 24, fontWeight: 800, color: isReady ? INK : DIMT }}>${I ? Ico(I, 24) : c.badge}</span>`}
      <span class="o-col" style=${{ gap: 2, padding: c.group === 'cert' ? '6px 8px' : '0 4px 4px' }}><span class="o-t" style=${{ fontSize: 15, color: isReady ? INK : MUT }}>${c.name}</span><span class="o-s">${isReady ? (c.group === 'cert' ? plural(c.units.length, 'argomento pronto', 'argomenti pronti') : plural(c.lessons.length, 'lezione', 'lezioni')) : 'In arrivo'}</span></span></button>`; };
  return html`<${Flow} top=${html`<${TopBar} onBack=${nav.back} mid=${html`<h1 class="o-grow" style="font-size:28px;line-height:32px;font-weight:800;letter-spacing:-.02em">Percorsi</h1>`}/>`}>
    <div class="o-pad" style="padding-top:14px;padding-bottom:max(30px,calc(env(safe-area-inset-bottom) + 14px))">
      <div class="o-rowf" style="gap:8px;flex-wrap:wrap">${chips.map(([id, t]) => html`<button key=${id} type="button" class=${'o-chip' + (f === id ? ' on' : '')} onClick=${() => setF(id)}>${t}</button>`)}</div>
      ${groups.filter(([g]) => f === 'all' || f === g).map(([g, t]) => html`<section key=${g}><h2 class="o-h2" style="font-size:18px;margin:22px 0 10px">${t}</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${[...ready.filter(c => c.group === g), ...COMING.filter(c => c.group === g)].map(tile)}</div></section>`)}
      <button type="button" class="o-rowf" onClick=${() => nav.tab('coach')} style="gap:12px;width:100%;padding:14px 16px;margin-top:26px;background:${T_GR};border-radius:16px"><span class="o-grow o-t">Non trovi un argomento? Chiedilo a Rally.</span>${PathIco(D_NEXT, 22, 2.6)}</button>
    </div>
  <//>`;
}
function CourseSheetScreen({ nav, course }) {
  useS2(); useTick();
  const c = courseById(course) || courses()[0], album = K.albumLoad(), now = Date.now();
  const mins = c.lessons.reduce((n, l) => n + l.minutes, 0), started = doneCount(c.lessons) > 0, nx = nextLesson(c);
  const go = () => { s2set(x => ({ cur: c.id, started: Array.from(new Set([...(x.started || []), c.id])) })); if (nx) nav.replace('lezione', { key: nx.key }); else nav.replace('percorso', { course: c.id }); };
  return html`<${Room} color=${c.color || AZ} tabs=${false} headH=${176}
    rally=${html`<${Rally} pose="insegna" alt="" style="position:absolute;right:-14px;top:calc(var(--otop) + 27px)"/>`}
    head=${html`<div class="o-rowf" style="height:44px"><${IBtn} d=${D_BACK} onClick=${nav.back} label="Indietro"/></div>
      <div class="o-col" style="align-items:flex-start;gap:12px;margin-top:22px;max-width:190px"><h1 class="o-h1m">${c.name}</h1><${Pill}>${c.tagline}<//></div>`}>
    <${Sheet} pad=${false} style=${{ paddingTop: 24 }}>
      <${Stats3} items=${[[c.lessons.length, 'lezioni'], [c.units.length, c.group === 'cert' ? 'argomenti' : 'unità'], [mins < 90 ? mins + ' min' : Math.round(mins / 60) + ' ore', 'in tutto']]}/>
      <div style="height:2px;background:${SEP};margin:18px 0"></div>
      <h2 class="o-h2" style="font-size:18px;margin-bottom:10px">Cosa impari</h2>
      <ul class="o-col" style="gap:8px;list-style:none">${c.learn.map(t => html`<li key=${t} class="o-rowf" style="gap:12px;align-items:flex-start">${PathIco(D_CHECK, 20, 3)}<span class="o-t" style="font-size:15px;font-weight:600">${t}</span></li>`)}</ul>
      <h2 class="o-h2" style="font-size:18px;margin:22px 0 12px">Le figurine da vincere</h2>
      <div class="o-scroll" style="display:flex;gap:10px;overflow-x:auto;overflow-y:hidden;margin:0 -23px;padding:2px 23px 6px;flex:none">${c.lessons.slice(0, 8).map((l, k) => { const st = stickerState(l, album, now), em = lessonEmoji(l);
        return html`<span key=${l.key} style=${{ width: 50, height: 50, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, fontSize: em ? 22 : 16, fontWeight: 800, background: st !== 'manca' || k === 0 ? (c.color || AZ) : 'transparent', border: st !== 'manca' || k === 0 ? `2.5px solid ${INK}` : `2px dashed ${INK}`, boxShadow: st !== 'manca' || k === 0 ? `3px 3px 0 ${INK}` : 'none', transform: k === 0 ? 'rotate(-4deg)' : 'none' }}>${st !== 'manca' || k < 2 ? (em || stickerSym(l)) : '?'}</span>`; })}</div>
      <div style="flex:1 1 20px;min-height:20px"></div>
      <p class="o-s" style="text-align:center;font-size:14px;font-weight:700;color:${INK};margin-top:22px">Tutte le lezioni sono gratis.</p>
      <div style="padding:12px 0 max(30px,calc(env(safe-area-inset-bottom) + 12px))"><${Btn} cls="lg" onClick=${go}>${started ? 'Continua il percorso' : 'Inizia il percorso'}<//></div>
    <//>
  <//>`;
}

// ---- salva i progressi (per chi è entrato come ospite) e accesso ----
function AccountForm({ mode, onSubmit, busy, err }) {
  const [name, setName] = useState(''), [email, setEmail] = useState(''), [pw, setPw] = useState('');
  return html`<form class="o-col" style="gap:10px;margin-top:14px" onSubmit=${e => { e.preventDefault(); onSubmit({ name: name.trim(), email: email.trim(), password: pw }); }}>
    ${mode === 'new' && html`<input class="o-inp" value=${name} onChange=${e => setName(e.target.value)} placeholder="Il tuo nome" aria-label="Nome" autocomplete="given-name" maxlength="24"/>`}
    <input class="o-inp" type="email" value=${email} onChange=${e => setEmail(e.target.value)} placeholder="Email" aria-label="Email" autocomplete="email" required=${true}/>
    <input class="o-inp" type="password" value=${pw} onChange=${e => setPw(e.target.value)} placeholder="Password (almeno 6 caratteri)" aria-label="Password" autocomplete=${mode === 'new' ? 'new-password' : 'current-password'} minlength="6" required=${true}/>
    ${err && html`<p class="o-s" style="color:#B3261E;font-weight:700" role="alert">${err}</p>`}
    <${Btn} cls="lg" type="submit" disabled=${busy} onClick=${undefined}>${busy ? 'Un attimo…' : mode === 'new' ? 'Crea l\'account' : 'Entra'}<//>
  </form>`;
}
function SaveScreen({ nav }) {
  const [form, setForm] = useState(false), [busy, setBusy] = useState(false), [err, setErr] = useState(null);
  const l = allStickers().find(x => isDone(x.key));
  const link = async p => { setBusy(true); setErr(null); try { await K.upgradeGuest(p); if (p.name) s2set({ name: firstName(p.name) }); nav.back(); } catch (e) { setErr((e && e.message) || 'Non ha funzionato, riprova.'); setBusy(false); } };
  return html`<div class="o-scr" style="background:${AZ}">
    <div style="position:relative;flex:none;height:calc(var(--otop) + 227px)">
      <div class="o-top o-pad"><${IBtn} d=${D_X} onClick=${nav.back} label="Chiudi"/></div>
      <${Rally} pose="telefono" w=${214} alt="Rally con il telefono" style="position:absolute;left:50%;margin-left:-150px;bottom:-34px"/>
      ${l && html`<div class="o-col" style="position:absolute;left:50%;margin-left:44px;bottom:26px;width:104px;padding:6px 6px 10px;gap:6px;background:#fff;border:2.5px solid ${INK};border-radius:16px;box-shadow:4px 4px 0 ${INK};transform:rotate(6deg)">
        <span style="height:52px;display:flex;align-items:center;justify-content:center;background:${AZ};border:2px solid ${INK};border-radius:10px;font-size:24px;font-weight:800">${lessonEmoji(l) || stickerSym(l)}</span><span style="font-size:12px;line-height:15px;font-weight:700;padding:0 2px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">${l.title}</span></div>`}
    </div>
    <div class="o-scroll" style="background:#fff;border-top:2.5px solid ${INK};position:relative"><div class="o-col o-pad" style="min-height:100%;padding-top:26px">
      <h1 class="o-big" style="font-size:30px;line-height:34px">Salva i tuoi progressi</h1>
      <p class="o-body o-mut" style="margin-top:8px;font-size:16px">${l ? 'Hai finito la prima lezione e vinto una figurina. ' : ''}Con un account le ritrovi quando rientri.</p>
      ${form ? html`<${AccountForm} mode="new" busy=${busy} err=${err} onSubmit=${p => link(Object.assign({ provider: 'email' }, p))}/>`
        : html`<div class="o-col" style="gap:12px;margin-top:26px">
          <${Btn} cls="lg ink" disabled=${busy} onClick=${() => link({ provider: 'apple' })}>Continua con Apple<//>
          <${Btn} cls="lg flat" bg="#fff" disabled=${busy} onClick=${() => link({ provider: 'google' })}>Continua con Google<//>
          <${Btn} cls="lg flat" bg="#fff" disabled=${busy} onClick=${() => setForm(true)}>Continua con l'email<//></div>`}
      <div style="text-align:center;margin-top:6px"><button type="button" class="o-link" onClick=${nav.back}>Più tardi</button></div>
      <div style="flex:1 1 12px"></div>
      <p class="o-s" style="text-align:center;padding:10px 12px max(26px,calc(env(safe-area-inset-bottom) + 10px))">Versione di prova: l'account resta su questo dispositivo. Niente pubblicità, niente dati venduti.</p>
    </div></div></div>`;
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
  return html`<div style="position:fixed;inset:0;z-index:60;background:${T_BG};overflow:hidden" role="img" aria-label="FinLearn si sta aprendo">
    <div ref=${el => { R.stage = el; }} style=${{ position: 'absolute', left: '50%', top: '50%', width: SPL.W, height: SPL.H, marginLeft: -SPL.W / 2, marginTop: -SPL.H / 2, transform: `scale(${sc.toFixed(4)})`, transformOrigin: '50% 50%' }}>
      <svg ref=${el => { R.chart = el; }} viewBox="0 0 390 844" style="position:absolute;left:0;top:0;width:390px;height:844px;overflow:visible"></svg>
      <div ref=${el => { R.rally = el; }} style=${{ position: 'absolute', left: rx, top: ry, width: rw, opacity: 0 }}>${im('calmo', 'p0', 1)}${im('calmo-giu', 'p1', 0)}${im('calmo-chiusi', 'p2', 0)}</div>
      <div ref=${el => { R.logo = el; }} style=${{ position: 'absolute', left: 0, right: 0, top: SPL.logo, display: 'flex', justifyContent: 'center', opacity: 0 }}><${Wordmark} size=${SPL.fs} arrowRef=${el => { R.arrow = el; }} headRef=${el => { R.head = el; }}/></div>
      <div ref=${el => { R.tag = el; }} style=${{ position: 'absolute', left: 0, right: 0, top: SPL.tag, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontFamily: "'IBM Plex Mono',ui-monospace,monospace", fontWeight: 500, fontSize: 10.5, lineHeight: '14px', letterSpacing: '.32em', textTransform: 'uppercase', color: MUT, whiteSpace: 'nowrap', opacity: 0 }}>
        <i style="display:block;width:26px;height:1.5px;background:${INK};border-radius:1px"></i><span style="margin-right:-.32em">Bull market your knowledge</span><i style="display:block;width:26px;height:1.5px;background:${INK};border-radius:1px"></i></div>
    </div></div>`;
}

// Primo giorno: benvenuto, obiettivo, punto di partenza. `auth` arriva da app.js (accesso di prova, salvato sul dispositivo).
const GOALS = [['zero', 'Capire la finanza da zero', 'Soldi, interessi, inflazione', Sprout], ['invest', 'Investire i miei risparmi', 'Azioni, obbligazioni, fondi', TrendingUp], ['work', 'Usarla al lavoro', 'Bilanci, valutazioni, tassi', Briefcase], ['exam', 'Preparare un esame', 'CFA, FRM, CAIA', GraduationCap]];
function Choice({ on, onClick, icon, title, sub }) {
  return html`<button type="button" role="radio" aria-checked=${on ? 'true' : 'false'} onClick=${onClick} class="o-rowf" style=${{ gap: 14, width: '100%', minHeight: 72, padding: '12px 16px', border: `2.5px solid ${INK}`, borderRadius: 20, background: on ? T_AZ : '#fff', boxShadow: on ? `4px 4px 0 ${INK}` : 'none' }}>
    ${icon && html`<span class="o-ibox" style="width:42px;height:42px;border-radius:13px">${icon}</span>`}
    <span class="o-grow o-col" style="gap:2px"><span style="font-size:17px;line-height:22px;font-weight:800">${title}</span><span class="o-s" style="font-size:14px;line-height:19px">${sub}</span></span>
    <span style=${{ width: 28, height: 28, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: `2.5px solid ${INK}`, background: on ? INK : '#fff', color: '#fff' }}>${on && PathIco(D_CHECK, 15, 3.6)}</span></button>`;
}
export function OrdineWelcome({ auth, onAuth }) {
  const [step, setStep] = useState('welcome'), [goal, setGoal] = useState('zero'), [start, setStart] = useState('zero'), [mins, setMins] = useState(10);
  const [busy, setBusy] = useState(false), [err, setErr] = useState(null), [mode, setMode] = useState('in');
  ordInjectCss();
  useOrdFit();
  const enter = async fn => { setBusy(true); setErr(null); try { const r = await fn(); onAuth(r.user, r.data); } catch (e) { setErr((e && e.message) || 'Non ha funzionato, riprova.'); setBusy(false); } };
  const create = () => { s2set(s => ({ onboard: { goal, start, t: Date.now() }, settings: Object.assign({}, s.settings, { goalMin: mins }) })); enter(() => auth.guest()); };
  let body;
  if (step === 'welcome') body = html`<div class="o-scr" style="background:${AZ}">
    <div class="o-top" style="flex:1 1 0;min-height:300px;position:relative;display:flex;flex-direction:column;align-items:center">
      <div style="margin-top:22px"><${Wordmark} size=${34}/></div>
      <div style="position:relative;width:min(288px,70vw);aspect-ratio:1;margin-top:auto;margin-bottom:-8px;background:#fff;border:2.5px solid ${INK};border-radius:50%;box-shadow:5px 5px 0 ${INK};display:flex;align-items:flex-end;justify-content:center">
        <${Rally} pose="saluta" w=${250} alt="Rally, la mascotte di FinLearn, saluta" style="margin-bottom:-6px;max-width:92%"/>
        <span style="position:absolute;left:-22px;top:20px"><${Pill} rot=${-8}>Ciao, sono Rally<//></span></div></div>
    <div class="o-sheet o-col" style="flex:none;padding-top:28px;padding-bottom:max(26px,calc(env(safe-area-inset-bottom) + 10px))">
      <h1 style="font-size:30px;line-height:34px;font-weight:800;letter-spacing:-.02em;text-wrap:balance">Impara la finanza, dieci minuti al giorno</h1>
      <p class="o-body o-mut" style="margin-top:10px;font-size:16px;line-height:23px">Dalle basi alle certificazioni, con lezioni brevi, sfide e figurine da collezionare.</p>
      <div style="margin-top:22px"><${Btn} cls="lg" onClick=${() => setStep('goal')}>Inizia<//></div>
      <div style="text-align:center;margin-top:4px"><button type="button" class="o-link" onClick=${() => setStep('login')}>Ho già un account</button></div></div></div>`;
  else if (step === 'goal') body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep('welcome')} n=${3} i=${0}/>`} foot=${html`<${Btn} cls="lg" onClick=${() => setStep('start')}>Continua<//>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px"><${Rally} pose="indica" w=${190} alt="" style="position:absolute;right:-14px;top:-10px"/>
      <div class="o-col" style="gap:6px;position:relative;min-height:156px;max-width:200px"><span class="o-lab">Passo 1 di 3</span><h1 class="o-big" style="font-size:30px;line-height:34px">Cosa vuoi imparare?</h1></div>
      <div role="radiogroup" aria-label="Cosa vuoi imparare" class="o-col" style="gap:12px;position:relative">${GOALS.map(([id, t, s, I]) => html`<${Choice} key=${id} on=${goal === id} onClick=${() => setGoal(id)} icon=${Ico(I, 22)} title=${t} sub=${s}/>`)}</div>
      <p class="o-body o-mut" style="margin-top:18px">Puoi seguire più percorsi insieme e cambiare idea quando vuoi.</p></div><//>`;
  else if (step === 'start') body = html`<${Flow} top=${html`<${TopBar} onBack=${() => setStep('goal')} n=${3} i=${1}/>`}
    foot=${html`${err && html`<p class="o-s" style="color:#B3261E;font-weight:700;margin-bottom:8px;text-align:center" role="alert">${err}</p>`}<${Btn} cls="lg" disabled=${busy} onClick=${create}>${busy ? 'Un attimo…' : 'Crea il mio percorso'}<//>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:20px"><${Rally} pose="occhiolino" w=${190} alt="" style="position:absolute;right:-14px;top:-10px"/>
      <div class="o-col" style="gap:6px;position:relative;min-height:156px;max-width:200px"><span class="o-lab">Passo 2 di 3</span><h1 class="o-big" style="font-size:30px;line-height:34px">Da dove parti?</h1></div>
      <div role="radiogroup" aria-label="Da dove parti" class="o-col" style="gap:12px;position:relative">
        <${Choice} on=${start === 'zero'} onClick=${() => setStart('zero')} title="Parto da zero" sub="Comincio dalla prima lezione."/>
        <${Choice} on=${start === 'some'} onClick=${() => setStart('some')} title="So già qualcosa" sub="Cinque domande e Rally capisce a che punto sono."/></div>
      <h2 class="o-h2" style="margin:28px 0 12px">Quanto tempo hai al giorno?</h2>
      <div role="radiogroup" aria-label="Minuti al giorno" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">${[5, 10, 20].map(m => html`<button key=${m} type="button" role="radio" aria-checked=${mins === m ? 'true' : 'false'} onClick=${() => setMins(m)} class="o-col"
        style=${{ alignItems: 'center', padding: '10px 0 12px', border: `2.5px solid ${INK}`, borderRadius: 18, background: mins === m ? AZ : '#fff', boxShadow: mins === m ? `4px 4px 0 ${INK}` : 'none' }}><span style="font-size:26px;line-height:30px;font-weight:800">${m}</span><span style="font-size:14px;font-weight:700">minuti</span></button>`)}</div>
      <p class="o-body o-mut" style="margin-top:16px">Lo cambi quando vuoi dalle impostazioni.</p></div><//>`;
  else body = html`<${Flow} top=${html`<${TopBar} onBack=${() => { setStep('welcome'); setErr(null); }} title=""/>`}>
    <div class="o-pad" style="position:relative;padding-top:22px;padding-bottom:30px"><${Rally} pose="saluta" w=${180} alt="" style="position:absolute;right:-14px;top:-10px"/>
      <div class="o-col" style="gap:6px;position:relative;min-height:150px;max-width:200px"><h1 class="o-big" style="font-size:30px;line-height:34px">${mode === 'in' ? 'Bentornato' : 'Crea un account'}</h1><p class="o-lab">${mode === 'in' ? 'Entra con l\'account che hai già.' : 'Bastano nome, email e password.'}</p></div>
      ${mode === 'in' && html`<${Btn} cls="lg flat" bg="#fff" disabled=${busy} onClick=${() => enter(() => auth.google())}>Continua con Google<//>`}
      <${AccountForm} mode=${mode === 'in' ? 'in' : 'new'} busy=${busy} err=${err} onSubmit=${p => enter(() => (mode === 'in' ? auth.emailIn(p.email, p.password) : auth.emailUp(p.email, p.password, p.name)))}/>
      <div style="text-align:center;margin-top:6px"><button type="button" class="o-link" onClick=${() => { setMode(mode === 'in' ? 'new' : 'in'); setErr(null); }}>${mode === 'in' ? 'Non ho un account' : 'Ho già un account'}</button></div>
      <p class="o-s" style="text-align:center;margin-top:14px">Versione di prova: l'account resta su questo dispositivo.</p></div><//>`;
  return html`<div class="o-app">${body}</div>`;
}

// =====================================================================================================
// GUSCIO DELL'APP: schede in basso, pila delle schermate, calcolatrice e chat sopra tutto
// =====================================================================================================
const SCREENS = {
  percorso: p => html`<${PercorsoScreen} ...${p}/>`,
  lezione: p => html`<${LessonScreen} nav=${p.nav} lessonKey=${p.key}/>`,
  testInizio: p => html`<${TestIntro} ...${p}/>`,
  testRun: p => html`<${TestRun} ...${p}/>`,
  testFine: p => html`<${TestDone} ...${p}/>`,
  testRev: p => html`<${TestReview} ...${p}/>`,
  pratica: p => html`<${PracticeRun} ...${p}/>`,
  deboli: p => html`<${WeakScreen} ...${p}/>`,
  sfida: p => html`<${DuelRun} ...${p}/>`,
  sfidaFine: p => html`<${DuelDone} ...${p}/>`,
  album: p => html`<${AlbumScreen} ...${p}/>`,
  impostazioni: p => html`<${SettingsScreen} ...${p}/>`,
  pro: p => html`<${ProScreen} ...${p}/>`,
  catalogo: p => html`<${CatalogScreen} ...${p}/>`,
  scheda: p => html`<${CourseSheetScreen} ...${p}/>`,
  salva: p => html`<${SaveScreen} ...${p}/>`
};
let NAV_ID = 0;
export function OrdineApp({ kit }) {
  const s = useS2();
  K = Object.assign({}, kit, { isPro: !!kit.isPro || !!s.pro });
  ordInjectCss();
  kit.useFlScreenLock();
  useOrdFit();
  const [tab, setTab] = useState('home'), [sub, setSub] = useState('allenati'), [stack, setStack] = useState([]);
  const [calc, setCalc] = useState(false), [ai, setAi] = useState(null), [toast, setToast] = useState(null);
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
      const cq = { picked, correct: right, q: plain, opts: q.options.map(K.flPlain), topic: `${q.lesson.unit.name} · ${q.lesson.title}${picked ? ` (lo studente ha già risposto ${picked}; la risposta corretta è ${right}: puoi spiegarla apertamente)` : ''}` };
      const first = picked ? `Domanda: "${plain}"\n\nHai risposto ${picked}, la giusta è ${right}. Cosa vuoi capire? Posso spiegarti il perché, rifare i conti o darti un trucco per ricordarla.` : `Stai lavorando su:\n\n"${plain}"\n\nCome posso aiutarti?`;
      K.setChats(prev => [{ id, title: `Quiz: ${plain.slice(0, 35)}...`, createdAt: now, updatedAt: now, isQuizChat: true, quizQuestion: plain, messages: [{ role: 'assistant', content: first, timestamp: now }] }, ...prev].slice(0, 50));
      setAi({ id, q: cq, preset: preset || null });
    }
  }), []);
  // primo ingresso: nome per chi usava già l'app, test di livello per chi ha detto "so già qualcosa"
  useEffect(() => {
    const st = s2get(), u = kit.user || {};
    if (!st.name && (!u.displayName || u.displayName === 'Google User') && !u.guest && ((kit.losProgress || []).length || Object.keys(kit.albumLoad()).length)) s2set({ name: 'Stefano' });
    if (st.onboard && st.onboard.start === 'some' && !st.onboard.level) { s2set(x => ({ onboard: Object.assign({}, x.onboard, { level: true }) })); const c = st.onboard.goal === 'exam' ? 'cfa2' : 'basi'; nav.go('testInizio', { kind: 'level', course: c }); }
  }, []);
  const top = stack.length - 1;
  const tabScreen = tab === 'home' ? html`<${HomeScreen} nav=${nav}/>` : tab === 'allenati' ? (sub === 'test' ? html`<${TestScreen} nav=${nav}/>` : html`<${AllenatiScreen} nav=${nav}/>`)
    : tab === 'sfide' ? html`<${SfideScreen} nav=${nav}/>` : tab === 'coach' ? html`<${CoachScreen} nav=${nav}/>` : html`<${ProfiloScreen} nav=${nav}/>`;
  const layer = (on, child, key, anim) => html`<div key=${key} class=${anim ? 'o-in' : ''} style=${{ position: 'absolute', inset: 0, visibility: on ? 'visible' : 'hidden', pointerEvents: on ? 'auto' : 'none' }} aria-hidden=${on ? undefined : 'true'}>${child}</div>`;
  const Calc = kit.TICalculator, Chat = kit.AiChatModal;
  return html`<${React.Fragment}><div class="o-app">
    ${layer(top < 0, tabScreen, 'tab:' + tab + ':' + sub, false)}
    ${stack.map((e, k) => layer(k === top, SCREENS[e.name] ? SCREENS[e.name](Object.assign({ nav }, e.params)) : null, 'st' + e.id, true))}
    ${toast && html`<div class="o-toast o-fade" role="status">${toast}</div>`}
  </div>
  ${calc && Calc && html`<${Calc} onClose=${() => setCalc(false)}/>`}
  ${ai && Chat && html`<${Chat} key=${ai.id} variant="quiz" chatId=${ai.id} chats=${K.chats} setChats=${K.setChats} currentQuestion=${ai.q} initialMessage=${ai.preset} onClose=${() => setAi(null)}/>`}<//>`;
}
