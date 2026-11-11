// Rally potenziato: lo scheletro del personaggio di FinLearn (dalla pagina «Rally potenziato»).
// Il disegno non si cambia: si aggiungono capacità. Vedi dev/video/LEGGIMI.md.
var R3X={};
const R3 = {
  S: '#D57E1A', B: '#F6A730', H: '#FFC45C',            // pelo: ombra · base · luce
  tuftS: '#B8640F', tuftB: '#D9821F',
  bellyS: '#F0BE80', bellyB: '#FFE0B0',
  muzS: '#EDB37E', muzB: '#FFD7A6', muzH: '#FFEBCB',
  hornS: '#E2C690', hornB: '#FFF4DE', hornTip: '#B98F5A', hornRing: '#CFAE76',
  hoofS: '#33231B', hoofB: '#563C2F', hoofH: '#7B5A48',
  ear: '#EF8A78', earH: '#FFA898',
  ink: '#1A0F08', iris: '#4A2A15', eyeShade: '#EBEFF5',
  nostril: '#7A3418', nostrilIn: '#4E1E0B',
  mouth: '#5C1A0E', tongue: '#FF7B7B', cheek: '#FF8A73',
  gold: '#F2C440', goldS: '#C4931C', brow: '#A9570C'
};

function r3Mirror(d) {
  return d.replace(/([MLCQHVZ])([^MLCQHVZ]*)/g, (all, cmd, args) => {
    if (cmd === 'Z' || cmd === 'V') return all;
    const n = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (cmd === 'H') return 'H' + (160 - n[0]);
    for (let i = 0; i < n.length; i += 2) n[i] = +(160 - n[i]).toFixed(2);
    return cmd + n.join(' ');
  });
}

// parte con cel-shading: d = contorno; lit/hi = forme (stringhe svg) disegnate dentro il ritaglio
function r3Part(u, key, d, shadowFill, inner, extraAttr) {
  return `<clipPath id="${key}${u}"><path d="${d}"/></clipPath>` +
    `<path d="${d}" fill="${shadowFill}"${extraAttr || ''}/>` +
    `<g clip-path="url(#${key}${u})">${inner}</g>`;
}

function r3Eye(u, m, side) {
  const C = R3;
  const cx = side === 'L' ? 63 : 97, cy = 46, rx = 12, ry = 13.4;
  const sgn = side === 'L' ? 1 : -1;
  if (m === 'celebrating') return `<path d="M${cx - 9.5} ${cy + 3} Q${cx} ${cy - 8} ${cx + 9.5} ${cy + 3}" fill="none" stroke="${C.ink}" stroke-width="4.2" stroke-linecap="round"/>`;
  const look = m === 'thinking' ? [2.6, -4] : (m === 'sad' || m === 'wrong') ? [0, 3] : [1, 1.2];
  const px = cx + look[0], py = cy + look[1];
  // palpebra superiore per mood: [abbassamento, rotazione]
  const lid = {
    neutral: [3.5, 6], walking: [3.5, 6], happy: [0, 0], correct: [0, 0],
    thinking: side === 'L' ? [1, -4] : [7, 4], sad: [8, -16], wrong: [7, -12]
  }[m] || [3, 5];
  const bottom = (m === 'happy' || m === 'correct') ? `<ellipse cx="${cx}" cy="${cy + 20}" rx="17" ry="10" fill="${C.B}"/>` : '';
  const k = `e${side}`;
  return `<clipPath id="${k}${u}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff"/>` +
    `<g clip-path="url(#${k}${u})">` +
      `<ellipse cx="${cx}" cy="${cy - 14}" rx="15" ry="5" fill="${C.eyeShade}"/>` +
      `<g class="r3-look"><circle cx="${px}" cy="${py}" r="7.8" fill="${C.iris}"/><circle cx="${px + .4}" cy="${py + .4}" r="5.4" fill="${C.ink}"/>` +
      `<circle cx="${px + 2.7}" cy="${py - 3}" r="2.9" fill="#fff"/><circle cx="${px - 2.5}" cy="${py + 2.7}" r="1.25" fill="#fff"/></g>` +
      bottom +
      `<g class="r3-blink"><g transform="translate(0 ${lid[0]}) rotate(${lid[1] * sgn} ${cx} ${cy - 13})"><rect x="${cx - 18}" y="${cy - 39}" width="36" height="26" fill="${C.B}"/></g></g>` +
    `</g>`;
}

function r3Face(u, m) {
  const C = R3;
  let s = '';
  s += `<g class="r3-eyes">${r3Eye(u, m, 'L')}${r3Eye(u, m, 'R')}</g>`;
  // sopracciglia (ciuffi di pelo)
  const br = (d) => `<path d="${d}" fill="none" stroke="${C.brow}" stroke-width="4.4" stroke-linecap="round"/>`;
  if (m === 'thinking') s += br('M53 27 Q62 20.5 72 26');
  if (m === 'sad' || m === 'wrong') s += br('M53 31.5 Q62 31 70.5 25.5') + br('M89.5 25.5 Q98 31 107 31.5');
  if (m === 'celebrating' || m === 'correct') s += br('M54 28 Q63 22 72 27') + br('M88 27 Q97 22 106 28');
  // guance
  const blush = (m === 'sad' || m === 'wrong') ? .18 : .38;
  s += `<ellipse cx="45" cy="72" rx="7.5" ry="4.2" fill="${C.cheek}" opacity="${blush}"/><ellipse cx="115" cy="72" rx="7.5" ry="4.2" fill="${C.cheek}" opacity="${blush}"/>`;
  // muso
  const muz = 'M80 58 C99 58 111 66 111 77 C111 89 98 96 80 96 C62 96 49 89 49 77 C49 66 61 58 80 58 Z';
  s += r3Part(u, 'mz', muz, C.muzS,
    `<ellipse cx="77" cy="73" rx="30" ry="16" fill="${C.muzB}"/><ellipse cx="70" cy="63.5" rx="15" ry="3.4" fill="${C.muzH}"/>`);
  // narici
  const nos = 'M68.5 68 C72.5 67.6 75 71 74.4 74.8 C73.9 78 68.6 78.6 66.8 76 C65 73 65.6 68.3 68.5 68 Z';
  s += `<path d="${nos}" fill="${C.nostril}"/><path d="${r3Mirror(nos)}" fill="${C.nostril}"/>`;
  s += `<ellipse cx="70.4" cy="74" rx="2.2" ry="2.8" fill="${C.nostrilIn}"/><ellipse cx="89.6" cy="74" rx="2.2" ry="2.8" fill="${C.nostrilIn}"/>`;
  // anello al naso
  s += `<path d="M75 79.5 A5 5 0 1 0 85 79.5" fill="none" stroke="${C.goldS}" stroke-width="3.2" stroke-linecap="round"/>` +
       `<path d="M75.6 80.6 A4.6 4.6 0 0 0 79.2 84.4" fill="none" stroke="#FFE68A" stroke-width="1.3" stroke-linecap="round"/>` +
       `<path d="M75 79.5 A5 5 0 1 0 85 79.5" fill="none" stroke="${C.gold}" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>`;
  // bocca
  const line = (d) => `<path d="${d}" fill="none" stroke="${C.mouth}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  const open = (d, ty, rx, ry) => `<clipPath id="mo${u}"><path d="${d}"/></clipPath><path d="${d}" fill="${C.mouth}" stroke="${C.mouth}" stroke-width="1.4" stroke-linejoin="round"/>` +
    `<g clip-path="url(#mo${u})"><ellipse cx="80" cy="${ty}" rx="${rx}" ry="${ry}" fill="${C.tongue}"/></g>`;
  const mouths = {
    neutral: line('M71.5 89.5 Q80 93.5 88.5 89.5'),
    happy: open('M68 88 Q80 100.5 92 88 Q80 91 68 88 Z', 97, 7, 4),
    celebrating: open('M66 87 Q80 104 94 87 Q80 90.5 66 87 Z', 100.5, 8.5, 5),
    thinking: line('M73.5 91.2 Q79.5 89.6 87.5 90.6'),
    sad: line('M71.5 93.5 Q80 87.5 88.5 93.5'),
    wrong: line('M70.5 91.5 Q75.2 88.4 80 91.5 Q84.8 94.6 89.5 91.5')
  };
  mouths.correct = mouths.celebrating; mouths.walking = mouths.neutral;
  s += mouths[m] || mouths.neutral;
  // sbuffi di vapore, lacrima, sudore
  s += `<g fill="#fff"><circle class="r3-puffL" cx="63" cy="82" r="3.4" opacity="0"/><circle class="r3-puffR" cx="97" cy="82" r="3.4" opacity="0"/></g>`;
  if (m === 'sad') s += `<path class="r3-tear" d="M58 66 C54.6 71.6 54 75 58 76.6 C62 75 61.4 71.6 58 66 Z" fill="#7DD3FC"/>`;
  if (m === 'wrong') s += `<path class="r3-sweat" d="M123 30 C118.6 37 117.6 41.4 123 43.4 C128.4 41.4 127.4 37 123 30 Z" fill="#7DD3FC"/><ellipse cx="121.4" cy="38.6" rx="1.2" ry="2" fill="#fff" opacity=".8"/>`;
  return s;
}

function r3Character(u, m) {
  const C = R3;
  let s = (R3X.back||'');
  // --- coda (base + punta con ritardo)
  s += `<g class="r3-tail"><path d="M117 131 C129 129 135.5 121 137.5 110" fill="none" stroke="${C.S}" stroke-width="5" stroke-linecap="round"/>` +
    `<g class="r3-tailTip">` + r3Part(u, 'tt', 'M137.6 111.5 C131.4 106.6 132.4 97.4 137.6 93 C140.6 98.4 147 101 145 108.4 C144 112.2 140.4 113.4 137.6 111.5 Z', C.tuftS,
      `<ellipse cx="136.5" cy="101" rx="5" ry="9" fill="${C.tuftB}"/>`) + `</g></g>`;
  // --- gambe
  const leg = (dx, cls, k) => `<g class="${cls}"><g transform="translate(${dx} 0)">` +
    r3Part(u, k + 'l', 'M64 128 C71 128 77 132 77 139 V150 H53 V139 C53 132 57 128 64 128 Z', C.S, `<ellipse cx="60" cy="138" rx="12" ry="16" fill="${C.B}"/>`) +
    r3Part(u, k + 'h', 'M50 154 Q50 149 56 149 H74 Q80 149 80 154 V158 Q80 163 75 163 H55 Q50 163 50 158 Z', C.hoofS,
      `<ellipse cx="61" cy="154" rx="14" ry="6.5" fill="${C.hoofB}"/><ellipse cx="57" cy="151.4" rx="5.2" ry="1.5" fill="${C.hoofH}"/>`) +
    `<path d="M65 156 V163" stroke="${C.hoofS}" stroke-width="2.2" stroke-linecap="round"/></g></g>`;
  s += leg(0, 'r3-legL', 'gL') + leg(31, 'r3-legR', 'gR');
  // --- parte superiore (respira come un blocco)
  s += `<g class="r3-upper">`;
  const torso = 'M80 82 C107 82 123 99 123 118 C123 135 105 145 80 145 C55 145 37 135 37 118 C37 99 53 82 80 82 Z';
  s += r3Part(u, 'to', torso, C.S, `<ellipse cx="72" cy="113" rx="45" ry="37" fill="${C.B}"/><ellipse cx="60" cy="98" rx="17" ry="8" fill="${C.H}" transform="rotate(-18 60 98)"/>`);
  s += r3Part(u, 'be', 'M80 102 C94 102 104 110 104 121 C104 132 94 140 80 140 C66 140 56 132 56 121 C56 110 66 102 80 102 Z', C.bellyS,
    `<ellipse cx="76.5" cy="117" rx="22" ry="18" fill="${C.bellyB}"/>`);
  s += `<path d="M73 109 l3.5 3.5 l3.5 -3.5 l3.5 3.5 l3.5 -3.5" fill="none" stroke="${C.bellyS}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>`;
  s += (R3X.body||'');
  // braccia (dietro la testa)
  const armD = 'M55 94 C44 95 34 105 31 118 C29 126.5 36 131.5 40.5 126.5 C44.5 117 50.5 108.5 61 101.5 Z';
  const arm = (side) => {
    const L = side === 'L';
    const d = L ? armD : r3Mirror(armD);
    const hx = L ? 36 : 124;
    return `<g class="r3-arm${side}"><path d="${d}" fill="${C.S}" opacity=".55" transform="translate(${L ? 3.5 : -3.5} 2.5)"/>` +
      r3Part(u, 'a' + side, d, C.S, `<ellipse cx="${L ? 39 : 117}" cy="106" rx="${L ? 9 : 6.5}" ry="16" fill="${C.B}" transform="rotate(${L ? 25 : -25} ${L ? 39 : 117} 106)"/>`) +
      r3Part(u, 'ah' + side, `M${hx - 7.6} 127 C${hx - 7.6} 122.5 ${hx + 7.6} 122.5 ${hx + 7.6} 127 C${hx + 7.6} 132.5 ${hx - 7.6} 132.5 ${hx - 7.6} 127 Z`, C.hoofS,
        `<ellipse cx="${hx - 1.4}" cy="125.8" rx="6.4" ry="4.6" fill="${C.hoofB}"/><ellipse cx="${hx - 3}" cy="124.2" rx="2.6" ry="1" fill="${C.hoofH}"/>`) +
      `<path d="M${hx} 125.5 V132" stroke="${C.hoofS}" stroke-width="1.6" stroke-linecap="round"/>${L ? (R3X.handL||'') : (R3X.handR||'')}</g>`;
  };
  s += arm('L') + (m === 'thinking' ? '' : arm('R'));
  // --- testa
  s += `<g class="r3-head">`;
  const earD = 'M43 47 C33 39 17 40 8 50.5 C17 60.5 33 59.5 44 55 Z';
  const earIn = 'M39 49.5 C31 44.6 20.5 45.4 14 50.6 C21 55.4 31 55.4 39 53 Z';
  const ear = (side) => {
    const L = side === 'L', M = L ? (d) => d : r3Mirror;
    return `<g class="r3-ear${side}">` + r3Part(u, 'er' + side, M(earD), C.S, `<ellipse cx="${L ? 25 : 135}" cy="47.5" rx="18" ry="6.5" fill="${C.B}"/>`) +
      r3Part(u, 'ei' + side, M(earIn), C.ear, `<ellipse cx="${L ? 26 : 134}" cy="49" rx="12" ry="3" fill="${C.earH}"/>`) + `</g>`;
  };
  s += ear('L') + ear('R');
  const hornD = 'M51 31 C40 32 27 28.5 20.5 18.5 C16.4 12 17 4.6 21.2 1.2 C24 9.4 30.4 15.4 38.4 18.2 C44.4 20.3 50.6 21.4 57 22.4 Z';
  const horn = (side) => {
    const L = side === 'L';
    const d = L ? hornD : r3Mirror(hornD);
    const x = (v) => L ? v : 160 - v;
    return r3Part(u, 'hn' + side, d, C.hornS,
      `<ellipse cx="${x(37)}" cy="19" rx="21" ry="5.8" fill="${C.hornB}" transform="rotate(${L ? 27 : -27} ${x(37)} ${19})"/>` +
      `<circle cx="${x(19.4)}" cy="5" r="7.6" fill="${C.hornTip}"/>` +
      `<path d="M${x(44.6)} 20.8 Q${x(42)} 25.8 ${x(44.8)} 31.2 M${x(49.4)} 21.6 Q${x(47)} 26.4 ${x(49.6)} 31.4" fill="none" stroke="${C.hornRing}" stroke-width="1.6" stroke-linecap="round"/>`);
  };
  s += horn('L') + horn('R');
  const headD = 'M80 16 C111 16 129 34 129 58 C129 80 111 95 80 95 C49 95 31 80 31 58 C31 34 49 16 80 16 Z';
  s += r3Part(u, 'hd', headD, C.S,
    `<ellipse cx="73" cy="51" rx="51" ry="40" fill="${C.B}"/><ellipse cx="58" cy="31" rx="17" ry="7.5" fill="${C.H}" transform="rotate(-22 58 31)"/>`);
  s += r3Part(u, 'tf', 'M65 25 C61 17 65 8.5 71.5 8 C70.8 12 73.4 14.4 76 12.6 C76 6.4 82 3 87.6 6 C84.6 9 86.4 12.2 89.4 12.4 C92.4 9.2 97.6 10.6 98.4 14.6 C96.6 20.4 92.4 24.2 86 25.4 C79 22.6 71.6 22.6 65 25 Z', C.tuftS,
    `<ellipse cx="79" cy="13" rx="17" ry="9" fill="${C.tuftB}"/>`);
  s += '<g class="r3-face" data-m="'+m+'">' + r3Face(u, m) + '</g>' + (R3X.head||'');
  s += `</g>`;
  if (m === 'thinking') s += arm('R');
  s += (R3X.front||'');
  s += `</g>`; // upper
  return s;
}

function r3Extras(m) {
  let s = '';
  if (m === 'thinking') s += `<g fill="#CBD5E1"><circle class="r3-dot1" cx="133" cy="30" r="3"/><circle class="r3-dot2" cx="142" cy="18" r="4.2"/><circle class="r3-dot3" cx="152" cy="4" r="5.8"/></g>`;
  if (m === 'correct') {
    const star = (x, y, r, c, k) => `<path class="r3-tw${k}" d="M${x} ${y - r} Q${x + r * .2} ${y - r * .2} ${x + r} ${y} Q${x + r * .2} ${y + r * .2} ${x} ${y + r} Q${x - r * .2} ${y + r * .2} ${x - r} ${y} Q${x - r * .2} ${y - r * .2} ${x} ${y - r} Z" fill="${c}"/>`;
    s += star(10, 28, 7, '#FFD43B', 1) + star(150, 34, 6, '#FFD43B', 2) + star(24, 8, 4, '#fff', 3) + star(140, 10, 3.5, '#fff', 1);
  }
  if (m === 'celebrating') {
    const conf = [[8, 18, '#58CC02', 20], [28, 2, '#1CB0F6', -30], [126, 4, '#FF4B8B', 35], [148, 24, '#FFD43B', -15], [2, 48, '#FF4B8B', 45], [152, 52, '#1CB0F6', 10], [52, -4, '#FFD43B', 60], [106, -6, '#58CC02', -50]];
    s += conf.map(([x, y, c, r], i) => `<g class="r3-conf r3-c${i % 4}"><rect x="${x}" y="${y}" width="6" height="9" rx="2" fill="${c}" transform="rotate(${r} ${x + 3} ${y + 4.5})"/></g>`).join('');
  }
  return s + (R3X.fx||'');
}

function r3Delay(u) { let h = 0; for (const ch of String(u)) h = (h * 31 + ch.charCodeAt(0)) % 997; return -(h % 40) / 10; }

function rly3SVG(mood, size, uid, opts) {
  const o = opts || {};
  const m = mood || 'neutral';
  const u = uid || 'r';
  return `<svg viewBox="0 0 160 170" width="${size}" height="${size * 170 / 160}" style="overflow:visible;display:block" aria-hidden="true">` +
    `<ellipse class="r3-shadow" cx="80" cy="164" rx="38" ry="5" fill="#000" opacity=".18"/>` +
    `<g class="r3 r3-m-${m}${o.static ? ' r3-static' : ''}${o.poke ? ' r3-poke' : ''}" style="--rd:${r3Delay(u)}s">${r3Extras(m)}<g class="r3-all">${r3Character(u, m)}</g></g></svg>`;
}

function rly3MarkSVG(size, opts) {
  const o = opts || {};
  const u = o.uid || 'mk';
  const sc = o.maskable ? 0.64 : 0.9;
  const tx = 60 - 80 * sc;
  const ty = o.maskable ? 60 - 84 * sc : 6 - 1 * sc;
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" style="display:block" aria-hidden="true">` +
    `<rect width="120" height="120" rx="${o.rounded ? 26 : 0}" fill="${o.bg || '#0B1322'}"/>` +
    `<circle cx="60" cy="${o.maskable ? 62 : 66}" r="${o.maskable ? 40 : 52}" fill="#14213C"/>` +
    `<g transform="translate(${tx} ${ty}) scale(${sc})"><g class="r3 r3-static">${r3Character(u, 'happy')}</g></g></svg>`;
}


// Rally 4 · estensione dello scheletro di Rally v3 (stesso disegno, stessi colori)
// Aggiunge: vista di tre quarti (giro continuo 0..1) e di profilo, braccia davanti al corpo,
// 6 forme di bocca (visemi) e nuove espressioni. Con le opzioni di default disegna Rally identico a v3.

function r4tf(dx, sx, cx) { // sposta di dx e comprime orizzontalmente attorno a cx
  if (!dx && (sx == null || sx === 1)) return '';
  sx = sx == null ? 1 : sx;
  return ` transform="translate(${(cx + dx).toFixed(2)} 0) scale(${sx.toFixed(3)} 1) translate(${-cx} 0)"`;
}
function r4g(inner, dx, sx, cx, cls) {
  const t = r4tf(dx, sx, cx);
  return (t || cls) ? `<g${cls ? ` class="${cls}"` : ''}${t}>${inner}</g>` : inner;
}

const R4_NEW = ['surprised', 'angry', 'love', 'sleepy', 'wink', 'dizzy', 'smug', 'crying'];

// Bocca: 6 visemi (X riposo, A, E, O, M m/b/p, F f/v) + motore di labiale
// Stile v3: interno R3.mouth, lingua R3.tongue ritagliata nella bocca, denti bianchi senza contorno.
// Coordinate frontali: centro x 80, tra l'anello (y<=84.6) e il fondo del muso (y 96).

// ---------- forme ----------
const R4_MOUTH_FRONT = {
  X: { line: 'M72 89.8 Q80 92.8 88 89.8' },
  A: { d: 'M68.5 87.6 Q80 86 91.5 87.6 Q91 95.4 80 96.5 Q69 95.4 68.5 87.6 Z',
    teeth: 'M66 85 L94 85 L94 89.4 Q80 88 66 89.4 Z', tongue: [80, 96.8, 7, 4] },
  E: { d: 'M66 87.8 Q80 86.4 94 87.8 Q92.4 94.6 80 95.2 Q67.6 94.6 66 87.8 Z',
    teeth: 'M64 85 L96 85 L96 89.9 Q80 88.5 64 89.9 Z', tongue: [80, 96.2, 7.5, 2.7] },
  O: { d: 'M80 86.2 C84.4 86.2 86.2 89.6 86.2 92 C86.2 94.8 83.6 96.7 80 96.7 C76.4 96.7 73.8 94.8 73.8 92 C73.8 89.6 75.6 86.2 80 86.2 Z',
    tongue: [80, 96.8, 4.4, 2.7] },
  M: { line: 'M71.5 91 Q80 90 88.5 91', w: 3.4,
    extra: [['M70.6 89.6 Q69.4 91 70.8 92.3', 2], ['M89.4 89.6 Q90.6 91 89.2 92.3', 2]] },
  F: { d: 'M71 88.4 Q80 87.2 89 88.4 Q88 92.4 80 92.8 Q72 92.4 71 88.4 Z',
    teeth: 'M68 85 L92 85 L92 91.7 Q80 90.6 68 91.7 Z', after: [['M70.5 92.3 Q80 95.8 89.5 92.3', 2.7]] }
};
// profilo (coordinate assolute del muso di profilo: punta x~147, ring ~x 135-139 / y<=84.5, fondo che risale verso la punta)
// silhouette diverse anche a 80 px: A cuneo alto con lingua · E fessura lunga con due file di denti · O labbra a "becco"
// sporgenti (attaccate al muso) · M linea premuta con labbro in punta · F denti sopra il labbro inferiore arrotolato
const R4_MOUTH_SIDE = {
  X: { line: 'M116.5 87 Q118.5 89.8 124 90 Q134 90.2 142.5 88.4', w: 2.8 },
  A: { d: 'M116 88.2 Q129 87.8 143.2 86.4 Q144.2 91.6 139.6 94.6 Q134.6 97 128 94.8 Q121 92.6 116 88.2 Z',
    teeth: 'M132 88.6 Q137 87.2 146 85.8 L146 88.6 Q139 89.2 132 88.6 Z', tongue: [134.5, 96.6, 8, 4.2] },
  E: { d: 'M115.5 88.6 Q130 88 144.2 87.2 Q144 91.4 140.8 92.6 Q129 93.4 115.5 88.6 Z',
    teeth: 'M118 88 Q130 86.4 146 86 L146 89.9 Q132 90.1 118 89.5 Z M124 93.6 Q133 91.2 143 90.8 L143 94 L124 94 Z' },
  O: { raw: (C) => `<ellipse cx="140.4" cy="91.4" rx="5.6" ry="5.9" fill="${C.muzS}"/><ellipse cx="139.8" cy="90.6" rx="4.3" ry="4.6" fill="${C.muzB}"/>`,
    d: 'M141.2 88 C142.8 88 143.8 89.6 143.8 91.6 C143.8 93.6 142.8 95.2 141.2 95.2 C139.6 95.2 138.6 93.6 138.6 91.6 C138.6 89.6 139.6 88 141.2 88 Z',
    tongue: [141.2, 95.4, 2.4, 1.6], before: [['M121 90.4 Q128.4 91.4 135 90.8', 2.4]] },
  M: { line: 'M117 89.4 Q130 90.2 141.4 89', w: 3.4,
    extra: [['M117.6 87.8 Q116.2 89.4 117.8 90.8', 2.2], ['M140.6 86.6 Q144.6 89.2 140.8 92', 2.4]] },
  F: { d: 'M128 88.4 Q136 87 144 86.6 Q143.6 90.4 141 91.4 Q134 92 128 88.4 Z',
    teeth: 'M127 85 L146 84.8 L146 91 Q136 91.4 127 90.6 Z',
    before: [['M117 88.4 Q122.5 89.8 128.6 89', 2.6]], after: [['M127.4 91 Q135 94 142.4 91.6', 3.2]] }
};

