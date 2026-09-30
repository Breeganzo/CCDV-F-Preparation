# CCDV-F Prep — Claude Certified Developer (Foundations)

A 180-question practice bank with a self-scoring UI. No install, no server, no build step.

### ▶︎ [Study online — no download needed](https://breeganzo.github.io/CCDV-F-Preparation/)

## Run it

Use the hosted link above, or run it locally — double-click `index.html`, or:

```bash
open -a "Google Chrome" index.html
```

Everything runs client-side. Progress is stored in your browser's `localStorage`, so you
can close the tab and resume. Nothing is uploaded, and there is no account or tracking.

## Modes

| Mode | Behaviour |
|---|---|
| **Full Exam** | 53 questions sampled to match real domain weights, 120-minute timer. Auto-submits at 0:00. |
| **Practice** | Whole bank, shuffled, no timer. |
| **Domain Drill** | Every question from one domain. |
| **Re-drill Missed** | Only the questions you got wrong last run. |

**Instant feedback** is a checkbox on the home screen, **on by default, and it applies to
every mode including the timed exam.** The moment you complete an answer, the correct
option goes green, your wrong pick goes red, and the full explanation opens underneath.
The question grid also colours green/red as you go. Turn the checkbox off only when you
want a realistic Pearson VUE dry run with no reveals until submit. The setting is
remembered between sessions.

Keyboard: `1`–`6` select · `←` `→` navigate · `Enter` next · `F` flag for review.

## Scoring

Matches the real exam. Multi-response items are **all-or-nothing** — no partial credit.
Raw percentage is converted to the 100–1000 scale (`100 + raw × 900`); **720 is the pass
mark**, which is about **69% raw**. The results screen breaks your score down per domain
and flags any domain under 60%.

## Where to start

1. `STUDY-GUIDE.md` — weight-ordered cheatsheet. The "five ideas" section at the top
   answers a large fraction of the exam on its own.
2. `RESOURCES.md` — verified exam facts, official free courses, the highest-value docs
   pages, and a suggested 5-hour schedule.
3. The app — start with a **Domain 2 drill**. D2 is 33.1% of the exam.

## Files

```
index.html                        UI (inline CSS)
assets/app.js                     sampler, timer, scoring, history
data/blueprint.js                 exam config + domain weights (source of truth)
data/questions-d1-agents.js       22 questions
data/questions-d2-apps.js         49
data/questions-d3-claude-code.js   5
data/questions-d4-eval-debug.js    4
data/questions-d5-model.js        25
data/questions-d6-prompt-context.js 17
data/questions-d7-security.js     12
data/questions-d8-tools-mcp.js    16
data/questions-r2-supplement.js   30   (round 2, weight-distributed)
tools/validate.js                 schema + coverage validator
tools/bias.js                     answer-key bias detector
STUDY-GUIDE.md
RESOURCES.md
```

Bank totals by domain: D1 26 · D2 59 · D3 6 · D4 5 · D5 30 · D6 20 · D7 15 · D8 19 = **180**.

Run `node tools/validate.js` after editing any question file. It checks unique IDs, valid
answer indices, `n === correct.length`, a distractor explanation for every wrong option,
sub-skill names against the blueprint, and per-domain counts.

Run `node tools/bias.js` to check the answer key has no tells. Options are written to
uniform length and the key is rotated evenly across all four positions, so you cannot
guess the answer by picking the longest option — the current bank measures a 1.04×
correct/distractor length ratio and a 41/43/47/40 A/B/C/D distribution.

## Contributing

Issues and pull requests are welcome, especially corrections to explanations or doc links.
Two rules: questions must be **original** (see below), and `node tools/validate.js` plus
`node tools/bias.js` must both pass before a PR is merged.

## Note on content

All 180 questions are **original**, authored from the published exam blueprint and official
Anthropic documentation, weighted to the real domain distribution. They are not real exam
items. Using leaked exam content violates the Anthropic Certification Terms & Conditions
and results in revocation of the credential.

This project is not affiliated with, endorsed by, or sponsored by Anthropic PBC or Pearson
VUE. "Claude" is a trademark of Anthropic PBC. Always check the [official exam guide](https://anthropic-partners.skilljar.com/)
for current exam details before booking.

Licensed MIT — see [LICENSE](LICENSE).
