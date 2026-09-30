# CCDV-F Study Guide — ordered by exam weight

> Read this top-down. **Domains 2 + 5 alone are 49.9% of the exam.** Domain 3 (Claude Code) is
> only 3.1% — roughly **2 questions**. Most people over-study Claude Code because it's the fun
> part. Don't.

| Priority | Domain | Weight | Items (of 53) |
|---|---|---|---|
| 1 | D2 Applications and Integration | 33.1% | ~18 |
| 2 | D5 Model Selection and Optimization | 16.8% | ~9 |
| 3 | D1 Agents and Workflows | 14.7% | ~8 |
| 4 | D6 Prompt and Context Engineering | 11.0% | ~6 |
| 5 | D8 Tools and MCPs | 10.6% | ~5 |
| 6 | D7 Security and Safety | 8.1% | ~4 |
| 7 | D3 Claude Code | 3.1% | ~2 |
| 8 | D4 Eval, Testing, and Debugging | 2.6% | ~1 |

Pass mark: **720 scaled** out of 100–1000 ≈ **~69% raw**. 53 questions, 120 minutes → 2.2 min
per question. Time is not your constraint; precision is.

---

## The five ideas that answer most of the exam

If you remember nothing else, remember these. They are the discriminator between the
right answer and the plausible-sounding one over and over again.

1. **Deterministic beats probabilistic for invariants.**
   If something must happen *every time* — auth, validation, formatting, blocking a
   destructive action — it goes in code, a hook, or a permission boundary. **Never** in a
   prompt. "Instruct the model to…" is almost always the wrong answer when the requirement
   is absolute.

2. **Capability restriction beats instruction.**
   An action the agent structurally cannot perform cannot be induced by any input. Scope
   credentials, remove tools from untrusted paths, gate on human approval.

3. **Simplest thing that works.**
   Single call → prompt chain → routing → parallelisation → orchestrator → autonomous
   agent. Only escalate when the simpler pattern demonstrably fails. "Use an agent" is a
   trap answer for a task with a fixed, known sequence of steps.

4. **Measure before you change.**
   Labelled eval set, one variable at a time. "Upgrade the model" / "rewrite the prompt"
   before diagnosis is always wrong on this exam.

5. **Model output is untrusted input at a boundary.**
   Parse, validate structure, validate *semantics* separately, define the failure path.
   Schema validation proves shape, not truth.

---

## D2 — Applications and Integration (33.1%) ← spend the most time here

### Claude API mechanics (6.8 — the single heaviest sub-skill)
- **Messages API**: `messages` is a list of `{role, content}`. Roles strictly alternate
  user/assistant. `system` is a **top-level parameter**, not a message role.
- **The API is stateless.** You resend the full conversation every turn. There is no
  server-side session. This is why context management is your job.
- **`stop_reason`** — you must check it:
  - `end_turn` — model finished naturally
  - `max_tokens` — **truncated**; your output is incomplete. A JSON parse failure here is
    a truncation bug, not a model bug.
  - `tool_use` — model wants a tool; you must run it and send results back
  - `stop_sequence` — hit one of your stop strings
  - `refusal` — model declined
- **`max_tokens`** caps *output only*. It does not reserve or affect input.
- **Multi-turn tool use loop**: assistant turn containing `tool_use` → you append a **user**
  turn containing `tool_result` blocks with matching `tool_use_id` → call again. Every
  `tool_use` must get a `tool_result`, in the same turn, or the API errors.
- **Streaming** (`stream: true`) — SSE. Improves *perceived* latency (time-to-first-token).
  Does **not** reduce total tokens, cost, or total generation time. Required for very long
  outputs to avoid request timeouts.
- **Errors**: `400 invalid_request_error` (your bug — do NOT retry), `401 authentication`,
  `403 permission`, `404 not_found`, `413 request_too_large`, `429 rate_limit_error`
  (retry w/ exponential backoff + jitter, honour `retry-after`), `500 api_error`,
  `529 overloaded_error` (retry). **Retry 429/500/529 and timeouts; never retry 400.**
- **Batch API**: async, up to 24h turnaround, ~**50% cheaper**. Use for offline/bulk work.
  Never for anything a user is waiting on.