// applica una funzione (x,y)->[x,y] a un percorso con soli comandi assoluti M L Q C Z
function r4MapPath(d, f) {
  return d.replace(/([MLQC])([^MLQCZ]*)/g, (all, cmd, args) => {
    const n = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    for (let i = 0; i + 1 < n.length; i += 2) { const p = f(n[i], n[i + 1]); n[i] = +p[0].toFixed(2); n[i + 1] = +p[1].toFixed(2); }
    return cmd + n.join(' ') + ' ';
  }).trim();
}

function r4MouthDraw(u, S, f, sx) {
  const C = R3, P = f ? (d) => r4MapPath(d, f) : (d) => d;
  const ln = (d, w, op) => `<path d="${P(d)}" fill="none" stroke="${C.mouth}" stroke-width="${w || 2.7}" stroke-linecap="round" stroke-linejoin="round"${op ? ` opacity="${op}"` : ''}/>`;
  const many = (a) => (a || []).map(e => ln(e[0], e[1], e[2])).join('');
  let s = (S.raw ? S.raw(C) : '') + many(S.before);
  if (S.line) s += ln(S.line, S.w);
  if (S.d) {
    const d = P(S.d), id = `mv${u}`;
    let tg = '';
    if (S.tongue) {
      const t = S.tongue, c = f ? f(t[0], t[1]) : [t[0], t[1]];
      tg = `<ellipse cx="${+c[0].toFixed(2)}" cy="${+c[1].toFixed(2)}" rx="${+(t[2] * (sx || 1)).toFixed(2)}" ry="${t[3]}" fill="${C.tongue}"/>`;
    }
    s += `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${C.mouth}" stroke="${C.mouth}" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<g clip-path="url(#${id})">${tg}${S.teeth ? `<path d="${P(S.teeth)}" fill="#fff"/>` : ''}</g>`;
  }
  return s + many(S.extra) + many(S.after);
}

// Bocca frontale (firma invariata)
function r4Mouth(u, key) {
  const S = R4_MOUTH_FRONT[key] || R4_MOUTH_FRONT.X;
  return r4MouthDraw(u, S);
}

// Bocca per vista: 'front' (= r4Mouth) · 'tq' tre quarti (coordinate frontali, metà lontana compressa:
// va ancora dentro la trasformazione 'muz' di r4Face) · 'side' profilo (coordinate assolute del muso
// di profilo, NON va più passata per r4g(mo, 48, .5, 80)). k = quanto è girato (0..1, solo per 'tq').
function r4MouthView(u, key, view, k) {
  if (view === 'side') return r4MouthDraw(u, R4_MOUTH_SIDE[key] || R4_MOUTH_SIDE.X);
  if (view === 'tq') {
    k = k == null ? 1 : Math.max(0, Math.min(1, k));
    if (!k) return r4Mouth(u, key);
    const far = 1 - .3 * k, near = 1 + .03 * k;
    const f = (x, y) => [80 + (x - 80) * (x > 80 ? far : near) + 1.2 * k, y + (x > 80 ? -(x - 80) * .02 * k : 0)];
    return r4MouthDraw(u, R4_MOUTH_FRONT[key] || R4_MOUTH_FRONT.X, f, (near + far) / 2);
  }
  return r4Mouth(u, key);
}

// ---------- motore di labiale ----------
const R4_LS = {
  it: { pct: 'percento', eur: 'euro', usd: 'dollari', amp: 'e', plus: 'più', eq: 'uguale', dec: 'virgola' },
  en: { pct: 'percent', eur: 'euros', usd: 'dollars', amp: 'and', plus: 'plus', eq: 'equals', dec: 'point' }
};

function r4NumWords(n, lang) {
  n = Math.floor(n);
  if (lang === 'en') {
    const a = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');
    const t = ',,twenty thirty forty fifty sixty seventy eighty ninety'.split(/[ ,]/);
    const w = (x) => x < 20 ? a[x] : x < 100 ? t[Math.floor(x / 10)] + (x % 10 ? ' ' + a[x % 10] : '') :
      x < 1000 ? a[Math.floor(x / 100)] + ' hundred' + (x % 100 ? ' ' + w(x % 100) : '') :
      x < 1e6 ? w(Math.floor(x / 1000)) + ' thousand' + (x % 1000 ? ' ' + w(x % 1000) : '') :
      w(Math.floor(x / 1e6)) + ' million' + (x % 1e6 ? ' ' + w(x % 1e6) : '');
    return w(n);
  }
  const a = 'zero uno due tre quattro cinque sei sette otto nove dieci undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove'.split(' ');
  const t = ',,venti trenta quaranta cinquanta sessanta settanta ottanta novanta'.split(/[ ,]/);
  const w = (x) => {
    if (x < 20) return a[x];
    if (x < 100) { const d = t[Math.floor(x / 10)], u = x % 10; return u ? (u === 1 || u === 8 ? d.slice(0, -1) : d) + a[u] : d; }
    if (x < 1000) { const c = Math.floor(x / 100), r = x % 100; return (c > 1 ? a[c] : '') + 'cento' + (r ? w(r) : ''); }
    if (x < 1e6) { const m = Math.floor(x / 1000), r = x % 1000; return (m > 1 ? w(m) + 'mila' : 'mille') + (r ? w(r) : ''); }
    const m = Math.floor(x / 1e6), r = x % 1e6; return (m > 1 ? w(m) + ' milioni' : 'un milione') + (r ? ' ' + w(r) : '');
  };
  return w(n);
}

// testo -> unità {c (lettera minuscola senza accento o simbolo), acc, i (indice nel testo originale)}
function r4LSUnits(text, lang) {
  const L = R4_LS[lang] || R4_LS.it, U = [];
  const push = (str, i) => { for (const ch of str) U.push({ c: ch, acc: false, i }); };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/[0-9]/.test(ch)) {
      let j = i; while (j < text.length && /[0-9]/.test(text[j])) j++;
      let num = text.slice(i, j);
      // separatore delle migliaia (1.000 in it, 1,000 in en)
      const th = lang === 'en' ? ',' : '.';
      while (text[j] === th && /^[0-9]{3}(?![0-9])/.test(text.slice(j + 1))) { num += text.slice(j + 1, j + 4); j += 4; }
      push(' ' + r4NumWords(+num, lang) + ' ', i);
      const dc = lang === 'en' ? '.' : ',';
      if (text[j] === dc && /[0-9]/.test(text[j + 1] || '')) { push(L.dec + ' ', j); i = j; continue; }
      i = j - 1; continue;
    }
    const sym = { '%': L.pct, '€': L.eur, '$': L.usd, '&': L.amp, '+': L.plus, '=': L.eq }[ch];
    if (sym) { push(' ' + sym + ' ', i); continue; }
    const base = ch.normalize('NFD');
    const letter = base[0].toLowerCase();
    U.push({ c: letter, acc: base.length > 1 && /[aeiouy]/.test(letter), i });
  }
  return U;
}

// Restituisce [{t, key, i}] (t in secondi dall'inizio, key visema, i indice del carattere nel testo).
// L'ultimo elemento è sempre {t: durata totale, key: 'X'}.
// opts: lang 'it'|'en' (default 'it'), rate (1 = normale, 2 = doppia velocità),
//       vowel/cons durate base in s, pause {comma, stop, long, dash} in s.
function r4LipSync(text, opts) {
  opts = opts || {};
  const lang = opts.lang === 'en' ? 'en' : 'it', rate = opts.rate || 1;
  const PV = opts.vowel || .1, PC = opts.cons || .065;
  const PZ = Object.assign({ comma: .24, stop: .48, long: .65, dash: .2, line: .5 }, opts.pause || {});
  const U = r4LSUnits(String(text || ''), lang);
  const isV = (c) => /[aeiou]/.test(c) || (lang === 'en' && c === 'y');
  const isL = (c) => /[a-z]/.test(c);
  const ph = []; // {key, d, i, pause}
  const add = (key, d, i, pause) => ph.push({ key, d: d / rate, i, pause: !!pause });
  const pause = (d, i) => { if (ph.length && ph[ph.length - 1].pause) ph[ph.length - 1].d = Math.max(ph[ph.length - 1].d, d / rate); else add('X', d, i, true); };
  const at = (k) => (U[k] || { c: ' ' }).c;
  const wordEnd = (k) => !isL(at(k + 1));
  const wordStart = (k) => !isL(at(k - 1));
  for (let k = 0; k < U.length; k++) {
    const { c, acc, i } = U[k];
    const n1 = at(k + 1), n2 = at(k + 2), p1 = at(k - 1);
    // punteggiatura e spazi
    if (!isL(c)) {
      if (c === '.' && n1 === '.' && n2 === '.') { pause(PZ.long, i); k += 2; continue; }
      if (c === '…') { pause(PZ.long, i); continue; }
      if (/[.!?]/.test(c)) { pause(PZ.stop, i); continue; }
      if (/[,;:]/.test(c)) { pause(c === ',' ? PZ.comma : PZ.comma * 1.3, i); continue; }
      if (/[—–]/.test(c) || (c === '-' && (p1 === ' ' || n1 === ' '))) { pause(PZ.dash, i); continue; }
      if (c === '\n') { pause(PZ.line, i); continue; }
      continue; // spazi, apostrofi, virgolette: parlato legato
    }
    // doppie (solo italiano): la prima lettera si salta, la seconda dura di più
    let dbl = 1;
    if (lang === 'it' && !isV(c) && c === n1) continue;
    if (lang === 'it' && !isV(c) && c === p1) dbl = 1.75;
    if (lang === 'it' && c === 'q' && n1 === 'q') continue;
    if (isV(c)) {
      // i muta: ci/gi/sci/gli + vocale
      if (lang === 'it' && c === 'i' && /[cg]/.test(p1) && isV(n1) && !acc) continue;
      // u semivocale: qu, gu + vocale -> breve arrotondamento
      if (c === 'u' && (p1 === 'q' || (p1 === 'g' && lang === 'it')) && isV(n1)) { add('O', .055, i); continue; }
      let key = { a: 'A', e: 'E', i: 'E', o: 'O', u: 'O', y: 'E' }[c], d = PV;
      if (lang === 'en') {
        if (c === 'e' && wordEnd(k) && k > 2 && isL(at(k - 3)) && !isV(p1)) continue; // e muta finale (make, time)
        if (c === 'o' && n1 === 'o') { add('O', PV * 1.4, i); k++; continue; }
        if (c === 'e' && /[ea]/.test(n1)) { add('E', PV * 1.3, i); k++; continue; }
        if (c === 'o' && /[uw]/.test(n1)) { add('A', PV * .7, i); add('O', PV * .7, i); k++; continue; }
        if (c === 'a' && /[iy]/.test(n1)) { add('E', PV * 1.2, i); k++; continue; }
        if (c === 'a' && !isV(n1) && n2 === 'e' && wordEnd(k + 2)) key = 'E';
        if (c === 'i' && (wordEnd(k) || (n1 === 'g' && n2 === 'h') || (!isV(n1) && n2 === 'e' && wordEnd(k + 2)))) key = 'A';
        if (c === 'i' && wordStart(k) && !isL(n1)) key = 'A'; // "I", "I'm"
        if (c === 'o' && n1 === 'a') { add('O', PV * 1.3, i); k++; continue; }
        if (c === 'u' && !/[oe]/.test(p1)) key = 'A';
        if (c === 'y' && wordStart(k)) { add('E', PC, i); continue; }
      }
      if (acc) d *= 1.35;                                       // accento: vocale tonica più lunga
      if (isV(n1)) d *= .7;                                     // dittongo / iato
      if (wordEnd(k) && /[.!?,;:…\n]/.test(at(k + 1) === ' ' ? at(k + 2) : at(k + 1))) d *= 1.25; // vocale prima di una pausa
      add(key, d, i);
      continue;
    }
    // consonanti
    if (c === 'h') { if (lang === 'en' && wordStart(k) && n1 !== ' ') add('E', PC * .6, i); continue; }
    if (/[mbp]/.test(c)) {
      if (lang === 'en' && c === 'p' && n1 === 'h') { add('F', PC * 1.1, i); k++; continue; }
      if (lang === 'en' && c === 'm' && n1 === 'b' && wordEnd(k + 1)) { add('M', PC, i); k++; continue; }
      add('M', PC * 1.1 * dbl, i); continue;
    }
    if (/[fv]/.test(c)) { add('F', PC * 1.15 * dbl, i); continue; }
    if (c === 'w') { add('O', PC * 1.1, i); if (n1 === 'h') k++; continue; }
    if (lang === 'en') {
      if ((c === 's' || c === 'c') && n1 === 'h') { add('O', PC * 1.3, i); k++; continue; }
      if (c === 't' && n1 === 'h') { add('E', PC * 1.2, i); k++; continue; }
      if (c === 'j') { add('O', PC, i); continue; }
      if (c === 'c' && n1 === 'k') { add('E', PC, i); k++; continue; }
      if (c === 'g' && n1 === 'h') { k++; continue; }
      if (c === 'k' && n1 === 'n' && wordStart(k)) continue;
    } else {
      if (c === 's' && n1 === 'c' && /[ei]/.test(n2)) { add('O', PC * 1.4, i); k++; continue; } // sci, sce
      if (c === 'g' && n1 === 'n') { add('E', PC * 1.3, i); k++; continue; }                   // gn
      if (c === 'g' && n1 === 'l' && n2 === 'i') { add('E', PC * 1.2, i); k++; continue; }     // gli
      if (/[cg]/.test(c) && /[ei]/.test(n1)) { add('O', PC * dbl, i); continue; }              // c/g dolce: labbra in avanti
    }
    add('E', (c === 'r' ? .8 : c === 's' || c === 'z' ? 1.25 : 1) * PC * dbl, i);
  }
  // sequenza temporizzata, unendo chiavi uguali consecutive
  const seq = []; let t = 0;
  for (const p of ph) {
    if (!seq.length && p.key === 'X') { t += p.d; continue; }
    if (seq.length && seq[seq.length - 1].key === p.key) { t += p.d; continue; }
    seq.push({ t: +t.toFixed(3), key: p.key, i: p.i }); t += p.d;
  }
  // la pausa finale non serve: la bocca si chiude alla fine del parlato
  if (seq.length && seq[seq.length - 1].key !== 'X') seq.push({ t: +t.toFixed(3), key: 'X', i: String(text || '').length });
  return seq;
}

function r4LipSyncDuration(seq) { return seq && seq.length ? seq[seq.length - 1].t : 0; }

// Versione "levigata": nessun visema più breve di minHold (default 0.06 s).
// Le labiali (M, F) si vedono sempre: se troppo brevi rubano tempo al vicino; gli altri si fondono col precedente.
// Prima di una pausa lunga dopo una A si passa un attimo per E (chiusura morbida).
const R4_LS_CACHE = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
function r4LipSmooth(seq, minHold) {
  minHold = minHold == null ? .06 : minHold;
  if (!seq || !seq.length) return [];
  const ck = R4_LS_CACHE && R4_LS_CACHE.get(seq);
  if (ck && ck.m === minHold) return ck.s;
  let s = seq.map(e => ({ t: e.t, key: e.key, i: e.i }));
  const end = s[s.length - 1].t;
  const dur = (j) => (j + 1 < s.length ? s[j + 1].t : end + minHold) - s[j].t;
  for (let pass = 0; pass < 3; pass++) {
    for (let j = 0; j < s.length - 1; j++) {
      if (dur(j) >= minHold - 1e-6) continue;
      const lab = s[j].key === 'M' || s[j].key === 'F';
      if (lab && j + 1 < s.length - 1 && dur(j + 1) - (minHold - dur(j)) >= minHold) { s[j + 1].t = +(s[j].t + minHold).toFixed(3); continue; }
      if (lab && j > 0 && dur(j - 1) - (minHold - dur(j)) >= minHold) { s[j].t = +(s[j + 1].t - minHold).toFixed(3); continue; }
      if (j > 0) { s.splice(j, 1); j--; } else if (s.length > 2) { s.splice(1, 1); j--; }
    }
    s = s.filter((e, j) => !j || e.key !== s[j - 1].key || j === s.length - 1);
  }
  // chiusura morbida: A -> (pausa >= .2 s) diventa A -> E (60 ms) -> X
  const out = [];
  for (let j = 0; j < s.length; j++) {
    out.push(s[j]);
    const nx = s[j + 1];
    if (nx && s[j].key === 'A' && nx.key === 'X' && dur(j) >= minHold * 2 && (j + 2 >= s.length || dur(j + 1) >= .2))
      out.push({ t: +(nx.t - minHold).toFixed(3), key: 'E', i: s[j].i });
  }
  if (R4_LS_CACHE) R4_LS_CACHE.set(seq, { m: minHold, s: out });
  return out;
}

// Chiave della bocca al tempo t (s). opts: minHold (0.06), lead (anticipo delle labbra sul suono, 0.03 s).
// Prima dell'inizio, nelle pause e dopo la fine: 'X'.
function r4MouthAt(seq, t, opts) {
  opts = opts || {};
  const s = r4LipSmooth(seq, opts.minHold);
  if (!s.length) return 'X';
  t += opts.lead == null ? .03 : opts.lead;
  if (t < s[0].t || t >= s[s.length - 1].t) return 'X';
  let lo = 0, hi = s.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (s[mid].t <= t) lo = mid; else hi = mid - 1; }
  return s[lo].key;
}
// come r4MouthAt ma restituisce anche l'indice del carattere: {key, i}
function r4MouthStateAt(seq, t, opts) {
  opts = opts || {};
  const s = r4LipSmooth(seq, opts.minHold);
  if (!s.length) return { key: 'X', i: -1 };
  const tt = t + (opts.lead == null ? .03 : opts.lead);
  if (tt < s[0].t || tt >= s[s.length - 1].t) return { key: 'X', i: tt >= s[s.length - 1].t ? s[s.length - 1].i : -1 };
  let lo = 0; while (lo + 1 < s.length && s[lo + 1].t <= tt) lo++;
  return { key: s[lo].key, i: s[lo].i };
}
// Occhi ed espressioni
// Opzioni lette da r4Face(u, m, o) (oltre a face, k, look, mouth, hideR, sideMuzzle passate dalle viste):
//   o.blink    0 = aperto … 1 = chiuso. Numero (entrambi gli occhi) oppure {L:0..1, R:0..1}. Vale per ogni mood.
//   o.eyeTurn  intensità dello spostamento della pupilla verso il bordo nell'occhio compresso (default 1; 0 = pupilla centrata).
//   o.headClip ritaglia l'occhio lontano sul contorno della testa nel 3/4 (default true; false per disattivare).
//   o.fx       false = niente decorazioni sopra la testa (cuori, zzz, stelline, segni di rabbia, scintille). Lacrime e sudore restano.
//   o.face.fx  [dx] spostamento orizzontale delle decorazioni sopra la testa (default: 0.6 × dx dell'occhio lontano).
// Gli occhi con una trasformazione in o.face (eyeL/eyeR = [dx, sx]) sono disegnati "nativamente": il bianco si comprime,
// ma iride e pupilla si comprimono meno (sfera di scorcio), si spostano verso il bordo dello sguardo e i riflessi restano tondi;
// archi (occhi chiusi) e sopracciglia vengono rimappati punto per punto, così lo spessore del tratto resta uniforme.
const R4_FACE_MOODS = ['neutral', 'happy', 'celebrating', 'thinking', 'sad', 'wrong', 'correct',
  'surprised', 'angry', 'love', 'sleepy', 'wink', 'dizzy', 'smug', 'crying', 'proud', 'determined', 'nervous', 'laugh'];

const r4f = (v) => +v.toFixed(2);
// rimappa le x di un path assoluto (M L Q C) con x -> cx + dx + (x - cx) * sx
function r4MapD(d, t, cx) {
  if (!t || (!t[0] && (t[1] == null || t[1] === 1))) return d;
  const dx = t[0] || 0, sx = t[1] == null ? 1 : t[1];
  return d.replace(/([MLQC])([^MLQCZ]*)/g, (all, cmd, args) => {
    const n = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    for (let i = 0; i < n.length; i += 2) n[i] = r4f(cx + dx + (n[i] - cx) * sx);
    return cmd + n.join(' ') + ' ';
  }).trim();
}
function r4Blink(o, side) {
  const b = o && o.blink;
  const v = b == null ? 0 : (typeof b === 'object' ? (b[side] || 0) : b);
  return Math.max(0, Math.min(1, +v || 0));
}

