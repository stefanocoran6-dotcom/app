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
