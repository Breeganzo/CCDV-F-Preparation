/* Measures answer-key tells. Run: node tools/bias.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const sb = { window: {} }; vm.createContext(sb);
for (const f of ['data/blueprint.js'].concat(
  fs.readdirSync(path.join(root, 'data')).filter(f => f.startsWith('questions-')).map(f => 'data/' + f)))
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sb, { filename: f });

const Q = sb.window.CCDV_QUESTIONS;
const single = Q.filter(q => q.type === 'single');

let longest = 0, shortest = 0, cLen = 0, cN = 0, wLen = 0, wN = 0;
const spreads = [], offenders = [];
const absolutes = /\b(always|never|only|all|none|every|cannot|must not|no other)\b/i;
let absC = 0, absW = 0;

for (const q of single) {
  const L = q.opts.map(o => o.length);
  const max = Math.max(...L), min = Math.min(...L);
  const ci = q.correct[0];
  if (L[ci] === max) { longest++; offenders.push(q.id); }
  if (L[ci] === min) shortest++;
  cLen += L[ci]; cN++;
  L.forEach((n, i) => { if (i !== ci) { wLen += n; wN++; } });
  spreads.push(Math.round((max - min) / min * 100));
  q.opts.forEach((o, i) => {
    if (absolutes.test(o)) { if (i === ci) absC++; else absW++; }
  });
}

const avg = a => Math.round(a.reduce((x, y) => x + y, 0) / a.length);
console.log(`\nSingle-answer questions analysed: ${single.length}\n`);
console.log(`Correct option is the LONGEST : ${longest}  (${Math.round(longest / single.length * 100)}%)   <- chance is ~25%`);
console.log(`Correct option is the SHORTEST: ${shortest}  (${Math.round(shortest / single.length * 100)}%)`);
console.log(`Avg length, correct option    : ${Math.round(cLen / cN)} chars`);
console.log(`Avg length, distractors       : ${Math.round(wLen / wN)} chars`);
console.log(`Correct/distractor length ratio: ${(cLen / cN / (wLen / wN)).toFixed(2)}x   <- want ~1.00`);
console.log(`Avg within-question spread    : ${avg(spreads)}%  (longest vs shortest option)`);
console.log(`\nAbsolutes ("always/never/only") in correct options : ${absC}`);
console.log(`Absolutes in distractors                           : ${absW}   <- a tell if lopsided`);

// position bias
const pos = {};
single.forEach(q => { pos[q.correct[0]] = (pos[q.correct[0]] || 0) + 1; });
console.log(`\nAnswer position distribution: ` +
  Object.keys(pos).sort().map(k => `${'ABCDEF'[k]}=${pos[k]}`).join('  '));
console.log(`\nFirst 25 questions where correct == longest:\n  ${offenders.slice(0, 25).join(', ')}\n`);