function r4Eye(u, m, side, o) {
  const C = R3; o = o || {};
  const cx = side === 'L' ? 63 : 97, cy = 46;
  const es = m === 'surprised' ? 1.1 : 1; // occhio un po' più grande quando è sorpreso
  const rx = 12 * es, ry = 13.4 * es;
  const sgn = side === 'L' ? 1 : -1;
  // trasformazione della vista: nativa (niente scale sul gruppo intero)
  const T = o.eyeT, tx = T ? (T[0] || 0) : 0, sx = T ? (T[1] == null ? 1 : T[1]) : 1;
  const nat = !!T && (tx !== 0 || sx !== 1);
  const X = nat ? (v) => r4f(cx + tx + (v - cx) * sx) : (v) => v;
  const isx = nat ? 1 - (1 - sx) * .55 : 1; // iride: si comprime meno del bianco
  const bl = r4Blink(o, side);
  const closedLine = (w) => `<path d="M${X(cx - 10)} ${cy + 3} Q${X(cx)} ${cy + 7.5} ${X(cx + 10)} ${cy + 3}" fill="none" stroke="${C.ink}" stroke-width="${w || 3.6}" stroke-linecap="round"${w ? '' : ''}/>`;
  const arc = (up, w) => `<path d="M${X(cx - 9.5)} ${cy + (up ? 3 : -2)} Q${X(cx)} ${cy + (up ? -8 : 7)} ${X(cx + 9.5)} ${cy + (up ? 3 : -2)}" fill="none" stroke="${C.ink}" stroke-width="${w || 4.2}" stroke-linecap="round"/>`;
  // occhi già chiusi (il battito non li cambia)
  if (m === 'celebrating') return arc(true);
  if (m === 'laugh') return arc(true, 4.8);
  if (m === 'wink' && (side === 'R' || o.hideR)) return arc(true);
  if (m === 'crying') {
    const q = (dx) => X(side === 'R' ? cx - dx : cx + dx);
    return `<path d="M${q(-9)} ${cy - 3} L${q(1)} ${cy + 1} L${q(-9)} ${cy + 5}" fill="none" stroke="${C.ink}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  const grp = (inner, s2) => nat ? `<g${r4tf(tx, s2 == null ? sx : s2, cx)}>${inner}</g>` : inner;
  if (m === 'love') {
    if (bl >= .5) return closedLine();
    return grp(`<path d="M${cx} ${cy + 10} C${cx - 16} ${cy} ${cx - 13} ${cy - 13} ${cx - 6} ${cy - 11} C${cx - 3} ${cy - 10} ${cx - 1} ${cy - 8} ${cx} ${cy - 5} C${cx + 1} ${cy - 8} ${cx + 3} ${cy - 10} ${cx + 6} ${cy - 11} C${cx + 13} ${cy - 13} ${cx + 16} ${cy} ${cx} ${cy + 10} Z" fill="#FF4B8B"/>`, isx) +
      `<ellipse cx="${X(cx - 6)}" cy="${cy - 6}" rx="3" ry="2" fill="#fff" opacity=".85"/>`;
  }
  if (m === 'dizzy' && bl >= .5) return closedLine();
  let look = m === 'thinking' ? [2.6, -4] : (m === 'sad' || m === 'wrong') ? [0, 3] : m === 'smug' ? [3.5, 1] : m === 'sleepy' ? [0, 3] :
    m === 'proud' ? [1, -2.2] : m === 'nervous' ? [-2.6, 1] : m === 'determined' ? [.6, .4] : [1, 1.2];
  if (o.look) look = o.look;
  const lid = {
    neutral: [3.5, 6], walking: [3.5, 6], happy: [0, 0], correct: [0, 0], wink: [0, 0], love: [0, 0],
    thinking: side === 'L' ? [1, -4] : [7, 4], sad: [8, -16], wrong: [7, -12],
    surprised: [-8, 0], angry: [7, 18], sleepy: [12, 0], smug: [9.5, 3], dizzy: [-8, 0],
    proud: [5, 3], determined: [8, 13], nervous: [3, -12]
  }[m] || [3, 5];
  const big = m === 'surprised' ? .66 : m === 'nervous' ? .8 : m === 'determined' ? 1.05 : 1;
  const bottom = (m === 'happy' || m === 'correct' || m === 'wink' || m === 'proud') ? `<ellipse cx="${cx}" cy="${cy + 20}" rx="17" ry="10" fill="${C.B}"/>` : '';
  const k = `e${side}`;
  let iris;
  if (m === 'dizzy') {
    iris = grp(`<path d="M${cx} ${cy} m0 -1.5 a1.5 1.5 0 1 1 -1.5 1.5 a3.5 3.5 0 1 1 3.5 3.5 a5.5 5.5 0 1 1 -5.5 -5.5 a7.5 7.5 0 1 1 7.5 7.5" fill="none" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round"/>`, isx);
  } else if (!nat) {
    const px = cx + look[0], py = cy + look[1];
    iris = `<g class="r3-look"><circle cx="${px}" cy="${py}" r="${7.8 * big}" fill="${C.iris}"/><circle cx="${px + .4}" cy="${py + .4}" r="${5.4 * big}" fill="${C.ink}"/>` +
      `<circle cx="${px + 2.7 * big}" cy="${py - 3 * big}" r="${2.9 * big}" fill="#fff"/><circle cx="${px - 2.5 * big}" cy="${py + 2.7 * big}" r="${1.25 * big}" fill="#fff"/></g>`;
  } else {
    // occhio di scorcio: pupilla verso la direzione dello sguardo (bordo destro), iride poco compressa, riflessi tondi
    const turnAmt = o.eyeTurn == null ? 1 : o.eyeTurn;
    const irx = 7.8 * big * isx, wrx = rx * sx;
    let px = X(cx + look[0]) + (1 - sx) * 5 * turnAmt;
    px = Math.min(px, X(cx) + wrx - irx * .8); px = Math.max(px, X(cx) - wrx + irx * .8);
    const py = cy + look[1], hr = .8 + .2 * sx;
    iris = `<g class="r3-look"><ellipse cx="${r4f(px)}" cy="${py}" rx="${r4f(irx)}" ry="${r4f(7.8 * big)}" fill="${C.iris}"/>` +
      `<ellipse cx="${r4f(px + .4 * isx)}" cy="${py + .4}" rx="${r4f(5.4 * big * isx)}" ry="${r4f(5.4 * big)}" fill="${C.ink}"/>` +
      `<circle cx="${r4f(px + 2.2 * big * isx)}" cy="${r4f(py - 3 * big)}" r="${r4f(2.9 * big * hr)}" fill="#fff"/>` +
      `<circle cx="${r4f(px - 2.3 * big * isx)}" cy="${r4f(py + 2.7 * big)}" r="${r4f(1.25 * big * hr)}" fill="#fff"/></g>`;
  }
  // palpebra superiore (+ battito)
  let lidY = lid[0], lidR = lid[1] * sgn, lower = '', lash = '';
  if (bl > 0) {
    const shut = 17 * es; // il bordo della palpebra arriva a cy + 4
    lidY = r4f(lid[0] + (Math.max(lid[0], shut) - lid[0]) * bl);
    lidR = r4f(lidR * (1 - bl));
    const ly = r4f(cy + ry + 1 - (ry - 3) * bl);
    lower = `<rect x="${cx - 18}" y="${ly}" width="36" height="26" fill="${C.B}"/>`;
    const op = Math.max(0, Math.min(1, (bl - .55) / .3));
    if (op > 0) lash = `<g opacity="${r4f(op)}">${closedLine()}</g>`;
  }
  const lidS = `<g class="r3-blink"><g transform="translate(0 ${lidY}) rotate(${lidR} ${cx} ${cy - 13})"><rect x="${cx - 18}" y="${cy - 39}" width="36" height="26" fill="${C.B}"/></g>${lower}</g>`;
  const erx = nat ? r4f(rx * sx) : rx;
  if (bl >= .97) return lash; // chiuso del tutto: resta solo la linea delle ciglia
  // durante il battito le palpebre usano un ritaglio appena più largo, così non resta il filo bianco del bordo
  const clipB = bl > 0 ? `<clipPath id="${k}b${u}"><ellipse cx="${X(cx)}" cy="${cy}" rx="${r4f(erx + .9)}" ry="${r4f(ry + .9)}"/></clipPath>` : '';
  return `<clipPath id="${k}${u}"><ellipse cx="${X(cx)}" cy="${cy}" rx="${erx}" ry="${ry}"/></clipPath>` + clipB +
    `<ellipse cx="${X(cx)}" cy="${cy}" rx="${erx}" ry="${ry}" fill="#fff"/>` +
    `<g clip-path="url(#${k}${u})">` +
    grp(`<ellipse cx="${cx}" cy="${cy - 14}" rx="15" ry="5" fill="${C.eyeShade}"/>`) + iris + (bl > 0 ? '' : grp(bottom + lidS)) +
    `</g>` + (bl > 0 ? `<g clip-path="url(#${k}b${u})">${grp(bottom + lidS)}</g>` : '') + lash;
}

// 6 forme di bocca: X riposo · A · E · O · M (m/b/p) · F (f/v)
function r4Face(u, m, o) {
  const C = R3; o = o || {};
  const T = o.face || {}; // trasformazioni per elemento (3/4, profilo)
  const isId = (t) => !t || (!t[0] && (t[1] == null || t[1] === 1));
  const tw = (inner, k, cx) => { const t = T[k]; return t ? r4g(inner, t[0], t[1], cx) : inner; };
  let s = '';
  // occhi: con trasformazione -> disegno nativo; senza -> identico a v3
  const eye = (sd) => {
    const k = 'eye' + sd, cx = sd === 'L' ? 63 : 97;
    if (isId(T[k])) return tw(r4Eye(u, m, sd, o), k, cx);
    return r4Eye(u, m, sd, Object.assign({}, o, { eyeT: T[k] }));
  };
  const turned = !isId(T.eyeL) || !isId(T.eyeR);
  // occhio e sopracciglio lontani: ritagliati sulla sagoma della testa (o.headPath dalle viste, altrimenti quella frontale)
  const farClip = !o.hideR && !isId(T.eyeR) && !o.sideMuzzle && o.headClip !== false;
  const hcR = (inner) => (!farClip || !inner) ? inner : `<g clip-path="url(#hcR${u})">${inner}</g>`;
  if (farClip) s += `<clipPath id="hcR${u}"><path d="${o.headPath || 'M80 16 C111 16 129 34 129 58 C129 80 111 95 80 95 C49 95 31 80 31 58 C31 34 49 16 80 16 Z'}"/></clipPath>`;
  const eR = o.hideR ? '' : hcR(eye('R'));
  s += `<g class="r3-eyes">${eye('L')}${eR}</g>`;
  // sopracciglia
  const br = (d, w) => `<path d="${d}" fill="none" stroke="${C.brow}" stroke-width="${w || 4.4}" stroke-linecap="round"/>`;
  let bL = '', bR = '', bw;
  if (m === 'thinking') bL = 'M53 27 Q62 20.5 72 26';
  if (m === 'sad' || m === 'wrong' || m === 'crying') { bL = 'M53 31.5 Q62 31 70.5 25.5'; bR = 'M89.5 25.5 Q98 31 107 31.5'; }
  if (m === 'celebrating' || m === 'correct') { bL = 'M54 28 Q63 22 72 27'; bR = 'M88 27 Q97 22 106 28'; }
  if (m === 'surprised' || m === 'dizzy') { bL = 'M53 22 Q62 14 72 20'; bR = 'M88 20 Q98 14 107 22'; }
  if (m === 'angry') { bL = 'M52 24 L72 33'; bR = 'M88 33 L108 24'; bw = 5.2; }
  if (m === 'smug') { bL = 'M53 24 Q62 17.5 71 22.5'; bR = 'M89 30.5 Q98 29 107 30.5'; }
  if (m === 'wink') { bR = 'M88 30 Q97 27 106 31'; }
  if (m === 'sleepy') { bL = 'M54 30.5 Q62 28 71 30.5'; bR = 'M89 30.5 Q98 28 106 30.5'; }
  if (m === 'proud') { bL = 'M53 25 Q62 18.5 72 23.5'; bR = 'M88 23.5 Q98 18.5 107 25'; }
  if (m === 'determined') { bL = 'M53 26 Q63 26.5 72 31.5'; bR = 'M88 31.5 Q97 26.5 107 26'; bw = 4.8; }
  if (m === 'nervous') { bL = 'M53 30 Q61 29.5 70 23.5'; bR = 'M90 23.5 Q99 29.5 107 30'; }
  if (m === 'laugh') { bL = 'M54 25.5 Q63 19 72 24'; bR = 'M88 24 Q97 19 106 25.5'; }
  const brow = (d, k, cx) => {
    if (!d) return '';
    const t = T[k];
    if (isId(t)) return tw(br(d, bw), k, cx);
    // profilo: sopracciglio meno compresso e più spesso, leggibile anche a 80 px
    if (o.hideR) return br(r4MapD(d, [t[0], 1 - (1 - (t[1] == null ? 1 : t[1])) * .5], cx), r4f((bw || 4.4) * 1.3));
    return br(r4MapD(d, t, cx), bw);
  };
  s += brow(bL, 'eyeL', 63) + (o.hideR ? '' : hcR(brow(bR, 'eyeR', 97)));
  // guance
  const blush = (m === 'sad' || m === 'wrong' || m === 'angry') ? .18 : (m === 'love' || m === 'smug' ? .6 :
    (m === 'proud' || m === 'laugh') ? .55 : (m === 'nervous' || m === 'determined') ? .26 : .38);
  s += tw(`<ellipse cx="45" cy="72" rx="7.5" ry="4.2" fill="${C.cheek}" opacity="${blush}"/>`, 'cheekL', 45) +
    (o.hideR ? '' : tw(`<ellipse cx="115" cy="72" rx="7.5" ry="4.2" fill="${C.cheek}" opacity="${blush}"/>`, 'cheekR', 115));
  // muso (+ narici, anello, bocca)
  let mz = '';
  if (o.sideMuzzle) {
    const d = 'M100 58 C124 55 146 63 147 77 C148 91 132 98 112 97 C99 96.4 91 89 91 78 C91 67 93 59 100 58 Z';
    mz += r3Part(u, 'mz', d, C.muzS, `<ellipse cx="114" cy="74" rx="27" ry="16" fill="${C.muzB}"/><ellipse cx="116" cy="63.5" rx="14" ry="3.2" fill="${C.muzH}"/>`);
    mz += `<g transform="translate(9 0)"><path d="M128 67.5 C132 67.4 134 71 133.4 74.6 C132.8 77.6 128.4 78.2 126.8 75.8 C125.2 73 125.6 67.6 128 67.5 Z" fill="${C.nostril}"/><ellipse cx="129.6" cy="73.6" rx="1.9" ry="2.6" fill="${C.nostrilIn}"/></g>`;
    mz += `<g transform="translate(9 0)"><path d="M126 80 A4.4 4.4 0 1 0 134.6 80" fill="none" stroke="${C.goldS}" stroke-width="3" stroke-linecap="round"/><path d="M126 80 A4.4 4.4 0 1 0 134.6 80" fill="none" stroke="${C.gold}" stroke-width="1.5" stroke-linecap="round"/></g>`;
  } else {
    const muz = 'M80 58 C99 58 111 66 111 77 C111 89 98 96 80 96 C62 96 49 89 49 77 C49 66 61 58 80 58 Z';
    const kk = o.k || 0;
    // facing left: l'SVG viene specchiato, quindi la luce del muso va disegnata dal lato opposto (resta in alto a sinistra a schermo)
    const lx = (x) => o.facing === 'left' ? r4f(160 - x) : x;
    mz += r3Part(u, 'mz', muz, C.muzS, `<ellipse cx="${lx(77 - 5 * kk)}" cy="73" rx="${30 - 3 * kk}" ry="16" fill="${C.muzB}"/><ellipse cx="${lx(70 - 2 * kk)}" cy="63.5" rx="15" ry="3.4" fill="${C.muzH}"/>`);
    const nos = 'M68.5 68 C72.5 67.6 75 71 74.4 74.8 C73.9 78 68.6 78.6 66.8 76 C65 73 65.6 68.3 68.5 68 Z';
    mz += `<path d="${nos}" fill="${C.nostril}"/><path d="${r3Mirror(nos)}" fill="${C.nostril}"/>`;
    mz += `<ellipse cx="70.4" cy="74" rx="2.2" ry="2.8" fill="${C.nostrilIn}"/><ellipse cx="89.6" cy="74" rx="2.2" ry="2.8" fill="${C.nostrilIn}"/>`;
    mz += `<path d="M75 79.5 A5 5 0 1 0 85 79.5" fill="none" stroke="${C.goldS}" stroke-width="3.2" stroke-linecap="round"/>` +
      `<path d="M75.6 80.6 A4.6 4.6 0 0 0 79.2 84.4" fill="none" stroke="#FFE68A" stroke-width="1.3" stroke-linecap="round"/>` +
      `<path d="M75 79.5 A5 5 0 1 0 85 79.5" fill="none" stroke="${C.gold}" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>`;
  }
  // bocca
  const line = (d, w) => `<path d="${d}" fill="none" stroke="${C.mouth}" stroke-width="${w || 2.7}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const open = (d, ty, rx, ry) => `<clipPath id="mo${u}"><path d="${d}"/></clipPath><path d="${d}" fill="${C.mouth}" stroke="${C.mouth}" stroke-width="1.4" stroke-linejoin="round"/>` +
    `<g clip-path="url(#mo${u})"><ellipse cx="80" cy="${ty}" rx="${rx}" ry="${ry}" fill="${C.tongue}"/></g>`;
  const mouths = {
    neutral: line('M71.5 89.5 Q80 93.5 88.5 89.5'),
    happy: open('M68 88 Q80 100.5 92 88 Q80 91 68 88 Z', 97, 7, 4),
    celebrating: open('M66 87 Q80 104 94 87 Q80 90.5 66 87 Z', 100.5, 8.5, 5),
    thinking: line('M73.5 91.2 Q79.5 89.6 87.5 90.6'),
    sad: line('M71.5 93.5 Q80 87.5 88.5 93.5'),
    wrong: line('M70.5 91.5 Q75.2 88.4 80 91.5 Q84.8 94.6 89.5 91.5'),
    surprised: open('M80 86 C86.6 86 88.6 91 88.6 94.4 C88.6 99 85.2 102.2 80 102.2 C74.8 102.2 71.4 99 71.4 94.4 C71.4 91 73.4 86 80 86 Z', 100.6, 5.6, 3.4),
    angry: `<path d="M68 88.6 Q80 85.6 92 88.6 L92 94 Q80 97.4 68 94 Z" fill="#fff" stroke="${C.mouth}" stroke-width="2.6" stroke-linejoin="round"/>` +
      `<path d="M68.5 91.3 Q80 89.6 91.5 91.3 M76 87.4 V95.6 M84 87.4 V95.6" fill="none" stroke="${C.mouth}" stroke-width="1.6"/>`,
    love: open('M68 88 Q80 100.5 92 88 Q80 91 68 88 Z', 97, 7, 4),
    sleepy: `<ellipse cx="80" cy="89.8" rx="3.3" ry="2.8" fill="${C.mouth}"/>`,
    wink: open('M70 88 Q82 99 92 86 Q82 90.5 70 88 Z', 96, 6, 3.6),
    dizzy: line('M68 92 Q71 88 74 92 Q77 96 80 92 Q83 88 86 92 Q89 96 92 92', 2.9),
    smug: line('M71 92 Q82 93.8 90.4 87', 3) + line('M89.2 85.6 Q91.8 86.4 91.6 89.2', 2),
    crying: open('M66 92 Q80 84 94 92 Q92 102 80 102 Q68 102 66 92 Z', 101, 8, 4),
    proud: `<path d="M68 88 Q80 98.5 92 88 Q80 93.4 68 88 Z" fill="${C.mouth}" stroke="${C.mouth}" stroke-width="1.6" stroke-linejoin="round"/>` +
      line('M66.6 86.4 Q67.4 88.6 69.4 89', 2) + line('M93.4 86.4 Q92.6 88.6 90.6 89', 2),
    determined: line('M71 91.4 Q80 89.4 89 91.4', 3.2) + line('M89 91.4 Q90.4 92 90.8 93.4', 2.2),
    nervous: `<path d="M68.5 88.6 Q74 86.8 80 88.6 Q86 90.4 91.5 88.6 L91.5 93 Q86 94.8 80 93 Q74 91.2 68.5 93 Z" fill="#fff" stroke="${C.mouth}" stroke-width="2.3" stroke-linejoin="round"/>` +
      `<path d="M69 90.8 Q74.4 89 80 90.8 Q85.6 92.6 91 90.8" fill="none" stroke="${C.mouth}" stroke-width="1.3"/>`,
    laugh: open('M64.5 86 Q80 108 95.5 86 Q80 90 64.5 86 Z', 103, 9.5, 6)
  };
  mouths.correct = mouths.celebrating; mouths.walking = mouths.neutral;
  let mo = o.mouth ? r4MouthView(u, o.mouth, o.sideMuzzle ? 'side' : (o.k > 0 ? 'tq' : 'front'), o.k) : (mouths[m] || mouths.neutral);
  if (o.sideMuzzle && !o.mouth) mo = r4g(mo, 48, .5, 80);
  mz += mo;
  // sbuffi dalle narici (classi animabili). Frontale come v3; arrabbiato: nuvolette fuori dal muso; profilo: davanti alla narice
  if (o.sideMuzzle) mz += m === 'angry' ? `<g fill="#fff" opacity=".9"><circle class="r3-puffL" cx="151" cy="84" r="3.6"/><circle cx="156" cy="90" r="2.4"/></g>` :
    `<g fill="#fff"><circle class="r3-puffL" cx="146" cy="82" r="3.4" opacity="0"/></g>`;
  else if (m === 'angry') mz += `<g fill="#fff" opacity=".9"><circle class="r3-puffL" cx="51" cy="86" r="3.8"/><circle cx="45" cy="91" r="2.6"/><circle class="r3-puffR" cx="109" cy="86" r="3.8"/><circle cx="115" cy="91" r="2.6"/></g>`;
  else mz += `<g fill="#fff"><circle class="r3-puffL" cx="63" cy="82" r="3.4" opacity="0"/><circle class="r3-puffR" cx="97" cy="82" r="3.4" opacity="0"/></g>`;
  const mzOut = o.sideMuzzle ? mz : tw(mz, 'muz', 80);
  // lacrime e sudore: seguono l'occhio a cui appartengono (nel frontale nessuna trasformazione)
  const eyeFx = (inner, sd, back) => {
    if (!inner || (sd === 'R' && o.hideR)) return '';
    const k = 'eye' + sd, t = T[k];
    // nel profilo le lacrime scendono dall'angolo posteriore dell'occhio (non sul muso)
    return isId(t) ? tw(inner, k, sd === 'L' ? 63 : 97) : r4g(inner, r4f(t[0] - ((o.sideMuzzle || o.hideR) && back ? 10 : 0)), 1, sd === 'L' ? 63 : 97);
  };
  let fxL = '', fxR = '', fxF = '';
  if (m === 'sad') fxL += `<path class="r3-tear" d="M58 66 C54.6 71.6 54 75 58 76.6 C62 75 61.4 71.6 58 66 Z" fill="#7DD3FC"/>`;
  if (m === 'crying') {
    fxL += `<path d="M56 54 C52 64 52 78 55 92" fill="none" stroke="#7DD3FC" stroke-width="5.4" stroke-linecap="round" opacity=".92"/><ellipse cx="55" cy="96" rx="3.6" ry="4.4" fill="#7DD3FC"/>`;
    fxR += `<path d="M104 54 C108 64 108 78 105 92" fill="none" stroke="#7DD3FC" stroke-width="5.4" stroke-linecap="round" opacity=".92"/><ellipse cx="105" cy="96" rx="3.6" ry="4.4" fill="#7DD3FC"/>`;
  }
  if (m === 'laugh') {
    fxL += `<path d="M50 45 C46.6 50.6 46 54 50 55.6 C54 54 53.4 50.6 50 45 Z" fill="#7DD3FC"/>`;
    fxR += `<path d="M110 45 C106.6 50.6 106 54 110 55.6 C114 54 113.4 50.6 110 45 Z" fill="#7DD3FC"/>`;
  }
  const sweat = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M0 -13 C-4.4 -6 -5.4 -1.6 0 .4 C5.4 -1.6 4.4 -6 0 -13 Z" fill="#7DD3FC"/><ellipse cx="-1.6" cy="-4.4" rx="1.2" ry="2" fill="#fff" opacity=".8"/></g>`;
  const back = m === 'sad' || m === 'crying';
  const tears = eyeFx(fxL, 'L', back) + hcR(eyeFx(fxR, 'R', back));
  // frontale: come v3 (muso, poi lacrime); girato: i rivoli di crying (e nel profilo ogni lacrima) passano dietro al muso
  s += turned && (m === 'crying' || o.hideR) ? tears + mzOut : mzOut + tears;
  // decorazioni sopra la testa (cuori, zzz, stelline…): seguono poco il giro della testa
  const fxdx = T.fx ? T.fx[0] : (o.hideR || !T.eyeR ? 0 : r4f((T.eyeR[0] || 0) * .6));
  if (m === 'wrong') fxF += `<path class="r3-sweat" d="M123 30 C118.6 37 117.6 41.4 123 43.4 C128.4 41.4 127.4 37 123 30 Z" fill="#7DD3FC"/><ellipse cx="121.4" cy="38.6" rx="1.2" ry="2" fill="#fff" opacity=".8"/>`;
  if (m === 'nervous') fxF += sweat(124, 44, 1.35) + sweat(117, 24, .7);
  let deco = '';
  const star4 = (x, y, r, c) => `<path d="M${x} ${y - r} Q${x + r * .2} ${y - r * .2} ${x + r} ${y} Q${x + r * .2} ${y + r * .2} ${x} ${y + r} Q${x - r * .2} ${y + r * .2} ${x - r} ${y} Q${x - r * .2} ${y - r * .2} ${x} ${y - r} Z" fill="${c}"/>`;
  if (m === 'angry') deco += `<g fill="#fff" opacity=".95"><circle cx="26" cy="22" r="6"/><circle cx="18" cy="14" r="4.6"/><circle cx="134" cy="22" r="6"/><circle cx="142" cy="14" r="4.6"/></g>` +
    `<path d="M109 17 Q113.5 17 113.5 12.5 M120.5 12.5 Q120.5 17 125 17 M125 24 Q120.5 24 120.5 28.5 M113.5 28.5 Q113.5 24 109 24" fill="none" stroke="#E5484D" stroke-width="3.2" stroke-linecap="round"/>`;
  if (m === 'sleepy') deco += `<g font-family="Bricolage Grotesque,Arial,sans-serif" font-weight="800" fill="#6C7CFF"><text x="116" y="30" font-size="13">z</text><text x="127" y="17" font-size="17">z</text><text x="139" y="2" font-size="22">Z</text></g>`;
  if (m === 'love') deco += `<g fill="#FF4B8B"><path d="M132 20 c-6 -6 -12 2 -6 7 l6 5 6 -5 c6 -5 0 -13 -6 -7z"/><path d="M24 12 c-4 -4 -8 1 -4 5 l4 3 4 -3 c4 -4 0 -9 -4 -5z" opacity=".8"/></g>`;
  if (m === 'dizzy') deco += `<g fill="#FFD43B" stroke="${C.ink}" stroke-width="1.4"><path d="M40 6 l2 4 4.4 .6 -3.2 3 .8 4.4 -4 -2 -4 2 .8 -4.4 -3.2 -3 4.4 -.6z"/><path d="M118 0 l2 4 4.4 .6 -3.2 3 .8 4.4 -4 -2 -4 2 .8 -4.4 -3.2 -3 4.4 -.6z"/><path d="M80 -8 l2 4 4.4 .6 -3.2 3 .8 4.4 -4 -2 -4 2 .8 -4.4 -3.2 -3 4.4 -.6z"/></g>`;
  if (m === 'proud') deco += star4(134, 22, 8, '#FFD43B') + star4(146, 38, 4.5, '#FFD43B') + star4(124, 6, 3.5, '#fff');
  if (o.fx === false) deco = '';
  fxF += deco;
  s += o.sideMuzzle ? fxF : (fxdx ? r4g(fxF, fxdx, 1, 80) : fxF);
  return s;
}

