# Q&A Preparation Document
## Spec-Driven Development Showcase — Associate Director Session
### Anticipated Questions with Prepared Answers

---

## Q1: "How reliable is AI-generated code? Can we trust it in production?"

**Short Answer:** As reliable as the specification you provide. The code in this project follows every best practice a senior Angular engineer would apply — and the evidence is 44 green tests and zero runtime exceptions during validation.

**Full Answer:**
> "Reliability comes from the specification, not the generator. When the spec says 'all localStorage reads must be wrapped in try/catch' — the AI implements that on every storage call, every time. When it says 'widget failures must not cascade' — the AI adds error boundaries on every component. Human developers under deadline pressure skip these things. The AI doesn't.
>
> In this project: 44/44 automated tests pass. The weather widget has been tested with geolocation denied, network offline, corrupted localStorage, and city-not-found scenarios — all per the specification. The code was audited for debug logs, unused imports, and accessibility labels before the final commit.
>
> That said — AI-generated code still benefits from a human code review. The difference is that review takes hours, not weeks, because the structure and intent are already documented in the spec."

**Supporting Evidence:** `tasks.md` T058–T065 (Polish phase) — 8 quality audit tasks run after implementation.

---

## Q2: "What about security concerns? Can we use this for client projects?"

**Short Answer:** This project has zero security vulnerabilities because it has zero backend, no authentication, and no sensitive data. For enterprise projects with those concerns, the constitution is where you encode security requirements.

**Full Answer:**
> "Security in AI-generated code is governed by what the specification requires. In this project, the constitution's Simplicity principle meant no backend, no authentication, and no personally identifiable data — so the attack surface is essentially zero. The only external calls are to a free, no-auth weather API over HTTPS.
>
> For enterprise projects with real security requirements — SQL injection prevention, OWASP Top 10 compliance, auth token handling, input sanitisation — you add those as explicit rules in the project constitution. The AI will then apply those rules on every generated file, just as it applied accessibility rules and error-handling rules in this project.
>
> Your organization's existing security review process still applies. The difference is: instead of reviewing undocumented code from a developer, you review code where every security requirement is traceable to a specific item in the spec and verified by a test."

---

## Q3: "Can this work for enterprise-scale applications? This is just a small dashboard."

**Short Answer:** Yes — with incremental adoption. The framework scales by composing multiple Spec-Driven features, not by doing everything at once.

**Full Answer:**
> "This project is deliberately a small, clean demonstration — one feature, one spec, 65 tasks. Enterprise applications have hundreds of features. But Spec-Driven Development is designed for exactly that: you write one spec per feature, generate one set of tasks, and implement incrementally. A large application is 20 dashboards like this one, each with its own spec and constitution compliance check.
>
> The framework has been used for full-stack .NET APIs, React micro-frontends, and Node.js services — not just Angular SPAs. The constitution, spec, and task templates are technology-agnostic. You fill in the tech stack in the planning step and everything downstream adjusts.
>
> The honest limitation: for legacy modernisation of a 15-year-old monolith, the framework works best on the greenfield modules being extracted, not on the legacy core. That's a constraint to be transparent about when scoping pilots."

---

## Q4: "What are the limitations? What can't this do?"

**Short Answer:** The AI cannot replace domain expertise in ambiguous requirements, cannot navigate undocumented legacy codebases effectively, and cannot make business judgement calls about trade-offs.

**Full Answer:**
> "Four honest limitations:
>
> **1. Garbage In, Garbage Out.** If the specification is vague, the generated code will be mediocre. This is why the Clarification step (Step 3) is mandatory — the AI asks up to 5 targeted questions to resolve ambiguity before writing a single line. A strong spec produces strong code. A weak spec produces rework.
>
> **2. Legacy Code Integration.** The framework is optimised for greenfield work. Integrating AI-generated code into a 15-year-old COBOL or classic ASP.NET application requires a human engineer to handle the connective tissue.
>
> **3. Creative Architecture for Novel Problems.** For genuinely novel technical problems — first-of-kind distributed systems, cutting-edge ML pipelines — you still need a senior architect to make the initial design decisions. The AI executes well-defined solutions; it doesn't invent new patterns.
>
> **4. Test Infrastructure Complexity.** In this project, Angular TestBed + zone.js had configuration conflicts with Vitest that required manual resolution. For complex test setups, a developer needs to configure the environment before the AI can generate tests reliably."

