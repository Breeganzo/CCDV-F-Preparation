/* Domain 6 - Prompt and Context Engineering - 11.0% of the exam (6 of 53 items).
   Sub-skills: Context Engineering 3.8 | Prompt Engineering 4.6 | Output Handling 2.6

   OPTION DISCIPLINE: balanced option lengths, key rotated across all four positions,
   every distractor plausible. Reasoning lives in `why`, never inside the correct option. */
(window.CCDV_QUESTIONS = window.CCDV_QUESTIONS || []).push(

// ---------- Context Engineering ----------
{ id:"D6-001", d:6, s:"Context Engineering", diff:2, type:"single", n:1,
  stem:"A coding agent's quality degrades after about 25 turns: it forgets earlier decisions and repeats work already done. Which technique addresses this most directly?",
  opts:[
    "Compact older turns into a structured summary, keeping recent turns verbatim.",
    "Raise max_tokens so each response has room to restate prior decisions.",
    "Increase the temperature so the agent stops retreading the same ground.",
    "Disable tool use so that noisy tool results stop crowding the history."
  ],
  correct:[0],
  why:"Compaction is the standard answer for long sessions: bulky historical turns are replaced by a dense summary that preserves decisions and state while recent turns stay in full. The information survives; the token cost does not.",
  wrong:{1:"Output length has nothing to do with retaining earlier context.",2:"Higher temperature increases variation, not recall.",3:"Removing capability does not restore context that was already lost."},
  doc:{t:"Anthropic docs \u2014 Context windows",u:"https://docs.anthropic.com/en/docs/build-with-claude/context-windows"} },

{ id:"D6-002", d:6, s:"Context Engineering", diff:2, type:"single", n:1,
  stem:"Which of these is context pruning, as distinct from compaction?",
  opts:[
    "Condensing the first twenty turns of the session into a single paragraph.",
    "Raising the context window limit so more history fits without intervention.",
    "Splitting the task across two agents so each holds only half the material.",
    "Deleting material that is no longer relevant, such as a since-rewritten file."
  ],
  correct:[3],
  why:"Pruning removes superseded material outright whereas compaction compresses it. Pruning is right when content has been invalidated, because summarising it would only preserve noise.",
  wrong:{0:"That is compaction: compressing rather than removing.",1:"A configuration change, not a context management technique.",2:"That is task isolation through subagents."},
  doc:{t:"Anthropic docs \u2014 Context windows",u:"https://docs.anthropic.com/en/docs/build-with-claude/context-windows"} },

{ id:"D6-003", d:6, s:"Context Engineering", diff:3, type:"single", n:1,
  stem:"An agent must analyse 60 log files to find a root cause. Loading all of them exceeds the context window. What is the most effective structure?",
  opts:[
    "Truncate each file to its first hundred lines so that all 60 fit at once.",
    "Move to a model with a larger window and load the complete set of files.",
    "Dispatch subagents over batches in isolated contexts, returning findings only.",
    "Ask the user to nominate the single file most likely to contain the cause."
  ],
  correct:[2],
  why:"Task isolation is the canonical answer when analysis exceeds one window. Each subagent reads its batch in its own context and returns a short conclusion, so the parent reasons over 60 findings rather than 60 raw files.",
  wrong:{0:"Arbitrary truncation is likely to discard the very lines that matter.",1:"Works briefly, costs more, and fails again as volume grows.",3:"Pushes the analysis back onto the user, which was the task itself."},
  doc:{t:"Claude Code docs \u2014 Subagents",u:"https://docs.anthropic.com/en/docs/claude-code/sub-agents"} },

{ id:"D6-004", d:6, s:"Context Engineering", diff:2, type:"single", n:1,
  stem:"What is \"context bloat\" and why does it matter beyond cost?",
  opts:[
    "It is purely a billing concern and has no measurable effect on quality.",
    "Accumulated low-value content raises cost and dilutes the relevant signal.",
    "It is the condition of a context window being too small for the chosen task.",
    "It is the effect of setting max_tokens far higher than any answer requires."
  ],
  correct:[1],
  why:"Bloat hurts twice. You pay for every token on every turn, and a window packed with verbose tool output and superseded files makes it harder for the model to attend to what matters.",
  wrong:{0:"Quality degradation is arguably the more serious half of the problem.",2:"That describes a capacity limit rather than bloat.",3:"max_tokens bounds output; it does not accumulate context."},
  doc:{t:"Anthropic docs \u2014 Context windows",u:"https://docs.anthropic.com/en/docs/build-with-claude/context-windows"} },

{ id:"D6-005", d:6, s:"Context Engineering", diff:2, type:"multi", n:2,
  stem:"Which two practices keep a long-running agent's context healthy? (Select 2)",
  opts:[
    "Truncate or filter verbose tool output before it ever enters the context.",
    "Persist goals, decisions, and constraints outside the conversation and re-inject.",
    "Retain every intermediate result in case it turns out to matter later on.",
    "Fix sampling temperature at 0 so the agent stays reliably on track.",
    "Disable prompt caching so that the context is rebuilt fresh each turn."
  ],
  correct:[0,1],
  why:"Filtering tool output at the source stops the largest contributor to bloat, and holding durable state in an explicit external store keeps critical constraints salient however long the session runs.",
  wrong:{2:"Retaining everything is precisely what causes bloat and eventual overflow.",3:"Sampling temperature does not manage context at all.",4:"Caching reduces cost for stable prefixes and has no bearing on context hygiene."},
  doc:{t:"Anthropic docs \u2014 Context windows",u:"https://docs.anthropic.com/en/docs/build-with-claude/context-windows"} },

{ id:"D6-006", d:6, s:"Context Engineering", diff:3, type:"single", n:1,
  stem:"A team compacts aggressively and now the agent makes decisions that contradict constraints agreed early in the session. What went wrong?",
  opts:[
    "The summary narrated events instead of deliberately preserving constraints.",
    "Compaction is inherently unsafe and should be avoided in production agents.",
    "The context window is larger than the task needs, diluting recent material.",
    "Temperature was set too high during the summarisation step of compaction."
  ],
  correct:[0],
  why:"Compaction is lossy by design, so what it keeps must be chosen deliberately. Constraints, decisions, and open items should be retained explicitly, or better still kept in structured state that is never summarised.",
  wrong:{1:"Compaction is necessary for long sessions; the implementation was at fault.",2:"Window size did not cause the loss of information.",3:"Temperature affects wording, not which categories of fact survive."},
  doc:{t:"Anthropic docs \u2014 Context windows",u:"https://docs.anthropic.com/en/docs/build-with-claude/context-windows"} },

// ---------- Prompt Engineering ----------
{ id:"D6-007", d:6, s:"Prompt Engineering", diff:2, type:"single", n:1,
  stem:"Which prompt is most likely to produce consistent, usable output?",
  opts:[
    "\"Summarise this document accurately and completely for a business reader.\"",
    "\"Give me a really good summary of this document, thorough but also concise.\"",
    "\"Summarise this document. Keep the tone professional and the length sensible.\"",
    "\"Summarise in three bullets under 20 words each: decision, owner, deadline.\""
  ],
  correct:[3],
  why:"Specificity about structure, length, and required content is what makes output consistent and machine-consumable. It states the format, the size bound, and exactly which facts must appear.",
  wrong:{0:"\"Accurately and completely\" is unmeasurable and fixes no format.",1:"\"Thorough but concise\" is contradictory and gives no structure.",2:"\"Professional\" and \"sensible\" are subjective and will drift between calls."},
  doc:{t:"Anthropic docs \u2014 Be clear and direct",u:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct"} },

{ id:"D6-008", d:6, s:"Prompt Engineering", diff:2, type:"single", n:1,
  stem:"Why are XML tags recommended for separating sections of a complex Claude prompt?",
  opts:[
    "Claude parses XML natively and handles other formats less reliably.",
    "Tagged sections compress better, reducing the token cost of a long prompt.",
    "They mark unambiguous boundaries between instructions, examples, and data.",
    "The API requires structured delimiters on any request that defines tools."
  ],
  correct:[2],
  why:"Clear delimiters let the model distinguish \"this is your instruction\" from \"this is the document to operate on\", which matters most when retrieved content might otherwise read as an instruction.",
  wrong:{0:"Claude handles plain text, markdown, and JSON perfectly well.",1:"Tags add tokens; the benefit is clarity rather than compression.",3:"Tool use imposes no formatting requirement of this kind."},
  doc:{t:"Anthropic docs \u2014 Use XML tags",u:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags"} },

{ id:"D6-009", d:6, s:"Prompt Engineering", diff:2, type:"single", n:1,
  stem:"When do few-shot examples deliver the most value?",
  opts:[
    "When the task is simple and the instruction is already unambiguous.",
    "When an output format or edge-case convention is easier shown than described.",
    "When input token count must be reduced without changing the task at all.",
    "When the model needs access to private data it was not trained on."
  ],
  correct:[1],
  why:"Examples are most powerful for conveying format and conventions, especially edge cases where a prose rule would be long and ambiguous but a single demonstration is instantly clear.",
  wrong:{0:"Simple tasks rarely need examples; they just add tokens.",2:"Examples increase input tokens rather than reducing them.",3:"Examples cannot supply missing data; that is retrieval's job."},
  doc:{t:"Anthropic docs \u2014 Multishot prompting",u:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting"} },

{ id:"D6-010", d:6, s:"Prompt Engineering", diff:3, type:"single", n:1,
  stem:"A prompt template inserts user input directly: \"Answer this question about our policy: {user_input}\". A user submits text that itself contains instructions. What is the best structural mitigation?",
  opts:[
    "Delimit the input as data, and keep privileged capability off that path.",
    "Rely on the system prompt, which takes precedence over user-supplied text.",
    "Reject any submission containing words such as \"ignore\" or \"disregard\".",
    "Lower the sampling temperature so stray instructions are less likely followed."
  ],
  correct:[0],
  why:"Delimiting and framing untrusted input as data is the prompt-layer defence, and it must be paired with an architectural one, because no single layer is sufficient against adversarial text.",
  wrong:{1:"System prompts are influential but are not a guaranteed precedence mechanism.",2:"Keyword blocklists are trivially evaded by rephrasing or encoding.",3:"Temperature has no effect on injection susceptibility."},
  doc:{t:"Anthropic docs \u2014 Mitigate jailbreaks",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks"} },

{ id:"D6-011", d:6, s:"Prompt Engineering", diff:2, type:"single", n:1,
  stem:"Which approach to improving an underperforming prompt is most reliable?",
  opts:[
    "Rewrite it wholesale based on experience, then ship and watch for complaints.",
    "Add as many explicit instructions as possible to cover every observed case.",
    "Ask Claude to critique and rate its own prompt, then apply its suggestions.",
    "Build a labelled eval set, change one thing at a time, and measure each change."
  ],
  correct:[3],
  why:"Prompt iteration without measurement is guessing. A fixed labelled set plus single-variable changes shows which edits helped and catches a change that fixes one category while breaking another.",
  wrong:{0:"A full rewrite moves many variables at once, so you learn nothing about cause.",1:"Overloaded prompts dilute the important instructions and often reduce accuracy.",2:"Self-assessment is not a measurement of downstream task performance."},
  doc:{t:"Anthropic docs \u2014 Create strong empirical evaluations",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/develop-tests"} },

{ id:"D6-012", d:6, s:"Prompt Engineering", diff:2, type:"single", n:1,
  stem:"What is the purpose of prefilling the assistant turn in a Messages API request?",
  opts:[
    "To reduce the number of input tokens the request has to carry.",
    "To register the response for reuse by the prompt caching layer.",
    "To constrain how the response begins, steering it into a chosen format.",
    "To supersede the system prompt for one specific turn of the conversation."
  ],
  correct:[2],
  why:"Prefilling puts the opening tokens of the assistant turn under your control and generation continues from there, which is how an opening brace suppresses conversational preamble before JSON.",
  wrong:{0:"A prefill adds tokens rather than removing them.",1:"It is unrelated to prompt caching.",3:"System instructions continue to apply normally."},
  doc:{t:"Anthropic docs \u2014 Prefill Claude's response",u:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prefill-claudes-response"} },

{ id:"D6-013", d:6, s:"Prompt Engineering", diff:3, type:"single", n:1,
  stem:"A classification prompt performs well overall but consistently mislabels one rare category. What is the most targeted fix?",
  opts:[
    "Move the workload to a larger model tier with stronger reasoning ability.",
    "Define that category precisely and show examples, including near-miss cases.",
    "Increase max_tokens so the model has room to deliberate before labelling.",
    "Drop the neighbouring categories so the rare one is no longer confusable."
  ],
  correct:[1],
  why:"A single confused category is a boundary problem, so sharpen the boundary. Demonstrating true positives alongside the near-misses it is being confused with is targeted, cheap, and measurable.",
  wrong:{0:"An expensive blunt instrument that may not resolve a definitional ambiguity.",2:"Output length is irrelevant to which label is chosen.",3:"Removing categories changes the task rather than solving it."},
  doc:{t:"Anthropic docs \u2014 Multishot prompting",u:"https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting"} },

// ---------- Output Handling ----------
{ id:"D6-014", d:6, s:"Output Handling", diff:2, type:"single", n:1,
  stem:"Claude generates JSON that another service consumes to update a database. What should the consuming code do?",
  opts:[
    "Parse it, validate against the schema, and handle failures before processing.",
    "Flatten the response to plain text and pass it downstream for storage.",
    "Retry on parse failure and process the first response that parses cleanly.",
    "Compare the response against an example template and proceed if it matches."
  ],
  correct:[0],
  why:"Model output is untrusted input at a system boundary. Parse, validate, and define the failure path, whether reject, escalate, or fall back, before anything touches the database.",
  wrong:{1:"Flattening to text discards the structure the consumer depends on.",2:"A parseable response can still be semantically wrong; parsing is not validation.",3:"\"Looks similar\" is not a check and lets malformed records through."},
  doc:{t:"Anthropic docs \u2014 Increase output consistency",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/increase-consistency"} },

{ id:"D6-015", d:6, s:"Output Handling", diff:2, type:"single", n:1,
  stem:"Which technique most reliably produces machine-readable structured output?",
  opts:[
    "Instruct the model firmly and repeatedly to emit nothing but valid JSON.",
    "Extract the payload from the response text using tuned regular expressions.",
    "Set temperature to 0 so the output format stays stable across requests.",
    "Define a tool whose input_schema is the target shape and read its arguments."
  ],
  correct:[3],
  why:"A tool schema turns a formatting request into a typed contract: the model produces arguments conforming to your JSON Schema, so you read structured data instead of scraping prose.",
  wrong:{0:"Better than nothing, but it still leaves an unguarded parse in production.",1:"Regex extraction is brittle and fails on nesting and edge cases.",2:"Determinism does not guarantee schema conformance."},
  doc:{t:"Anthropic docs \u2014 Tool use for structured output",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} },

{ id:"D6-016", d:6, s:"Output Handling", diff:3, type:"single", n:1,
  stem:"An extraction pipeline validates Claude's JSON against a schema and passes. A record still contains a plausible-looking but incorrect invoice total. What does this demonstrate?",
  opts:[
    "The schema was written incorrectly and failed to constrain the total field.",
    "Sampling temperature was set too high for a numeric extraction workload.",
    "Schema validation checks shape, not truth; semantics need a separate check.",
    "The model does not reliably support structured JSON output for this task."
  ],
  correct:[2],
  why:"Structural and semantic validation are different problems. A number can be the right type in the right field and still be wrong, so recompute it from line items or reconcile against the source.",
  wrong:{0:"The schema did its job; it was never meant to verify values.",1:"A confidently wrong figure occurs at temperature 0 as well.",3:"JSON output plainly worked, since the payload validated."},
  doc:{t:"Anthropic docs \u2014 Reduce hallucinations",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations"} },

{ id:"D6-017", d:6, s:"Output Handling", diff:2, type:"single", n:1,
  stem:"What is \"defensive parsing\" of model output?",
  opts:[
    "Parsing the response a second time to confirm the first result was correct.",
    "Checking stop_reason, validating structure and values, and defining a failure path.",
    "Selecting a faster parser so malformed payloads are rejected more quickly.",
    "Reading only the leading portion of the response to avoid trailing noise."
  ],
  correct:[1],
  why:"It treats every response as potentially truncated or malformed rather than assuming the model produced what was asked, which is why stop_reason is checked before the content is trusted.",
  wrong:{0:"Parsing twice yields the same result and proves nothing.",2:"Parser performance is unrelated to correctness handling.",3:"Arbitrary truncation creates the malformed input you are guarding against."},
  doc:{t:"Anthropic docs \u2014 Increase output consistency",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/increase-consistency"} }

);