// ===== Braccia v4: omero + avambraccio (gomito), scorcio, zoccoli, oggetti in mano =====
// Senza gomito (o.elbow[sd] non definito, nessuno scorcio) disegna il braccio intero identico a v3.
// Geometria a riposo del braccio sinistro (il destro è speculare, x -> 160 - x):
//   P perno della spalla · S/E/W centri di spalla, gomito, polso (con raggi) · H centro dello zoccolo
const R4_ARM = { P: [55, 98], S: [54.4, 99], rS: 6.9, E: [41.6, 112.5], rE: 6.3, W: [36.2, 123.2], rW: 5.9, H: [36, 127] };
const R4_LIGHT = [-0.66, -0.75];      // direzione della luce (da in alto a sinistra), unitaria
const R4_CAST = [2.7, 2.5];           // spostamento dell'ombra portata sul corpo

function r4Pt(sd, p) { return sd === 'L' ? [p[0], p[1]] : [160 - p[0], p[1]]; }
function r4Rot(p, c, deg) {
  const a = deg * Math.PI / 180, cs = Math.cos(a), sn = Math.sin(a), x = p[0] - c[0], y = p[1] - c[1];
  return [c[0] + x * cs - y * sn, c[1] + x * sn + y * cs];
}
function r4N(v) { return +(+v).toFixed(2); }
// capsula rastremata: cerchio a (raggio ra) unito con tangenti al cerchio b (raggio rb)
function r4Cap(a, ra, b, rb) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 0.001;
  const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const s = Math.max(-0.95, Math.min(0.95, (ra - rb) / L)), c = Math.sqrt(1 - s * s);
  const m1 = [nx * c + ux * s, ny * c + uy * s], m2 = [-nx * c + ux * s, -ny * c + uy * s];
  const p = (o, r, m) => `${r4N(o[0] + r * m[0])} ${r4N(o[1] + r * m[1])}`;
  return `M${p(a, ra, m1)} L${p(b, rb, m1)} A${r4N(rb)} ${r4N(rb)} 0 ${s < 0 ? 1 : 0} 0 ${p(b, rb, m2)} ` +
    `L${p(a, ra, m2)} A${r4N(ra)} ${r4N(ra)} 0 ${s > 0 ? 1 : 0} 0 ${p(a, ra, m1)} Z`;
}
function r4Lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }

// ---- zoccoli (centrati in 0,0; Lf=false li specchia) ----
// 'front': visto di fronte (suola verso lo spettatore): saluto, indicare la camera, coprirsi gli occhi
function r4HoofFront(u, key) {
  const C = R3;
  return r3Part(u, key, 'M0 -7.3 C4.6 -7.3 7.9 -4.2 7.9 0 C7.9 4.4 4.6 7.5 0 7.5 C-4.6 7.5 -7.9 4.4 -7.9 0 C-7.9 -4.2 -4.6 -7.3 0 -7.3 Z', C.hoofS,
    `<ellipse cx="-1.5" cy="-1.7" rx="7" ry="6.4" fill="${C.hoofB}"/>` +
    `<ellipse cx="0.5" cy="0.9" rx="4.9" ry="4.6" fill="#45302A"/>` +
    `<ellipse cx="-3.6" cy="-4.3" rx="2.7" ry="1.15" fill="${C.hoofH}" transform="rotate(-28 -3.6 -4.3)"/>`) +
    `<path d="M0.3 -6.6 Q-0.5 0.4 0.3 7.2" fill="none" stroke="${C.hoofS}" stroke-width="1.9" stroke-linecap="round"/>`;
}
// 'grip': parte posteriore (dietro all'oggetto) + dito anteriore (sopra l'oggetto)
function r4HoofGripBack(u, key) {
  const C = R3;
  return r3Part(u, key, 'M0 -6.4 C4.4 -6.4 7.4 -3.6 7.4 0.2 C7.4 4 4.4 6.6 0 6.6 C-4.4 6.6 -7.4 4 -7.4 0.2 C-7.4 -3.6 -4.4 -6.4 0 -6.4 Z', C.hoofS,
    `<ellipse cx="-1.4" cy="-1.4" rx="6.6" ry="5.6" fill="${C.hoofB}"/><ellipse cx="-3.4" cy="-3.6" rx="2.4" ry="1" fill="${C.hoofH}" transform="rotate(-20 -3.4 -3.6)"/>`);
}
function r4HoofToe(u, key, tx, ty) {
  const C = R3;
  return `<g transform="translate(${tx} ${ty}) scale(.82) translate(${-tx} ${-ty})">` + r4HoofToe0(u, key, tx, ty, C) + `</g>`;
}
function r4HoofToe0(u, key, tx, ty, C) {
  const d = `M${tx} ${ty - 4.3} C${tx + 2.9} ${ty - 4.3} ${tx + 4.6} ${ty - 2.2} ${tx + 4.6} ${ty + 0.3} C${tx + 4.6} ${ty + 2.9} ${tx + 2.6} ${ty + 4.5} ${tx} ${ty + 4.5} ` +
    `C${tx - 2.6} ${ty + 4.5} ${tx - 4.6} ${ty + 2.9} ${tx - 4.6} ${ty + 0.3} C${tx - 4.6} ${ty - 2.2} ${tx - 2.9} ${ty - 4.3} ${tx} ${ty - 4.3} Z`;
  return r3Part(u, key, d, C.hoofS, `<ellipse cx="${tx - 0.9}" cy="${ty - 0.9}" rx="4.1" ry="3.7" fill="${C.hoofB}"/><ellipse cx="${tx - 1.8}" cy="${ty - 2.4}" rx="1.5" ry="0.7" fill="${C.hoofH}"/>`);
}

// ---- oggetti pronti da tenere in mano: o.hold = { L: R4_CUP } (sovrascrivibili: {...R4_CUP, dx: 2}) ----
// svg nelle coordinate dell'oggetto, (0,0) = centro dello zoccolo. Campi: upright (resta dritto), at ('front'|'back'|'grip'|'behind'),
// hoof (zoccolo consigliato), dx/dy (spostamento, specchiato per la mano destra), rot (inclinazione in gradi), scale, toe [x,y], mirrorR.
const R4_CUP = {
  upright: true, at: 'grip', hoof: 'grip', dx: 6.5, dy: -2, toe: [2.4, -0.2],
  svg: '<g class="r4-cup">' +
    '<path d="M7.6 -7.4 C13.6 -8.4 14.6 -0.6 7.8 0.2" fill="none" stroke="#D4C6B6" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M7.6 -6.2 C11.6 -6.6 12.2 -1.8 7.9 -1.2" fill="none" stroke="#F4EEE6" stroke-width="1.1" stroke-linecap="round"/>' +
    '<path d="M-8.6 -9 C-8.6 -1.4 -6.2 4.4 0 4.4 C6.2 4.4 8.6 -1.4 8.6 -9 Z" fill="#D4C6B6"/>' +
    '<path d="M-8.6 -9 C-8.6 -2.4 -6.8 2.6 -1.6 2.6 C1.8 2.6 3.6 -2 4.2 -9 Z" fill="#F4EEE6"/>' +
    '<path d="M-6.6 -6.4 C-6.6 -3.6 -5.8 -1.4 -4.6 0" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M-8.4 -4.6 C-3 -3.2 3 -3.2 8.4 -4.6" fill="none" stroke="#F2C440" stroke-width="1.4" opacity=".9"/>' +
    '<ellipse cx="0" cy="-9" rx="8.6" ry="2.9" fill="#FFFFFF"/>' +
    '<ellipse cx="0" cy="-8.6" rx="7" ry="2.05" fill="#6B3A1E"/>' +
    '<ellipse cx="-1.2" cy="-8.9" rx="4.2" ry="1.1" fill="#A8683A"/>' +
    '<g class="r4-steam" fill="none" stroke="#FFFFFF" stroke-linecap="round" opacity=".85">' +
    '<path d="M-3 -13 C-5 -15.5 -1 -17.5 -3 -20.5 C-4.4 -22.6 -2.6 -24 -2.6 -25" stroke-width="1.8"/>' +
    '<path d="M2.6 -13.6 C0.8 -16 4.6 -17.6 2.8 -20.4" stroke-width="1.5"/>' +
    '<path d="M-0.2 -18.6 C-1 -20 0.6 -21 0 -22.4" stroke-width="1.1" opacity=".7"/></g></g>'
};
// telefono con lo schermo verso lo spettatore (mostra qualcosa)
const R4_PHONE = {
  upright: true, at: 'grip', hoof: 'grip', dx: 3, dy: -9, toe: [1.8, -1.6],
  svg: '<g class="r4-phone">' +
    '<rect x="-7.6" y="-13.4" width="15.2" height="26.8" rx="3.4" fill="#232838"/>' +
    '<rect x="-7.6" y="-13.4" width="13.8" height="25.6" rx="3.2" fill="#3A4258"/>' +
    '<rect x="-6" y="-11" width="11.6" height="21.4" rx="1.6" fill="#7FD0F5"/>' +
    '<path d="M-6 -11 H5.6 V-3.4 L-6 6.2 Z" fill="#A6E1FA"/>' +
    '<path d="M-4.4 5.6 L-1.4 2.2 L0.8 3.8 L4 -1.4" fill="none" stroke="#F2C440" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<rect x="-4.4" y="-8.6" width="6" height="1.4" rx=".7" fill="#FFFFFF" opacity=".85"/>' +
    '<rect x="-4.4" y="-6.2" width="8.4" height="1.2" rx=".6" fill="#FFFFFF" opacity=".55"/>' +
    '<rect x="-2" y="-12.6" width="4" height="1" rx=".5" fill="#151A26"/></g>'
};
// telefono visto da dietro (Rally lo sta leggendo): dorso, fotocamera, riflesso dello schermo sul bordo
const R4_PHONE_BACK = {
  upright: true, at: 'grip', hoof: 'grip', dx: 3, dy: -9, toe: [1.8, -1.6],
  svg: '<g class="r4-phone">' +
    '<rect x="-7.6" y="-13.4" width="15.2" height="26.8" rx="3.4" fill="#8FD8FF" opacity=".45" transform="translate(0 -1.2) scale(1.08 1.06)"/>' +
    '<rect x="-7.6" y="-13.4" width="15.2" height="26.8" rx="3.4" fill="#2A3044"/>' +
    '<rect x="-7.6" y="-13.4" width="13.6" height="25.4" rx="3.2" fill="#46506B"/>' +
    '<path d="M-7 -6 L-1.4 -12.8 H1.8 L-7 -2.2 Z" fill="#FFFFFF" opacity=".16"/>' +
    '<rect x="-5.4" y="-11.4" width="6" height="7.2" rx="2" fill="#2A3044"/>' +
    '<circle cx="-3.6" cy="-9.4" r="1.3" fill="#11141D"/><circle cx="-3.6" cy="-6.2" r="1.3" fill="#11141D"/><circle cx="-0.8" cy="-7.8" r=".7" fill="#F2C440"/>' +
    '<circle cx="0" cy="3" r="2.1" fill="none" stroke="#5E6A88" stroke-width="1"/></g>'
};
// matita (in pugno, punta in alto)
const R4_PENCIL = {
  upright: true, at: 'grip', hoof: 'grip', dx: 0, dy: -4, rot: 12, toe: [1.4, -0.4],
  svg: '<g class="r4-pencil">' +
    '<path d="M-2.6 -14 L0 -21.6 L2.6 -14 Z" fill="#F3D3A3"/><path d="M0 -21.6 L2.6 -14 H0.6 Z" fill="#DDB27A"/>' +
    '<path d="M-0.95 -18.8 L0 -21.6 L0.95 -18.8 Z" fill="#3B3B3B"/>' +
    '<rect x="-2.6" y="-14" width="5.2" height="24" fill="#E0A21E"/><rect x="-2.6" y="-14" width="3.2" height="24" fill="#F7C948"/>' +
    '<rect x="-1.9" y="-13" width="1" height="21.6" rx=".5" fill="#FFE08A"/>' +
    '<rect x="-2.8" y="10" width="5.6" height="3.4" fill="#AEB5BF"/><rect x="-2.8" y="10" width="3.4" height="3.4" fill="#D3D8DF"/>' +
    '<path d="M-2.6 13.4 H2.6 V15.2 C2.6 17 -2.6 17 -2.6 15.2 Z" fill="#E86F86"/><path d="M-2.6 13.4 H0.8 V16.4 C-1.6 16.6 -2.6 16 -2.6 15.2 Z" fill="#FF94A8"/></g>'
};
// bacchetta / puntatore da lavagna
const R4_POINTER = {
  upright: true, at: 'grip', hoof: 'grip', dx: 0, dy: 8, rot: -38, toe: [1.4, 0.2],
  svg: '<g class="r4-pointer">' +
    '<path d="M-1.9 6 L-0.9 -34 H0.9 L1.9 6 Z" fill="#8A5530"/><path d="M-1.9 6 L-0.9 -34 H0 L-0.2 6 Z" fill="#B27445"/>' +
    '<path d="M-0.9 -34 H0.9 L0.7 -38.6 C0.6 -39.8 -0.6 -39.8 -0.7 -38.6 Z" fill="#F2C440"/></g>'
};
// moneta d'oro (con spessore e simbolo dell'euro), mostrata alla camera
const R4_COIN = {
  upright: true, at: 'grip', hoof: 'grip', dx: 0, dy: -8.4, toe: [0.8, -2.2], mirrorR: false,
  svg: '<g class="r4-coin">' +
    '<circle cx="1.3" cy="0.6" r="8.4" fill="#A97A12"/>' +
    '<circle cx="0" cy="0" r="8.4" fill="#C4931C"/>' +
    '<circle cx="-0.6" cy="-0.6" r="7.2" fill="#F2C440"/>' +
    '<circle cx="0" cy="0" r="5.6" fill="none" stroke="#C4931C" stroke-width="1.1"/>' +
    '<path d="M2.6 -2.6 C1.2 -4.2 -2.8 -3.8 -3 0 C-2.8 3.8 1.2 4.2 2.6 2.6 M-4.4 -0.9 H1.2 M-4.4 1.1 H0.8" fill="none" stroke="#B07F12" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M-5.4 -3.2 C-4.4 -5.4 -2.6 -6.4 -0.8 -6.6" fill="none" stroke="#FFF4C2" stroke-width="1.4" stroke-linecap="round"/></g>'
};
const R4_ITEMS = { cup: R4_CUP, phone: R4_PHONE, phoneBack: R4_PHONE_BACK, pencil: R4_PENCIL, pointer: R4_POINTER, coin: R4_COIN };
// di spalle si vede l'altra faccia: lo schermo diventa il dorso e viceversa
R4_PHONE.backItem = 'phoneBack'; R4_PHONE_BACK.backItem = 'phone';

// oggetto da tenere: nome ('cup'), {item:'cup', ...override} oppure {svg, ...}
function r4Item(h, back) {
  if (!h) return null;
  let it = typeof h === 'string' ? (R4_ITEMS[h] || null) : (h.item && R4_ITEMS[h.item]) ? Object.assign({}, R4_ITEMS[h.item], h) : h;
  if (it && back && it.backItem && R4_ITEMS[it.backItem]) { // vista di spalle: altra faccia dell'oggetto, stesse regolazioni
    const ov = typeof h === 'string' ? {} : Object.assign({}, h); delete ov.item; delete ov.svg;
    it = Object.assign({}, R4_ITEMS[it.backItem], ov);
  }
  return it;
}
// spostamento orizzontale del braccio nella vista: usa r4ViewArmDX di 40_views.js (conosce turn 0..2 e view 'back')
function r4ArmDX(sd, o) {
  if (typeof r4ViewArmDX === 'function') return r4ViewArmDX(sd, o);
  o = o || {};
  if (o.view === 'back') return 0;
  if (o.view === 'side') return sd === 'L' ? 30 : -18;
  const k = Math.max(0, Math.min(1, o.turn || 0));
  return sd === 'L' ? 6 * k : -8 * k;
}
// posizione (coordinate del personaggio) del centro dello zoccolo per una data spalla/gomito/scorcio
function r4HandPos(sd, rot, eb, f, o, reach) {
  const A = R4_ARM, P0 = r4Pt(sd, A.P), rc = reach || 1, Er = r4Pt(sd, A.E), E0 = r4Lerp(P0, Er, rc), H0 = r4Pt(sd, A.H);
  const H1 = r4Lerp(E0, [E0[0] + H0[0] - Er[0], E0[1] + H0[1] - Er[1]], (1 - 0.5 * (f || 0)) * rc);
  const p = r4Rot(r4Rot(H1, E0, eb || 0), P0, rot || 0);
  return [r4N(p[0] + r4ArmDX(sd, o)), r4N(p[1])];
}
// cinematica inversa a due ossa: dove deve andare lo zoccolo -> {armRot, elbow}
// opt: bend (+1|-1, verso del gomito), f (scorcio), reach (allungamento), view/turn (come rly4SVG)
function r4ArmIK(sd, tx, ty, opt) {
  opt = opt || {};
  const A = R4_ARM, P0 = r4Pt(sd, A.P), rc = opt.reach || 1, Er = r4Pt(sd, A.E), E0 = r4Lerp(P0, Er, rc), H0 = r4Pt(sd, A.H);
  const H1 = r4Lerp(E0, [E0[0] + H0[0] - Er[0], E0[1] + H0[1] - Er[1]], (1 - 0.5 * (opt.f || 0)) * rc);
  const l1 = Math.hypot(E0[0] - P0[0], E0[1] - P0[1]), l2 = Math.hypot(H1[0] - E0[0], H1[1] - E0[1]);
  const T = [tx - r4ArmDX(sd, opt), ty];
  let d = Math.hypot(T[0] - P0[0], T[1] - P0[1]);
  d = Math.max(Math.abs(l1 - l2) + 0.01, Math.min(l1 + l2 - 0.01, d));
  const phi = Math.atan2(T[1] - P0[1], T[0] - P0[0]);
  const Aa = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)) * (opt.bend == null ? 1 : opt.bend);
  const ua = phi + Aa, Ep = [P0[0] + l1 * Math.cos(ua), P0[1] + l1 * Math.sin(ua)];
  const fa = Math.atan2(T[1] - Ep[1], T[0] - Ep[0]);
  const a0 = Math.atan2(E0[1] - P0[1], E0[0] - P0[0]), b0 = Math.atan2(H1[1] - E0[1], H1[0] - E0[0]);
  const deg = (r) => { let v = r * 180 / Math.PI; while (v > 180) v -= 360; while (v < -180) v += 360; return Math.round(v); };
  const rot = deg(ua - a0);
  return { armRot: rot, elbow: deg(fa - b0 - (ua - a0)) };
}

