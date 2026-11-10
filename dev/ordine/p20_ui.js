
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
