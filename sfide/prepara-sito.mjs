// Prepara la cartella ./sito: i file dell'app che Cloudflare pubblica insieme all'arbitro, allo stesso indirizzo.
// Dentro finiscono SOLO i file che servono al telefono: niente sorgenti, appunti o strumenti (cartella dev/), niente cartella sfide/.
// Lo lancia wrangler prima di ogni pubblicazione e di ogni prova (vedi "build" in wrangler.jsonc); a mano: node sfide/prepara-sito.mjs
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const QUI = dirname(fileURLToPath(import.meta.url)), APP = join(QUI, '..'), SITO = join(QUI, 'sito');
// l'elenco è chiuso: un file nuovo dell'app va aggiunto qui, altrimenti non viene pubblicato (e questo script si ferma se manca uno di questi)
const FILE = ['index.html', 'app.js', 'ordine.js', 'ordine_en.js', 'sw.js', 'manifest.webmanifest', 'favicon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'notizie.json'];
const CARTELLE = ['rally', 'notizie'];

// Intestazioni di sicurezza per tutte le pagine e i file (formato _headers di Cloudflare).
// La regola completa su quali programmi possono girare (script-src, connect-src) arriva quando le librerie esterne saranno dentro l'app:
// oggi React, Tailwind, KaTeX e i caratteri arrivano ancora da altri siti e una regola stretta fermerebbe l'app.
const INTESTAZIONI = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=31536000
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Content-Security-Policy: frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'
`;

const mancano = FILE.concat(CARTELLE).filter(f => !existsSync(join(APP, f)));
if (mancano.length) { console.error('prepara-sito: mancano ' + mancano.join(', ')); process.exit(1); }
rmSync(SITO, { recursive: true, force: true }); mkdirSync(SITO, { recursive: true });
for (const f of FILE) cpSync(join(APP, f), join(SITO, f));
for (const c of CARTELLE) cpSync(join(APP, c), join(SITO, c), { recursive: true });
writeFileSync(join(SITO, '_headers'), INTESTAZIONI);

// controllo: dentro non devono esserci file che non sono dell'app (sorgenti, appunti, chiavi) e nessun file enorme
const tutti = []; const giro = d => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) giro(p); else tutti.push(p); } }; giro(SITO);
const strani = tutti.filter(p => !/\.(html|js|json|webmanifest|svg|png|webp|jpg)$/.test(p) && !p.endsWith('_headers'));
const grossi = tutti.filter(p => statSync(p).size > 20 * 1024 * 1024);
if (strani.length || grossi.length) { console.error('prepara-sito: file inattesi: ' + strani.concat(grossi).join(', ')); process.exit(1); }
const peso = tutti.reduce((s, p) => s + statSync(p).size, 0);
console.log(`sito pronto: ${tutti.length} file, ${(peso / 1048576).toFixed(1)} MB`);