// u: id univoco · sd: 'L'|'R' · o: opzioni · P: spostamenti della vista · side: profilo
// opzioni nuove (per lato): o.foreshorten {L,R} 0..1 · o.reach {L,R} 0.7..1.6 (braccio più lungo, stile cartoon) · o.hoof {L,R} 'side'|'front'|'grip'|'none' (nascosto, es. braccia incrociate) · o.hold {L,R} oggetto (vedi R4_ITEMS)
function r4Arm(u, sd, o, P, side) {
  const C = R3, A = R4_ARM;
  const Lf = sd === 'L', M = Lf ? (d) => d : r3Mirror, X = (v) => Lf ? v : 160 - v;
  const flip = o.facing === 'left'; // il disegno viene specchiato: luce e ombra portata si specchiano in coordinate del personaggio
  const LG = flip ? [-R4_LIGHT[0], R4_LIGHT[1]] : R4_LIGHT, CS = flip ? [-R4_CAST[0], R4_CAST[1]] : R4_CAST;
  const pick = (k) => o[k] ? o[k][sd] : undefined;
  let rot = pick('armRot'), eb = pick('elbow');
  if (side && Lf && rot == null) rot = -24; // nel profilo il braccio vicino pende dritto
  const f = Math.max(0, Math.min(1, +pick('foreshorten') || 0));
  const rc = Math.max(0.7, Math.min(1.6, +pick('reach') || 1)); // allungamento "cartoon" di omero e avambraccio
  const hold = r4Item(pick('hold'), o.view === 'back');
  const hoofT = pick('hoof') || (hold && hold.hoof) || (f >= 0.45 ? 'front' : 'side');
  if (eb == null && (f > 0 || rc !== 1)) eb = 0;
  const hx = X(36);
  const legacy = Lf ? (R3X.handL || '') : (R3X.handR || '');
  const tdx = (Lf ? P.armL : P.armR)[0];
  // oggetto in mano + zoccolo non laterale, in un gruppo che resta dritto: hc centro zoccolo, ang rotazione del gruppo, sc scala
  const held = (hc, ang, sc) => {
    const it = hold || {};
    const at = hold ? (it.at || 'front') : 'none';
    const up = it.upright !== false;
    const r = up ? -ang + (it.rot ? (Lf ? it.rot : -it.rot) : 0) : (it.rot ? (Lf ? it.rot : -it.rot) : 0);
    const s = sc * (it.scale || 1);
    const g0 = `<g class="r4-hold${sd}" transform="translate(${r4N(hc[0])} ${r4N(hc[1])}) rotate(${r4N(r)})${s !== 1 ? ` scale(${r4N(s)})` : ''}">`;
    const obj = hold ? `<g transform="translate(${r4N(Lf ? (it.dx || 0) : -(it.dx || 0))} ${r4N(it.dy || 0)})${!Lf && it.mirrorR !== false ? ' scale(-1 1)' : ''}">${it.svg || ''}</g>` : '';
    const hs = hoofT === 'front' ? 0.96 : 1;
    const hoofG = (inner) => `<g transform="rotate(${r4N(up ? 0 : 0)})${hs !== 1 ? ` scale(${hs})` : ''}${Lf ? '' : ' scale(-1 1)'}">${inner}</g>`;
    let back = '', front = '';
    if (hoofT === 'front') back = hoofG(r4HoofFront(u, 'hf' + sd));
    else if (hoofT === 'grip') {
      const tt = it.toe || [3, 2];
      back = hoofG(r4HoofGripBack(u, 'hg' + sd));
      front = hoofG(r4HoofToe(u, 'ht' + sd, tt[0] + (it.dx || 0) * 0, tt[1]));
    }
    // ordine: behind -> (fuori) · back: oggetto dietro lo zoccolo · grip: dietro + dito sopra · front: oggetto sopra
    if (at === 'back' || at === 'behind') return g0 + obj + back + front + `</g>`;
    if (at === 'front') return g0 + back + front + obj + `</g>`;
    return g0 + back + obj + front + `</g>`;
  };
  const v3Hoof = (key) => r3Part(u, key, `M${hx - 7.6} 127 C${hx - 7.6} 122.5 ${hx + 7.6} 122.5 ${hx + 7.6} 127 C${hx + 7.6} 132.5 ${hx - 7.6} 132.5 ${hx - 7.6} 127 Z`, C.hoofS,
      `<ellipse cx="${hx - 1.4}" cy="125.8" rx="6.4" ry="4.6" fill="${C.hoofB}"/><ellipse cx="${hx - 3}" cy="124.2" rx="2.6" ry="1" fill="${C.hoofH}"/>`) +
    `<path d="M${hx} 125.5 V132" stroke="${C.hoofS}" stroke-width="1.6" stroke-linecap="round"/>`;
  let body;
  if (eb == null) { // braccio intero, identico a v3 (accetta anche hold/hoof senza cambiare la forma del braccio)
    const armD = 'M55 94 C44 95 34 105 31 118 C29 126.5 36 131.5 40.5 126.5 C44.5 117 50.5 108.5 61 101.5 Z';
    const d = M(armD);
    const sh = `<path d="${d}" fill="${C.S}" opacity=".55" transform="translate(${Lf ? 3.5 : -3.5} 2.5)"/>`;
    const hoof = hoofT === 'side' ? v3Hoof('ah' + sd) : '';
    // facing:'left' specchia tutto il disegno: la zona chiara passa al lato opposto (luce sempre in alto a sinistra sullo schermo)
    const lc = flip ? (Lf ? 43 : 121) : (Lf ? 39 : 117), lrx = (Lf !== flip) ? 9 : 6.5;
    body = sh + r3Part(u, 'a' + sd, d, C.S, `<ellipse cx="${lc}" cy="106" rx="${lrx}" ry="16" fill="${C.B}" transform="rotate(${Lf ? 25 : -25} ${lc} 106)"/>`) +
      hoof + legacy + ((hold || hoofT !== 'side') ? held([hx, 127], rot || 0, 1) : '');
  } else { // braccio con gomito: omero + avambraccio, capsule rastremate con cel-shading in coordinate del mondo
    rot = rot || 0;
    const P0 = r4Pt(sd, A.P), S0 = r4Pt(sd, A.S), E0 = r4Pt(sd, A.E), W0 = r4Pt(sd, A.W), H0 = r4Pt(sd, A.H);
    const fl = (1 - 0.5 * f) * rc;
    const E2 = r4Lerp(P0, E0, rc), dE = [r4N(E2[0] - E0[0]), r4N(E2[1] - E0[1])], mv = dE[0] || dE[1];
    const tE = mv ? `translate(${dE[0]} ${dE[1]}) ` : '';
    const W1 = r4Lerp(E0, W0, fl), rW1 = A.rW * (1 + 0.22 * f), H1 = r4Lerp(E0, H0, fl), hsc = 1 + 0.4 * f;
    const rS = A.rS, rE = A.rE * (1 + 0.06 * f);
    const near = Lf !== flip; // braccio dal lato della luce (sullo schermo)
    const shrink = near ? 1.1 : 2.0, off = near ? 2.4 : 2.6;
    const litAt = (ang) => { const l = r4Rot(LG, [0, 0], -ang); return [l[0] * off, l[1] * off]; };
    const add = (p, v) => [p[0] + v[0], p[1] + v[1]];
    const capU = r4Cap(S0, rS, E2, rE), capF = r4Cap(E0, rE, W1, rW1);
    const oU = litAt(rot), oF = litAt(rot + eb);
    const litU = r4Cap(add(S0, oU), rS - shrink, add(E2, oU), rE - shrink);
    const litF = r4Cap(add(E0, oF), rE - shrink, add(W1, oF), rW1 - shrink);
    const ex = r4N(E0[0]), ey = r4N(E0[1]);
    const inv = `rotate(${r4N(-eb)} ${ex} ${ey})${mv ? ` translate(${-dE[0]} ${-dE[1]})` : ''}`; // dal sistema dell'omero a quello dell'avambraccio
    const id = (k) => k + sd + u;
    // ombra portata sul corpo (busto + testa), un'unica sagoma semitrasparente per tutto il braccio
    const toLocal = `rotate(${r4N(-rot)} ${P0[0]} ${P0[1]})${tdx ? ` translate(${r4N(-tdx)} 0)` : ''}`;
    const hd = o.head ? ` translate(${o.head.dx || 0} ${o.head.dy || 0}) rotate(${o.head.rot || 0} 80 92)` : '';
    const headD = side ? (typeof R4_HEAD_SIDE !== 'undefined' ? R4_HEAD_SIDE : 'M76 15.5 C105 15.5 122 33 122 55 C122 78 105 94.5 76 94.5 C47 94.5 30 78 30 55 C30 33 47 15.5 76 15.5 Z')
      : (typeof R4_HEAD !== 'undefined' ? R4_HEAD : 'M80 16 C111 16 129 34 129 58 C129 80 111 95 80 95 C49 95 31 80 31 58 C31 34 49 16 80 16 Z');
    const torsoD = 'M80 82 C107 82 123 99 123 118 C123 135 105 145 80 145 C55 145 37 135 37 118 C37 99 53 82 80 82 Z';
    const cst = r4Rot(CS, [0, 0], -rot);
    const hoofSil = hoofT === 'none' ? '' : (hoofT === 'side')
      ? `<ellipse cx="${r4N(H1[0])}" cy="${r4N(H1[1])}" rx="${r4N(7.6 * hsc)}" ry="${r4N(5 * hsc)}"/>`
      : `<circle cx="${r4N(H1[0])}" cy="${r4N(H1[1])}" r="${r4N(7.4 * hsc)}"/>`;
    const cast = `<clipPath id="${id('acb')}"><path d="${torsoD}" transform="${toLocal}"/><path d="${headD}" transform="${toLocal}${hd}"/></clipPath>` +
      `<g clip-path="url(#${id('acb')})" opacity=".5"><g fill="${C.S}" transform="translate(${r4N(cst[0])} ${r4N(cst[1])})"><path d="${capU}"/>` +
      `<g transform="${tE}rotate(${r4N(eb)} ${ex} ${ey})"><path d="${capF}"/>${hoofSil}</g></g></g>`;
    // omero
    const upper = `<clipPath id="${id('acu')}"><path d="${capU}"/></clipPath><path d="${capU}" fill="${C.S}"/>` +
      `<g clip-path="url(#${id('acu')})"><path d="${litU}" fill="${C.B}"/></g>`;
    // avambraccio (gruppo animabile .r3-fore attorno al gomito)
    const fade = Math.min(1, Math.max(0, (Math.abs(eb) - 55) / 50));
    const dist0 = r4Lerp(E0, W1, 0.45), rd0 = rE + (rW1 - rE) * 0.45;
    const fcs = r4Rot(CS, [0, 0], -(rot + eb));
    const foldSh = fade > 0 ? `<clipPath id="${id('afc')}"><path d="${capU}" transform="${inv}"/></clipPath>` +
      `<g clip-path="url(#${id('afc')})"><path d="${r4Cap(dist0, rd0, W1, rW1)}" fill="${C.S}" opacity="${r4N(0.45 * fade)}" transform="translate(${r4N(fcs[0] * 0.8)} ${r4N(fcs[1] * 0.8)})"/></g>` : '';
    // ridipinge la luce dell'omero dentro l'attacco del gomito: le due zone chiare si fondono senza cuciture
    const joint = `<clipPath id="${id('afj')}"><circle cx="${ex}" cy="${ey}" r="${r4N(rE * 1.25)}"/></clipPath>` +
      `<clipPath id="${id('aff')}"><path d="${capF}"/></clipPath><clipPath id="${id('afd')}"><path d="${r4Cap(E0, rE + 1.3, W1, rW1 + 1.3)}"/></clipPath>` +
      `<g clip-path="url(#${id('afd')})"><g clip-path="url(#${id('afj')})"><g clip-path="url(#${id('afc2')})"><path d="${litU}" fill="${C.B}" transform="${inv}"/></g></g></g>`;
    const jointClip = `<clipPath id="${id('afc2')}"><path d="${capU}" transform="${inv}"/></clipPath>`;
    const foreLit = `<g clip-path="url(#${id('aff')})"><path d="${litF}" fill="${C.B}"/></g>`;
    const angF = rot + eb;
    let hand;
    if (hoofT === 'side' && !hold) hand = `<g transform="translate(${r4N(H1[0])} ${r4N(H1[1])})${hsc !== 1 ? ` scale(${r4N(hsc)})` : ''} translate(${-hx} -127)">${v3Hoof('ah' + sd)}</g>`;
    else if (hoofT === 'side') hand = `<g transform="translate(${r4N(H1[0])} ${r4N(H1[1])})${hsc !== 1 ? ` scale(${r4N(hsc)})` : ''} translate(${-hx} -127)">${v3Hoof('ah' + sd)}</g>` + held(H1, angF, hsc);
    else hand = held(H1, angF, hsc);
    const behind = hold && hold.at === 'behind' ? hand : '';
    const fore = (mv ? `<g transform="${tE.trim()}">` : '') + `<g class="r3-fore${sd}" transform="rotate(${r4N(eb)} ${ex} ${ey})">` + behind + foldSh +
      `<path d="${capF}" fill="${C.S}"/>` + jointClip + joint + foreLit + (behind ? '' : hand) + legacy + `</g>` + (mv ? '</g>' : '');
    body = cast + upper + fore;
  }
  const inner = `<g class="r3-arm${sd}"${rot ? ` transform="rotate(${rot} ${X(55)} 98)"` : ''}>` + body + `</g>`;
  return r4g(inner, tdx, 1, 80);
}

// ===== Libreria di pose =====
// Ogni posa: armRot, elbow, armsFront, head, look, mouth, foreshorten, hoof, hold + mood consigliato.
// Uso: const p = r4Pose('bevi'); rly4SVG(p.mood, 200, 'id', p)  ·  con vista: r4Pose('saluta', {turn: 1}) applica la variante tarata
// (turn3 per 0.5 < turn < 1.5, side per turn >= 1.5 o view:'side'; view:'back' usa la posa frontale)
const R4_POSES = {
  saluta: { mood: 'happy', hoof: {R: 'front'}, armsFront: {R: 1}, head: {rot: -4}, mouth: 'E', reach: {R: 1.15}, armRot: {R: -95}, elbow: {R: -24},
    turn3: { mood: 'happy', hoof: {L: 'front'}, armsFront: {L: 1, R: 0}, head: {rot: -4}, mouth: 'E', reach: {L: 1.15}, armRot: {L: 83}, elbow: {L: 24} },
    side: { mood: 'happy', reach: {L: 1.6}, armsFront: {L: 1, R: 0}, hoof: {L: 'front'}, mouth: 'E', armRot: {L: -177}, elbow: {L: 19} },
    note: 'saluta con lo zoccolo di fronte, accanto alla testa' },
  bevi: { mood: 'happy', foreshorten: {L: 0.35}, armsFront: {L: 1}, hold: {L: {item: 'cup', scale: 1.25, rot: 12}}, head: {rot: -3, dy: -1}, look: [1, -1], armRot: {L: -88}, elbow: {L: -113},
    turn3: { mood: 'happy', foreshorten: {L: 0.35}, armsFront: {L: 1}, hold: {L: {item: 'cup', scale: 1.25, rot: 12}}, head: {rot: -3, dy: -1}, look: [1, -1], armRot: {L: -102}, elbow: {L: -54} },
    side: { mood: 'happy', foreshorten: {L: 0.2}, armsFront: {L: 1}, hold: {L: {item: 'cup', scale: 1.25, rot: 20}}, head: {rot: -3, dy: -1}, look: [1, -1], armRot: {L: -95}, elbow: {L: -69} },
    note: 'beve il caffè: avambraccio verso la camera (scorcio), tazzina inclinata verso la bocca' },
  copreOcchi: { mood: 'happy', foreshorten: {L: 0.6, R: 0.6}, armsFront: {L: 1, R: 1}, mouth: 'E', reach: {L: 1.5, R: 1.5}, head: {dy: 4}, hoof: {L: 'front', R: 'front'}, armRot: {L: 164, R: -164}, elbow: {L: -23, R: 23},
    turn3: { mood: 'happy', foreshorten: {L: 0.6, R: 0.6}, reach: {L: 1.5, R: 1.5}, armsFront: {L: 1, R: 1}, hoof: {L: 'front', R: 'front'}, head: {dy: 4}, mouth: 'E', armRot: {L: 172, R: -109}, elbow: {L: 20, R: -19} },
    side: { mood: 'happy', foreshorten: {L: 0.3}, reach: {L: 1.35}, armsFront: {L: 1, R: 0}, hoof: {L: 'front'}, head: {dy: 3}, mouth: 'E', armRot: {L: 160}, elbow: {L: 20} },
    note: 'si copre gli occhi: zoccoli visti di fronte, braccia allungate (reach), testa un po’ abbassata' },
  sbircia: { mood: 'happy', foreshorten: {L: 0.6, R: 0.3}, armsFront: {L: 1, R: 1}, look: [2, 0], reach: {L: 1.5, R: 1.15}, head: {dy: 4, rot: 3}, hoof: {L: 'front', R: 'front'}, armRot: {L: 164, R: -175}, elbow: {L: -23, R: 74},
    turn3: { mood: 'happy', foreshorten: {L: 0.6, R: 0.3}, reach: {L: 1.5, R: 1.15}, armsFront: {L: 1, R: 1}, hoof: {L: 'front', R: 'front'}, head: {dy: 4, rot: 3}, look: [3, 0], armRot: {L: 172, R: -105}, elbow: {L: 20, R: 48} },
    side: { mood: 'happy', foreshorten: {L: 0.3}, reach: {L: 1.2}, armsFront: {L: 1, R: 0}, hoof: {L: 'front'}, look: [3, -1], armRot: {L: 164}, elbow: {L: 19} },
    note: 'sbircia: un occhio coperto, l’altro zoccolo abbassato' },
  abbraccia: { mood: 'love', foreshorten: {L: 0.6, R: 0.6}, armRot: {L: 65, R: -65}, elbow: {L: 19, R: -19},
    side: { mood: 'love', foreshorten: {L: 0.3}, armsFront: {L: 1, R: 0}, armRot: {L: -129}, elbow: {L: 20} },
    note: 'braccia aperte verso la camera per un abbraccio' },
  indicaSu: { mood: 'happy', armsFront: {R: 1}, head: {rot: 3}, look: [3, -3], reach: {R: 1.3}, armRot: {R: -118}, elbow: {R: -23},
    turn3: { mood: 'happy', armsFront: {L: 1, R: 0}, head: {rot: -3}, look: [1, -3], reach: {L: 1.3}, armRot: {L: 104}, elbow: {L: 23} },
    note: 'indica in alto (braccio teso davanti al bordo della testa)' },
  indicaCamera: { mood: 'smug', foreshorten: {R: 1}, armsFront: {R: 1}, hoof: {R: 'front'}, armRot: {R: 134}, elbow: {R: 159},
    turn3: { mood: 'smug', foreshorten: {L: 1}, armsFront: {L: 1, R: 0}, hoof: {L: 'front'}, armRot: {L: -109}, elbow: {L: -158} },
    side: { mood: 'smug', armsFront: {L: 1, R: 0}, armRot: {L: -134}, elbow: {L: 20} },
    note: 'indica la camera: avambraccio in scorcio pieno, zoccolo grande di fronte' },
  maniFianchi: { mood: 'smug', armRot: {L: 13, R: -13}, elbow: {L: -50, R: 50},
    side: { mood: 'smug', armRot: {L: -37}, elbow: {L: 82} },
    note: 'mani sui fianchi, gomiti in fuori' },
  bracciaIncrociate: { mood: 'smug', armsFront: {L: 1, R: 1}, hoof: {L: 'none', R: 'none'}, armRot: {L: -107, R: 112}, elbow: {L: 24, R: -24},
    note: 'braccia incrociate (zoccoli nascosti)' },
  pensa: { mood: 'thinking', armsFront: {R: 1}, look: [2, -3], armRot: {R: 85}, elbow: {R: 117},
    side: { mood: 'thinking', armsFront: {L: 1, R: 0}, look: [2, -3], armRot: {L: -101}, elbow: {L: -42} },
    note: 'pensa: zoccolo al mento' },
  festeggia: { mood: 'celebrating', hoof: {L: 'front', R: 'front'}, reach: {L: 1.3, R: 1.3}, armRot: {L: 98, R: -98}, elbow: {L: 20, R: -20},
    turn3: { mood: 'celebrating', reach: {L: 1.5, R: 1.5}, armsFront: {L: 1, R: 0}, hoof: {L: 'front', R: 'front'}, armRot: {L: 101, R: -99}, elbow: {L: 23, R: -23} },
    side: { mood: 'celebrating', reach: {L: 1.6}, armsFront: {L: 1, R: 0}, hoof: {L: 'front'}, armRot: {L: 140}, elbow: {L: 24} },
    note: 'festeggia a braccia in alto' },
  scrollaSpalle: { mood: 'neutral', foreshorten: {L: 0.5, R: 0.5}, hoof: {L: 'front', R: 'front'}, head: {dy: 3, rot: -6}, mouth: 'M', armRot: {L: 50, R: -50}, elbow: {L: 4, R: -4},
    note: 'scrolla le spalle: zoccoli in fuori, testa incassata' },
  telefono: { mood: 'happy', armsFront: {R: 1}, hold: {R: {item: 'phoneBack', scale: 1.3}}, head: {dy: 3, rot: 4}, look: [1, 3], armRot: {R: 133}, elbow: {R: -151},
    turn3: { mood: 'happy', armsFront: {L: 1}, hold: {L: {item: 'phoneBack', scale: 1.3}}, head: {dy: 3, rot: 4}, look: [1, 3], armRot: {L: -76}, elbow: {L: -60} },
    side: { mood: 'happy', armsFront: {L: 1, R: 0}, hold: {L: {item: 'phoneBack', scale: 1.3}}, head: {dy: 3, rot: 4}, look: [1, 3], armRot: {L: -82}, elbow: {L: -34} },
    note: 'tiene il telefono e legge (si vede il dorso)' },
  mostraTelefono: { mood: 'happy', armsFront: {L: 1}, hold: {L: {item: 'phone', scale: 1.3}}, armRot: {L: 91}, elbow: {L: -109},
    note: 'mostra lo schermo del telefono' },
  moneta: { mood: 'happy', armsFront: {L: 1}, hold: {L: {item: 'coin', scale: 1.3}}, armRot: {L: 109}, elbow: {L: -37},
    note: 'mostra una moneta' },
  insegna: { mood: 'happy', hold: {R: 'pointer'}, look: [3, -1], armRot: {R: -8}, elbow: {R: -129},
    turn3: { mood: 'happy', hold: {L: 'pointer'}, armsFront: {R: 0}, look: [1, -1], armRot: {L: 26}, elbow: {L: 79} },
    side: { mood: 'happy', armsFront: {L: 1}, hold: {L: 'pointer'}, look: [3, -1], armRot: {L: -90}, elbow: {L: -19} },
    note: 'spiega con la bacchetta' },
  scrive: { mood: 'thinking', armsFront: {R: 1}, hold: {R: 'pencil'}, armRot: {R: 102}, elbow: {R: -131},
    turn3: { mood: 'thinking', armsFront: {L: 1}, hold: {L: 'pencil'}, armRot: {L: -65}, elbow: {L: -47} },
    side: { mood: 'thinking', armsFront: {L: 1, R: 0}, hold: {L: 'pencil'}, armRot: {L: -75}, elbow: {L: -45} },
    note: 'pensa con la matita in mano' }
};
// unisce opzioni (le mappe {L,R} vengono fuse per lato)
function r4Merge(a, b) {
  const out = Object.assign({}, a);
  for (const k in (b || {})) {
    const v = b[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && ['armRot', 'elbow', 'armsFront', 'foreshorten', 'hoof', 'hold', 'reach'].indexOf(k) >= 0 && out[k])
      out[k] = Object.assign({}, out[k], v);
    else out[k] = v;
  }
  return out;
}
function r4Pose(name, extra) {
  const p = R4_POSES[name];
  if (!p) return Object.assign({}, extra || {});
  extra = extra || {};
  // la variante tarata (profilo o 3/4) sostituisce la posa frontale; poi si applicano le opzioni extra
  const t = extra.view === 'side' ? 2 : (+extra.turn || 0);
  let o = extra.view === 'back' ? p : (t >= 1.5 && p.side) ? p.side : (t > 0.5 && t < 1.5 && p.turn3) ? p.turn3 : p;
  o = Object.assign({}, o); delete o.side; delete o.turn3; delete o.note;
  return r4Merge(o, extra);
}
// posa interpolata lungo il giro (turn 0..2): angoli, scorcio, allungamento, testa e sguardo passano con continuità
// tra la variante frontale (0), turn3 (1) e side (2); i valori discreti (mood, hoof, hold, armsFront, bocca) cambiano a metà.
// Uso nei giri animati: ad ogni fotogramma rly4SVG(p.mood, size, id, r4PoseBlend('bevi', t)).
function r4PoseBlend(name, turn, extra) {
  extra = extra || {};
  const t = Math.max(0, Math.min(2, +turn || 0));
  const p = R4_POSES[name];
  if (!p) return Object.assign({ turn: t }, extra);
  const V = [p, p.turn3 || p, p.side || p.turn3 || p];
  const i = t < 1 ? 0 : 1, w = t - i, A = V[i], B = V[i + 1], ta = i, tb = i + 1;
  const lerp = (a, b) => r4N(a + (b - a) * w);
  const o = Object.assign({}, w < 0.5 ? A : B); delete o.side; delete o.turn3; delete o.note;
  const side = (key, def, wrap) => {
    const a = A[key] || {}, b = B[key] || {}, out = {};
    let any = false;
    for (const sd of ['L', 'R']) {
      if (a[sd] == null && b[sd] == null) continue;
      any = true;
      const va = a[sd] != null ? a[sd] : def(sd, ta);
      let vb = b[sd] != null ? b[sd] : def(sd, tb);
      if (wrap) { while (vb - va > 180) vb -= 360; while (vb - va < -180) vb += 360; } // la spalla gira per la via più corta
      out[sd] = lerp(va, vb);
    }
    if (any) o[key] = out; else delete o[key];
  };
  side('armRot', (sd, tt) => (sd === 'L' && tt === 2) ? -24 : 0, true); // nel profilo il braccio vicino pende a -24
  side('elbow', () => 0);
  side('foreshorten', () => 0);
  side('reach', () => 1);
  if (A.head || B.head) {
    const a = A.head || {}, b = B.head || {};
    o.head = { dx: lerp(a.dx || 0, b.dx || 0), dy: lerp(a.dy || 0, b.dy || 0), rot: lerp(a.rot || 0, b.rot || 0) };
  }
  if (A.look || B.look) {
    const a = A.look || [1, 1.2], b = B.look || [1, 1.2];
    o.look = [lerp(a[0], b[0]), lerp(a[1], b[1])];
  }
  o.turn = t;
  return r4Merge(o, extra);
}
// Viste: frontale, giro continuo, profilo, spalle; composizione del personaggio
// Opzioni di vista di rly4SVG(mood, size, uid, o):
//   o.turn  0..2  0 = frontale · 1 = tre quarti · 2 = profilo (valori intermedi = rotazione continua)
//   o.view  'side' (= turn 2) · 'back' (di spalle: nuca, retro di orecchie e corna, schiena, coda davanti)
//   o.facing 'left' specchia tutto (Rally guarda a sinistra)
// Nel giro la testa ruota di R4_VIEW.head gradi a turn=1, il busto di R4_VIEW.body: le parti "di lato" (corna, orecchie)
// si accorciano come una rotazione vera, quelle "davanti" (occhi, muso, pancia, ciuffo) scorrono sulla sfera.
// Nella vista di spalle i nomi L/R restano quelli dell'immagine (armL = braccio a sinistra nell'immagine).
const R4_POSE = {
  coverEyes: { L: 156, R: -156, front: { L: 1, R: 1 } },
  drink: { L: -141, front: { L: 1 } },
  facepalm: { R: -170, front: { R: 1 } },
  hug: { L: -100, R: 100, front: { L: 1, R: 1 } },
  point: { R: -95, front: { R: 1 } }
};
const R4_VIEW = { head: 28, body: 22 };

