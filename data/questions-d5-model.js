/* Domain 5 - Model Selection and Optimization - 16.8% of the exam (9 of 53 items).
   Sub-skills: LLM Fundamentals 5.2 | Technical Fundamentals 6.1
               Model Selection and Trade-offs 2.7 | Cost and Token Management 2.8

   OPTION DISCIPLINE: balanced option lengths, key rotated across all four positions,
   every distractor plausible. Reasoning lives in `why`, never inside the correct option. */
(window.CCDV_QUESTIONS = window.CCDV_QUESTIONS || []).push(

// ---------- LLM Fundamentals ----------
{ id:"D5-001", d:5, s:"LLM Fundamentals", diff:2, type:"single", n:1,
  stem:"A team sets temperature to 0 and expects byte-identical output for identical input. In production they still observe occasional variation. Which explanation is correct?",
  opts:[
    "Temperature is ignored on requests that also supply tool definitions.",
    "Determinism additionally requires top_p to be set to 0 on the same request.",
    "Temperature 0 makes sampling greedy but does not guarantee identical output.",
    "The service perturbs sampling slightly to prevent responses being cached."
  ],
  correct:[2],
  why:"Greedy decoding removes most variation but is not a guarantee. Near-ties in logits combined with floating-point and serving-stack differences can still flip a token, so correctness must never depend on identical output.",
  wrong:{0:"Temperature applies whether or not tools are defined.",1:"Anthropic advises tuning one of the two, and neither converts sampling into a guarantee.",3:"No deliberate noise is injected; this is not how the service behaves."},
  doc:{t:"Anthropic docs \u2014 Messages API parameters",u:"https://docs.anthropic.com/en/api/messages"} },

{ id:"D5-002", d:5, s:"LLM Fundamentals", diff:1, type:"single", n:1,
  stem:"Which statement about tokens is accurate for budgeting purposes?",
  opts:[
    "One token corresponds to one word, so word count is a reliable proxy.",
    "Only generated output is tokenised and billed; supplied input is not.",
    "Whitespace and punctuation are excluded from the token count.",
    "Tokens are sub-word units, roughly three to four characters of English."
  ],
  correct:[3],
  why:"Tokens are sub-word fragments. The three-to-four-character heuristic is fine for rough English planning but understates code, nested JSON, and non-Latin scripts, so use token counting when the number matters.",
  wrong:{0:"Long or unusual words split into several tokens; common short words may be one.",1:"Input is billed too, and in most applications it dominates the bill.",2:"Whitespace and punctuation consume tokens like any other characters."},
  doc:{t:"Anthropic docs \u2014 Token counting",u:"https://docs.anthropic.com/en/docs/build-with-claude/token-counting"} },

{ id:"D5-003", d:5, s:"LLM Fundamentals", diff:2, type:"single", n:1,
  stem:"What does the context window limit actually constrain?",
  opts:[
    "System prompt, tool definitions, message history, and output combined.",
    "The number of messages in the conversation, whatever their individual length.",
    "The length of the generated response for a single request.",
    "The number of tool definitions a single request is permitted to carry."
  ],
  correct:[0],
  why:"The window covers everything processed in one request, which is why verbose tool schemas and large tool results silently consume capacity during long agent runs.",
  wrong:{1:"Ten short messages and ten enormous ones consume wildly different amounts.",2:"That describes max_tokens, a separate ceiling that applies to output only.",3:"Tool definitions consume window space, but no separate count limit governs them."},
  doc:{t:"Anthropic docs \u2014 Context windows",u:"https://docs.anthropic.com/en/docs/build-with-claude/context-windows"} },

{ id:"D5-004", d:5, s:"LLM Fundamentals", diff:2, type:"single", n:1,
  stem:"Why does a model sometimes produce a fluent, confident answer that is factually wrong?",
  opts:[
    "The training corpus contained that exact false statement verbatim.",
    "Sampling temperature was set above zero for the request in question.",
    "Generation predicts plausible continuations, and fluency is not verified truth.",
    "The output ceiling was too low, so the answer was cut short and distorted."
  ],
  correct:[2],
  why:"Next-token prediction optimises for plausible continuation, so an answer with the right shape can score highly whether or not it is true. Confidence in the text carries no information about accuracy.",
  wrong:{0:"Fabrications are frequently novel combinations never present in training data.",1:"Greedy decoding at temperature 0 still produces confident errors.",3:"Truncation yields incomplete output, which is a different failure mode."},
  doc:{t:"Anthropic docs \u2014 Reduce hallucinations",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations"} },

{ id:"D5-005", d:5, s:"LLM Fundamentals", diff:3, type:"single", n:1,
  stem:"Your agent's per-request cost climbs steadily across a long session even though each user message is short. What explains this?",
  opts:[
    "The model becomes progressively less efficient the longer it reasons.",
    "Each turn resends accumulated history, so input tokens grow and are re-billed.",
    "Output tokens are settled retroactively when the session finally ends.",
    "Approaching the rate limit applies a surcharge to each subsequent request."
  ],
  correct:[1],
  why:"The API is stateless, so every request carries the whole history you choose to send. Input grows roughly linearly with turn count and is paid again on each call; compaction and caching are the mitigations.",
  wrong:{0:"No efficiency decay exists; the growth is in what the client sends.",2:"Tokens are billed per request, not deferred to the end of a session.",3:"Rate limits throttle requests; they do not add a surcharge."},
  doc:{t:"Anthropic docs \u2014 Context windows",u:"https://docs.anthropic.com/en/docs/build-with-claude/context-windows"} },

{ id:"D5-006", d:5, s:"LLM Fundamentals", diff:2, type:"single", n:1,
  stem:"Which task characteristic most strongly suggests enabling extended thinking?",
  opts:[
    "Reformatting a list of supplied names into a JSON array of objects.",
    "Returning a value looked up directly from a retrieved passage of text.",
    "Classifying a short customer sentence as positive, neutral, or negative.",
    "Debugging a subtle logic error that requires several dependent deductions."
  ],
  correct:[3],
  why:"Extended thinking buys internal reasoning tokens before the answer. It pays off on genuinely multi-step problems and is wasted latency and cost on mechanical transformation or simple classification.",
  wrong:{0:"A mechanical transformation gains nothing from deliberation.",1:"Extraction from supplied text is a lookup rather than reasoning.",2:"Simple classification is handled well without thinking tokens."},
  doc:{t:"Anthropic docs \u2014 Extended thinking",u:"https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking"} },

{ id:"D5-007", d:5, s:"LLM Fundamentals", diff:2, type:"single", n:1,
  stem:"When extended thinking is enabled, how do thinking tokens relate to billing and the output limit?",
  opts:[
    "They are billed as output and consume budget inside max_tokens.",
    "They are billed as input tokens, since they precede the visible answer.",
    "They are billed at the discounted cache-read rate for reused reasoning.",
    "They are not billed at all and do not count toward max_tokens."
  ],
  correct:[0],
  why:"Reasoning tokens are generated tokens, so they are priced as output and sit inside the response budget. That is why budget_tokens must be set below max_tokens and why thinking raises both cost and latency.",
  wrong:{1:"They are generated rather than supplied, so they are not input.",2:"Cache-read pricing applies only to reused input prefixes.",3:"Assuming they are free is a common cause of unexplained cost overruns."},
  doc:{t:"Anthropic docs \u2014 Extended thinking",u:"https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking"} },

{ id:"D5-008", d:5, s:"LLM Fundamentals", diff:3, type:"single", n:1,
  stem:"A classifier prompt works perfectly on ten hand-picked examples but scores 71% on a held-out set of 400. What is the most likely explanation?",
  opts:[
    "The model version changed between the two measurement runs.",
    "The held-out set of 400 examples is substantially mislabelled.",
    "The prompt was iterated against those ten cases, so it overfits them.",
    "Sampling temperature was set too low for a classification workload."
  ],
  correct:[2],
  why:"Tuning a prompt against the same cases you measure on is overfitting. Those ten stopped being an evaluation the moment they became the optimisation target; a held-out set must never be used for tuning.",
  wrong:{0:"Possible, but a version change would usually move both numbers together.",1:"Worth spot-checking, though a 29-point gap points at methodology first.",3:"Temperature does not explain a systematic generalisation gap."},
  doc:{t:"Anthropic docs \u2014 Create strong empirical evaluations",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/develop-tests"} },

// ---------- Technical Fundamentals ----------
{ id:"D5-009", d:5, s:"Technical Fundamentals", diff:2, type:"single", n:1,
  stem:"Prompt caching is enabled with a cache breakpoint after a 12,000-token reference document. On the second identical request within the cache lifetime, what is the billing effect for that prefix?",
  opts:[
    "It is charged again at the standard base input rate for that model.",
    "It is charged at the reduced cache-read rate, roughly a tenth of base input.",
    "It is charged as output tokens because it is replayed into the response.",
    "It is supplied entirely free of charge for the lifetime of the cache entry."
  ],
  correct:[1],
  why:"A hit bills the reused prefix at roughly 0.1x base input. The first request pays a write premium above base input, so caching pays off once a stable prefix is reused several times.",
  wrong:{0:"That is the behaviour without caching, or when the prefix has changed.",2:"Cached content is input and is never reclassified as output.",3:"Reads are heavily discounted but they are not free."},
  doc:{t:"Anthropic docs \u2014 Prompt caching",u:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"} },

{ id:"D5-010", d:5, s:"Technical Fundamentals", diff:3, type:"single", n:1,
  stem:"A team enables prompt caching but sees almost no cache hits. Their prompt begins with a timestamp and the user's name, followed by a long stable policy document. What is wrong?",
  opts:[
    "The policy document falls below the minimum cacheable token length.",
    "Caching requires extended thinking, which the team has not enabled.",
    "A separate cache-warming call must populate the entry before the first hit.",
    "Variable content sits at position zero, so every prefix is unique."
  ],
  correct:[3],
  why:"The cache matches an exact prefix from the start of the prompt, so a leading timestamp defeats it entirely. Stable content must come first, then the breakpoint, then the variable part.",
  wrong:{0:"A minimum exists, but this document comfortably exceeds it.",1:"Caching and extended thinking are independent features.",2:"No warming endpoint exists; the first request populates the cache."},
  doc:{t:"Anthropic docs \u2014 Prompt caching",u:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"} },

{ id:"D5-011", d:5, s:"Technical Fundamentals", diff:2, type:"single", n:1,
  stem:"Which workload benefits least from prompt caching?",
  opts:[
    "A one-off run over 50,000 unrelated short strings with differing instructions.",
    "A support bot that carries the same 20,000-token policy manual every request.",
    "A code assistant that includes the same large file set on each turn of a session.",
    "A contract Q&A tool where users ask many questions about one uploaded document."
  ],
  correct:[0],
  why:"Caching rewards reuse of a large stable prefix. Unrelated short inputs share nothing substantial, so there is no prefix worth caching and the write premium makes it worse; that workload wants Batch.",
  wrong:{1:"A large manual repeated on every call is the ideal caching case.",2:"A stable file set reused across turns caches extremely well.",3:"One document with many questions is the canonical caching pattern."},
  doc:{t:"Anthropic docs \u2014 Prompt caching",u:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"} },

{ id:"D5-012", d:5, s:"Technical Fundamentals", diff:2, type:"single", n:1,
  stem:"Your application needs the lowest possible time-to-first-token for a live chat experience. Which combination helps most?",
  opts:[
    "Raise max_tokens and turn on extended thinking for higher answer quality.",
    "Stream the response, pick a faster model tier, and cache the stable prefix.",
    "Route chat traffic through the Batch API to smooth out load spikes.",
    "Add more few-shot examples so the model reaches its answer sooner."
  ],
  correct:[1],
  why:"Those three attack perceived latency from different directions: streaming emits the first token immediately, a faster tier generates quicker, and a cache hit skips re-processing the prefix.",
  wrong:{0:"Both increase latency, and extended thinking deliberately spends time reasoning first.",2:"Batch is asynchronous and can take minutes to hours, so it is the opposite of interactive.",3:"More examples mean more input to process before the first output token."},
  doc:{t:"Anthropic docs \u2014 Reducing latency",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-latency"} },

{ id:"D5-013", d:5, s:"Technical Fundamentals", diff:2, type:"single", n:1,
  stem:"Which statement about max_tokens is correct?",
  opts:[
    "It reserves capacity and is billed in full whether or not it is consumed.",
    "It sets the size of the context window available to the request.",
    "It bounds generated tokens; reaching it yields stop_reason \"max_tokens\".",
    "It limits how many tool calls the model is permitted to make in a turn."
  ],
  correct:[2],
  why:"It caps output length and billing follows tokens actually produced. Hitting the cap truncates the response and reports it in stop_reason, which your code should detect rather than assume completeness.",
  wrong:{0:"There is no reservation charge for an unused ceiling.",1:"The context window is a model property, not a per-request output limit.",3:"Tool call count is not governed by max_tokens."},
  doc:{t:"Anthropic docs \u2014 Messages API",u:"https://docs.anthropic.com/en/api/messages"} },

{ id:"D5-014", d:5, s:"Technical Fundamentals", diff:3, type:"single", n:1,
  stem:"An agent loop repeatedly calls the same search tool with near-identical arguments and never converges. Which diagnosis fits best?",
  opts:[
    "The context window is far larger than this task actually requires.",
    "Sampling temperature is too low, so the model keeps repeating one choice.",
    "The model tier is more capable than the task warrants, causing overthinking.",
    "The tool returns nothing useful, and no iteration ceiling bounds the loop."
  ],
  correct:[3],
  why:"Repeating a call means the agent receives nothing that changes its state. Fix both sides: return an informative result or error, and enforce a deterministic iteration ceiling in the harness.",
  wrong:{0:"Window size does not cause repetition.",1:"A contributing factor at most; the missing signal and missing bound are the defect.",2:"Capability is not the issue when the loop lacks feedback entirely."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

{ id:"D5-015", d:5, s:"Technical Fundamentals", diff:2, type:"single", n:1,
  stem:"Which parameter guidance matches Anthropic's recommendation?",
  opts:[
    "Adjust either temperature or top_p, not both, because they interact.",
    "Tune temperature and top_p together to obtain finer sampling control.",
    "Leave top_p at 1.0 and temperature at 1.0 for every production workload.",
    "Raise temperature above 1.0 when the task calls for maximum creativity."
  ],
  correct:[0],
  why:"Both shape the same sampling distribution, and moving them together produces interactions that are hard to predict or debug. Pick one lever, tune it, leave the other at its default.",
  wrong:{1:"This is the specific practice the guidance warns against.",2:"Those are defaults, not a rule; extraction and classification usually want lower.",3:"Claude's temperature range is 0 to 1, so higher values are invalid."},
  doc:{t:"Anthropic docs \u2014 Messages API",u:"https://docs.anthropic.com/en/api/messages"} },

{ id:"D5-016", d:5, s:"Technical Fundamentals", diff:2, type:"single", n:1,
  stem:"A tool returns a 40,000-token JSON blob, of which the agent needs three fields. What is the best handling?",
  opts:[
    "Pass the whole payload through so the model has complete information.",
    "Filter inside the tool handler and return only the three required fields.",
    "Move to a model with a larger window and continue passing everything.",
    "Insert the payload, then ask the model to summarise it before proceeding."
  ],
  correct:[1],
  why:"Tool output is under your control, so reduce it before it reaches the model. This cuts cost, preserves window space for the real task, and removes noise the model would otherwise reason through.",
  wrong:{0:"Uncontrolled tool output is a leading cause of context bloat in agents.",2:"Raises the ceiling and the price without addressing the waste.",3:"Summarising after insertion means you already paid for all 40,000 tokens."},
  doc:{t:"Anthropic docs \u2014 Tool use",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} },

{ id:"D5-017", d:5, s:"Technical Fundamentals", diff:3, type:"multi", n:2,
  stem:"An interactive assistant is too slow at p95. Which two changes reduce latency without changing the task? (Select 2)",
  opts:[
    "Put the stable prompt and reference material behind a cache breakpoint.",
    "Route simple requests to a smaller model and reserve the large one for hard work.",
    "Raise max_tokens so the model can finish the answer within a single turn.",
    "Enable extended thinking on all requests to improve answer quality.",
    "Add ten further few-shot examples so the task is less ambiguous."
  ],
  correct:[0,1],
  why:"A cache hit removes the time spent re-processing a long stable prefix, and tiering by difficulty keeps most traffic off the slowest model. Both cut latency while leaving the task definition untouched.",
  wrong:{2:"A higher ceiling permits longer output, which takes longer to generate.",3:"Extended thinking deliberately adds reasoning time before the answer.",4:"More examples mean more input tokens to process before the first output token."},
  doc:{t:"Anthropic docs \u2014 Reducing latency",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-latency"} },

// ---------- Model Selection and Trade-offs ----------
{ id:"D5-018", d:5, s:"Model Selection and Trade-offs", diff:2, type:"single", n:1,
  stem:"You must classify 2 million short messages per day into eight categories. Accuracy on a held-out set is already 97% with the smallest model tier. Which choice is best?",
  opts:[
    "Move to the most capable tier so accuracy is maximised regardless of cost.",
    "Adopt the mid tier as a balanced compromise between quality and spend.",
    "Stay on the fastest, cheapest tier, which already clears the accuracy bar.",
    "Alternate between tiers per request to balance cost against quality."
  ],
  correct:[2],
  why:"Selection is driven by whether the quality bar is met, not by picking the most capable option. At 97% the requirement is satisfied, so at this volume the cheapest sufficient tier wins outright.",
  wrong:{0:"Paying premium rates at that volume for accuracy you already have is waste.",1:"A compromise only makes sense when the cheap option falls short, and it does not.",3:"Alternating gives inconsistent behaviour and complicates evaluation."},
  doc:{t:"Anthropic docs \u2014 Choosing a model",u:"https://docs.anthropic.com/en/docs/about-claude/models/choosing-a-model"} },

{ id:"D5-019", d:5, s:"Model Selection and Trade-offs", diff:2, type:"single", n:1,
  stem:"Which task profile most justifies the most capable (and most expensive) model tier?",
  opts:[
    "High-volume sentiment tagging of short social media posts.",
    "Extracting a date from a fixed-format field in a standard invoice header.",
    "Translating short user-interface strings into a dozen target languages.",
    "Low-volume, high-stakes work where an error is expensive to discover."
  ],
  correct:[3],
  why:"Premium capability earns its price when volume is low, the reasoning is genuinely hard, and a mistake costs far more than the inference, such as multi-file refactoring or complex legal analysis.",
  wrong:{0:"High volume plus a simple task is the classic case for the cheapest tier.",1:"A fixed-format extraction is handled easily by a small model.",2:"Short string translation does not require frontier reasoning."},
  doc:{t:"Anthropic docs \u2014 Choosing a model",u:"https://docs.anthropic.com/en/docs/about-claude/models/choosing-a-model"} },

{ id:"D5-020", d:5, s:"Model Selection and Trade-offs", diff:3, type:"single", n:1,
  stem:"A team argues \"we should always use the newest model because it is strictly better\". What is the most important caveat for a production system?",
  opts:[
    "Behaviour can shift between versions, so validate against your eval suite first.",
    "Newer models are consistently slower than the versions they replace.",
    "Tool use is unavailable on a new model until a later follow-up release.",
    "Newer models cannot be pinned, so rollback is impossible after an upgrade."
  ],
  correct:[0],
  why:"Better aggregate benchmarks do not guarantee better behaviour on your prompts. Formatting, verbosity, and edge-case handling can move in ways a downstream parser does not expect.",
  wrong:{1:"Not generally true; newer releases are often faster at a given tier.",2:"Tool use is supported across current model tiers.",3:"Dated model ids exist precisely so that you can pin and roll back."},
  doc:{t:"Anthropic docs \u2014 Models overview",u:"https://docs.anthropic.com/en/docs/about-claude/models"} },

{ id:"D5-021", d:5, s:"Model Selection and Trade-offs", diff:2, type:"single", n:1,
  stem:"An agent performs a long chain of tool calls where most steps are simple lookups and one step is a difficult synthesis. What is the most cost-effective architecture?",
  opts:[
    "Run the entire chain on the most capable model for behavioural consistency.",
    "Run routine steps on a cheap fast model and the synthesis on the capable one.",
    "Run the whole chain on the cheapest tier and accept weaker synthesis quality.",
    "Run the chain on two different models and compare the results at the end."
  ],
  correct:[1],
  why:"Model choice is a per-step decision rather than a per-application one. Cheap models handle lookups and routing; the expensive model is reserved for the step whose quality decides the outcome.",
  wrong:{0:"Paying premium rates for trivial lookups is the commonest avoidable agent cost.",2:"Degrading the one step that matters defeats the purpose of the chain.",3:"Doubles spend with no reliable way to arbitrate between the two results."},
  doc:{t:"Anthropic \u2014 Building effective agents",u:"https://www.anthropic.com/engineering/building-effective-agents"} },

// ---------- Cost and Token Management ----------
{ id:"D5-022", d:5, s:"Cost and Token Management", diff:2, type:"single", n:1,
  stem:"Which change is most likely to reduce spend on a high-volume summarisation service without reducing quality?",
  opts:[
    "Remove the system prompt entirely to save its tokens on every request.",
    "Set temperature to 0 so the model produces a more economical response.",
    "Trim input boilerplate, cap output length, and cache the stable prefix.",
    "Disable streaming, since incremental delivery carries a billing overhead."
  ],
  correct:[2],
  why:"Spend is tokens in plus tokens out. Those three reduce token volume rather than degrade the task: less input, no output nobody reads, and a discounted rate on the repeated prefix.",
  wrong:{0:"Saves very little and usually costs quality, which is a false economy.",1:"Sampling temperature has no effect on price.",3:"Streaming is billed identically to a blocking response."},
  doc:{t:"Anthropic docs \u2014 Prompt caching",u:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"} },

{ id:"D5-023", d:5, s:"Cost and Token Management", diff:2, type:"single", n:1,
  stem:"Finance asks for a per-feature breakdown of Claude spend. What instrumentation gives you this?",
  opts:[
    "The monthly invoice total, apportioned across features by headcount.",
    "A count of API requests issued per feature, compared month over month.",
    "An estimate derived from the average prompt length of each feature.",
    "The usage block from every response, tagged with feature and model."
  ],
  correct:[3],
  why:"Each response reports the token counts that actually drove the charge, including cache reads and writes. Persisting that with a feature tag turns attribution into arithmetic rather than estimation.",
  wrong:{0:"An aggregate total cannot be split by feature after the fact.",1:"Request counts ignore the huge variation in tokens per request.",2:"Estimates drift and miss cache effects entirely."},
  doc:{t:"Anthropic docs \u2014 Messages API",u:"https://docs.anthropic.com/en/api/messages"} },

{ id:"D5-024", d:5, s:"Cost and Token Management", diff:3, type:"single", n:1,
  stem:"A per-tenant monthly token budget must be enforced so a tenant can never exceed it. Where must the check live?",
  opts:[
    "In your service, metering per tenant and refusing requests once exhausted.",
    "In the system prompt, asking Claude to be concise as the limit approaches.",
    "In max_tokens, scaled down in proportion to the tenant's remaining budget.",
    "In organisation-level rate limits, configured per tenant in the console."
  ],
  correct:[0],
  why:"A hard budget is an application invariant, so the code that owns the meter must refuse or throttle at the boundary before a request is issued. Anything the model can influence is not enforcement.",
  wrong:{1:"Prompt guidance cannot enforce a financial limit.",2:"A useful secondary control, but it caps output only and ignores input.",3:"Rate limits apply to your whole organisation and have no notion of your tenants."},
  doc:{t:"Anthropic docs \u2014 Rate limits",u:"https://docs.anthropic.com/en/api/rate-limits"} },

{ id:"D5-025", d:5, s:"Cost and Token Management", diff:2, type:"single", n:1,
  stem:"Which pair of workload characteristics together make the Message Batches API the right choice?",
  opts:[
    "Interactive latency requirements combined with relatively low daily volume.",
    "Tolerance for asynchronous completion combined with large request volume.",
    "Strict data residency requirements combined with streamed partial output.",
    "Heavy tool use combined with a human-in-the-loop approval step per item."
  ],
  correct:[1],
  why:"Batch trades immediacy for price. When nothing waits on an individual result and volume is large, a 50% discount on input and output tokens is the clear economic choice.",
  wrong:{0:"Interactive work is precisely what batch is unsuitable for.",2:"Batch does not stream, and residency is an unrelated deployment concern.",3:"A human approval step implies an interactive loop, not offline processing."},
  doc:{t:"Anthropic docs \u2014 Message Batches",u:"https://docs.anthropic.com/en/docs/build-with-claude/batch-processing"} }

);
