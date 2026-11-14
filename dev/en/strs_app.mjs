// Elenco di tutte le stringhe "da leggere" di una zona di app.js (per riguardarle a occhio): node dev/en/strs_app.mjs da a
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const HERE = path.dirname(new URL(import.meta.url).pathname); const acorn = createRequire(HERE + '/')('acorn');
const src = fs.readFileSync(path.join(HERE, '..', '..', 'app.js'), 'utf8');
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module', locations: true });
const da = +process.argv[2], a = +process.argv[3]; const seen = new Set();
function walk(n, parent) {
  if (!n || typeof n.type !== 'string') return;
  const l = n.loc.start.line;
  const isL = parent && parent.type === 'CallExpression' && parent.callee.type === 'Identifier' && parent.callee.name === 'L';
  if (isL) return;
  const add = t => { t = t.replace(/\s+/g, ' ').trim(); if (l < da || l > a || !/[A-Za-zÀ-ÿ]{3,}/.test(t) || seen.has(t)) return; if (/^[a-z][A-Za-z0-9_\-:.\/#\[\]]*$/.test(t) && t.length < 24) return; if (/^(https?:|#|\.|\/|\d|[a-z]+\(|[\d.]+(px|em|%))/.test(t) || /^[a-z]+-[a-z-]+$/.test(t)) return; if (/(solid|flex|rgba?\(|translate|px |var\(--)/.test(t) && t.length < 80) return; seen.add(t); console.log(l + ': ' + t.slice(0, 140)); };
  if (n.type === 'Literal' && typeof n.value === 'string' && !(parent && parent.type === 'Property' && parent.key === n && !parent.computed) && !(parent && parent.type === 'ImportDeclaration')) add(n.value);
  if (n.type === 'TemplateLiteral') add(n.quasis.map(q => q.value.cooked).join('◇'));
  for (const k in n) { const v = n[k]; if (Array.isArray(v)) v.forEach(c => walk(c, n)); else if (v && typeof v.type === 'string') walk(v, n); }
}
walk(ast, null);