### Claude application design (8.6 — the heaviest sub-skill overall)
- Separate concerns: prompt/context layer, model call layer, tool execution layer,
  validation layer. Business rules live in code, not prompts.
- Idempotency for anything that mutates state — agents retry.
- Fail-open vs fail-closed must be an **explicit decision**, especially for guardrails.
- Human-in-the-loop for irreversible/high-blast-radius actions.
- Stateless services + externalised conversation state → horizontal scaling.
- Graceful degradation: cached response, smaller model, or a clear error — never a silent
  wrong answer.

### Software engineering foundations (7.4)
- Standard stuff applies: layering, DI, testability, error propagation, observability.
- Log **request id, model, params, stop_reason, token counts, latency** — you cannot debug
  an LLM system without these.
- Unit-test deterministic layers (parsers, validators, tool implementations) normally.
  Use eval sets, not assertions, for the probabilistic layer.

### Understanding requirements (3.4)
- Translate business need → measurable acceptance criteria *before* prompting.
- Identify what must be exact (code) vs what tolerates variance (model).
- Latency budget, cost ceiling, accuracy floor, failure tolerance — get these numbers first.

### Systems life cycle (2.8)
- Prototype → eval set → staged rollout → monitor → iterate.
- Pin model versions in production. Re-run the eval suite before any version change.

### Configuration management (4.1)
- Model id, temperature, max_tokens, prompt templates, tool definitions = **configuration**,
  versioned and environment-specific — not hardcoded constants.
- Prompts should be versioned artifacts with an eval score attached.
- Secrets never in config files or images. Runtime injection only.

---

## D5 — Model Selection and Optimization (16.8%)

### Technical fundamentals (6.1) + LLM fundamentals (5.2)
- **Tokens ≈ 3.5–4 chars** of English. Non-English and code tokenize less efficiently.
- Context window holds **input + output together**.
- Model is **stateless and autoregressive**; "memory" is entirely resent context.
- **Temperature**: 0 = most deterministic (not *guaranteed* deterministic), higher = more
  varied. Use 0 for extraction/classification/routing; higher for creative generation.
  Temperature is **not** a correctness, safety, or speed control.
- **Extended thinking**: extra reasoning tokens before the answer. Helps hard multi-step
  reasoning. Costs tokens and latency. Not for simple classification.
- Hallucination: model produces fluent, confident, wrong output. Mitigate with grounding
  (retrieval + citations), permission to say "I don't know", and verification.

### Model selection and trade-offs (2.7)
Shape of the answer, not the specific names:
- **Small/fast tier** (Haiku-class): high volume, simple, latency-sensitive, cheap.
- **Balanced tier** (Sonnet-class): the default for most production work.
- **Frontier tier** (Opus-class): hardest reasoning, complex agents, research.
- **Routing pattern**: classify with a cheap model, escalate only hard cases. This is
  frequently the correct answer to "reduce cost without losing quality".
- Right answer to "which model?" is almost never "the biggest". It's "the smallest that
  passes your eval set".

### Cost and token management (2.8)
- **Prompt caching**: cache the stable *prefix* (system prompt, tool defs, large fixed
  documents). Big discount on cache reads, small premium on cache writes. Requires the
  prefix to be **byte-identical and stable** — put variable content *after* cached content.
- **Batch API**: ~50% off for non-realtime.
- Other levers: trim context, smaller model, shorter outputs, routing.
- Output tokens cost more than input tokens. Verbose responses are a real cost line.

---

## D1 — Agents and Workflows (14.7%)

### Workflows vs agents — the core distinction
- **Workflow**: LLM steps orchestrated through **predefined code paths**. You know the
  steps. Predictable, testable, cheaper, debuggable.
- **Agent**: the model **directs its own process and tool use**, deciding the steps
  dynamically. Use only when the path genuinely cannot be known in advance.
- Default to the workflow. Agents cost more, take longer, and fail in more ways.