---

## Q5: "How does this affect developer roles? Are we replacing developers?"

**Short Answer:** No. This elevates developer roles from typists to architects. Developers go from writing boilerplate to writing specifications and reviewing AI output.

**Full Answer:**
> "Think of it this way: when CAD software was introduced to engineering, draftsmen weren't made redundant — they became more productive and focused on design rather than drawing lines. The same is true here.
>
> In the Spec-Driven model, developers do higher-value work:
> - **Writing specifications** — requires deep domain knowledge and business understanding
> - **Reviewing generated code** — requires engineering judgement about what's correct
> - **Maintaining the constitution** — requires architectural thinking about governance
> - **Handling edge cases** — requires experience to spot what the AI missed
>
> The role that does diminish: writing boilerplate TypeScript interfaces, HTML templates, and CSS animations from scratch. That work was never a high-value use of a senior developer's time.
>
> For our organization: this means junior developers can start contributing on day one by running specs, while senior developers focus on architecture and specification quality. The pyramid structure shifts — we need more senior architects, fewer mid-level boilerplate writers."

---

## Q6: "What's the learning curve? How long does it take a team to adopt this?"

**Short Answer:** A developer familiar with their tech stack can run their first Spec-Driven project within one day of introduction. Full fluency takes 2–3 projects.

**Full Answer:**
> "The learning curve is in writing good specifications, not in using the tools. The tools are a structured set of prompts and markdown templates — there's nothing to install beyond a Claude Code licence.
>
> **Day 1:** Developer understands the 7-step workflow and the constitution template. Runs their first small spec.
> **Project 1:** Developer discovers what 'good clarification' looks like — learns to ask better questions in Step 3.
> **Project 2–3:** Developer develops fluency in constitution design — knows which principles to include for their project type.
>
> For the team: I'd run a 2-hour workshop, then pair with each developer on their first spec. By their third project, they're fully independent.
>
> The harder learning curve is cultural: developers who pride themselves on writing elegant code need to shift their pride to writing elegant specifications. That's a mindset shift, not a skill gap."

---

## Q7: "How do we maintain and update AI-generated code over time?"

**Short Answer:** Exactly the same way you maintain human-written code. The AI output is standard Angular/TypeScript — any developer who knows Angular can read, modify, and extend it.

