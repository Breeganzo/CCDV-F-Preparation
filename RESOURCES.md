# CCDV-F Resources

## Exam facts (verified from Anthropic Partner Academy, Exam Guide v1.0)

| | |
|---|---|
| Code | **CCDV-F** |
| Questions | **53** |
| Time | **120 minutes** |
| Passing score | **720** (scaled 100–1000) ≈ **~69% raw** |
| Item types | Multiple choice + multiple response (the item tells you how many to select) |
| Delivery | Pearson VUE — online proctored or test centre |
| Fee | **$125 USD** per attempt |
| Validity | **12 months** |
| Retakes | 14 days after 1st fail, 30 after 2nd, 90 after 3rd; **max 4 attempts** per rolling 12 months |
| Score report | Pass/fail + scaled score + percent correct per domain |

## Domain weights

| # | Domain | Weight | ~Items |
|---|---|---|---|
| 1 | Agents and Workflows | 14.7% | 8 |
| 2 | Applications and Integration | 33.1% | 18 |
| 3 | Claude Code | 3.1% | 2 |
| 4 | Eval, Testing, and Debugging | 2.6% | 1 |
| 5 | Model Selection and Optimization | 16.8% | 9 |
| 6 | Prompt and Context Engineering | 11.0% | 6 |
| 7 | Security and Safety | 8.1% | 4 |
| 8 | Tools and MCPs | 10.6% | 5 |

---

## Official — Anthropic Partner Academy (free)

- **Certification page** — https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification
- **Full prep learning path** — https://anthropic-partners.skilljar.com/path/claude-certified-developer-foundations
- **Building with the Claude API** — https://anthropic-partners.skilljar.com/claude-with-the-anthropic-api
- **Claude Code in Action** — https://anthropic-partners.skilljar.com/claude-code-in-action
- **Introduction to Model Context Protocol** — https://anthropic-partners.skilljar.com/introduction-to-model-context-protocol

## Official docs — highest value per minute

Ordered by how much of the exam they cover.

1. **Building effective agents** (essay) — https://www.anthropic.com/engineering/building-effective-agents
   *Read this one in full. The workflow-vs-agent distinction and all five patterns come
   straight from here, and D1 is 14.7%.*
2. **Messages API reference** — https://docs.anthropic.com/en/api/messages
3. **Errors** — https://docs.anthropic.com/en/api/errors
4. **Tool use overview** — https://docs.anthropic.com/en/docs/build-with-claude/tool-use
5. **Prompt caching** — https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
6. **Context windows** — https://docs.anthropic.com/en/docs/build-with-claude/context-windows
7. **Models overview / choosing a model** — https://docs.anthropic.com/en/docs/about-claude/models
8. **Prompt engineering overview** — https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
9. **Extended thinking** — https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking
10. **Batch processing** — https://docs.anthropic.com/en/docs/build-with-claude/batch-processing
11. **Streaming** — https://docs.anthropic.com/en/api/streaming
12. **Mitigate jailbreaks and prompt injections** — https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks
13. **Reduce hallucinations** — https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations
14. **Create strong empirical evaluations** — https://docs.anthropic.com/en/docs/test-and-evaluate/develop-tests
15. **MCP specification** — https://modelcontextprotocol.io
16. **Claude Code docs** — https://docs.anthropic.com/en/docs/claude-code/overview
    (memory, hooks, slash commands, subagents, SDK/headless)

---

## YouTube — an honest assessment

**No channel legitimately walks through real CCDV-F exam questions.** Anything claiming to
be "real exam dumps" is either (a) fabricated, and will teach you wrong answers, or
(b) genuinely leaked, in which case using it violates the Anthropic Certification Terms &
Conditions and your credential is revoked if detected. The exam is new, the item bank is
small, and leaked-content detection on a Pearson VUE exam is not theoretical.

Channels that are actually useful:

- **Manifold AI Learning** (Nachiketh) — the most substantive CCDV-F content currently
  available. Two relevant videos: a study-guide walkthrough (~13 min) and an honest
  post-exam review (~18 min) describing what the exam actually felt like. Search YouTube
  for `Manifold AI Learning Claude Certified Developer`.
- **Tutorials Dojo** — https://www.youtube.com/channel/UCw4cxFG34-cCbG5RdA-7mTw — strong
  general certification exam technique; not CCDV-F-specific.
- **Anthropic's own channel** — for Claude Code and MCP walkthroughs.

Free practice questions elsewhere (quality varies — treat as supplementary):
- FlashGenius — https://flashgenius.net/sample-tests/ccdv-f

---

## How to use the 5 hours

| Time | Activity |
|---|---|
| 0:00–0:20 | Read **STUDY-GUIDE.md** — the five core ideas + D2 and D5 sections. |
| 0:20–1:10 | **Practice mode**, Domain 2 drill (49 questions). Instant feedback. Read every explanation, including for questions you got right. |
| 1:10–1:40 | Domain 5 drill (25 questions). |
| 1:40–2:10 | Domain 1 drill (22 questions). |
| 2:10–2:30 | Break. Actually take it. |
| 2:30–3:15 | **Full exam simulation** — 53 questions, 120-minute timer, no feedback until submit. |
| 3:15–3:45 | Review the simulation. Re-drill missed questions. |
| 3:45–4:15 | Drill D6, D8, D7. Skim D3 and D4 (~9 questions total). |
| 4:15–4:45 | Second full exam simulation. Target **>80%** — the real pass mark is ~69%, so leave headroom. |
| 4:45–5:00 | Re-read the five core ideas and the "final 30 minutes" checklist. Stop studying. |

Per-domain scores below 60% in the results table are flagged. Re-drill those, not the ones
you already pass.

---

## A note on the question bank

These 150 questions are **original**, written from the published exam blueprint and the
official Anthropic documentation, weighted to match the real domain distribution and
style-matched to Pearson VUE scenario items. They are not, and are not represented as,
actual exam content.

That is deliberate, and it is also better preparation: memorised answers to leaked items
collapse the moment the wording changes, whereas the reasoning patterns these questions
drill — deterministic vs probabilistic, capability vs instruction, simplest-thing-that-works,
measure-before-you-change — transfer to whatever the real items happen to say.