### Patterns (know all five by name and by trigger)
| Pattern | Use when |
|---|---|
| **Prompt chaining** | Task decomposes into a fixed sequence; each step's output feeds the next. Add programmatic gates between steps. |
| **Routing** | Inputs fall into distinct categories needing different handling/models. |
| **Parallelisation** | *Sectioning* — independent subtasks run concurrently. *Voting* — same task run multiple times for confidence. |
| **Orchestrator–workers** | Subtasks aren't known upfront; a central LLM decomposes and delegates. |
| **Evaluator–optimizer** | One model generates, another critiques against criteria, loop. Needs clear, articulable criteria. |

### Agent construction (5.3)
- Agent loop: perceive → decide → act (tool) → observe result → repeat until done.
- **Always bound the loop**: max iterations, wall-clock timeout, cost ceiling.
- Define an explicit stop condition and an explicit failure exit.
- Give the agent a clear success criterion; without one it wanders.
- Checkpoint state so a long run can resume.
- Tool results must be unambiguous — distinguish "no results" from "error".

### Agent architecture (4.5)
- Single agent with tools < multi-agent. Only split when subtasks need genuinely isolated
  context or different capabilities.
- Subagents for **context isolation** — each explores in its own window and returns a
  distilled finding.
- Human approval gates on irreversible actions.

---

## D6 — Prompt and Context Engineering (11.0%)

### Prompt engineering (4.6)
- **Be clear and direct.** Specify format, length, and required content explicitly.
- **XML tags** to delimit instructions vs examples vs data. Prevents the model confusing
  supplied content with directions — also an injection mitigation.
- **Few-shot / multishot**: best for conveying *format* and *edge-case conventions*.
  Include near-miss examples to sharpen a confused category boundary.
- **Chain of thought**: "think step by step" or a `<thinking>` block for multi-step
  reasoning. Costs tokens.
- **Prefill the assistant turn**: start it with `{` to force straight into JSON and skip
  the preamble.
- **Role prompting** via the system parameter.
- Iterate against an eval set, one change at a time.

### Context engineering (3.8)
- **Compaction** — replace old turns with a structured summary. Must *deliberately*
  preserve decisions, constraints, and open items, not just narrate.
- **Pruning** — remove superseded/irrelevant content entirely (old file versions,
  consumed search results).
- **Task isolation / subagents** — analyse in separate windows, return findings only.
- **Context bloat** hurts twice: cost *and* accuracy (signal dilution).
- Keep durable state (goals, constraints) **outside** the conversation and re-inject it.
- Filter verbose tool output *before* it enters context — usually the biggest win.

### Output handling (2.6)
- **Tool schema is the most reliable structured-output mechanism** — define a tool whose
  `input_schema` is your target shape, read the `tool_use` arguments. Beats asking for JSON.
- Defensive parsing: check `stop_reason`, validate structure, validate values, define the
  failure path.
- Schema valid ≠ semantically correct. Recompute/cross-reference where correctness matters.

---

## D8 — Tools and MCPs (10.6%)

### Tool implementation (4.4)
- A tool definition = `name`, `description`, `input_schema` (JSON Schema).
- **The description is the most important field** — it is how the model decides *when* to
  call it. Describe purpose, when to use, when NOT to use, and what it returns.
- Fewer, well-described tools beat many overlapping ones.
- Tool results should be descriptive on failure ("no user with that id" ≠ empty array ≠
  "database unreachable").
- Tool execution happens **in your code**. The model only requests. You enforce auth,
  rate limits, and validation at the execution site — never trust the arguments blindly.
- `tool_choice`: `auto` (default), `any` (must use some tool), `tool` (force a specific
  one), `none`.

### MCP (2.1)
- **Model Context Protocol** — an open standard for connecting models to external
  tools/data. Client–server. The point is **write the integration once, reuse across any
  MCP-compatible client**, instead of bespoke per-app glue.
- Servers expose **tools** (actions), **resources** (data), **prompts** (templates).
- Transports: stdio (local) and HTTP/SSE (remote).
- Correct answer to "we need this integration in 4 different apps" → MCP server.

### Agentic customisation (4.1)
- Slash commands (`.claude/commands/*.md`, committed = team-wide), Skills, subagents,
  hooks, memory — pick based on whether you need *knowledge*, *invocation*, *isolation*,
  or *enforcement*.
