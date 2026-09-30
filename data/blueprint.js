/* CCDV-F blueprint - Anthropic Exam Guide v1.0 (July 2026)
   Source: anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification */
window.CCDV_BLUEPRINT = {
  code: "CCDV-F",
  name: "Claude Certified Developer \u2013 Foundations",
  examQuestions: 53,
  examMinutes: 120,
  passScaled: 720,
  scaleMin: 100,
  scaleMax: 1000,
  // 720 on a 100-1000 scale => (720-100)/900 = 0.689 raw
  passRaw: 0.689,
  domains: [
    { id: 1, name: "Agents and Workflows",            weight: 14.7, bank: 26, exam: 8,
      subskills: ["Agent Architecture", "Agent Construction with Claude", "Agent Patterns and Frameworks"] },
    { id: 2, name: "Applications and Integration",    weight: 33.1, bank: 59, exam: 18,
      subskills: ["Understanding Requirements", "Systems Life Cycle", "Claude API Mechanics",
                  "Software Engineering Foundations", "Claude Application Design", "Configuration Management"] },
    { id: 3, name: "Claude Code",                     weight: 3.1,  bank: 6,  exam: 2,
      subskills: ["Claude Code Operation"] },
    { id: 4, name: "Eval, Testing, and Debugging",    weight: 2.6,  bank: 5,  exam: 1,
      subskills: ["Debugging and Error Handling"] },
    { id: 5, name: "Model Selection and Optimization", weight: 16.8, bank: 30, exam: 9,
      subskills: ["LLM Fundamentals", "Technical Fundamentals", "Model Selection and Trade-offs",
                  "Cost and Token Management"] },
    { id: 6, name: "Prompt and Context Engineering",  weight: 11.0, bank: 20, exam: 6,
      subskills: ["Context Engineering", "Prompt Engineering", "Output Handling"] },
    { id: 7, name: "Security and Safety",             weight: 8.1,  bank: 15, exam: 4,
      subskills: ["AI Application Security", "Guardrails and Safe Deployment", "Claude Hooks",
                  "Identity, Secrets, and Key Management"] },
    { id: 8, name: "Tools and MCPs",                  weight: 10.6, bank: 19, exam: 5,
      subskills: ["Tool Implementation", "MCP Server Development", "Agentic Customisation"] }
  ]
};
