// scene.cjs · Dalla scheda dell'episodio (video.js) alle battute per tempi.py: id, testo della voce, lingua e pausa prima della battuta.
// La pausa segue la stessa regola di tg.js (funzione pausaScene): "pausa" della scena, altrimenti un respiro in più prima di ogni capitolo.
// Uso: node scene.cjs [scene.json]
global.window = {};
require('./video.js');
const V = window.VIDEO;
const cap = new Set((V.capitoli || []).map((c) => c.scena));
const PC = V.pausaCapitolo == null ? 0.6 : V.pausaCapitolo;
const out = V.scene.map((s, j) => ({ id: s.id, dice: s.dice, lingua: V.lingua || 'it', pausa: s.pausa != null ? s.pausa : (j && cap.has(s.id)) ? PC : 0 }));
require('fs').writeFileSync(process.argv[2] || 'scene.json', JSON.stringify(out));
console.log('battute', out.length, '· caratteri della voce', out.reduce((a, s) => a + s.dice.length, 0));