const r4n = (v) => +(+v).toFixed(2);
const r4z = (v) => Math.abs(v) < 1e-7 ? 0 : (Math.abs(v - 1) < 1e-7 ? 1 : v);
function r4Mix(a, b, t) {
  if (Array.isArray(a)) return a.map((v, i) => a[i] + (b[i] - a[i]) * t);
  return a + (b - a) * t;
}
// interpola due path con la stessa struttura di comandi
function r4MixD(d1, d2, t) {
  if (!t) return d1;
  if (t >= 1) return d2;
  const B = d2.match(/-?\d*\.?\d+/g); let i = 0;
  return d1.replace(/-?\d*\.?\d+/g, (a) => r4n(+a + (+B[i++] - +a) * t));
}
// rimappa le x (coppie x y) di un path M/C: x -> 80 + dx + (x - 80) * sx
function r4MapPX(d, t) {
  return d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (a, x, y) => `${r4n(80 + t[0] + (+x - 80) * t[1])} ${y}`);
}
// scurisce una parte lontana (cel-shading piatto: ogni colore si sposta verso un bruno caldo)
function r4Hex(c, a) {
  const n = parseInt(c.slice(1), 16), D = [112, 50, 10];
  const f = (v, d) => Math.round(v + (d - v) * a);
  return '#' + ((1 << 24) | (f(n >> 16, D[0]) << 16) | (f((n >> 8) & 255, D[1]) << 8) | f(n & 255, D[2])).toString(16).slice(1).toUpperCase();
}
function r4Dim(svg, a) { return a > .004 ? svg.replace(/#[0-9A-Fa-f]{6}(?![0-9A-Za-z])/g, (c) => r4Hex(c, a)) : svg; }
// comprime in verticale attorno a y0
function r4sy(inner, sy, y0) { return sy === 1 ? inner : `<g transform="translate(0 ${y0}) scale(1 ${r4n(Math.max(.001, sy))}) translate(0 ${-y0})">${inner}</g>`; }

// spostamento orizzontale delle braccia per la vista (usato anche dall'IK di 30_arms se vuole restare allineato)
function r4ViewArmDX(sd, o) {
  o = o || {};
  if (o.view === 'back') return 0;
  const t = o.view === 'side' ? 2 : Math.max(0, Math.min(2, +o.turn || 0));
  const k = Math.min(1, t), s = Math.max(0, t - 1);
  return sd === 'L' ? r4Mix(6 * k, 33, s) : r4Mix(-8 * k, -18, s);
}

// stato della vista a turn = k (0..1, frontale -> 3/4)
function r4State34(k) {
  const th = k * R4_VIEW.head * Math.PI / 180, tb = k * R4_VIEW.body * Math.PI / 180;
  const c = Math.cos(th), sn = Math.sin(th), cb = Math.cos(tb), sb = Math.sin(tb);
  const T = (dx, sx) => [r4z(dx), r4z(sx)];
  // punto sulla superficie della testa (sfera di raggio R): scorre e si comprime
  const sph = (x0, R) => {
    const p0 = Math.asin((x0 - 80) / R), p = p0 + th;
    return T(80 + R * Math.sin(p) - x0, Math.max(0, Math.min(1, Math.cos(p) / Math.cos(p0))));
  };
  const muz = T(60 * sn, c);
  return {
    eyeL: sph(63, 52), eyeR: sph(97, 52), cheekL: sph(45, 52), cheekR: sph(115, 52), muz,
    hornL: T(3 * sn, c), hornR: T(-2 * sn, c * (1 - .12 * k)), hornRdim: .12 * k,
    earL: T(1.5 * k, 1 - .06 * k), earR: T(-7 * k, 1 - .45 * k), earRdim: .1 * k, earRfront: Math.max(0, 1 - 1.6 * k), earLfront: 1,
    tuft: T(18 * sn, c), belly: T(40 * sb, cb),
    legL: 5 * k, legR: -4 * k, legRdim: .22 * k, armL: 6 * k, armR: -8 * k, armRdim: .2 * k, armLrot: 0,
    torsoB: 72 - 4 * k, torsoH: 60 + 8 * k, headB: 73 - 4 * k, headH: 58 + 6 * k, look: [1 + 2 * k, 1.2],
    nosL: muz, nosR: muz, ring: muz, mouth: muz, fx: .6 * sph(97, 52)[0], tail: k
  };
}
// stato del profilo (turn = 2)
const R4_SIDE = {
  eyeL: [41, .64], eyeR: [22, .05], cheekL: [42, .8], cheekR: [10, .1], muz: [48, .5],
  hornL: [0, .64], hornR: [2, .6], hornRdim: .2,
  earL: [3, .97], earR: [-18, .3], earRdim: .15, earRfront: 0, earLfront: 1,
  tuft: [2, .9], belly: [24, .52],
  legL: 9, legR: -9, legRdim: .3, armL: 33, armR: -18, armRdim: .3, armLrot: -38,
  torsoB: 84, torsoH: 74, headB: 70, headH: 62, look: [3, 1.2],
  nosL: [64.6, .72], nosR: [61, 0], ring: [57, .45], mouth: [44, .7], fx: 0, tail: 1
};
function r4StateAt(k, s) {
  const A = r4State34(k);
  if (!s) return A;
  const O = {};
  for (const key in A) O[key] = r4Mix(A[key], R4_SIDE[key], s);
  return O;
}

// muso e testa: frontale (r4Face/v3) -> profilo, stessa struttura per poterli interpolare
const R4_HEAD = 'M80 16 C111 16 129 34 129 58 C129 80 111 95 80 95 C49 95 31 80 31 58 C31 34 49 16 80 16 Z';
const R4_HEAD_SIDE = 'M76 15.5 C105 15.5 122 33 122 55 C122 78 105 94.5 76 94.5 C47 94.5 30 78 30 55 C30 33 47 15.5 76 15.5 Z';
const R4_MUZ = 'M80 58 C99 58 111 66 111 77 C111 89 98 96 80 96 C62 96 49 89 49 77 C49 66 61 58 80 58 Z';
const R4_MUZ_SIDE = 'M110 57.5 C131 57 147.5 64 147.5 78 C147.5 91 135 98.5 115 98.5 C101 98.5 90 92 90 79 C90 66 97 58 110 57.5 Z';

// separa l'uscita di r4Face (senza sideMuzzle) in: prima del muso | muso | narici+anello | bocca | sbuffi | dopo
function r4SplitFace(f, u) {
  const a = f.indexOf(`<clipPath id="mz${u}">`);
  if (a < 0) return null;
  const pi = f.indexOf('class="r3-puffL"', a);
  const pg = pi < 0 ? -1 : f.lastIndexOf('<g', pi);
  const pe = pg < 0 ? -1 : f.indexOf('</g>', pi) + 4;
  const ms = pg < 0 ? -1 : f.lastIndexOf('opacity=".9"/>', pg);
  if (pg < a || ms < a || pe < 4) return null;
  const mzEnd = f.indexOf('</g>', a) + 4; // fine di r3Part del muso
  const det = f.slice(mzEnd, ms + 14).match(/<[^>]+\/>/g) || [];
  return { pre: f.slice(0, a), det, mouth: f.slice(ms + 14, pg), puffs: f.slice(pg, pe), post: f.slice(pe) };
}

// faccia per turn > 1 (da 3/4 a profilo): occhi, sopracciglia, guance, bocca, effetti da r4Face; muso interpolato qui
function r4TurnFace(u, m, o, st, s, headD) {
  const C = R3;
  const hideR = s >= .5;
  // occhio lontano: si stringe fino a sparire tra turn 1.3 e 1.5, scivolando dietro al contorno
  const e34 = r4State34(1).eyeR, fe = Math.max(0, Math.min(1, (s - .3) / .2));
  const eyeR = [r4n(e34[0] + 3 * Math.min(1, s / .5)), r4n(e34[1] * (1 - .35 * Math.min(1, s / .3)) * (1 - fe))];
  const fo = Object.assign({}, o, {
    headPath: headD,
    face: { eyeL: st.eyeL, eyeR: eyeR, cheekL: st.cheekL, cheekR: st.cheekR, fx: [r4n(st.fx)] },
    mouth: o.mouth, look: o.look || st.look, hideR, sideMuzzle: false, k: 1
  });
  const f = r4Face(u, m, fo);
  const P = r4SplitFace(f, u);
  if (!P) return r4Face(u, m, Object.assign({}, fo, { sideMuzzle: s >= .5, face: s >= .5 ? { eyeL: st.eyeL, cheekL: st.cheekL } : fo.face }));
  const m34 = r4State34(1).muz;
  const d = r4MixD(r4MapPX(R4_MUZ, m34), R4_MUZ_SIDE, s);
  const X = (x) => 80 + m34[0] + (x - 80) * m34[1];
  const bx = r4Mix(X(72), 114, s), brx = r4Mix(27 * m34[1], 27, s), hx = r4Mix(X(68), 117, s), hrx = r4Mix(15 * m34[1], 14, s);
  const mc = r4Mix(X(80), 118.75, s), ML = (x) => o.facing === 'left' ? 2 * mc - x : x;
  let mz = r3Part(u, 'mz', d, C.muzS, `<ellipse cx="${r4n(ML(bx))}" cy="${r4n(r4Mix(73, 74, s))}" rx="${r4n(brx)}" ry="16" fill="${C.muzB}"/>` +
    `<ellipse cx="${r4n(ML(hx))}" cy="63.5" rx="${r4n(hrx)}" ry="${r4n(r4Mix(3.4, 3.2, s))}" fill="${C.muzH}"/>`);
  const det = P.det.length === 7 ? P.det : null;
  const nos = 'M68.5 68 C72.5 67.6 75 71 74.4 74.8 C73.9 78 68.6 78.6 66.8 76 C65 73 65.6 68.3 68.5 68 Z';
  const nL = det ? det[0] + det[2] : `<path d="${nos}" fill="${C.nostril}"/><ellipse cx="70.4" cy="74" rx="2.2" ry="2.8" fill="${C.nostrilIn}"/>`;
  const nR = det ? det[1] + det[3] : `<path d="${r3Mirror(nos)}" fill="${C.nostril}"/><ellipse cx="89.6" cy="74" rx="2.2" ry="2.8" fill="${C.nostrilIn}"/>`;
  const ring = det ? det[4] + det[5] + det[6] : '';
  if (st.nosR[1] > .04) mz += r4g(nR, st.nosR[0], st.nosR[1], 80);
  mz += r4g(nL, st.nosL[0], st.nosL[1], 80);
  mz += r4g(ring, st.ring[0], st.ring[1], 80);
    // nel profilo i visemi e la "O" di surprised hanno forme dedicate (10_mouth.js), se disponibili
  const sideMouth = (o.mouth || m === 'surprised') && s >= .5 && typeof r4MouthView === 'function';
  mz += (sideMouth ? r4MouthView(u, o.mouth || 'O', 'side') : r4g(P.mouth, st.mouth[0], st.mouth[1], 80)) + r4g(P.puffs, st.mouth[0], st.mouth[1], 80);
  return P.pre + mz + P.post;
}

// orecchio: fr = quanto si vede l'interno (1 davanti … 0 retro)
function r4Ear(u, sd, fr) {
  const C = R3, Lf = sd === 'L', M = Lf ? (d) => d : r3Mirror;
  const earD = 'M43 47 C33 39 17 40 8 50.5 C17 60.5 33 59.5 44 55 Z';
  const earIn = 'M39 49.5 C31 44.6 20.5 45.4 14 50.6 C21 55.4 31 55.4 39 53 Z';
  fr = fr == null ? 1 : Math.max(0, Math.min(1, fr));
  const cy = fr >= 1 ? 47.5 : (fr <= 0 ? 44 : r4n(r4Mix(44, 47.5, fr)));
  const inner = fr <= 0 ? '' : r4sy(r3Part(u, 'ei' + sd, M(earIn), C.ear, `<ellipse cx="${Lf ? 26 : 134}" cy="49" rx="12" ry="3" fill="${C.earH}"/>`), fr, 46);
  return `<g class="r3-ear${sd}">` + r3Part(u, 'er' + sd, M(earD), C.S, `<ellipse cx="${Lf ? 25 : 135}" cy="${cy}" rx="18" ry="6.5" fill="${C.B}"/>`) + inner + `</g>`;
}
function r4Horn(u, sd) {
  const C = R3, Lf = sd === 'L';
  const hornD = 'M51 31 C40 32 27 28.5 20.5 18.5 C16.4 12 17 4.6 21.2 1.2 C24 9.4 30.4 15.4 38.4 18.2 C44.4 20.3 50.6 21.4 57 22.4 Z';
  const d = Lf ? hornD : r3Mirror(hornD);
  const x = (v) => Lf ? v : 160 - v;
  return r3Part(u, 'hn' + sd, d, C.hornS,
    `<ellipse cx="${x(37)}" cy="19" rx="21" ry="5.8" fill="${C.hornB}" transform="rotate(${Lf ? 27 : -27} ${x(37)} ${19})"/>` +
    `<circle cx="${x(19.4)}" cy="5" r="7.6" fill="${C.hornTip}"/>` +
    `<path d="M${x(44.6)} 20.8 Q${x(42)} 25.8 ${x(44.8)} 31.2 M${x(49.4)} 21.6 Q${x(47)} 26.4 ${x(49.6)} 31.4" fill="none" stroke="${C.hornRing}" stroke-width="1.6" stroke-linecap="round"/>`);
}
const R4_TUFT = 'M65 25 C61 17 65 8.5 71.5 8 C70.8 12 73.4 14.4 76 12.6 C76 6.4 82 3 87.6 6 C84.6 9 86.4 12.2 89.4 12.4 C92.4 9.2 97.6 10.6 98.4 14.6 C96.6 20.4 92.4 24.2 86 25.4 C79 22.6 71.6 22.6 65 25 Z';
const R4_TORSO = 'M80 82 C107 82 123 99 123 118 C123 135 105 145 80 145 C55 145 37 135 37 118 C37 99 53 82 80 82 Z';
function r4Tuft(u, lf) { return r3Part(u, 'tf', R4_TUFT, R3.tuftS, `<ellipse cx="${lf ? 81 : 79}" cy="13" rx="17" ry="9" fill="${R3.tuftB}"/>`); }
// gamba; lf = luce specchiata (guarda a sinistra) · prof = zoccolo visto di lato (punta verso destra)
function r4Leg(u, dx, cls, kk, dim, lf, prof) {
  const C = R3, L = (x) => lf ? 130 - x : x;
  const hoof = prof
    ? r3Part(u, kk + 'h', 'M51 154 Q51 149 57 149 H70 Q77.5 149 81 154.5 L82.6 158.6 Q83.6 163 78.6 163 H55 Q51 163 51 158.6 Z', C.hoofS,
      `<ellipse cx="${L(63)}" cy="154" rx="15" ry="6.5" fill="${C.hoofB}"/><ellipse cx="${L(59)}" cy="151.4" rx="5.2" ry="1.5" fill="${C.hoofH}"/>`) +
      `<path d="M77.4 157.6 Q79.8 160.4 80.4 163" fill="none" stroke="${C.hoofS}" stroke-width="2" stroke-linecap="round"/>`
    : r3Part(u, kk + 'h', 'M50 154 Q50 149 56 149 H74 Q80 149 80 154 V158 Q80 163 75 163 H55 Q50 163 50 158 Z', C.hoofS,
      `<ellipse cx="${L(61)}" cy="154" rx="14" ry="6.5" fill="${C.hoofB}"/><ellipse cx="${L(57)}" cy="151.4" rx="5.2" ry="1.5" fill="${C.hoofH}"/>`) +
      `<path d="M65 156 V163" stroke="${C.hoofS}" stroke-width="2.2" stroke-linecap="round"/>`;
  return `<g class="${cls}"><g transform="translate(${dx} 0)">` +
    r3Part(u, kk + 'l', 'M64 128 C71 128 77 132 77 139 V150 H53 V139 C53 132 57 128 64 128 Z', C.S, `<ellipse cx="${L(60)}" cy="138" rx="12" ry="16" fill="${dim ? C.S : C.B}"/>`) +
    hoof + `</g></g>`;
}

function r4Character(u, m, o) {
  const C = R3; o = o || {};
  if (o.view === 'back') return r4Back(u, m, o);
  const t = o.view === 'side' ? 2 : Math.max(0, Math.min(2, +o.turn || 0));
  const k = Math.min(1, t), s = Math.max(0, t - 1);
  const st = r4StateAt(k, s);
  const lf = o.facing === 'left'; // Rally guarda a sinistra: la luce resta in alto a sinistra nell'immagine
  const AF = o.armsFront || {};
  let s0 = (R3X.back || '');
  // coda: nel frontale esce a destra; girando scivola dietro al corpo e riappare a sinistra (dietro)
  const tailPath = 'M117 131 C129 129 135.5 121 137.5 110', tipD = 'M137.6 111.5 C131.4 106.6 132.4 97.4 137.6 93 C140.6 98.4 147 101 145 108.4 C144 112.2 140.4 113.4 137.6 111.5 Z';
  const tail = (mir) => `<g class="r3-tail"${mir ? ' data-mir="1"' : ''}><path d="${mir ? r3Mirror(tailPath) : tailPath}" fill="none" stroke="${C.S}" stroke-width="5" stroke-linecap="round"/>` +
    `<g class="r3-tailTip">` + r3Part(u, 'tt', mir ? r3Mirror(tipD) : tipD, C.tuftS, `<ellipse cx="${mir ? 23.5 : 136.5}" cy="101" rx="5" ry="9" fill="${C.tuftB}"/>`) + `</g></g>`;
  if (k < .5) s0 += k ? r4g(tail(false), r4n(-56 * k), 1, 80) : tail(false);
  else s0 += r4g(tail(true), r4n(s ? r4Mix(6, 2, s) : r4Mix(34, 6, (k - .5) * 2)), 1, 80);
  // gambe: la lontana (destra) si scurisce e va dietro
  const dimR = st.legRdim;
  const legLs = r4g(r4Leg(u, 0, 'r3-legL', 'gL', false, lf, s > .3), r4n(st.legL), 1, 64);
  const legRs = r4g(r4Dim(r4Leg(u, 31, 'r3-legR', 'gR', s > .3, lf, s > .3), dimR), r4n(st.legR), 1, 95);
  s0 += k > .2 ? legRs + legLs : legLs + legRs;
  s0 += `<g class="r3-upper">`;
  // braccia
  // braccio vicino: girando verso il profilo scende e si piega un po' in avanti (omero + avambraccio, più leggibile)
  let ao = o;
  if (s > 0 && (!o.armRot || o.armRot.L == null)) {
    ao = Object.assign({}, o, { armRot: Object.assign({}, o.armRot || {}, { L: r4n(st.armLrot) }) });
    if (!o.elbow || o.elbow.L == null) ao.elbow = Object.assign({}, o.elbow || {}, { L: r4n(22 * s) });
  }
  const P = { armL: [r4n(st.armL), 1], armR: [r4n(st.armR), 1] };
  const arm = (sd) => r4Arm(u, sd, ao, P, s >= .5);
  const thinkFront = m === 'thinking';
  // braccio lontano: una copia dietro al busto + una copia davanti ritagliata fuori da un'ellisse che avanza col giro
  // (il busto lo "copre" progressivamente, senza salti di livello)
  let farBack = '', farFront = '';
  if (!AF.R && k > 0) {
    const aR = r4Dim(arm('R'), st.armRdim);
    farBack = aR;
    const ex = r4n(44 + 40 * k + 4 * s);
    if (ex + 43 < 126) farFront = `<clipPath id="fa${u}"><path clip-rule="evenodd" d="M-60 -60 H220 V240 H-60 Z M${ex} 115 m-43 0 a43 37 0 1 0 86 0 a43 37 0 1 0 -86 0 Z"/></clipPath>` +
      `<g clip-path="url(#fa${u})">${aR}</g>`;
  }
  s0 += farBack;
  const tB = lf ? r4n(160 - st.torsoB) : r4n(st.torsoB), tH = lf ? r4n(160 - st.torsoH) : r4n(st.torsoH);
  s0 += r3Part(u, 'to', R4_TORSO, C.S, `<ellipse cx="${tB}" cy="113" rx="45" ry="37" fill="${C.B}"/><ellipse cx="${tH}" cy="98" rx="17" ry="8" fill="${C.H}" transform="rotate(${lf ? 18 : -18} ${tH} 98)"/>`);
  s0 += r4g(r3Part(u, 'be', 'M80 102 C94 102 104 110 104 121 C104 132 94 140 80 140 C66 140 56 132 56 121 C56 110 66 102 80 102 Z', C.bellyS, `<ellipse cx="${lf ? 83.5 : 76.5}" cy="117" rx="22" ry="18" fill="${C.bellyB}"/>`) +
    `<path d="M73 109 l3.5 3.5 l3.5 -3.5 l3.5 3.5 l3.5 -3.5" fill="none" stroke="${C.bellyS}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>`, r4n(st.belly[0]), r4n(st.belly[1]), 80);
  s0 += (R3X.body || '');
  if (!AF.L) s0 += arm('L');
  if (k === 0 && !AF.R && !thinkFront) s0 += arm('R');
  if (k > 0 && !thinkFront) s0 += farFront;
  // testa
  s0 += `<g class="r3-head"${o.head ? ` transform="translate(${o.head.dx || 0} ${o.head.dy || 0}) rotate(${o.head.rot || 0} 80 92)"` : ''}>`;
  if (k === 0) s0 += r4g(r4Ear(u, 'L'), 0, 1, 26) + r4g(r4Ear(u, 'R'), 0, 1, 134);
  else s0 += r4g(r4Dim(r4Ear(u, 'R', st.earRfront), st.earRdim), r4n(st.earR[0]), r4n(st.earR[1]), 117) + r4g(r4Ear(u, 'L', st.earLfront), r4n(st.earL[0]), r4n(st.earL[1]), 43);
  if (k === 0) s0 += r4g(r4Horn(u, 'L'), 0, 1, 37) + r4g(r4Horn(u, 'R'), 0, 1, 123);
  else s0 += r4g(r4Dim(r4Horn(u, 'R'), st.hornRdim), r4n(st.hornR[0]), r4n(st.hornR[1]), 80) + r4g(r4Horn(u, 'L'), r4n(st.hornL[0]), r4n(st.hornL[1]), 80);
  const headD = r4MixD(R4_HEAD, R4_HEAD_SIDE, s);
  const hc = 80 - 4 * s, HL = (x) => lf ? r4n(2 * hc - x) : x;
  const hB = HL(k === 0 ? 73 : r4n(st.headB)), hH = HL(k === 0 ? 58 : r4n(st.headH));
  s0 += r3Part(u, 'hd', headD, C.S, `<ellipse cx="${hB}" cy="51" rx="${s ? r4n(r4Mix(51, 47, s)) : 51}" ry="40" fill="${C.B}"/><ellipse cx="${hH}" cy="31" rx="17" ry="7.5" fill="${C.H}" transform="rotate(${lf ? 22 : -22} ${hH} 31)"/>`);
  s0 += r4g(r4Tuft(u, lf), r4n(st.tuft[0]), r4n(st.tuft[1]), 80);
  let face;
  if (s > 0) face = r4TurnFace(u, m, o, st, s, headD);
  else {
    const F = { eyeL: st.eyeL, eyeR: st.eyeR, cheekL: st.cheekL, cheekR: st.cheekR, muz: st.muz };
    if (k > 0) F.fx = [r4n(st.fx)];
    face = r4Face(u, m, Object.assign({}, o, { face: F, mouth: o.mouth, look: o.look || (k > 0 ? st.look : null), hideR: false, sideMuzzle: false, k: k }, k > 0 ? { headPath: headD } : {}));
  }
  s0 += '<g class="r3-face" data-m="' + m + '">' + face + '</g>' + (R3X.head || '');
  s0 += `</g>`;
  if (thinkFront && !AF.R) s0 += k > 0 ? farFront : arm('R');
  if (AF.L) s0 += arm('L');
  if (AF.R) s0 += arm('R');
  s0 += (R3X.front || '');
  s0 += `</g>`;
  return s0;
}

// vista di spalle: niente faccia; nuca con ciuffo, retro di orecchie e corna, schiena, coda in primo piano
// di spalle il lato destro e sinistro di Rally si scambiano: le opzioni per lato (armRot, elbow, hold, hoof…) e
// gli oggetti R3X.handL/handR passano all'altro braccio; rotazioni e pieghe cambiano segno (braccio speculare)
function r4SwapSides(o) {
  const out = Object.assign({}, o);
  for (const key in o) {
    const v = o[key];
    if (!v || typeof v !== 'object' || Array.isArray(v) || key === 'head') continue;
    const ks = Object.keys(v);
    if (!ks.length || ks.some((x) => x !== 'L' && x !== 'R')) continue;
    const neg = key === 'armRot' || key === 'elbow';
    const f = (x) => (neg && typeof x === 'number') ? -x : x;
    const w = {};
    if ('L' in v) w.R = f(v.L);
    if ('R' in v) w.L = f(v.R);
    out[key] = w;
  }
  return out;
}
function r4Back(u, m, o0) {
  const o = r4SwapSides(o0);
  const C = R3, AF = o.armsFront || {}, lf = o.facing === 'left';
  let s = (R3X.back || '') + (R3X.front || ''); // gli oggetti "davanti" ora sono dietro al corpo
  s += r4Leg(u, 0, 'r3-legL', 'gL', false, lf) + r4Leg(u, 31, 'r3-legR', 'gR', false, lf);
  s += `<g class="r3-upper">`;
  const P = { armL: [0, 1], armR: [0, 1] };
  const arm = (sd) => { // anche gli oggetti di R3X passano all'altra mano
    const X0 = R3X; R3X = Object.assign({}, X0, { handL: X0.handR, handR: X0.handL });
    try { return r4Arm(u, sd, o, P, false); } finally { R3X = X0; }
  };
  // di spalle un braccio in posa (armsFront, armRot o gomito) lavora davanti a Rally, quindi resta dietro al busto
  // (si vede solo quello che esce dalla sagoma); o.armsOver {L,R} lo forza sopra la schiena (es. zoccolo dietro la schiena)
  const OV = o.armsOver || {};
  const posed = (sd) => !OV[sd] && (AF[sd] || (o.armRot && o.armRot[sd] != null) || (o.elbow && o.elbow[sd] != null));
  if (posed('L')) s += arm('L');
  if (posed('R')) s += arm('R');
  s += r3Part(u, 'to', R4_TORSO, C.S, `<ellipse cx="${lf ? 88 : 72}" cy="111" rx="45" ry="37" fill="${C.B}"/><ellipse cx="${lf ? 98 : 62}" cy="96" rx="17" ry="8" fill="${C.H}" transform="rotate(${lf ? 18 : -18} ${lf ? 98 : 62} 96)"/>` +
    `<ellipse cx="80" cy="146" rx="34" ry="11" fill="${C.S}"/>`);
  s += (R3X.body || '');
  if (!posed('L')) s += arm('L');
  if (!posed('R')) s += arm('R');
  // coda in primo piano: parte dal fondo della schiena, curva a destra e risale
  const tailD = 'M80 129 C82 141 95 143 101 134 C104 129.5 105 124 104.6 117';
  const tipD = 'M137.6 111.5 C131.4 106.6 132.4 97.4 137.6 93 C140.6 98.4 147 101 145 108.4 C144 112.2 140.4 113.4 137.6 111.5 Z';
  s += `<g class="r3-tail" data-view="back"><path d="${tailD}" fill="none" stroke="${C.tuftS}" stroke-width="5.6" stroke-linecap="round"/>` +
    `<path d="${tailD}" fill="none" stroke="${C.S}" stroke-width="3.4" stroke-linecap="round" transform="translate(-.8 -.6)"/>` +
    `<g class="r3-tailTip" transform="translate(-33 7)">` + r3Part(u, 'tt', tipD, C.tuftS, `<ellipse cx="136.5" cy="101" rx="5" ry="9" fill="${C.tuftB}"/>`) + `</g></g>`;
  s += `<g class="r3-head"${o.head ? ` transform="translate(${o.head.dx || 0} ${o.head.dy || 0}) rotate(${o.head.rot || 0} 80 92)"` : ''}>`;
  s += r4Ear(u, 'L', 0) + r4Ear(u, 'R', 0);
  s += r4Horn(u, 'L') + r4Horn(u, 'R');
  s += r3Part(u, 'hd', R4_HEAD, C.S, `<ellipse cx="${lf ? 86 : 74}" cy="49" rx="51" ry="40" fill="${C.B}"/><ellipse cx="${lf ? 100 : 60}" cy="31" rx="17" ry="7.5" fill="${C.H}" transform="rotate(${lf ? 22 : -22} ${lf ? 100 : 60} 31)"/>` +
    `<ellipse cx="80" cy="97" rx="38" ry="9" fill="${C.S}"/>`);
  // ciuffo visto da dietro: stessa ciocca, più scura e appoggiata sulla nuca, con due ciocche che scendono
  s += r4g(r3Part(u, 'tf', R4_TUFT, C.tuftS, `<ellipse cx="${lf ? 79 : 81}" cy="16" rx="16" ry="8" fill="${C.tuftB}"/>`), 0, 1, 80);
  s += r3Part(u, 'tn', 'M71 22.5 C69.6 27.6 71.4 32.6 76 35.4 C76.6 32.4 77.8 30 80 28.4 C81.6 30.8 83.8 32.4 86.8 33 C87.8 29 86.6 25 83.6 22 C79.6 23.6 75.2 23.8 71 22.5 Z', C.tuftS,
    `<ellipse cx="${lf ? 82 : 78}" cy="25.5" rx="7" ry="4.6" fill="${C.tuftB}"/>`);
  s += (R3X.head || '') + `</g>`;
  s += `</g>`;
  return s;
}

function rly4SVG(mood, size, uid, o) {
  o = o || {};
  const m = mood || 'neutral', u = uid || 'r4';
  const flip = o.facing === 'left';
  const back = o.view === 'back';
  const inner = `${o.fx === false || back ? '' : r3Extras(R4_NEW.indexOf(m) >= 0 ? 'neutral' : m)}<g class="r3-all">${r4Character(u, m, o)}</g>`;
  return `<svg viewBox="0 0 160 170" width="${size}" height="${size * 170 / 160}" style="overflow:visible;display:block" aria-hidden="true">` +
    `<ellipse class="r3-shadow" cx="80" cy="164" rx="38" ry="5" fill="#000" opacity=".18"/>` +
    `<g class="r3 r3-m-${m} r3-static"${flip ? ' transform="translate(160 0) scale(-1 1)"' : ''}>${inner}</g></svg>`;
}
// ============================================================================
// R4M · libreria di movimento di Rally (deterministica: ogni posa è funzione del tempo)
// ----------------------------------------------------------------------------
// Va bene sia dal vivo (requestAnimationFrame) sia per il video fotogramma per fotogramma:
// la stessa t dà sempre la stessa posa, senza stato nascosto. Anche il "follow-through"
// di orecchie e coda è deterministico: viene simulato con una molla su una finestra fissa
// di 1.2 s prima di t (passo 1/120 s), ricalcolata ogni volta.
//
// API
//   R4M.pose(clip, t, params?)  -> posa
//        clip: nome ('idle' 'wave' 'walk' 'turn' 'jump' 'celebrate' 'sad' 'talk' 'sip' 'surprise')
//        t: secondi dall'inizio del clip
//        params (tutti facoltativi): mood, view ('front'|'3q'|'side'), facing ('left'|'right'),
//          loop (true: i clip "a colpo singolo" ripartono da capo; default: si fermano sull'ultima posa),
//          speed (scala del tempo), fx (false: niente coriandoli), più parametri del clip
//          (walk: period, stride; jump: height; talk: text, rate; turn: to:'side'|'3q').
//   posa = { mood, o, css, offset:{x,y,rot,sx,sy}, hand:{L,R}, raw }
//        mood, o   -> da passare a rly4SVG(mood, size, uid, o)
//        css       -> { '.r3-legL': 'translate(..) rotate(..)', ... } da applicare con R4M.apply
//        offset.x  -> spostamento nel mondo (unità del viewBox 160x170, già col segno di facing):
//                     chi usa la libreria sposta il contenitore di offset.x * size/160 px
//        offset.y/rot/sx/sy -> già dentro css['.r3-all'] (salto, schiacciamento), qui per comodità
//        hand.L/R  -> rotazione totale (spalla+gomito) del braccio: per tenere dritti gli oggetti in mano
//                     (es. R3X.handL = tazzina ruotata di -hand.L attorno a 36,127)
//   R4M.apply(svgEl, css)       applica le trasformazioni CSS nel DOM con i perni giusti
//   R4M.svg(posa, size, uid)    stringa SVG completa con le trasformazioni già dentro (niente DOM:
//                               utile per node, per i video e per i fogli di prova)
//   R4M.timeline([{clip, dur, params, blend, t0}, ...]) -> { duration, pose(t), at(t) }
//        concatena i clip; ogni clip entra con una dissolvenza di `blend` secondi (default .3)
//        tra i parametri numerici (vista compresa: frontale <-> 3/4 <-> profilo passa per il giro
//        continuo, e il cambio di lato passa per il frontale). offset.x si accumula tra i clip.
//   R4M.define(nome, {dur, mood, cyclic, fn(P, t, p)})  aggiunge un clip; R4M.clips: elenco
//   R4M.ease: funzioni di easing (inOut, out, in, outBack, inBack, smooth, bump, spring)
//
// Principi applicati: anticipazione (prima di salto, giro, saluto, sorso), schiacciamento/allungamento
// (perno ai piedi, volume quasi costante), follow-through e sovrapposizione (orecchie, coda e punta
// della coda simulate a molla; avambraccio in ritardo sull'omero; testa in ritardo sul busto), archi
// (le mani ruotano attorno a spalla e gomito, il salto è una parabola), ease-in/out, tempi variati
// (ciglia a intervalli pseudo-casuali ma fissi, doppio battito ogni tanto, cambio di espressione
// nascosto da un battito di ciglia durante le transizioni).
//
// Usa solo le opzioni documentate di rly4SVG. Battito di ciglia: di norma con il CSS su .r3-blink;
// se un altro pezzo definisce R4_FEATURES = { blink: true }, passa invece o.blink (0..1).
// ============================================================================
const R4M = (function () {
  const S = Math.sin, Co = Math.cos, PI = Math.PI, TAU = 2 * PI, ex = Math.exp;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const lerp = (a, b, k) => a + (b - a) * k;
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const E = {
    inOut: (x) => (x = clamp(x, 0, 1)) < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    out: (x) => 1 - Math.pow(1 - clamp(x, 0, 1), 3),
    in: (x) => Math.pow(clamp(x, 0, 1), 3),
    smooth: (x) => (x = clamp(x, 0, 1)) * x * (3 - 2 * x),
    outBack: (x, s) => { x = clamp(x, 0, 1); const c = s == null ? 1.7 : s; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); },
    inBack: (x, s) => { x = clamp(x, 0, 1); const c = s == null ? 1.7 : s; return (c + 1) * x * x * x - c * x * x; },
    bump: (x) => (x <= 0 || x >= 1) ? 0 : S(PI * x),
    // risposta di una molla smorzata a un gradino: 0 -> 1 con rimbalzi (x in secondi)
    spring: (x, f, z) => x <= 0 ? 0 : 1 - ex(-(z == null ? 6 : z) * x) * Co(TAU * (f == null ? 2.2 : f) * x)
  };
  const hash = (n) => { const s = S(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  // yaw interno: 0 frontale · 1 tre quarti · 2 profilo (come o.turn 0..2 di 40_views.js).
  // Le capacità del rig si scoprono una volta sola confrontando le stringhe (niente supposizioni):
  //   turn2 = giro continuo fino a 2 · blink = o.blink · back = view:'back'
  const SIDE = 1.5; // per la logica dei clip: da qui in su si anima come di profilo
  let CAP = null;
  function caps() {
    if (CAP) return CAP;
    CAP = { turn2: false, blink: false, back: false };
    try {
      const g = (o) => { const sv = R3X; R3X = {}; const r = rly4SVG('happy', 10, 'cap', o); R3X = sv; return r; };
      CAP.turn2 = g({ turn: 1.5 }) !== g({ turn: 1 });
      CAP.blink = g({ blink: 1 }) !== g({ blink: 0 });
      CAP.back = g({ view: 'back' }) !== g({});
    } catch (e) { /* rig non ancora pronto: valori prudenti */ }
    if (typeof R4_FEATURES !== 'undefined' && R4_FEATURES && R4_FEATURES.blink) CAP.blink = true;
    return CAP;
  }
  // rotazione di default del braccio vicino per una certa vista (nel profilo pende dritto: -24)
  function defArmL(yaw) {
    if (caps().turn2 && typeof r4StateAt === 'function') { try { return r4StateAt(Math.min(1, yaw), Math.max(0, yaw - 1)).armLrot || 0; } catch (e) { } }
    return yaw >= SIDE ? -24 : 0;
  }

  // ---- posa "grezza": tutti numeri (tranne mood/facing/mouth), così si può mescolare ----
  function rest(p) {
    const yaw = p.view === 'side' ? 2 : p.view === '3q' ? 1 : clamp(p.turn || 0, 0, 2);
    return {
      yaw, back: p.view === 'back' ? 1 : 0, facing: p.facing === 'left' ? 'left' : 'right', mood: 'happy', mouth: null, fx: p.fx !== false,
      x: 0, y: 0, rot: 0, sx: 1, sy: 1, uRot: 0, uSx: 1, uSy: 1, hDx: 0, hDy: 0, hRot: 0,
      aL: 0, aR: 0, // aL/aR: scarto rispetto alla posa di default della vista
      eL: null, eR: null, fL: 0, fR: 0,
      lL: 0, lR: 0, yL: 0, yR: 0, earL: 0, earR: 0, tail: 0, tailTip: 0,
      blink: 0, look: null, shadow: 1, sec: 1
    };
  }
  const isSide = (P) => P.yaw >= SIDE;
  // sguardo di default, identico alla logica di r4Character / r4Eye
  function defLook(m, yaw) {
    if (yaw >= 1) return [3, 1.2];
    const k = clamp(yaw, 0, 1);
    if (k > 0) return [1 + 2 * k, 1.2];
    return m === 'thinking' ? [2.6, -4] : (m === 'sad' || m === 'wrong' || m === 'sleepy') ? [0, 3] : m === 'smug' ? [3.5, 1] : [1, 1.2];
  }
  const NOLID = { celebrating: 1, crying: 1, love: 1, dizzy: 1 };

  // ---- strati comuni ----
  function breathe(P, t, a, per) {
    a = a == null ? 1 : a; per = per || 3.4;
    const b = S(TAU * t / per);
    P.uSy *= 1 + .013 * a * b; P.uSx *= 1 - .006 * a * b;
    P.hDy += -.55 * a * S(TAU * (t - .25) / per);
    P.aL += 1.6 * a * S(TAU * (t - .15) / per); P.aR -= 1.6 * a * S(TAU * (t - .15) / per);
    P.earL += 2.5 * a * S(TAU * (t - .45) / per); P.earR += 2.5 * a * S(TAU * (t - .45) / per);
    P.tail += 5 * a * S(TAU * t / 2.6); P.tailTip += 7 * a * S(TAU * (t - .3) / 2.6);
  }
  function blinkShape(x) { // x: secondi dall'inizio del battito (dura .17 s)
    if (x < 0 || x > .17) return 0;
    if (x < .06) return E.in(x / .06) * .3 + E.smooth(x / .06) * .7;
    if (x < .09) return 1;
    return 1 - E.out((x - .09) / .08);
  }
  function blinks(P, t, seed, slow) {
    const cell = 3.1, k = Math.floor(t / cell); let b = 0;
    for (let j = k - 1; j <= k; j++) {
      const t0 = j * cell + .4 + hash(j + (seed || 0)) * 2.2;
      const sc = slow ? 1.6 : 1;
      b = Math.max(b, blinkShape((t - t0) / sc));
      if (hash(j * 3.7 + 9 + (seed || 0)) > .72) b = Math.max(b, blinkShape((t - t0 - .27) / sc));
    }
    P.blink = Math.max(P.blink, b);
  }
  function setLook(P, dx, dy) { const d = defLook(P.mood, P.yaw); P.look = [d[0] + dx, d[1] + dy]; }

  // ---- i clip ----
  const CL = {};
  function define(name, def) { CL[name] = def; }

  define('idle', {
    dur: 6.2, cyclic: true, mood: 'happy', fn(P, t) {
      breathe(P, t);
      P.rot += .6 * S(TAU * t / 6.2); P.hRot += .9 * S(TAU * (t - .35) / 6.2);
      blinks(P, t, 1);
      // ogni tanto uno sguardo di lato (gli occhi anticipano, la testa segue)
      const c = 6.2, u = ((t % c) + c) % c;
      const g = E.inOut(seg(u, 3.3, 3.55)) - E.inOut(seg(u, 4.5, 4.8));
      const gh = E.inOut(seg(u, 3.42, 3.85)) - E.inOut(seg(u, 4.55, 4.95));
      if (!isSide(P)) { setLook(P, 2.6 * g, -.6 * g); P.hDx += 1.2 * gh; P.hRot += 1.6 * gh; }
    }
  });

  define('wave', {
    dur: 2.6, mood: 'happy', fn(P, t) {
      breathe(P, t, .6); blinks(P, t + 1.3, 2);
      const ant = E.bump(seg(t, 0, .3));                       // anticipazione: si abbassa un poco
      P.sy *= 1 - .025 * ant; P.sx *= 1 + .012 * ant; P.aR += 7 * ant;
      const up = E.outBack(seg(t, .18, .55), 1.4) * (1 - E.inOut(seg(t, 1.95, 2.45)));
      const on = E.smooth(seg(t, .4, .6)) * (1 - E.smooth(seg(t, 1.8, 2.0)));
      const ph = TAU * 2.5 * (t - .55);
      P.fR = 1; P.pose = { name: 'saluta', w: up };
      P.aR += -96 * up + 6 * on * S(ph);                       // l'omero guida...
      P.eR = -40 * up + 24 * on * S(ph - 1.0);                 // ...l'avambraccio segue in ritardo
      P.hRot += 4.5 * up + .8 * on * S(ph - 1.6); P.hDx += 1 * up;
      P.rot += .7 * on * S(ph - .4); P.uRot += 1.2 * up;
      P.aL += -4 * up;
      if (t > .5 && t < 1.9) P.mouth = t < .75 ? 'E' : t < 1.0 ? 'A' : t < 1.2 ? 'O' : null; // "ciao!"
    }
  });

  define('walk', {
    dur: 3.6, cyclic: true, mood: 'happy', fn(P, t, p) {
      // Piede d'appoggio BLOCCATO: durante l'appoggio il piede arretra (rispetto all'anca) esattamente alla
      // velocità con cui il corpo avanza, quindi resta fermo sul pavimento; l'anca si abbassa quanto serve
      // perché la gamba rigida (25 unità, anca 138 -> suola 163) tocchi terra: y = 25 (1 - cos a).
      const T = p.period || .9, LG = 25;
      const side = isSide(P), q = !side && P.yaw > .5;
      const A = (p.stride || (side ? 33 : q ? 24 : 0)) * PI / 180; // ampiezza massima dell'angolo all'anca
      const D = 2 * LG * S(A), v = D / (T / 2);                     // passo e velocità
      const u = ((t / T) % 1 + 1) % 1, ph = TAU * u;
      blinks(P, t, 3);
      // posizione del piede (in avanti +) e sollevamento per una gamba con fase w (0..1)
      const foot = (w) => {
        if (w < .5) return { fx: D / 2 - D * (w / .5), lift: 0, st: 1 };                       // appoggio: lineare
        const k = (w - .5) / .5; return { fx: -D / 2 + D * E.inOut(k), lift: E.bump(k), st: 0 }; // volo: ritorna avanti
      };
      if (side || q) {
        const nL = foot(u), nR = foot((u + .5) % 1);
        const aL = Math.asin(clamp(nL.fx / LG, -1, 1)), aR = Math.asin(clamp(nR.fx / LG, -1, 1));
        P.lL = -aL * 180 / PI; P.lR = -aR * 180 / PI;              // angolo positivo = piede indietro
        P.yL = -7.5 * Math.pow(nL.lift, 1.2); P.yR = -7.5 * Math.pow(nR.lift, 1.2);
        if (q) { P.yL += 1.4 * nL.fx / (D / 2); P.yR += 1.4 * nR.fx / (D / 2); } // nel 3/4 il piede avanti scende un poco
        const ast = nL.st ? aL : aR;                               // gamba d'appoggio
        P.y += LG * (1 - Math.cos(ast));
        // schiacciamento all'appoggio (subito dopo il contatto), allungamento al passaggio
        const c2 = Co(2 * ph - .5);
        P.sy *= 1 - .03 * c2; P.sx *= 1 + .015 * c2;
      } else {                                                   // frontale: passo sul posto
        const c = Co(ph);
        P.yL = -5 * Math.pow(Math.max(0, c), 1.5); P.yR = -5 * Math.pow(Math.max(0, -c), 1.5);
        P.lL = 3 * Math.max(0, c); P.lR = -3 * Math.max(0, -c);
        const s2 = S(ph - .25) * S(ph - .25); P.y += 2.2 * s2 - .5; P.sy *= 1 - .022 * s2; P.sx *= 1 + .011 * s2;
        P.rot += 2.2 * S(ph - .3);
      }
      if (q) P.rot += 1.2 * S(ph - .3);
      P.uRot += (side ? 3.5 : q ? 2.5 : 0) + 1.1 * S(2 * ph - .7);
      P.hDy += .8 * Co(2 * ph - 1.1); P.hRot += 1.4 * S(2 * ph - 1.3) + (side ? -1 : 0);
      // braccia in opposizione alle gambe, in ritardo (follow-through): u=0 gamba vicina avanti -> braccio vicino indietro
      const ar = Co(ph - .35);
      if (side) { P.aL += 22 * ar; P.eL = -14 - 14 * Math.max(0, -Co(ph - .6)); P.aR = -18 * ar; }
      else if (q) { P.aL += 17 * ar; P.aR += -13 * ar; P.eL = -8 - 9 * Math.max(0, -Co(ph - .6)); }
      else { P.aL += 7 * S(ph - .35); P.aR += 7 * S(ph - .35); }
      P.tail += 6 * S(2 * ph - 1.5); P.tailTip += 8 * S(2 * ph - 2.2);
      P.x += (side || q) ? v * t : 0;
    }
  });

  define('turn', {
    dur: 3.4, mood: 'happy', fn(P, t, p) {
      const end = p.to === '3q' ? 1 : 2; // rampa continua 0 -> 2 (con rig vecchio: 3/4 e poi scatto al profilo)
      breathe(P, t, .7); blinks(P, t + .7, 4);
      // andata: occhi che anticipano, piccolo caricamento all'indietro, giro, oltre-corsa e assestamento
      const a1 = E.bump(seg(t, .3, .7)), k1 = E.inOut(seg(t, .58, 1.05));
      const a2 = E.bump(seg(t, 2.0, 2.35)), k2 = E.inOut(seg(t, 2.25, 2.75));
      P.yaw = lerp(lerp(0, end, k1), 0, k2);
      const ov1 = t > 1.0 ? ex(-(t - 1.0) * 6) * S(TAU * 1.3 * (t - 1.0)) : 0;
      const ov2 = t > 2.7 ? ex(-(t - 2.7) * 6) * S(TAU * 1.3 * (t - 2.7)) : 0;
      P.rot += -2.2 * a1 + 3.2 * ov1 + 1.8 * a2 - 2.6 * ov2;
      P.sy *= 1 - .035 * a1 - .025 * a2 + .03 * E.bump(k1) + .025 * E.bump(k2);
      P.sx *= 1 + .018 * a1 + .012 * a2 - .02 * E.bump(k1) - .015 * E.bump(k2);
      P.hRot += -3 * a1 + 4.5 * ex(-Math.max(0, t - 1.05) * 5) * S(TAU * 1.1 * Math.max(0, t - 1.05)) * (t > 1.05 ? 1 : 0) + 2 * a2 - 3 * ov2;
      P.hDy += 1.5 * (a1 + a2);
      const lookAhead = E.smooth(seg(t, .3, .5)) * (1 - E.smooth(seg(t, .8, 1.0)));
      const lookBack = E.smooth(seg(t, 2.0, 2.15)) * (1 - E.smooth(seg(t, 2.5, 2.75)));
      if (!isSide(P)) setLook(P, 3 * lookAhead - 3 * lookBack, 0);
      P.aL += 6 * a1 - 6 * a2; P.aR += -5 * a1 + 5 * a2;
      // il cambio 3/4 -> profilo avviene durante il movimento rapido (lo "smear" lo nasconde)
    }
  });

  define('jump', {
    dur: 1.6, mood: 'happy', fn(P, t, p) {
      const H = p.height || 46;
      breathe(P, t, .4);
      const pr = E.inOut(seg(t, .1, .42));                     // anticipazione: si schiaccia e carica le braccia
      const tk = seg(t, .42, .5);                              // spinta
      const fl = seg(t, .47, .99);                              // volo
      const air = t > .47 && t < .99;
      const ld = t - .99;                                       // atterraggio
      let sy = 1 - .15 * pr * (1 - tk), sx = 1 + .09 * pr * (1 - tk);
      if (t >= .42 && t < .99) {
        const st = .15 * Math.pow(1 - fl, 2) + .06 * Math.pow(fl, 3) + .14 * tk * (1 - fl);
        sy = lerp(sy, 1 + st, E.smooth(tk * 1.6)); sx = lerp(sx, 1 - st * .55, E.smooth(tk * 1.6));
      }
      if (ld >= 0) {
        const sq = ex(-ld * 8) * Co(TAU * 2.3 * ld);
        sy = 1 - .17 * sq; sx = 1 + .1 * sq;
      }
      P.sy *= sy; P.sx *= sx;
      if (air) P.y += -H * 4 * fl * (1 - fl);
      P.shadow = 1 - .45 * (-P.y / H);
      // braccia: indietro nella preparazione, su in volo (in ritardo), giù con rimbalzo all'atterraggio
      const upA = E.outBack(seg(t, .45, .72), 1.2) * (1 - E.inOut(seg(t, .86, 1.12)));
      const dn = ld >= 0 ? ex(-ld * 7) * S(TAU * 1.6 * ld) : 0;
      P.aL += 26 * pr * (1 - tk) + 98 * upA - 8 * dn; P.aR -= 26 * pr * (1 - tk) + 98 * upA - 8 * dn;
      P.eL = -30 * pr * (1 - tk) + 22 * upA; P.eR = -P.eL;
      P.fL = P.fR = upA > .6 ? 1 : 0; P.pose = { name: 'festeggia', w: upA };
      P.hDy += 3.5 * pr * (1 - tk) - 2 * E.bump(fl) + (ld >= 0 ? 4 * ex(-ld * 7) * S(TAU * 1.3 * ld + .5) : 0);
      P.lL = 6 * E.bump(fl); P.lR = -6 * E.bump(fl); P.yL = P.yR = -3.5 * E.bump(fl);
      if (fl > .18 && fl < .8) { P.mood = 'celebrating'; P.fx = false; }
      else if (pr > .3 && t < .47) setLook(P, 0, -2.5 * pr);
      if (ld > .05 && ld < .4) P.mouth = null;
      blinks(P, t + 2.2, 5);
    }
  });

  define('celebrate', {
    dur: 1.7, cyclic: true, mood: 'celebrating', fn(P, t, p) {
      if (p.fx !== true) P.fx = false;
      const hp = .85, i = Math.floor(t / hp), u = t - i * hp, sg = i % 2 ? -1 : 1;
      const pr = E.bump(seg(u, 0, .16)), fl = seg(u, .12, .55), ld = u - .55;
      P.y += (u > .12 && u < .55) ? -24 * 4 * fl * (1 - fl) : 0;
      let sy = 1 - .09 * pr, sx = 1 + .05 * pr;
      if (u > .12 && u < .55) { const st = .1 * Math.pow(1 - fl, 2); sy = 1 + st; sx = 1 - st * .55; }
      if (ld >= 0) { const sq = ex(-ld * 10) * Co(TAU * 2.4 * ld); sy = 1 - .12 * sq; sx = 1 + .07 * sq; }
      P.sy *= sy; P.sx *= sx; P.shadow = 1 - .4 * (-P.y / 24);
      const pump = S(TAU * u / hp - 1.2);
      P.aL = 100 + 14 * pump; P.aR = -100 - 14 * pump;
      P.eL = 22 + 16 * S(TAU * u / hp - 2.1); P.eR = -P.eL;
      P.fL = P.fR = 1; P.pose = { name: 'festeggia', w: 1 };
      P.rot += 4 * sg * E.bump(seg(u, .1, .6)); P.hRot += 5 * sg * E.bump(seg(u, .2, .75));
      P.lL = 5 * E.bump(fl); P.lR = -5 * E.bump(fl); P.yL = P.yR = -2.5 * E.bump(fl);
      P.tail += 14 * S(TAU * t * 2.4); P.tailTip += 16 * S(TAU * t * 2.4 - 1.1);
      P.mouth = null;
    }
  });

  define('sad', {
    dur: 5, cyclic: true, mood: 'sad', fn(P, t) {
      breathe(P, t, .7, 4.6);
      const c = 5, u = ((t % c) + c) % c;
      const inh = E.inOut(seg(u, 1.6, 2.5)), exh = E.inOut(seg(u, 2.6, 3.6)); // sospiro
      const sigh = inh * (1 - exh);
      P.uSy *= .975 + .04 * sigh - .012 * exh * (1 - E.smooth(seg(u, 3.6, 4.8)));
      P.hDy += 4.2 - 1.6 * sigh + 1.2 * exh * (1 - E.smooth(seg(u, 3.6, 4.8)));
      P.hRot += 3.2 + .8 * S(TAU * t / 5);
      P.aL += -9 + 2 * sigh; P.aR += 9 - 2 * sigh;
      P.eL = -10; P.eR = 10;
      P.earL += -24 + 6 * sigh; P.earR += -24 + 6 * sigh;
      P.tail += 24 - 4 * sigh; P.sec = .6;
      P.y += .6;
      blinks(P, t, 6, true);
    }
  });

  // visemi come nel video del giro: vocali -> A E O, m/b/p -> M, f/v -> F
  function vis(ch) {
    ch = ch.toLowerCase();
    if ('aàá'.indexOf(ch) >= 0) return 'A'; if ('eèéiìí'.indexOf(ch) >= 0) return 'E'; if ('oòóuùú'.indexOf(ch) >= 0) return 'O';
    if ('mbp'.indexOf(ch) >= 0) return 'M'; if ('fv'.indexOf(ch) >= 0) return 'F'; if (/[a-z]/.test(ch)) return 'E'; return 'X';
  }
  const SPEECH = {};
  const TALK_TXT = 'Se il tasso sale, il prezzo del bond scende.';
  function speech(txt, rate) {
    const key = txt + '|' + rate; if (SPEECH[key]) return SPEECH[key];
    const a = [], words = []; let t = 0, inW = false;
    for (let i = 0; i < txt.length; i++) {
      const ch = txt[i], v = vis(ch), isL = /[a-zàèéìòù]/i.test(ch);
      if (isL && !inW) words.push({ t, i, len: (txt.slice(i).match(/^[a-zàèéìòù]+/i) || [''])[0].length });
      inW = isL;
      a.push([t, v]);
      t += (/[.,!?:]/.test(ch) ? .28 : (v === 'X' ? .06 : (v === 'M' || v === 'F' ? .075 : .095))) / rate;
    }
    const R = { a, words, end: t, seq: null };
    // se esiste il lip-sync di 10_mouth.js lo usiamo (bocca e tempi delle parole)
    if (typeof r4LipSync === 'function' && typeof r4MouthAt === 'function') {
      try {
        const seq = r4LipSync(txt, { rate });
        if (seq && seq.length) {
          R.seq = seq; R.end = seq[seq.length - 1].t;
          words.forEach((w) => { const e = seq.find((q) => q.i >= w.i); w.t = e ? e.t : w.t; });
        }
      } catch (err) { R.seq = null; }
    }
    return (SPEECH[key] = R);
  }
  define('talk', {
    dur: null, cyclic: false, mood: 'happy', fn(P, t, p) {
      const L = speech(p.text || TALK_TXT, p.rate || 1);
      breathe(P, t, .7); blinks(P, t, 7);
      const tt = clamp(t, 0, L.end + .8);
      let v = 'X';
      if (L.seq) v = r4MouthAt(L.seq, tt);
      else { for (let i = 0; i < L.a.length && L.a[i][0] <= tt; i++) v = L.a[i][1]; if (tt > L.end) v = 'X'; }
      P.mouth = v;
      // annuisce a ogni parola, alternando l'inclinazione; gesto del braccio sulle parole lunghe
      let nod = 0, sgn = 1, gest = 0;
      L.words.forEach((w, i) => {
        const x = seg(tt, w.t, w.t + .34), b = E.bump(x);
        if (b > nod) { nod = b; sgn = i % 2 ? -1 : 1; }
        if (w.len >= 5) gest = Math.max(gest, E.bump(seg(tt, w.t - .05, w.t + .6)));
      });
      P.hDy += 1.3 * nod; P.hRot += sgn * 2 * nod + 1.2 * S(TAU * tt / 2.4);
      P.aR += -24 * gest; P.eR = -34 * gest; P.uRot += .8 * gest;
    }
  });

  define('sip', {
    dur: 4.4, mood: 'happy', fn(P, t) {
      breathe(P, t, .6);
      const ant = E.bump(seg(t, 0, .3));
      P.aL += 6 * ant; P.sy *= 1 - .015 * ant;
      const up = E.inOut(seg(t, .2, .85)), dn = E.inOut(seg(t, 2.6, 3.25)), dnE = E.inOut(seg(t, 2.72, 3.4)); // il gomito scende in ritardo
      const tip = E.bump(seg(t, 1.0, 2.4));
      // valori della posa "bevi" di 30_arms.js se c'è, altrimenti quelli collaudati (-84 / -96)
      let SA = -84, SE = -96;
      if (typeof r4PoseBlend === 'function') { try { const F = r4PoseBlend('bevi', 0); if (F && F.armRot && F.armRot.L != null) { SA = F.armRot.L; SE = (F.elbow && F.elbow.L) || SE; } } catch (e) { } }
      P.aL += SA * up * (1 - dn);
      P.eL = (SE * E.outBack(seg(t, .26, .9), 1.1) - 6 * tip) * (1 - dnE);
      P.hRot += (-5 - 4 * tip) * up * (1 - dn); P.hDy += -1 * up * (1 - dn);
      P.fL = (P.aL < -30) ? 1 : 0; P.pose = { name: 'bevi', w: up * (1 - dn) };
      if (t > 1.0 && t < 2.4) { P.mood = 'celebrating'; P.fx = false; }
      const ah = E.bump(seg(t, 3.3, 4.1));                     // "aah": sospiro soddisfatto
      P.uSy *= 1 + .02 * E.bump(seg(t, 3.15, 3.6)) - .015 * ah; P.hRot += 2 * ah;
      if (t > 3.4 && t < 3.9) P.mouth = 'A';
      if (t < 1.0 || t > 2.4) blinks(P, t + .4, 8);
    }
  });

  define('surprise', {
    dur: 1.9, mood: 'happy', fn(P, t) {
      breathe(P, t, .5);
      const sq = E.bump(seg(t, .22, .34));                     // anticipazione minima + battito "doppio sguardo"
      P.sy *= 1 - .05 * sq; P.sx *= 1 + .03 * sq;
      P.blink = Math.max(P.blink, blinkShape((t - .2) * 1.2));
      const jt = seg(t, .32, .5), fall = seg(t, .5, .74), ld = t - .74;
      const on = t >= .32, back = E.inOut(seg(t, 1.35, 1.8));
      if (t >= .32 && t < .74) P.y += t < .5 ? -14 * E.out(jt) : -14 * (1 - E.in(fall));
      if (t >= .32 && t < .74) { const st = .13 * (1 - jt * .6) * (1 - fall); P.sy *= 1 + st; P.sx *= 1 - st * .5; }
      if (ld >= 0) { const s = ex(-ld * 9) * Co(TAU * 2.4 * ld); P.sy *= 1 - .08 * s; P.sx *= 1 + .05 * s; }
      P.shadow = 1 + P.y / 40;
      if (on && t < 1.5) { P.mood = 'surprised'; P.mouth = 'O'; }
      const arm = on ? E.outBack(seg(t, .32, .52), 2) : 0;
      const relax = E.inOut(seg(t, .85, 1.35));
      const amt = arm * (1 - .4 * relax) * (1 - back);
      P.aL += 55 * amt; P.aR -= 55 * amt; P.eL = 30 * amt; P.eR = -30 * amt;
      P.earL += 16 * amt; P.earR += 16 * amt; P.tail += -16 * amt;
      P.hDy += -2.5 * E.bump(seg(t, .36, .7)) + 2 * (ld >= 0 ? ex(-ld * 7) * S(TAU * 1.5 * ld) : 0);
      if (on && t < 1.5) setLook(P, 0, -1.5);
    }
  });

  // ---- valutazione ----
  function clipDur(def, p) {
    if (def.dur != null) return def.dur;
    if (def === CL.talk) return speech(p.text || TALK_TXT, p.rate || 1).end + .8;
    return 1;
  }
  function baseClip(name, t, p) {
    const def = CL[name]; if (!def) throw new Error('R4M: clip sconosciuto ' + name);
    p = p || {};
    t *= p.speed || 1;
    const d = clipDur(def, p);
    if (!def.cyclic) t = p.loop ? ((t % d) + d) % d : clamp(t, 0, d);
    const P = rest(p); P.mood = p.mood || def.mood || 'happy';
    def.fn(P, t, p);
    if (p.mood && P.mood === def.mood) P.mood = p.mood;
    return P;
  }
  const NUM = ['x', 'wx', 'back', 'y', 'rot', 'sx', 'sy', 'uRot', 'uSx', 'uSy', 'hDx', 'hDy', 'hRot', 'aL', 'aR', 'fL', 'fR',
    'lL', 'lR', 'yL', 'yR', 'earL', 'earR', 'tail', 'tailTip', 'blink', 'shadow', 'sec'];
  function mix(A, B, w) {
    const P = {};
    NUM.forEach((k) => { P[k] = (A[k] == null || B[k] == null) ? (w < .5 ? A[k] : B[k]) : lerp(A[k], B[k], w); });
    // vista: yaw con segno (sinistra negativa), così un cambio di lato passa per il frontale
    const ya = A.facing === 'left' ? -A.yaw : A.yaw, yb = B.facing === 'left' ? -B.yaw : B.yaw;
    let y = lerp(ya, yb, w);
    if (A.facing !== B.facing && Math.abs(y) < 1e-6) y = 0;
    P.facing = y < 0 ? 'left' : y > 0 ? 'right' : (w < .5 ? A.facing : B.facing);
    P.yaw = Math.abs(y);
    // gomito: null = braccio intero (v3); si mescola come 0
    ['eL', 'eR'].forEach((k) => { P[k] = (A[k] == null && B[k] == null) ? null : lerp(A[k] || 0, B[k] || 0, w); });
    const la = A.look || defLook(A.mood, A.yaw), lb = B.look || defLook(B.mood, B.yaw);
    P.look = (A.look || B.look) ? [lerp(la[0], lb[0], w), lerp(la[1], lb[1], w)] : null;
    P.mood = w < .5 ? A.mood : B.mood;
    if (A.pose && B.pose && A.pose.name === B.pose.name) P.pose = { name: A.pose.name, w: lerp(A.pose.w, B.pose.w, w) };
    else if (A.pose || B.pose) P.pose = (A.pose && (!B.pose || w < .5)) ? { name: A.pose.name, w: A.pose.w * (1 - w) } : { name: B.pose.name, w: B.pose.w * w };
    P.mouth = w < .5 ? A.mouth : B.mouth;
    P.fx = w < .5 ? A.fx : B.fx;
    // il cambio di espressione si nasconde dietro un battito di ciglia
    if (A.mood !== B.mood && !NOLID[A.mood] && !NOLID[B.mood]) P.blink = Math.max(P.blink, E.bump(seg(w, .36, .64)));
    return P;
  }

  // ---- follow-through: molle per orecchie, coda e punta della coda ----
  function headY(P) { return P.y + (P.sy - 1) * (92 - 163) + P.hDy + (P.uSy - 1) * (92 - 150); }
  function secondary(base, t) {
    const dt = 1 / 120, N = 144;
    const ys = new Array(N + 3), xs = new Array(N + 3), ss = new Array(N + 3);
    let dir = 1;
    for (let i = 0; i < N + 3; i++) { const P = base(t + (i - N - 1) * dt); ys[i] = headY(P); dir = P.facing === 'left' ? -1 : 1; xs[i] = P.wx != null ? P.wx * dir : P.x; ss[i] = P.sec; }
    let e = 0, ev = 0, tl = 0, tv = 0, tp = 0, tpv = 0;
    const we = TAU * 3.2, ze = .22, wt = TAU * 1.7, zt = .26, wp = TAU * 2.6, zp = .2;
    for (let i = 1; i <= N + 1; i++) {
      const a = (ys[i + 1] - 2 * ys[i] + ys[i - 1]) / (dt * dt), v = (ys[i + 1] - ys[i - 1]) / (2 * dt);
      const ax = (xs[i + 1] - 2 * xs[i] + xs[i - 1]) / (dt * dt);
      const g = ss[i];
      ev += (-we * we * e - 2 * ze * we * ev + g * (2.2 * a + 14 * v)) * dt; e += ev * dt;
      const tacc = -wt * wt * tl - 2 * zt * wt * tv + g * (-2.4 * a + 1.2 * ax);
      tv += tacc * dt; tl += tv * dt;
      tpv += (-wp * wp * tp - 2 * zp * wp * tpv - 1.1 * tacc) * dt; tp += tpv * dt;
    }
    const soft = (x, m) => m * Math.tanh(x / m);
    return { ear: soft(e, 38), tail: soft(tl, 30), tip: soft(tp, 30) };
  }

  // ---- uscita: opzioni per rly4SVG + CSS ----
  const f = (v) => (Math.abs(v) < 5e-4 ? 0 : +v.toFixed(3));
  function finalize(P, sec) {
    const K = caps(), back = P.back >= .5 && K.back;
    const side = !back && (K.turn2 ? P.yaw >= 2 - 1e-3 : P.yaw >= SIDE), mir = !back && P.yaw > .5;
    const o = {};
    if (back) o.view = 'back';
    else if (side) o.view = 'side';
    else if (P.yaw > 1e-3) o.turn = f(K.turn2 ? P.yaw : Math.min(1, P.yaw));
    P.aL += back ? 0 : defArmL(K.turn2 ? P.yaw : (side ? 2 : Math.min(1, P.yaw)));
    if (P.facing === 'left') o.facing = 'left';
    const ar = {}; if (side || Math.abs(P.aL) > 1e-3) ar.L = f(P.aL); if (Math.abs(P.aR) > 1e-3) ar.R = f(P.aR);
    if (ar.L != null || ar.R != null) o.armRot = ar;
    o.__ar = ar;
    if (P.pose && !back && P.yaw > .02 && typeof r4PoseBlend === 'function' && K.turn2) poseAdapt(P, o);
    if (P.eL != null || P.eR != null) { o.elbow = {}; if (P.eL != null) o.elbow.L = f(P.eL); if (P.eR != null) o.elbow.R = f(P.eR); }
    if (P.fL >= .5 || P.fR >= .5) { o.armsFront = {}; if (P.fL >= .5) o.armsFront.L = 1; if (P.fR >= .5) o.armsFront.R = 1; }
    if (Math.abs(P.hDx) + Math.abs(P.hDy) + Math.abs(P.hRot) > 1e-3) o.head = { dx: f(P.hDx), dy: f(P.hDy), rot: f(P.hRot) };
    delete o.__ar;
    if (P.mouth) o.mouth = P.mouth;
    if (P.look) o.look = [f(P.look[0]), f(P.look[1])];
    if (P.fx === false) o.fx = false;
    const useOpt = K.blink;
    if (useOpt && P.blink > 1e-3) o.blink = f(P.blink);
    const earL = P.earL + sec.ear, earR = P.earR + sec.ear;
    const tail = P.tail + sec.tail, tip = P.tailTip + sec.tip, ts = mir ? -1 : 1;
    // di spalle la coda è in primo piano (perno 80,129) e la punta ha già un suo transform: non la tocchiamo
    const css = {
      '.r3-all': `translate(0px,${f(P.y)}px) rotate(${f(P.rot)}deg) scale(${f(P.sx)},${f(P.sy)})`,
      '.r3-upper': `rotate(${f(P.uRot)}deg) scale(${f(P.uSx)},${f(P.uSy)})`,
      // la testa non si deforma: stessa posa di o.head (che resta per le ombre delle braccia) + scala inversa
      '.r3-head': `translate(${f(P.hDx)}px,${f(P.hDy)}px) rotate(${f(P.hRot)}deg) scale(${f(1 / (P.sx * P.uSx))},${f(1 / (P.sy * P.uSy))})`,
      '.r3-legL': `translate(0px,${f(P.yL)}px) rotate(${f(P.lL)}deg)`,
      '.r3-legR': `translate(0px,${f(P.yR)}px) rotate(${f(P.lR)}deg)`,
      '.r3-earL': `rotate(${f(earL)}deg)`,
      '.r3-earR': `rotate(${f(-earR)}deg)`,
      '.r3-tail': `rotate(${f(ts * tail)}deg)`,
      '.r3-shadow': `scale(${f(clamp(P.shadow, .3, 1.3))},${f(clamp(P.shadow, .3, 1.3))})`
    };
    if (!back) css['.r3-tailTip'] = `rotate(${f(ts * tip)}deg)`;
    if (!useOpt) css['.r3-blink'] = `translate(0px,${f(30 * P.blink)}px)`;
    const dir = P.facing === 'left' ? -1 : 1;
    return {
      mood: P.mood, o, css,
      offset: { x: f(P.wx != null ? P.wx : P.x * dir), y: f(P.y), rot: f(P.rot), sx: f(P.sx), sy: f(P.sy) },
      hand: { L: f(P.aL + (P.eL || 0)), R: f(P.aR + (P.eR || 0)) },
      raw: P
    };
  }

  // Nei giri le pose delle braccia sono pensate per il frontale: se il clip dichiara P.pose = {name, w}
  // (una posa di R4_POSES, w = quanto è "dentro" la posa) e la vista non è frontale, si sposta il braccio
  // verso la variante della posa per quella vista (r4PoseBlend: frontale -> turn3 -> side), con continuità.
  function poseAdapt(P, o) {
    let F, B;
    try { F = r4PoseBlend(P.pose.name, 0) || {}; B = r4PoseBlend(P.pose.name, Math.min(2, P.yaw)) || {}; } catch (e) { return; }
    const w = clamp(P.pose.w, 0, 1); if (w < 1e-3) return;
    const dL = defArmL(Math.min(2, P.yaw)), Fa = F.armRot || {}, Ba = B.armRot || {}, Fe = F.elbow || {}, Be = B.elbow || {};
    const ar = o.__ar;
    ['L', 'R'].forEach((sd) => {
      const def = sd === 'L' ? dL : 0;
      const cur = sd === 'L' ? P.aL : P.aR;
      let tgt = Ba[sd] != null ? Ba[sd] : def, fr = Fa[sd] != null ? Fa[sd] : 0;
      while (tgt - def - fr > 180) tgt -= 360; while (tgt - def - fr < -180) tgt += 360;
      ar[sd] = f(cur + w * (tgt - def - fr));
      const ek = sd === 'L' ? 'eL' : 'eR', fe = Fe[sd] != null ? Fe[sd] : 0, be = Be[sd] != null ? Be[sd] : 0;
      if (P[ek] != null || Be[sd] != null) P[ek] = (P[ek] || 0) + w * (be - fe);
    });
    o.armRot = ar;
    ['reach', 'foreshorten'].forEach((k) => {
      const d0 = k === 'reach' ? 1 : 0, bv = B[k] || {};
      if (!B[k]) return; o[k] = {};
      ['L', 'R'].forEach((sd) => { if (bv[sd] != null) o[k][sd] = f(d0 + w * (bv[sd] - d0)); });
    });
    if (w > .5) {
      if (B.hoof) o.hoof = B.hoof;
      if (P.yaw > .3 && B.armsFront) { P.fL = B.armsFront.L ? 1 : 0; P.fR = B.armsFront.R ? 1 : 0; }
    }
  }

  function pose(clip, t, params) {
    const base = (tt) => baseClip(clip, tt, params);
    return finalize(base(t), secondary(base, t));
  }

  function timeline(items) {
    // x nel mondo: durante una dissolvenza si mescolano le VELOCITÀ (non le posizioni), così chi
    // cammina rallenta e si ferma senza scivolare indietro. Il clip precedente viene proseguito
    // con la sua velocità finale v0; il nuovo parte da X0 + v0*B/2 (= integrale di (1-w) * v0).
    let st = 0, X = 0; const segs = [];
    const wxAt = (it, lt) => { const P = baseClip(it.clip, lt, it.p); return P.x * (P.facing === 'left' ? -1 : 1); };
    items.forEach((it, i) => {
      const p = it.params || {}, def = CL[it.clip];
      if (!def) throw new Error('R4M: clip sconosciuto ' + it.clip);
      const dur = it.dur != null ? it.dur : clipDur(def, p);
      const sg = { clip: it.clip, p, dur, start: st, t0: it.t0 || 0, blend: it.blend != null ? it.blend : (i ? .3 : 0) };
      const prev = segs[i - 1];
      sg.X0 = X; sg.v0 = prev ? (wxAt(prev, prev.t0 + prev.dur + .005) - wxAt(prev, prev.t0 + prev.dur - .005)) / .01 : 0;
      sg.bx = X + sg.v0 * sg.blend / 2;
      sg.x0 = wxAt(sg, sg.t0);
      X = sg.bx + wxAt(sg, sg.t0 + dur) - sg.x0;
      segs.push(sg); st += dur;
    });
    const evalSeg = (s, t) => {
      const P = baseClip(s.clip, t - s.start + s.t0, s.p);
      P.wx = s.bx + P.x * (P.facing === 'left' ? -1 : 1) - s.x0;
      return P;
    };
    const find = (t) => { let i = 0; while (i < segs.length - 1 && t >= segs[i + 1].start) i++; return i; };
    const base = (t) => {
      const i = find(t), s = segs[i];
      let P = evalSeg(s, t);
      if (i > 0 && s.blend > 0 && t - s.start < s.blend) {
        const tau = Math.max(0, t - s.start), u = tau / s.blend, w = E.smooth(u);
        const loc = P.wx - s.bx;
        P = mix(evalSeg(segs[i - 1], t), P, w);
        P.wx = s.X0 + s.v0 * (tau - s.blend * (u * u * u - u * u * u * u / 2)) + w * loc;
      }
      return P;
    };
    return {
      duration: st, segments: segs,
      at: (t) => { const i = find(t); return { index: i, clip: segs[i].clip, local: t - segs[i].start }; },
      pose: (t) => finalize(base(t), secondary(base, t))
    };
  }

  // ---- applicazione ----
  const PIV = {
    '.r3-all': [80, 163], '.r3-upper': [80, 150], '.r3-head': [80, 92], '.r3-legL': [65, 138], '.r3-legR': [96, 138],
    '.r3-earL': [43, 51], '.r3-earR': [117, 51], '.r3-tail': [117, 131], '.r3-tailTip': [137.5, 110],
    '.r3-shadow': [80, 164], '.r3-blink': [0, 0]
  };
  const MIRP = { '.r3-tail': [43, 131], '.r3-tailTip': [22.5, 110] };
  const BACKP = { '.r3-tail': [80, 129] };
  function apply(svgEl, css) {
    if (!svgEl || !css) return;
    for (const sel in css) {
      svgEl.querySelectorAll(sel).forEach((el) => {
        const tl = el.closest ? el.closest('.r3-tail') : null;
        const mir = tl && tl.getAttribute('data-mir') === '1', bk = tl && tl.getAttribute('data-view') === 'back';
        if (bk && sel === '.r3-tailTip') return;
        const pv = (bk && BACKP[sel]) || (mir && MIRP[sel]) || PIV[sel] || [0, 0];
        el.style.transformBox = 'view-box';
        el.style.transformOrigin = pv[0] + 'px ' + pv[1] + 'px';
        el.style.transform = css[sel];
      });
    }
  }
  function svg(ps, size, uid) {
    let s = rly4SVG(ps.mood, size, uid, ps.o);
    const mir = s.indexOf('data-mir="1"') >= 0, bk = s.indexOf('class="r3-tail" data-view="back"') >= 0;
    for (const sel in ps.css) {
      if (bk && sel === '.r3-tailTip') continue;
      const c = sel.slice(1), pv = (bk && BACKP[sel]) || (mir && MIRP[sel]) || PIV[sel] || [0, 0];
      const st = ` style="transform-box:view-box;transform-origin:${pv[0]}px ${pv[1]}px;transform:${ps.css[sel]}"`;
      s = s.replace(new RegExp('<(\\w+) class="' + c + '"([^>]*)>', 'g'), (m, tag, rest) => { const cl = /\/\s*$/.test(rest); return `<${tag} class="${c}"${rest.replace(/\/\s*$/, '')}${st}${cl ? '/' : ''}>`; });
    }
    return s;
  }

  return { pose, timeline, apply, svg, define, caps, clips: CL, ease: E, list: () => Object.keys(CL), _base: baseClip, _speech: speech };
})();