- Need enforcement → **hook**. Need shared invocable procedure → **command**. Need
  always-on project knowledge → **CLAUDE.md**. Need isolated context → **subagent**.

---

## D7 — Security and Safety (8.1%)

- **Direct jailbreak** = user types the attack. **Indirect prompt injection** = the attack
  is embedded in content the system *ingests* (web page, doc, email). Indirect is more
  dangerous — legitimate user, hostile data.
- **The dangerous triad**: untrusted input + sensitive data access + an external
  send/exfiltration channel. Break the chain structurally.
- Defences are **layered**: delimit and label untrusted input as data-not-instructions,
  restrict capability on untrusted paths, authorise at the retrieval layer, filter output,
  human approval for high-impact actions.
- **Authorisation belongs at retrieval**, filtered by the authenticated user — not in the
  prompt, and not post-hoc.
- **Data minimisation / redaction before the call** beats "tell the model not to repeat it".
- **Deterministic guardrail** = code that always runs (regex/PII block, permission check,
  hook). **Probabilistic** = prompt, examples, model-based classifier.
- A model-based moderation filter is itself probabilistic: needs its own eval set,
  monitored FP/FN rates, and a defined fail-open/fail-closed policy.
- **Progressive autonomy**: propose-and-approve → narrow autonomy → wider. Never full
  autonomy on day one.
- **Hooks** run deterministically at lifecycle points and can **block** the pending action.
  "Must happen every time / must be blocked" → hook, not CLAUDE.md.
- **Keys**: runtime injection from a secret manager, per-service scoping, scheduled
  rotation, usage monitoring. Never in repo, never baked into an image, never shared
  across services.
- **End-user identity must propagate** to the downstream API (delegated token) so that
  system enforces the real user's permissions.

---

## D3 — Claude Code (3.1%, ~2 questions — 15 minutes max)

- **Plan mode** — read-only investigation, proposes a plan for approval before editing.
- **Headless mode** (`-p` / print) — non-interactive, for CI and scripting.
- **`/compact`** — summarise and continue the same task. **`/clear`** — wipe context, new
  task. **`/init`** — generate CLAUDE.md. **`/resume`** — reopen a prior session.
- **CLAUDE.md** — project memory, committed to the repo, loaded every session. The fix for
  "we keep having to tell it the same thing".
  Hierarchy: enterprise → user (`~/.claude/`) → project root → subdirectory.
- **Custom slash commands** — markdown in `.claude/commands/` (project, shared) or
  `~/.claude/commands/` (personal).
- **Settings** — `.claude/settings.json` (shared), `.claude/settings.local.json` (personal,
  gitignored), `~/.claude/settings.json` (user).
- **Subagents** — `.claude/agents/`, isolated context for a delegated subtask.
- **Hooks** — deterministic lifecycle enforcement (see D7).

---

## D4 — Eval, Testing, and Debugging (2.6%, ~1 question — 10 minutes max)

- First step for any intermittent failure: **capture full traces** (prompt, model, params,
  `stop_reason`, output, tool results) and find the pattern. Never "upgrade the model" first.
- **Integration-layer vs model-layer**: a well-formed response that is semantically wrong →
  prompt/context/model. Malformed request, wrong params, unhandled truncation, bad tool
  result → your code.
- Retry 429 / 500 / 529 / timeouts with backoff. **Never** retry 400.
- Evals: labelled set, held out, run before every prompt or model change. LLM-as-judge for
  subjective criteria, exact match for extraction/classification.
- Ambiguous tool results (bare empty array) cause the agent to fill the gap with assumption.

---

## Final 30 minutes before the exam

Re-read the **five ideas** at the top. Then, on every question, ask:

1. Does the requirement say *must / every time / never*? → deterministic answer (code, hook,
   permission), not a prompt.
2. Is an option "use a bigger model" or "rewrite the prompt" *before* measuring? → almost
   certainly wrong.
3. Is an option "build an agent" for a task with known fixed steps? → wrong; workflow.
4. Does an option trust model output without validating it? → wrong.
5. Is an option the *simplest* thing that satisfies every stated constraint? → probably right.

Watch for the item telling you **how many** to select. Multi-response is scored
all-or-nothing — partial credit does not exist.
