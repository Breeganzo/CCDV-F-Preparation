/* Domain 3 - Claude Code - 3.1% of the exam (2 of 53 items).
   Sub-skill: Claude Code Operation 3.1

   OPTION DISCIPLINE: balanced option lengths, key rotated across all four positions,
   every distractor plausible. Reasoning lives in `why`, never inside the correct option. */
(window.CCDV_QUESTIONS = window.CCDV_QUESTIONS || []).push(

{ id:"D3-001", d:3, s:"Claude Code Operation", diff:2, type:"single", n:1,
  stem:"A developer wants Claude Code to analyse a large refactor and present an approach for approval before touching any files. Which mechanism is designed for this?",
  opts:[
    "Headless mode, which runs the whole refactor and reports what it changed.",
    "The /clear command, which resets context before a large piece of work.",
    "Plan mode, which restricts Claude to investigation and proposes a plan.",
    "A subagent, which performs the refactor in an isolated working context."
  ],
  correct:[2],
  why:"Plan mode exists for risky or wide-reaching changes: Claude may read and analyse but not modify, and you approve the plan before execution. That is a structural gate rather than a request to be careful.",
  wrong:{0:"Headless mode is for non-interactive scripted use, the opposite of an approval step.",1:"/clear wipes the conversation context and gates nothing.",3:"A subagent isolates context for a subtask; it does not gate file modification."},
  doc:{t:"Claude Code docs \u2014 Common workflows",u:"https://docs.anthropic.com/en/docs/claude-code/common-workflows"} },

{ id:"D3-002", d:3, s:"Claude Code Operation", diff:2, type:"single", n:1,
  stem:"Your team wants a reusable \"/security-review\" command that every developer in the repository can run with the same instructions. Where should it be defined?",
  opts:[
    "As a committed markdown file in the project's .claude/commands/ directory.",
    "In each developer's personal user-level Claude Code configuration folder.",
    "As a clearly headed section inside the repository's root CLAUDE.md file.",
    "As an MCP server exposing a security_review tool to every connected client."
  ],
  correct:[0],
  why:"Custom slash commands are markdown files under .claude/commands/. Committing them to the project makes the command available to everyone who clones the repository, with one definition to maintain.",
  wrong:{1:"Personal configuration is not shared, so each developer needs their own copy.",2:"CLAUDE.md supplies always-on context; it does not create an invocable command.",3:"Far heavier than needed, since there is no external system to integrate with."},
  doc:{t:"Claude Code docs \u2014 Slash commands",u:"https://docs.anthropic.com/en/docs/claude-code/slash-commands"} },

{ id:"D3-003", d:3, s:"Claude Code Operation", diff:2, type:"single", n:1,
  stem:"Which Claude Code capability is intended for running it non-interactively inside a CI pipeline?",
  opts:[
    "Plan mode, which produces a reviewable plan the pipeline can archive.",
    "The /resume command, which reattaches the pipeline to a prior session.",
    "Agent memory, which supplies the project context a pipeline job needs.",
    "Headless mode, invoked with the print flag to run a prompt to completion."
  ],
  correct:[3],
  why:"It runs a single prompt to completion and emits output suitable for scripting, which is what a CI job needs. Interactive features have no meaning where no terminal is attached.",
  wrong:{0:"Plan mode is an interactive approval workflow.",1:"/resume reopens a previous interactive session.",2:"Memory supplies context; it is not an execution mode."},
  doc:{t:"Claude Code docs \u2014 Headless mode",u:"https://docs.anthropic.com/en/docs/claude-code/sdk"} },

{ id:"D3-004", d:3, s:"Claude Code Operation", diff:2, type:"single", n:1,
  stem:"A long Claude Code session is approaching the context limit, but the developer wants to keep working on the same task. Which command is appropriate?",
  opts:[
    "/clear, which removes the accumulated conversation and starts clean.",
    "/compact, which summarises the session and continues with less context.",
    "/init, which regenerates the project memory file from the current repo.",
    "/model, which switches to a model offering a larger context window."
  ],
  correct:[1],
  why:"Compacting preserves task continuity while reducing the context. Clearing is right only when you are genuinely starting an unrelated task.",
  wrong:{0:"Clearing discards the task state the developer explicitly wants to keep.",2:"/init creates or refreshes CLAUDE.md and does nothing to context size.",3:"Switching models does not reduce accumulated conversation."},
  doc:{t:"Claude Code docs \u2014 Slash commands",u:"https://docs.anthropic.com/en/docs/claude-code/slash-commands"} },

{ id:"D3-005", d:3, s:"Claude Code Operation", diff:3, type:"single", n:1,
  stem:"A team notices Claude Code repeatedly using the wrong test command for their project. What is the most durable fix?",
  opts:[
    "Correct the command by hand at the start of each working session.",
    "Build an MCP server that exposes a run_tests tool with the right command.",
    "Record the canonical build and test commands in the project's CLAUDE.md.",
    "Move the team onto a more capable model tier with better repo inference."
  ],
  correct:[2],
  why:"Repeated corrections are exactly what project memory is for: the knowledge becomes persistent, shared through version control, and loaded in every session.",
  wrong:{0:"Unbounded repetition of the same correction, for every developer, forever.",1:"Disproportionate, since the assistant can already run commands.",3:"No model can guess a project-specific command it has never been told."},
  doc:{t:"Claude Code docs \u2014 Memory",u:"https://docs.anthropic.com/en/docs/claude-code/memory"} }

);
