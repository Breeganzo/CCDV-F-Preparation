/* Schema + coverage validator. Run: node tools/validate.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const sandbox = { window: {} };
vm.createContext(sandbox);

const files = ['data/blueprint.js'].concat(
  fs.readdirSync(path.join(root, 'data')).filter(f => f.startsWith('questions-')).map(f => 'data/' + f)
);
for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f });

const BP = sandbox.window.CCDV_BLUEPRINT;
const Q = sandbox.window.CCDV_QUESTIONS || [];
const errs = [];
const E = (id, m) => errs.push(`${id}: ${m}`);

const seen = new Set();
const byDomain = {}, byDiff = {}, bySub = {};
const validSub = {};
BP.domains.forEach(d => { validSub[d.id] = new Set(d.subskills); byDomain[d.id] = 0; });

for (const q of Q) {
  const id = q.id || '(missing id)';
  if (seen.has(q.id)) E(id, 'duplicate id'); else seen.add(q.id);
  if (!BP.domains.some(d => d.id === q.d)) { E(id, `unknown domain ${q.d}`); continue; }
  byDomain[q.d]++;
  byDiff[q.diff] = (byDiff[q.diff] || 0) + 1;
  bySub[q.s] = (bySub[q.s] || 0) + 1;

  if (!validSub[q.d].has(q.s)) E(id, `sub-skill "${q.s}" not in blueprint domain ${q.d}`);
  if (![1, 2, 3].includes(q.diff)) E(id, `bad diff ${q.diff}`);
  if (!['single', 'multi'].includes(q.type)) E(id, `bad type ${q.type}`);
  if (!q.stem || q.stem.length < 20) E(id, 'stem missing/too short');
  if (!Array.isArray(q.opts) || q.opts.length < 3) E(id, 'needs >=3 options');
  if (!Array.isArray(q.correct) || !q.correct.length) E(id, 'no correct answers');
  if (q.n !== q.correct.length) E(id, `n=${q.n} but correct.length=${q.correct.length}`);
  if (q.type === 'single' && q.n !== 1) E(id, 'single must have n=1');
  if (q.type === 'multi' && q.n < 2) E(id, 'multi must have n>=2');
  if (new Set(q.correct).size !== q.correct.length) E(id, 'duplicate index in correct');
  for (const c of q.correct) if (!(c >= 0 && c < (q.opts || []).length)) E(id, `correct index ${c} out of range`);
  if (!q.why || q.why.length < 40) E(id, 'why missing/too short');
  if (!q.doc || !q.doc.t || !/^https:\/\//.test(q.doc.u || '')) E(id, 'doc link missing/not https');
  const wrongKeys = new Set(Object.keys(q.wrong || {}).map(Number));
  for (let i = 0; i < (q.opts || []).length; i++) {
    if (q.correct.includes(i)) { if (wrongKeys.has(i)) E(id, `wrong[${i}] explains a CORRECT option`); }
    else if (!wrongKeys.has(i)) E(id, `missing wrong[${i}] distractor explanation`);
  }
  for (const k of wrongKeys) if (!(k >= 0 && k < (q.opts || []).length)) E(id, `wrong key ${k} out of range`);
}

console.log(`\nTotal questions loaded: ${Q.length}\n`);
console.log('Domain                               weight   bank  actual  exam');
console.log('-'.repeat(68));
let bankTotal = 0, examTotal = 0;
for (const d of BP.domains) {
  const a = byDomain[d.id];
  bankTotal += d.bank; examTotal += d.exam;
  const flag = a === d.bank ? ' ' : '<';
  console.log(`${d.id}. ${d.name.padEnd(34)}${(d.weight + '%').padStart(6)}${String(d.bank).padStart(7)}${String(a).padStart(8)}${flag}${String(d.exam).padStart(5)}`);
  if (a !== d.bank) E(`domain ${d.id}`, `expected ${d.bank} questions, found ${a}`);
}
console.log('-'.repeat(68));
console.log(`${''.padEnd(37)}${'TOTAL'.padStart(6)}${String(bankTotal).padStart(7)}${String(Q.length).padStart(8)} ${String(examTotal).padStart(5)}`);

const dn = n => byDiff[n] || 0;
console.log(`\nDifficulty mix: recall ${dn(1)} (${Math.round(dn(1) / Q.length * 100)}%) | scenario ${dn(2)} (${Math.round(dn(2) / Q.length * 100)}%) | hard ${dn(3)} (${Math.round(dn(3) / Q.length * 100)}%)`);
console.log(`Multi-response items: ${Q.filter(q => q.type === 'multi').length}`);
console.log(`Sub-skills covered: ${Object.keys(bySub).length} of ${BP.domains.reduce((n, d) => n + d.subskills.length, 0)}`);
const uncovered = [];
BP.domains.forEach(d => d.subskills.forEach(s => { if (!bySub[s]) uncovered.push(`D${d.id} ${s}`); }));
if (uncovered.length) console.log('UNCOVERED sub-skills: ' + uncovered.join(', '));

if (errs.length) { console.log(`\n${errs.length} PROBLEM(S):`); errs.forEach(e => console.log('  - ' + e)); process.exit(1); }
console.log('\nAll checks passed.\n');
