/* Domain 8 - Tools and MCPs - 10.6% of the exam (5 of 53 items).
   Sub-skills: Tool Implementation 4.4 | MCP Server Development 2.1 | Agentic Customisation 4.1

   OPTION DISCIPLINE: balanced option lengths, key rotated across all four positions,
   every distractor plausible. Reasoning lives in `why`, never inside the correct option. */
(window.CCDV_QUESTIONS = window.CCDV_QUESTIONS || []).push(

// ---------- Tool Implementation ----------
{ id:"D8-001", d:8, s:"Tool Implementation", diff:2, type:"single", n:1,
  stem:"An MCP server exposes search_customers described as \"Find customer records\" and search_orders described as \"Find customer order records\". Claude frequently picks the wrong one. What is the best fix?",
  opts:[
    "Withdraw the less frequently used of the two tools from the exposed set.",
    "Merge the pair into a single tool with a record_type enumeration parameter.",
    "Rewrite each description to state purpose, inputs, and when to prefer it.",
    "Add keyword routing that selects the tool before the request reaches Claude."
  ],
  correct:[2],
  why:"Selection is driven almost entirely by the description, and these two are nearly identical strings, so there is nothing to discriminate on. Stating the boundary against the sibling tool is the highest-leverage fix.",
  wrong:{0:"Deleting a needed capability to work around wording breaks functionality.",1:"A generic multipurpose tool hides intent behind an enum and usually selects worse.",3:"Brittle keyword rules discard the contextual understanding that makes tool use work."},
  doc:{t:"Anthropic docs \u2014 Tool use best practices",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} },

{ id:"D8-002", d:8, s:"Tool Implementation", diff:2, type:"single", n:1,
  stem:"What is the role of input_schema in a tool definition?",
  opts:[
    "It validates the value the tool handler returns before it reaches the model.",
    "It declares which callers or roles are permitted to invoke the tool.",
    "It configures the per-minute rate limit applied to that tool's execution.",
    "It is JSON Schema for the parameters, guiding the model and your validation."
  ],
  correct:[3],
  why:"It serves two purposes at once: telling the model the shape, types, and required fields to produce, and giving your handler a contract to validate against before doing anything.",
  wrong:{0:"It describes inputs only; return values are your handler's concern.",1:"Authorisation is enforced in your application, never in a schema.",2:"Rate limiting is an infrastructure concern outside the tool definition."},
  doc:{t:"Anthropic docs \u2014 Tool use",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} },

{ id:"D8-003", d:8, s:"Tool Implementation", diff:3, type:"single", n:1,
  stem:"A delete_records tool is defined with a filter parameter. During testing the agent once called it with an empty filter, which would have deleted everything. What is the correct set of changes?",
  opts:[
    "Require the filter, reject broad filters, cap affected rows, gate on approval.",
    "Add a prominent warning to the tool description and monitor future calls.",
    "Rename the tool to something less inviting for the model to reach for.",
    "Set temperature to 0 on any request where this tool is made available."
  ],
  correct:[0],
  why:"Layered deterministic defences for a destructive capability: the schema makes the filter mandatory, the handler bounds the blast radius, and a human gate stands in front of the irreversible action.",
  wrong:{1:"A description influences behaviour but cannot prevent the call.",2:"Naming does not constrain what the handler will execute.",3:"Sampling temperature is not a safety control."},
  doc:{t:"Anthropic docs \u2014 Tool use best practices",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} },

{ id:"D8-004", d:8, s:"Tool Implementation", diff:2, type:"single", n:1,
  stem:"Which distinction between client-side and server-side tools is correct?",
  opts:[
    "Client-side tools are executed by Anthropic and server-side tools by you.",
    "Client-side tools run in your code; server-side tools run inside the request.",
    "Client-side tools are those that execute within an end user's web browser.",
    "The terms are interchangeable and describe the same execution model."
  ],
  correct:[1],
  why:"With a custom tool, Claude returns a tool_use block and your application runs the code, then returns a tool_result. Server-side tools execute inside the API request, so you receive results without dispatching anything.",
  wrong:{0:"This reverses the two.",2:"\"Client\" means your application, which is usually a backend service.",3:"Who executes the code changes both architecture and security posture."},
  doc:{t:"Anthropic docs \u2014 Tool use",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} },

{ id:"D8-005", d:8, s:"Tool Implementation", diff:2, type:"single", n:1,
  stem:"A tool queries a database and can return anywhere from 1 to 200,000 rows. What should the tool contract include?",
  opts:[
    "Nothing beyond the query parameters; return whatever the query produces.",
    "A parameter letting the model lift the row limit when it judges it necessary.",
    "A limit with a default and a hard ceiling, plus pagination for larger sets.",
    "A second model call that summarises the result set before it is returned."
  ],
  correct:[2],
  why:"Unbounded tool output is one of the fastest ways to exhaust a context window and a budget. Bound results by default with a ceiling the caller cannot exceed, and offer pagination when more is genuinely needed.",
  wrong:{0:"A 200,000-row result exhausts the window and the budget in one call.",1:"A model-controlled override is a suggestion rather than a limit.",3:"Sometimes useful, but it adds cost and does not bound the query itself."},
  doc:{t:"Anthropic docs \u2014 Tool use best practices",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} },

{ id:"D8-006", d:8, s:"Tool Implementation", diff:2, type:"single", n:1,
  stem:"Claude calls a tool with a string where the schema requires an integer. What is the best handler behaviour?",
  opts:[
    "Raise the exception so the malformed call terminates the agent run.",
    "Coerce the value to the expected type silently and continue processing.",
    "Return nothing at all, leaving the model to decide how to proceed.",
    "Return an error tool_result naming the field and the expected type."
  ],
  correct:[3],
  why:"Validate at the boundary and return an actionable error. Naming the offending field and the expected type usually lets the model correct itself on the next iteration, which is self-healing for free.",
  wrong:{0:"One malformed argument should not destroy an entire run.",1:"Silent coercion hides bugs and produces subtly wrong results downstream.",2:"An empty response gives the model nothing to correct and invites a repeat."},
  doc:{t:"Anthropic docs \u2014 Tool use",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} },

{ id:"D8-007", d:8, s:"Tool Implementation", diff:3, type:"multi", n:2,
  stem:"You are designing the tool set for a finance agent. Which two design choices most reduce risk? (Select 2)",
  opts:[
    "Split read and write capability into separate tools with separate code paths.",
    "Scope each tool's credential narrowly instead of sharing one privileged account.",
    "Expose one generic execute_query tool that accepts arbitrary SQL for flexibility.",
    "Keep tool descriptions broad so the model considers a wider range of options.",
    "Return complete raw API responses so the model always has full information."
  ],
  correct:[0,1],
  why:"Separating reads from writes means the common path holds no destructive capability, and per-tool least privilege bounds what a compromised or misused tool can reach. Both shrink the blast radius structurally.",
  wrong:{2:"Arbitrary SQL is the largest possible attack surface and the classic injection target.",3:"Vague descriptions cause wrong tool selection.",4:"Raw responses bloat context and may leak fields the agent should never see."},
  doc:{t:"Anthropic docs \u2014 Tool use best practices",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} },

// ---------- MCP Server Development ----------
{ id:"D8-008", d:8, s:"MCP Server Development", diff:2, type:"single", n:1,
  stem:"Which three primitives does the Model Context Protocol define?",
  opts:[
    "Tools, resources, and prompts.",
    "Models, prompts, and embeddings.",
    "Agents, subagents, and hooks.",
    "Functions, schemas, and transports."
  ],
  correct:[0],
  why:"Tools are actions the model invokes, resources are data the application exposes for context, and prompts are reusable templates the user invokes. Their control differs: model, application, and user respectively.",
  wrong:{1:"Models and embeddings are not MCP primitives.",2:"These are Claude Code concepts rather than protocol primitives.",3:"Schemas and transports are mechanisms, not primitives."},
  doc:{t:"Model Context Protocol \u2014 Specification",u:"https://modelcontextprotocol.io/docs/concepts/architecture"} },

{ id:"D8-009", d:8, s:"MCP Server Development", diff:2, type:"single", n:1,
  stem:"An MCP server runs as a local subprocess of the host application on the same machine. Which transport is the natural choice?",
  opts:[
    "A WebSocket bound to a port on the host's public network interface.",
    "stdio, exchanging JSON-RPC over the subprocess's standard streams.",
    "SMTP, queuing each request so no message can be lost in transit.",
    "A shared file on disk that both processes poll once every second."
  ],
  correct:[1],
  why:"The host launches the server as a subprocess and talks over stdin and stdout, with no ports and no network exposure. Remote servers use an HTTP-based transport instead.",
  wrong:{0:"Unnecessary for a local subprocess and needlessly exposes a network surface.",2:"Email is not a transport for a synchronous RPC protocol.",3:"File polling is slow, racy, and not part of the specification."},
  doc:{t:"Model Context Protocol \u2014 Transports",u:"https://modelcontextprotocol.io/docs/concepts/transports"} },

{ id:"D8-010", d:8, s:"MCP Server Development", diff:3, type:"single", n:1,
  stem:"Your team wants to expose an internal ticketing system so several different Claude-powered applications can use it without each reimplementing the integration. What does building an MCP server give you?",
  opts:[
    "Faster inference on requests that involve reading or writing ticket data.",
    "Automatic fine-tuning of the model on your accumulated ticket history.",
    "A standard interface any compatible client can consume without bespoke code.",
    "A managed authentication layer, removing the need for server-side auth."
  ],
  correct:[2],
  why:"This is MCP's purpose: build the integration once behind a standard protocol so every compatible client can use it, instead of writing one bespoke adapter per application.",
  wrong:{0:"MCP is an integration protocol and does not affect inference speed.",1:"It has no relationship to fine-tuning of any kind.",3:"Servers still need authentication, often more carefully with several clients."},
  doc:{t:"Model Context Protocol \u2014 Introduction",u:"https://modelcontextprotocol.io/introduction"} },

{ id:"D8-011", d:8, s:"MCP Server Development", diff:2, type:"single", n:1,
  stem:"Which MCP primitive is best suited to exposing the contents of a configuration file as background context, rather than as an action?",
  opts:[
    "A tool, since the file must be fetched before its contents can be used.",
    "A prompt, since the configuration shapes how the model should behave.",
    "A hook, since configuration should be injected at a defined lifecycle point.",
    "A resource, identified by a URI and read by the application for context."
  ],
  correct:[3],
  why:"Resources represent data the host application can read and place into context. They are application-controlled and URI-identified, which suits reference material such as a configuration file.",
  wrong:{0:"A tool implies an invocable action with side effects or computation.",1:"Prompts are user-invoked templates rather than data exposure.",2:"Hooks are a Claude Code lifecycle mechanism, not an MCP primitive."},
  doc:{t:"Model Context Protocol \u2014 Resources",u:"https://modelcontextprotocol.io/docs/concepts/resources"} },

// ---------- Agentic Customisation ----------
{ id:"D8-012", d:8, s:"Agentic Customisation", diff:3, type:"single", n:1,
  stem:"Your team has a repeatable multi-step procedure (\"how we cut a release\") written in prose, with no external system calls. Which customisation mechanism fits best?",
  opts:[
    "A Skill: reusable instructions applied automatically when the task matches.",
    "An MCP server, which is the most capable of the customisation mechanisms.",
    "A custom tool with an empty input schema that returns the procedure text.",
    "A hook that fires on every prompt and prepends the release procedure."
  ],
  correct:[0],
  why:"Skills package procedural knowledge as instructions applied when relevant. With no external system to call, the requirement is purely to teach the assistant the procedure.",
  wrong:{1:"MCP solves integration with external systems, and there is no system here.",2:"A tool with no inputs and nothing to execute misuses the mechanism.",3:"Hooks enforce deterministic actions at lifecycle points, not convey procedures."},
  doc:{t:"Claude Code docs \u2014 Skills",u:"https://docs.anthropic.com/en/docs/claude-code/skills"} },

{ id:"D8-013", d:8, s:"Agentic Customisation", diff:3, type:"single", n:1,
  stem:"Which requirement most clearly calls for an MCP server rather than a Skill?",
  opts:[
    "Capturing the team's code review conventions so every review follows them.",
    "Querying and updating records in an internal inventory system over the network.",
    "Standardising the structure and wording of commit messages across the repo.",
    "Explaining the project's directory layout so files are created in the right place."
  ],
  correct:[1],
  why:"Live interaction with an external system, with authenticated calls and state changes, needs executable integration. The other three are knowledge, which Skills or memory files convey.",
  wrong:{0:"Conventions are instructions, best expressed as a Skill or in memory.",2:"A formatting convention is knowledge rather than integration.",3:"Layout description is context, not a capability."},
  doc:{t:"Model Context Protocol \u2014 Introduction",u:"https://modelcontextprotocol.io/introduction"} },

{ id:"D8-014", d:8, s:"Agentic Customisation", diff:2, type:"single", n:1,
  stem:"What is the main advantage of a built-in tool over an equivalent custom tool you implement yourself?",
  opts:[
    "Built-in tools are verified by the provider and do not return wrong results.",
    "Built-in tool definitions and results are excluded from token accounting.",
    "The provider maintains and executes it, so you host and patch nothing.",
    "Built-in tools are exempt from the organisation's request rate limits."
  ],
  correct:[2],
  why:"It removes an implementation and operations burden entirely. The trade-off is that you accept its behaviour and scope rather than tailoring it to your needs.",
  wrong:{0:"No tool is infallible, built-in or otherwise.",1:"Their definitions and results consume context like anything else.",3:"Rate limits still apply to the request that invokes them."},
  doc:{t:"Anthropic docs \u2014 Tool use",u:"https://docs.anthropic.com/en/docs/build-with-claude/tool-use"} },

{ id:"D8-015", d:8, s:"Agentic Customisation", diff:2, type:"single", n:1,
  stem:"A Skill is being written to help Claude generate compliance reports. Which content makes it most effective?",
  opts:[
    "A concise one-line instruction telling Claude to generate reports correctly.",
    "The full source code of the internal service that stores report submissions.",
    "The list of employees who are authorised to request a compliance report.",
    "Triggering context plus the procedure, required sections, rules, and examples."
  ],
  correct:[3],
  why:"A Skill needs a description precise enough to be selected at the right moment and body content concrete enough to change the output: steps, structure, rules, and an example to pattern-match.",
  wrong:{0:"Too vague to trigger reliably or to alter the output.",1:"Implementation source is irrelevant to producing the report and wastes context.",2:"Authorisation is an access control concern enforced in the application."},
  doc:{t:"Claude Code docs \u2014 Skills",u:"https://docs.anthropic.com/en/docs/claude-code/skills"} },

{ id:"D8-016", d:8, s:"Agentic Customisation", diff:3, type:"single", n:1,
  stem:"An organisation has 30 MCP servers configured, and agents have become slower and less accurate at choosing tools. What is the most appropriate remedy?",
  opts:[
    "Enable only the servers relevant to each agent so its tool set stays focused.",
    "Increase the context window on every request so all definitions fit easily.",
    "Consolidate all 30 servers behind a single aggregating MCP server.",
    "Move every agent onto the most capable model tier available."
  ],
  correct:[0],
  why:"Every enabled server injects tool definitions into context and widens the selection space. Scoping the enabled set per agent cuts token overhead and sharply improves selection accuracy.",
  wrong:{1:"Accommodates the bloat instead of removing it, and selection stays poor.",2:"One server exposing thirty servers' worth of tools has the same problem.",3:"Mitigates the symptom at higher cost while the root cause remains."},
  doc:{t:"Claude Code docs \u2014 MCP",u:"https://docs.anthropic.com/en/docs/claude-code/mcp"} }

);