**Full Answer:**
> "The output of Spec-Driven Development is plain code. There is no magic wrapper, no proprietary runtime, no AI dependency in the deployed application. Once the code is generated and committed, it lives in your repository like any other code.
>
> For updates: you update the specification first. Add the new requirement as a user story, run through planning and task generation, and the AI generates delta tasks — 'add this endpoint', 'update this component' — that a developer implements. The audit trail is preserved: every change has a spec entry that justifies it.
>
> For bug fixes: exactly as normal. Open the file, read the code (it's clean, well-structured, commented at non-obvious points), fix the bug, run the tests. The code is not obfuscated or alien — it follows the same patterns a senior developer would use.
>
> The spec documents serve as living architecture documentation. Future maintainers can read `plan.md` and `data-model.md` to understand the system without reverse-engineering the code."

---

## Q8: "What happens when requirements change mid-project?"

**Short Answer:** Update the spec, re-run planning, generate new tasks. The constitution prevents scope creep by requiring each change to be justified against the governance principles.

**Full Answer:**
> "Requirement changes are handled at the specification level, not the code level. The process:
>
> 1. Update the relevant user story or functional requirement in `spec.md`
> 2. If it's a new feature: add a new user story
> 3. Re-run the planning step — the AI updates the architecture/data model if affected
> 4. Re-run the task generation — AI produces new tasks or modifies existing ones
> 5. Implement the new/changed tasks
>
> The constitution actually helps here: the Timebox & Validate principle says 'if a design decision cannot be resolved in the timebox, choose the simpler fallback.' This prevents the death-spiral of never-ending scope discussions. The framework imposes discipline that traditional development often lacks.
>
> Importantly: the spec is version-controlled. You can see exactly what changed, when, and why — providing the audit trail that delivery governance requires."

---

## Q9: "Can this integrate with existing processes — MyWizard, Delivery Excellence, JIRA?"

**Short Answer:** Yes, immediately. The spec artifacts map directly to JIRA user stories and standard delivery frameworks. The `/speckit.taskstoissues` command converts tasks directly to GitHub/JIRA issues.

**Full Answer:**
> "Integration points:
>
> **JIRA:** The user stories in `spec.md` are JIRA-ready. Each story has a priority (P1–P4), acceptance criteria, and independent test criteria. The task list maps to JIRA sub-tasks. A SpecKit command (`/speckit.taskstoissues`) exists specifically to generate JIRA issues from the task list automatically.
>
> **Delivery Excellence / GQP:** The specification artifacts ARE the design documentation that Delivery Excellence requires. `spec.md` = functional specification. `plan.md` = technical design document. `data-model.md` = data architecture document. `tasks.md` = work breakdown structure. These are not additional overhead — they're the same documents, generated automatically.
>
> **MyWizard:** MyWizard's AI capabilities and Spec-Driven Development are complementary. MyWizard handles project tracking and predictions; Spec-Driven Development handles code generation. They consume the same JIRA data.
>
> **Client Governance:** For client-facing deliverables, the spec can be formatted as a Statement of Work annex. The constitution becomes the agreed development standards document. Clients can review and sign off at the specification stage — before any code is written."

---

## Q10: "What are the licensing and cost implications? Are there legal risks with AI-generated code?"

**Short Answer:** Claude Code is ~$20/month per developer. AI-generated code has the same IP status as human-written code when directed by a human specification — Anthropic's terms grant full rights to output.

**Full Answer:**
> "Cost:
> - Claude Code (Claude API) subscription: ~$20/month per developer (Pro plan)
> - For a 5-developer pilot: ~$100/month = $1,200/year
> - ROI against the first project saved: $46,000+ per project
>
> Licensing:
> - Anthropic's usage policy grants you full ownership of the code generated using their tools. You can use it commercially, at clients, in proprietary products.
> - The code this tool generates is plain TypeScript/Angular/CSS — open-standard languages with no proprietary runtime.
>
> Legal risk:
> - The primary legal question is copyright in training data — not in the output. Anthropic has addressed this in their terms: outputs are owned by the user.
> - Your legal team should review the Anthropic commercial terms before broad rollout — standard practice for any new tooling vendor.
> - For highly regulated client environments (BFSI, government), include a clause in the constitution requiring all external API calls to be from organization-approved services — same governance as human-written code.
>
> Procurement path: Claude Code is available on the Anthropic website. For enterprise volume licensing, Anthropic offers an enterprise agreement. This should go through your organization's standard software procurement process."

---

## BONUS Q: "This is impressive, but what would YOU have done in 4 days without this tool?"

**Answer (honest, confident):**
> "With 16 years of experience and 8 years in Angular specifically, I could have delivered the core functionality — the three widgets — in 4 days manually. But 'delivered' would mean minimal tests, probably no skeleton loaders, possibly no offline fallback, and certainly no formal spec documentation.
>
> With Spec-Driven Development, in those same 4 days I got: a governance constitution, a formal specification, an architectural plan with constitution compliance checks, a data model document, 65 tracked tasks, 1,923 lines of clean code, 44 automated tests, WCAG accessibility compliance, and a structured audit trail.
>
> The AI didn't just write the code. It enforced a level of discipline and documentation that would have taken me 3–4 additional weeks to produce manually — if I ever produced it at all under normal project pressure.
>
> That's the real value. Not that AI replaces me. It's that AI lets me deliver at the quality standard I always aspired to — without compromising on time."

---

*Q&A Preparation · Spec-Driven Development Showcase · February 2026*
*Presenter: Application Development Associate Manager · 16 Years IT Experience*
