/* Domain 7 - Security and Safety - 8.1% of the exam (4 of 53 items).
   Sub-skills: AI Application Security 3.2 | Guardrails and Safe Deployment 2.3
               Claude Hooks 1.0 | Identity, Secrets, and Key Management 1.6

   OPTION DISCIPLINE: balanced option lengths, key rotated across all four positions,
   every distractor plausible. Reasoning lives in `why`, never inside the correct option. */
(window.CCDV_QUESTIONS = window.CCDV_QUESTIONS || []).push(

// ---------- AI Application Security ----------
{ id:"D7-001", d:7, s:"AI Application Security", diff:2, type:"single", n:1,
  stem:"What distinguishes indirect prompt injection from a direct jailbreak attempt?",
  opts:[
    "Indirect injection requires far more skill and access to carry out.",
    "Indirect injection affects only applications that have no tools enabled.",
    "They describe the same attack, differing only in the terminology used.",
    "The malicious instruction arrives inside content the system ingests."
  ],
  correct:[3],
  why:"The payload hides in data the application retrieves on the user's behalf, so a legitimate user issues a harmless request while the attacker's instruction rides in on a page, document, or email.",
  wrong:{0:"Difficulty varies, and planting content in an indexed page is often easy.",1:"Tools raise the stakes, but injection can cause disclosure without them.",2:"The delivery channel differs fundamentally, which changes the defences needed."},
  doc:{t:"Anthropic docs \u2014 Mitigate jailbreaks and prompt injections",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks"} },

{ id:"D7-002", d:7, s:"AI Application Security", diff:3, type:"single", n:1,
  stem:"An agent with database read access and an email tool summarises incoming support emails. What is the most serious risk, and the correct structural mitigation?",
  opts:[
    "Exfiltration via injected instructions: remove external send from this path.",
    "Runaway token spend on long email threads: apply a per-run budget cap.",
    "Inaccurate summaries reaching customers: add a second review pass.",
    "Long threads exceeding the window: truncate each email before processing."
  ],
  correct:[0],
  why:"The dangerous combination is untrusted input plus data access plus an outbound channel. Break the chain structurally, and scope the database credential to the minimum the task requires.",
  wrong:{1:"A real operational concern, but not the security risk in this design.",2:"Summary quality is a quality issue rather than an exfiltration path.",3:"A capacity concern that is unrelated to the exposure."},
  doc:{t:"Anthropic docs \u2014 Mitigate jailbreaks",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks"} },

{ id:"D7-003", d:7, s:"AI Application Security", diff:2, type:"single", n:1,
  stem:"Customer records containing personal data are sent to Claude for summarisation. Which control best reduces exposure?",
  opts:[
    "Instruct the model never to repeat personal data in the summary it returns.",
    "Enable streaming so the record is transmitted incrementally rather than at once.",
    "Send only the fields the task requires, masking identifiers that are not needed.",
    "Set temperature to 0 so the output stays close to the supplied source text."
  ],
  correct:[2],
  why:"Data minimisation works regardless of model behaviour: personal data that was never sent cannot be echoed, logged, or leaked. Redact before the request rather than hoping the output stays clean.",
  wrong:{0:"An instruction governs output, not the fact that data crossed the boundary.",1:"Streaming changes delivery timing, not exposure.",3:"Sampling temperature is not a privacy control."},
  doc:{t:"Anthropic docs \u2014 Security and compliance",u:"https://docs.anthropic.com/en/docs/about-claude/security-compliance"} },

{ id:"D7-004", d:7, s:"AI Application Security", diff:2, type:"single", n:1,
  stem:"A retrieval-backed assistant returns a document the requesting user is not entitled to see. Where did the design fail?",
  opts:[
    "The system prompt never mentioned the access control rules that apply.",
    "Retrieval was not filtered by the authenticated user's entitlements.",
    "The model tier was not capable enough to reason about the permission model.",
    "The document itself was not tagged with a confidential classification label."
  ],
  correct:[1],
  why:"Access control belongs in the retrieval layer, before content reaches the model. Once an unauthorised document is in context, telling the model to keep it secret is a probabilistic guard on a deterministic boundary.",
  wrong:{0:"A prompt cannot enforce entitlements against an over-broad query.",2:"Permission enforcement is not a reasoning task for the model.",3:"Labels are metadata; the filter must actually be applied to the query."},
  doc:{t:"Anthropic docs \u2014 Mitigate jailbreaks",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks"} },

{ id:"D7-005", d:7, s:"AI Application Security", diff:3, type:"multi", n:2,
  stem:"Which two statements about defending an agentic application are correct? (Select 2)",
  opts:[
    "Guardrails should be layered, because no single control is sufficient alone.",
    "Capability restriction beats instruction: an unreachable action cannot be induced.",
    "A sufficiently detailed system prompt removes the need for authorisation checks.",
    "Prompt injection is fully solved by sanitising input before it reaches the model.",
    "Running every request at temperature 0 prevents jailbreak attempts succeeding."
  ],
  correct:[0,1],
  why:"Defence in depth is the governing principle, and the strongest single layer is capability restriction, because an action the agent structurally cannot take cannot be triggered by any input.",
  wrong:{2:"Prompts never replace authorisation; they are guidance rather than enforcement.",3:"Sanitisation helps, but adversaries rephrase, encode, and translate around it.",4:"Temperature has no bearing on susceptibility to adversarial instructions."},
  doc:{t:"Anthropic docs \u2014 Strengthen guardrails",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks"} },

// ---------- Guardrails and Safe Deployment ----------
{ id:"D7-006", d:7, s:"Guardrails and Safe Deployment", diff:2, type:"single", n:1,
  stem:"You are rolling out an agent that can modify production configuration. Which deployment approach is safest?",
  opts:[
    "Enable it for everyone at once so real failure modes surface quickly.",
    "Restrict it to overnight windows when production traffic is at its lowest.",
    "Grant full autonomy from day one but log every action for later tracing.",
    "Start in proposal-only mode with human approval, then widen autonomy."
  ],
  correct:[3],
  why:"Progressive autonomy: the agent proposes and a human disposes, real behaviour is measured, and the permission boundary widens only where evidence supports it. Blast radius grows deliberately.",
  wrong:{0:"Maximum exposure before anyone knows the failure modes.",1:"A quiet window reduces witnesses rather than risk, and breakage is caught later.",2:"Logs support diagnosis after harm; they prevent nothing."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

{ id:"D7-007", d:7, s:"Guardrails and Safe Deployment", diff:2, type:"single", n:1,
  stem:"Which is an example of a deterministic guardrail as opposed to a probabilistic one?",
  opts:[
    "A code check that blocks responses matching a card-number pattern.",
    "A system prompt instructing the model to refuse requests for medical advice.",
    "A few-shot example demonstrating how a refusal should be worded.",
    "Selecting a more capable model tier that refuses unsafe requests more often."
  ],
  correct:[0],
  why:"A deterministic guardrail is code that always executes and returns the same decision for the same input. It either fires or does not, without depending on the model choosing to comply.",
  wrong:{1:"Instructions strongly influence behaviour but can be circumvented.",2:"Examples shape behaviour probabilistically.",3:"Capability reduces error rates without providing any guarantee."},
  doc:{t:"Anthropic docs \u2014 Strengthen guardrails",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations"} },

{ id:"D7-008", d:7, s:"Guardrails and Safe Deployment", diff:3, type:"single", n:1,
  stem:"A content-moderation guardrail uses Claude to classify outputs as safe or unsafe before delivery. What is the most important operational consideration?",
  opts:[
    "It should reuse the generation call's model and prompt for consistency.",
    "It should run after delivery so the user never waits on the extra call.",
    "It is probabilistic too, so it needs its own evals, error rates, and failure policy.",
    "It supersedes the other safety layers, which can then be retired safely."
  ],
  correct:[2],
  why:"A model-based filter is a probabilistic component like any other. It needs labelled evaluation, ongoing measurement of both error directions, and an explicit fail-open or fail-closed policy.",
  wrong:{0:"An independent check is worth more; sharing prompt and model correlates failures.",1:"Checking after delivery defeats the purpose entirely.",3:"It is one layer in defence in depth, not a replacement for the rest."},
  doc:{t:"Anthropic docs \u2014 Strengthen guardrails",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks"} },

// ---------- Claude Hooks ----------
{ id:"D7-009", d:7, s:"Claude Hooks", diff:2, type:"single", n:1,
  stem:"What is the defining property of a Claude Code hook?",
  opts:[
    "It is a prompt fragment injected at the start of every new session.",
    "It runs as code at a lifecycle point and can block the pending action.",
    "It is an optional tool the model may choose to invoke when relevant.",
    "It is a configuration flag that alters how the model behaves at runtime."
  ],
  correct:[1],
  why:"Hooks execute at defined points such as before or after a tool runs, and can approve or deny the pending action. Because they always run, they give guarantees that prompts cannot.",
  wrong:{0:"That describes memory or a system prompt, which is guidance not enforcement.",2:"A hook is not optional and is not selected by the model.",3:"Hooks run your own code; they are not a behavioural toggle."},
  doc:{t:"Claude Code docs \u2014 Hooks",u:"https://docs.anthropic.com/en/docs/claude-code/hooks"} },

{ id:"D7-010", d:7, s:"Claude Hooks", diff:3, type:"single", n:1,
  stem:"A team wants every file Claude Code edits to be auto-formatted and linted, with commits blocked when linting fails. What is the appropriate mechanism?",
  opts:[
    "A CLAUDE.md instruction asking Claude to run the formatter after each edit.",
    "A Skill that documents the formatting standard and the lint configuration.",
    "A subagent that reviews formatting and reports problems before committing.",
    "Hooks that format after an edit and deny the commit when linting fails."
  ],
  correct:[3],
  why:"\"Every time, without exception\" is the signature of a hook. Post-edit formatting and a pre-commit denial run as code and do not depend on the model remembering to comply.",
  wrong:{0:"Memory instructions are usually followed but not guaranteed, and blocking is hard.",1:"A Skill conveys knowledge; it does not enforce execution.",2:"A subagent adds a probabilistic review rather than a deterministic gate."},
  doc:{t:"Claude Code docs \u2014 Hooks",u:"https://docs.anthropic.com/en/docs/claude-code/hooks"} },

// ---------- Identity, Secrets, and Key Management ----------
{ id:"D7-011", d:7, s:"Identity, Secrets, and Key Management", diff:2, type:"single", n:1,
  stem:"Which practice best protects an Anthropic API key used by a production service?",
  opts:[
    "Inject it at runtime from a secret manager, scoped per service and rotated.",
    "Commit it to the repository, relying on restricted repository access control.",
    "Bake it into the container image so the service always starts with it present.",
    "Issue one shared key for every service so that rotation stays straightforward."
  ],
  correct:[0],
  why:"Runtime injection keeps the key out of code, images, and history. Per-service scoping limits blast radius, rotation limits the value of a leak, and usage monitoring detects misuse.",
  wrong:{1:"Repository access changes over time and git history is permanent.",2:"Image layers are extractable by anyone able to pull the image.",3:"One compromise then affects everything, and rotation becomes a coordinated outage."},
  doc:{t:"Anthropic docs \u2014 Getting started",u:"https://docs.anthropic.com/en/api/getting-started"} },

{ id:"D7-012", d:7, s:"Identity, Secrets, and Key Management", diff:3, type:"single", n:1,
  stem:"An agent needs to act on behalf of individual end users against an internal API. Which identity model is correct?",
  opts:[
    "A single privileged service account, with the prompt naming the current user.",
    "Each user supplies their own password to the agent at the start of a session.",
    "The call carries the user's identity or a delegated token the API enforces.",
    "The agent runs with administrator rights and filters results before display."
  ],
  correct:[2],
  why:"Authorisation must be enforced by the system that owns the data, using the real principal. Propagating a scoped delegated token means the downstream API applies that user's permissions with no model behaviour involved.",
  wrong:{0:"A prompt-stated identity is unverified and trivially confused by injection.",1:"Password sharing defeats authentication and auditing entirely.",3:"Over-privileged execution means the data was exposed before any filter ran."},
  doc:{t:"Anthropic docs \u2014 Security and compliance",u:"https://docs.anthropic.com/en/docs/about-claude/security-compliance"} }

);
