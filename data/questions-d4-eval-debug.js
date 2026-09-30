/* Domain 4 - Eval, Testing, and Debugging - 2.6% of the exam (1 of 53 items).
   Sub-skill: Debugging and Error Handling 2.6

   OPTION DISCIPLINE: balanced option lengths, key rotated across all four positions,
   every distractor plausible. Reasoning lives in `why`, never inside the correct option. */
(window.CCDV_QUESTIONS = window.CCDV_QUESTIONS || []).push(

{ id:"D4-001", d:4, s:"Debugging and Error Handling", diff:3, type:"single", n:1,
  stem:"An agent returns a wrong final answer. The trace shows a correct tool call, but the tool returned an empty array and the agent proceeded to answer from assumption. Where is the defect?",
  opts:[
    "In the model, which ought to have known the answer without calling a tool.",
    "In the prompt, which needed more few-shot examples of empty result handling.",
    "In the model version, which should be upgraded to one that reasons better.",
    "In the tool, which returned an ambiguous empty array instead of a clear signal."
  ],
  correct:[3],
  why:"An empty array could mean no matches, a bad query, or a failure. An unambiguous result lets the agent distinguish \"nothing exists\" from \"something went wrong\" rather than filling the gap with assumption.",
  wrong:{0:"Relying on parametric knowledge for data the tool fetches is the failure described.",1:"Examples cannot resolve a genuinely ambiguous tool response.",2:"A newer model would face exactly the same ambiguous signal."},
  doc:{t:"Anthropic docs \u2014 Tool use",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} },

{ id:"D4-002", d:4, s:"Debugging and Error Handling", diff:2, type:"single", n:1,
  stem:"Users report that a Claude-powered feature \"sometimes returns nonsense\". What is the most effective first diagnostic step?",
  opts:[
    "Capture full traces of failing cases and look for a common pattern.",
    "Move the feature to a larger model and see whether the reports subside.",
    "Rewrite the prompt from scratch using the current best-practice guidance.",
    "Add a disclaimer to the interface warning that output may be inaccurate."
  ],
  correct:[0],
  why:"You cannot fix an intermittent failure you cannot reproduce. Complete traces reveal whether the cause is truncation, a particular input shape, a parameter difference, or a tool returning bad data.",
  wrong:{1:"Changing a variable before understanding the failure is expensive guessing.",2:"A blind rewrite may fix it, break something else, or do nothing, unmeasurably.",3:"A disclaimer manages expectations without addressing the defect."},
  doc:{t:"Anthropic docs \u2014 Create strong empirical evaluations",u:"https://docs.anthropic.com/en/docs/test-and-evaluate/develop-tests"} },

{ id:"D4-003", d:4, s:"Debugging and Error Handling", diff:2, type:"single", n:1,
  stem:"How do you determine whether a failure originates in the integration layer or in the model's output?",
  opts:[
    "Model failures surface as HTTP errors, whereas integration failures do not.",
    "Integration failures only appear under high load, so reproduce at peak traffic.",
    "Inspect the raw response: well-formed but wrong points at the prompt or model.",
    "Model failures are always reproducible when temperature is set to zero."
  ],
  correct:[2],
  why:"The raw response separates the two. A malformed request, a wrong parameter, an unhandled stop_reason, or a bad tool result points at your code instead.",
  wrong:{0:"Model quality failures return HTTP 200, which is what makes them hard to catch.",1:"Integration bugs frequently appear on specific inputs at any load.",3:"Temperature 0 reduces variation but does not guarantee reproducibility."},
  doc:{t:"Anthropic docs \u2014 Errors",u:"https://docs.anthropic.com/en/api/errors"} },

{ id:"D4-004", d:4, s:"Debugging and Error Handling", diff:2, type:"single", n:1,
  stem:"Which error class should generally NOT be retried automatically?",
  opts:[
    "429 rate_limit_error, which signals the account is sending too quickly.",
    "400 invalid_request_error, which will fail identically on every attempt.",
    "529 overloaded_error, which signals transient capacity pressure upstream.",
    "A connection timeout occurring before any response has been received."
  ],
  correct:[1],
  why:"A 400 is a client-side defect such as a bad parameter or a mismatched tool_use_id. Retrying an identical malformed request wastes quota and delays surfacing the bug.",
  wrong:{0:"Rate limits are transient; retry with backoff and honour retry-after.",2:"Overload is transient capacity pressure and is the textbook retry case.",3:"Timeouts are transient and normally warrant a bounded retry."},
  doc:{t:"Anthropic docs \u2014 Errors",u:"https://docs.anthropic.com/en/api/errors"} }

);
