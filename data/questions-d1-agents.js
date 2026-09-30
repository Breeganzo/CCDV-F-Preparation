/* Domain 1 - Agents and Workflows - 14.7% of the exam (8 of 53 items).
   Sub-skills: Agent Architecture 4.5 | Agent Construction with Claude 5.3 | Agent Patterns and Frameworks 4.9

   OPTION DISCIPLINE: balanced option lengths, key rotated across all four positions,
   every distractor plausible. Reasoning lives in `why`, never inside the correct option. */
(window.CCDV_QUESTIONS = window.CCDV_QUESTIONS || []).push(

// ---------- Agent Architecture ----------
{ id:"D1-001", d:1, s:"Agent Architecture", diff:2, type:"single", n:1,
  stem:"Which characteristic most clearly distinguishes an agent from a workflow?",
  opts:[
    "An agent calls tools during execution, whereas a workflow does not.",
    "An agent runs asynchronously, whereas a workflow runs synchronously.",
    "An agent requires a larger model tier than a workflow does.",
    "An agent chooses its own steps; a workflow follows a predefined path."
  ],
  correct:[3],
  why:"The dividing line is control of the path. A workflow has its sequence encoded by the developer; an agent decides the next action in a loop and judges when the goal is met. Tools, model size, and concurrency are orthogonal.",
  wrong:{0:"Workflows commonly call tools at fixed steps, so this is not the distinction.",1:"Either architecture can be implemented in either execution style.",2:"Both patterns run on whatever tier the task requires."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

{ id:"D1-002", d:1, s:"Agent Architecture", diff:2, type:"single", n:1,
  stem:"A team's first instinct for every new feature is to build an autonomous agent. What is the most important counterargument?",
  opts:[
    "Agency costs predictability, latency, and money, so add it only when needed.",
    "Agents are considerably harder to implement in Python than workflows are.",
    "An agent cannot be given more than a handful of tools before it degrades.",
    "Agents require dedicated long-running infrastructure that workflows avoid."
  ],
  correct:[0],
  why:"The recommended posture is the simplest solution that works, with complexity added only when it demonstrably improves outcomes. Autonomy buys adaptability and pays in unpredictability, extra calls, and harder debugging.",
  wrong:{1:"Implementation effort is a real difference but not the core objection.",2:"Large tool sets do hurt selection accuracy, but no such hard limit exists.",3:"Deployment topology is unrelated to the choice of pattern."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

{ id:"D1-003", d:1, s:"Agent Architecture", diff:2, type:"single", n:1,
  stem:"In the prompt-chaining workflow pattern, what is the defining structure?",
  opts:[
    "A model decides at runtime which of several sub-agents to invoke.",
    "Several models answer the same question and a judge selects the best.",
    "A fixed sequence of calls, each consuming the previous step's output.",
    "A single call that handles the whole task from end to end."
  ],
  correct:[2],
  why:"Chaining decomposes a task into fixed sequential calls. Because the sequence is known in advance you can insert deterministic gate checks between steps and fail fast, trading a little latency for higher per-step accuracy.",
  wrong:{0:"That describes routing, where classification selects the handler.",1:"That describes parallelisation with voting or a judge.",3:"A single call is not a chain and has no intermediate gates."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

{ id:"D1-004", d:1, s:"Agent Architecture", diff:2, type:"single", n:1,
  stem:"Support tickets arrive as refund requests, technical faults, or billing questions, and each type needs very different handling and a different prompt. Which pattern fits?",
  opts:[
    "Parallelisation: run all three specialised handlers and merge their answers.",
    "Routing: classify the ticket first, then dispatch to the matching handler.",
    "Evaluator-optimiser: generate an answer, then critique and revise in a loop.",
    "A single prompt that contains all three sets of handling instructions."
  ],
  correct:[1],
  why:"Routing exists for distinct input categories needing separate treatment. Classifying first lets each path use a focused prompt and an appropriately sized model instead of one bloated prompt covering every case.",
  wrong:{0:"Running all three wastes spend and produces two irrelevant answers to reconcile.",2:"That pattern refines a single output; it does not select a handler.",3:"A combined prompt is longer, more confusing, and degrades every category."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

{ id:"D1-005", d:1, s:"Agent Architecture", diff:3, type:"single", n:1,
  stem:"A drafting system generates a marketing email, critiques it against brand guidelines, and revises \u2014 repeating until the critique passes. Which pattern is this, and what must be added for production safety?",
  opts:[
    "Routing, with a fallback category for tickets that match no known class.",
    "Parallelisation, with a merge function that reconciles the parallel outputs.",
    "Prompt chaining, with a cache breakpoint after the stable instruction block.",
    "Evaluator-optimiser, with a maximum iteration count to bound the loop."
  ],
  correct:[3],
  why:"Generate-critique-revise is the evaluator-optimiser loop, and its characteristic failure is non-convergence. A deterministic ceiling in the harness, plus a defined behaviour when it is reached, is required.",
  wrong:{0:"There is no classification or dispatch step anywhere in the description.",1:"Nothing runs concurrently and there is nothing to merge.",2:"The sequence is a feedback loop rather than a fixed forward chain."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

{ id:"D1-006", d:1, s:"Agent Architecture", diff:3, type:"single", n:1,
  stem:"In an orchestrator-worker design, why is explicit context passing to each worker preferred over letting workers share the orchestrator's full conversation?",
  opts:[
    "A narrow per-worker context keeps windows small and workers independently testable.",
    "Workers are prohibited from reading conversation history for security reasons.",
    "The Messages API does not permit message history to be shared across calls.",
    "Sharing one context would force the workers to execute strictly sequentially."
  ],
  correct:[0],
  why:"Context isolation is the structural benefit of the pattern. A purpose-built context per worker holds token cost down, removes irrelevant material that degrades focus, and makes each worker a unit you can evaluate alone.",
  wrong:{1:"It is a context-hygiene design choice, not an access restriction.",2:"You may send any history you like; nothing forbids it.",3:"Execution concurrency is independent of what context you pass."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

{ id:"D1-007", d:1, s:"Agent Architecture", diff:2, type:"single", n:1,
  stem:"Which requirement most strongly indicates a human-in-the-loop checkpoint is needed rather than full autonomy?",
  opts:[
    "The task requires the agent to read and reconcile several long documents.",
    "The task routinely takes more than ten seconds of wall-clock time to finish.",
    "The agent can take an irreversible action with external consequences.",
    "The agent needs access to more than a handful of distinct tools."
  ],
  correct:[2],
  why:"Checkpoints go where a wrong action is costly and cannot be undone. Payments, deletions, and outbound messages are the canonical cases: the agent proposes, a human approves, then the side effect runs.",
  wrong:{0:"Reading is read-only and carries no blast radius.",1:"Duration is a performance concern rather than a risk signal.",3:"Tool count says nothing about the severity of any single action."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

// ---------- Agent Construction with Claude ----------
{ id:"D1-008", d:1, s:"Agent Construction with Claude", diff:2, type:"single", n:1,
  stem:"What is the core loop of a tool-using agent built directly on the Messages API?",
  opts:[
    "Send the request once, then parse the final answer from the response.",
    "While stop_reason is \"tool_use\", run the tool, append the result, and call again.",
    "Submit the goal, then poll a job endpoint until the agent reports completion.",
    "Open a persistent socket so the model can invoke your tools directly."
  ],
  correct:[1],
  why:"The loop is driven by stop_reason. Each pass executes the requested tool, appends the assistant turn plus the matching tool_result, and re-invokes the model, exiting on \"end_turn\" or a harness guard.",
  wrong:{0:"A single call has no opportunity to incorporate tool results.",2:"There is no server-side agent job to poll on the Messages API.",3:"Anthropic never connects to your tools; your own code executes them."},
  doc:{t:"Anthropic docs \u2014 Tool use",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} },

{ id:"D1-009", d:1, s:"Agent Construction with Claude", diff:2, type:"multi", n:2,
  stem:"Which two guards should every production agent loop have? (Select 2)",
  opts:[
    "A maximum iteration count enforced by the harness rather than the prompt.",
    "A wall-clock or token budget that terminates a run once it is exceeded.",
    "Sampling temperature fixed at 0 so the agent's choices stay repeatable.",
    "A system prompt instructing the agent never to loop more than N times.",
    "A convention that every tool must return a well-formed JSON object."
  ],
  correct:[0,1],
  why:"Both guards are deterministic and live outside the model. An iteration ceiling stops a non-converging loop and a budget bounds cost and latency; neither can be talked around by the model.",
  wrong:{2:"Deterministic sampling does not bound the number of iterations.",3:"A prompt cannot enforce termination; the loop is controlled by your code.",4:"A sensible convention, but it is not a safety guard."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

{ id:"D1-010", d:1, s:"Agent Construction with Claude", diff:2, type:"single", n:1,
  stem:"What does the Claude Agent SDK provide over hand-writing the loop against the Messages API?",
  opts:[
    "It removes the need to define tools, inferring them from your codebase.",
    "It makes conversation state persistent on Anthropic's servers between calls.",
    "It guarantees the agent cannot take an incorrect or unsafe action.",
    "It supplies the harness: loop, dispatch, context, permissions, and hooks."
  ],
  correct:[3],
  why:"The SDK packages the harness Claude Code itself is built on, so you spend your effort on capabilities and policy rather than rebuilding the scaffolding.",
  wrong:{0:"You still define the tools the agent is permitted to use.",1:"It does not change the statelessness of the underlying API.",2:"No framework can guarantee the correctness of model decisions."},
  doc:{t:"Anthropic docs \u2014 Agent SDK",u:"https://docs.anthropic.com/en/api/agent-sdk/overview"} },

{ id:"D1-011", d:1, s:"Agent Construction with Claude", diff:3, type:"single", n:1,
  stem:"An agent must never run a destructive shell command such as rm -rf. The team adds a firm instruction to the system prompt. Why is this insufficient, and what is the right mechanism?",
  opts:[
    "Prompts are probabilistic guidance; a hook can inspect and block the command.",
    "The instruction is sufficient, because system prompts are obeyed strictly.",
    "Lower the sampling temperature so destructive commands are never selected.",
    "Use a smaller model tier, which attempts fewer destructive operations."
  ],
  correct:[0],
  why:"This is the deterministic-versus-probabilistic distinction the exam returns to repeatedly. A hook runs as code at a defined lifecycle point, inspects the pending action, and can deny it outright.",
  wrong:{1:"System prompts influence behaviour strongly but are not enforcement.",2:"Temperature does not create a safety boundary of any kind.",3:"Model size does not constrain what the harness will execute."},
  doc:{t:"Claude Code docs \u2014 Hooks",u:"https://docs.anthropic.com/en/docs/claude-code/hooks"} },

{ id:"D1-012", d:1, s:"Agent Construction with Claude", diff:2, type:"single", n:1,
  stem:"A research agent must gather information from five independent sources and then synthesise a report. Which structure is most efficient?",
  opts:[
    "A single agent that queries all five sources in sequence in one context.",
    "Five separate user-facing chat sessions whose outputs are merged by hand.",
    "An orchestrator dispatching five subagents that each return a condensed result.",
    "One agent that queries whichever source looks most promising and stops."
  ],
  correct:[2],
  why:"Independent subtasks parallelise, cutting wall-clock time, and each subagent works in its own context. The orchestrator then synthesises from five summaries rather than drowning in five full document sets.",
  wrong:{0:"Sequential gathering is slow and accumulates every raw source in one window.",1:"Manual merging is not an automated architecture.",3:"Stopping at one source fails the stated requirement outright."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

{ id:"D1-013", d:1, s:"Agent Construction with Claude", diff:3, type:"single", n:1,
  stem:"An agent completes its task but the final answer omits a constraint stated 30 turns earlier. Which mitigation targets the cause?",
  opts:[
    "Raise max_tokens on the final call so the answer has room for the constraint.",
    "Hold durable constraints in explicit state and re-inject them every turn.",
    "Lower the sampling temperature so earlier instructions are weighted higher.",
    "Move to a larger model tier with stronger long-context attention."
  ],
  correct:[1],
  why:"A requirement buried thirty turns back competes with everything added since. Keeping durable constraints in structured state and re-presenting them keeps them salient regardless of conversation length.",
  wrong:{0:"Output length has no bearing on whether a constraint was attended to.",2:"Temperature does not control attention across a long context.",3:"Reduces the problem at higher cost without removing the cause."},
  doc:{t:"Anthropic docs \u2014 Context windows",u:"https://docs.anthropic.com/en/docs/build-with-claude/context-windows"} },

{ id:"D1-014", d:1, s:"Agent Construction with Claude", diff:2, type:"single", n:1,
  stem:"Which is the most useful signal to log for diagnosing agent failures after the fact?",
  opts:[
    "The final answer returned to the user, stored alongside the original request.",
    "Total end-to-end latency for the run, bucketed by request type.",
    "The number of loop iterations the run consumed before terminating.",
    "Per-iteration tool calls, arguments, results, stop_reason, and token usage."
  ],
  correct:[3],
  why:"Agent failures are path failures: a wrong tool, bad arguments, a misread result. Only a per-iteration trace locates the step that went wrong and shows whether the model, the tool, or the harness was at fault.",
  wrong:{0:"Tells you something is wrong but never where it happened.",1:"A performance metric with no diagnostic content.",2:"Flags non-convergence without revealing its cause."},
  doc:{t:"Anthropic docs \u2014 Agent SDK",u:"https://docs.anthropic.com/en/api/agent-sdk/overview"} },

{ id:"D1-015", d:1, s:"Agent Construction with Claude", diff:2, type:"single", n:1,
  stem:"A tool call fails with a transient network error inside an agent loop. What should the tool handler return?",
  opts:[
    "A tool_result flagged as an error, carrying a clear and actionable message.",
    "Nothing; raise the exception so the entire agent run is aborted immediately.",
    "An empty string, allowing the agent to move on to its next chosen step.",
    "Plausible placeholder data so that the loop is able to continue running."
  ],
  correct:[0],
  why:"Tool failures are normal events in an agent loop rather than fatal ones. The protocol supports signalling an error result, which keeps the model informed so it can retry or route around the failure.",
  wrong:{1:"Aborting on a transient error discards all prior work unnecessarily.",2:"An empty result is indistinguishable from \"no data found\" and invites wrong answers.",3:"Fabricated data corrupts every downstream step, which is the worst outcome."},
  doc:{t:"Anthropic docs \u2014 Tool use \u2014 handling errors",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} },

// ---------- Agent Patterns and Frameworks ----------
{ id:"D1-016", d:1, s:"Agent Patterns and Frameworks", diff:2, type:"single", n:1,
  stem:"When does the parallelisation pattern with a voting step add the most value?",
  opts:[
    "When raw throughput is the only property the system needs to optimise.",
    "When the task must be completed at the lowest achievable cost per item.",
    "When one judgement is error-prone and independent attempts can be compared.",
    "When the same input must yield a strictly reproducible output every time."
  ],
  correct:[2],
  why:"Voting trades cost for confidence. Running a judgement independently several times and aggregating catches cases a single pass would miss, which is worth the multiplied spend when a miss is expensive.",
  wrong:{0:"Voting increases work per item; sectioning is the throughput variant.",1:"It multiplies cost by the number of votes cast.",3:"Aggregating several stochastic runs does not produce reproducibility."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

{ id:"D1-017", d:1, s:"Agent Patterns and Frameworks", diff:2, type:"single", n:1,
  stem:"What is the main reason to delegate a subtask to a subagent rather than continuing in the main conversation?",
  opts:[
    "Tokens consumed inside a subagent are billed at a lower published rate.",
    "The subtask runs in an isolated context and returns only its conclusion.",
    "Subagents can be granted tools that the main agent is not permitted to use.",
    "Subagent turns are excluded from the token accounting for the parent run."
  ],
  correct:[1],
  why:"Context isolation is the point. A subagent can read twenty files and hand back a paragraph, so the main conversation pays for the conclusion rather than the whole exploration.",
  wrong:{0:"Tokens are priced the same wherever they are consumed.",2:"Tool availability is a configuration choice, not an inherent property.",3:"Subagents consume billed tokens exactly like any other model call."},
  doc:{t:"Claude Code docs \u2014 Subagents",u:"https://docs.anthropic.com/en/docs/claude-code/sub-agents"} },

{ id:"D1-018", d:1, s:"Agent Patterns and Frameworks", diff:3, type:"single", n:1,
  stem:"A team is deciding between the Claude Agent SDK and a third-party graph framework such as LangGraph. Which consideration should drive the decision?",
  opts:[
    "Community size and repository popularity, as a proxy for long-term support.",
    "Third-party frameworks add less runtime overhead than a first-party SDK.",
    "The Agent SDK is usable only from inside Claude Code, which limits its reach.",
    "Whether the app needs explicit branching control flow or a model-driven loop."
  ],
  correct:[3],
  why:"Pick the abstraction matching the control flow you need. A graph framework gives explicit nodes, edges, and checkpointed state; the Agent SDK gives a model-driven loop with context, permissions, and hooks solved.",
  wrong:{0:"Popularity is not an engineering criterion for this decision.",1:"Performance is dominated by model calls, not framework overhead.",2:"The Agent SDK is a general-purpose library for building agents."},
  doc:{t:"Anthropic docs \u2014 Agent SDK",u:"https://docs.anthropic.com/en/api/agent-sdk/overview"} },

{ id:"D1-019", d:1, s:"Agent Patterns and Frameworks", diff:2, type:"single", n:1,
  stem:"In the orchestrator-worker pattern, which responsibility belongs to the orchestrator?",
  opts:[
    "Decomposing the goal, scoping each worker's context, and integrating results.",
    "Executing every tool call centrally on behalf of all of the workers.",
    "Holding the API credential so that workers never need their own access.",
    "Producing the final answer independently of what the workers returned."
  ],
  correct:[0],
  why:"The orchestrator owns decomposition, delegation, and integration: it decides the subtasks, supplies each worker a scoped context, and synthesises the returned results.",
  wrong:{1:"Workers execute their own tools; centralising that defeats the pattern.",2:"Credential handling is infrastructure, not the pattern's defining role.",3:"Ignoring worker output makes the delegation pointless."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

{ id:"D1-020", d:1, s:"Agent Patterns and Frameworks", diff:3, type:"single", n:1,
  stem:"A multi-agent system produces inconsistent results because two subagents make contradictory assumptions about the same entity. What is the most effective structural fix?",
  opts:[
    "Merge the subagents back into one larger agent with a single shared context.",
    "Increase each subagent's context window so more of the history is visible.",
    "Resolve the entity once in the orchestrator and pass the value to each worker.",
    "Run the subagents strictly in sequence instead of concurrently."
  ],
  correct:[2],
  why:"The contradiction arises because each subagent inferred the fact independently. Resolving it once and passing it down explicitly removes the ambiguity at its source.",
  wrong:{0:"Collapsing the architecture loses isolation and guarantees nothing.",1:"More room does not make independent inferences agree.",3:"Sequencing changes timing, not the independent inference."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

{ id:"D1-021", d:1, s:"Agent Patterns and Frameworks", diff:2, type:"single", n:1,
  stem:"Which statement best describes when to choose a self-hosted agent deployment over a managed one?",
  opts:[
    "Self-hosting is reliably cheaper once inference volume passes a threshold.",
    "It suits residency, isolation, or deep internal integration requirements.",
    "Managed deployments cannot register custom, organisation-specific tools.",
    "Self-hosting removes the need to manage and rotate an API credential."
  ],
  correct:[1],
  why:"The trade is control against operational burden. Self-hosting the harness satisfies residency, isolation, and integration constraints, but you then own scaling, upgrades, monitoring, and incidents.",
  wrong:{0:"Total cost frequently rises once engineering time is counted.",2:"Custom tools work in either deployment model.",3:"Model inference still requires authenticated API access."},
  doc:{t:"Anthropic docs \u2014 Agent SDK",u:"https://docs.anthropic.com/en/api/agent-sdk/overview"} },

{ id:"D1-022", d:1, s:"Agent Patterns and Frameworks", diff:2, type:"single", n:1,
  stem:"An agent has 40 tools available and frequently picks the wrong one. Which change is most likely to help?",
  opts:[
    "Enlarge the context window so all 40 tool definitions fit comfortably.",
    "Shorten every tool name so the definition block consumes fewer tokens.",
    "Raise the temperature so the agent explores a wider range of tool choices.",
    "Present only task-relevant tools and sharpen each description's boundaries."
  ],
  correct:[3],
  why:"Selection accuracy degrades as the set grows and descriptions overlap. Showing only contextually relevant tools and writing descriptions that clearly separate purpose and inputs is the standard remedy.",
  wrong:{0:"Fitting them all in is not the problem; discriminating among them is.",1:"Short names carry less meaning and usually make selection worse.",2:"More exploration produces more wrong choices, not fewer."},
  doc:{t:"Anthropic docs \u2014 Tool use best practices",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} }

);
