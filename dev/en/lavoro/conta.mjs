import fs from 'fs'; import * as acorn from 'acorn'; import * as walk from 'acorn-walk';
const src = fs.readFileSync('/home/claude/app/ordine.js', 'utf8');
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module', locations: true });
// salta le lezioni (BASI_UNITS)
let skip = null;
for (const n of ast.body) if (n.type === 'VariableDeclaration' && n.declarations[0].id.name === 'BASI_UNITS') skip = [n.start, n.end];
const inSkip = n => skip && n.start >= skip[0] && n.end <= skip[1];
let lit = [], tpl = [], tagged = [];
walk.full(ast, (n) => {
  if (inSkip(n)) return;
  if (n.type === 'Literal' && typeof n.value === 'string') lit.push(n);
  if (n.type === 'TemplateLiteral') tpl.push(n);
});
const isTag = new Set();
walk.full(ast, (n) => { if (n.type === 'TaggedTemplateExpression' && !inSkip(n)) { tagged.push(n); isTag.add(n.quasi); } });
console.log('literal', lit.length, 'template', tpl.length, 'tagged(html)', tagged.filter(n => n.tag.name === 'html').length, 'altri tag', tagged.filter(n => n.tag.name !== 'html').map(n => n.tag.name).join(','));
// quanti letterali "da lettere"
const hasLetters = s => /[A-Za-zÀ-ÿ]{2,}/.test(s);
const lit2 = lit.filter(n => hasLetters(n.value));
console.log('literal con lettere', lit2.length, 'distinti', new Set(lit2.map(n => n.value)).size);
let chars = 0; for (const n of lit2) chars += n.value.length; console.log('caratteri nei letterali', chars);
let tchars = 0, tn = 0; for (const t of tpl) { for (const q of t.quasis) { if (hasLetters(q.value.cooked)) { tn++; tchars += q.value.cooked.length; } } }
console.log('quasi con lettere', tn, 'caratteri', tchars);
