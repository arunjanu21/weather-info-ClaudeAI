<!--
SYNC IMPACT REPORT
==================
Version change: N/A (initial) → 1.0.0
Bump rationale: MINOR — First adoption; all principles are new.

Modified principles: N/A (initial constitution)

Added sections:
  - Core Principles (5 principles: Prototype-First, Simplicity Over Completeness,
    Incremental Delivery, Smoke Testing Only, Timebox & Validate)
  - Prototype Lifecycle
  - Development Workflow
  - Governance

Removed sections: N/A

Templates reviewed & status:
  ✅ .specify/templates/plan-template.md
       Constitution Check section is compatible; gates reference principle names
       defined here. No structural changes required.
  ✅ .specify/templates/spec-template.md
       User-story-first approach and MVP framing align with Incremental Delivery
       principle. No structural changes required.
  ✅ .specify/templates/tasks-template.md
       Phase structure (Setup → Foundational → User Stories → Polish) aligns with
       Incremental Delivery and Smoke Testing Only principles. No changes required.

Follow-up TODOs:
  - None. All placeholders resolved.
-->

# Weather Info Constitution

## Core Principles

### I. Prototype-First

Every feature MUST begin as the simplest possible working prototype that can be
demonstrated to a stakeholder. Prototypes MUST be runnable and produce observable
output before any hardening, refactoring, or documentation begins.

**Rules:**
- Initial implementation MUST be completable within a single working session.
- No architectural patterns (repositories, factories, event buses) MAY be introduced
  until the prototype has been validated by an actual run or demo.
- Hardening (error handling, edge cases, performance tuning) MUST be deferred to a
  dedicated follow-up phase, never mixed into the prototype phase.

**Rationale:** Unvalidated features waste effort. Running code surfaces real problems
faster than any upfront design exercise.

### II. Simplicity Over Completeness

The implementation that minimizes lines of code while satisfying the current user
scenario MUST be chosen over any more complete but heavier alternative.

**Rules:**
- YAGNI (You Aren't Gonna Need It) is non-negotiable: no feature, abstraction, or
  configuration option MAY be added for hypothetical future requirements.
- A helper, utility, or wrapper MUST NOT be created if it is used in fewer than three
  distinct call sites within the same feature.
- Inline logic is preferred over a named function when the logic is under 5 lines and
  called once.

**Rationale:** Premature abstractions increase cognitive load and slow iteration.
Complexity added today becomes a maintenance tax tomorrow.

### III. Incremental Delivery

Features MUST be broken into independently demonstrable slices ordered by user value.
Each slice MUST be deployable and verifiable in isolation before the next slice begins.

**Rules:**
- Every task list MUST identify a P1 slice that constitutes a runnable MVP.
- Implementation MUST NOT proceed to a lower-priority slice until the higher-priority
  slice passes its smoke test.
- Each slice MUST produce a visible artefact (running endpoint, rendered UI, CLI
  output, or printed result) that can be shown to a non-technical stakeholder.

**Rationale:** Delivering working increments early allows course correction before
significant effort is sunk in the wrong direction.

### IV. Smoke Testing Only

At prototype stage, automated tests MUST cover the primary happy path and at most one
critical failure path per user story. Comprehensive test coverage is explicitly
deferred until the prototype is promoted to production-ready.

**Rules:**
- Tests MUST be written only for paths exercised during a live demo or critical
  failure scenarios (e.g., missing API key, network timeout).
- Test file count MUST NOT exceed the number of user stories at prototype stage.
- Full coverage targets, mutation testing, and contract test suites MUST be scheduled
  as separate hardening tasks, never blocking prototype completion.

**Rationale:** Over-testing unvalidated code locks in the wrong behaviour. Smoke tests
provide a safety net without slowing the feedback loop.

### V. Timebox & Validate

Every implementation phase MUST be timeboxed. If a design decision cannot be resolved
within the timebox, the simpler fallback MUST be chosen unconditionally.

**Rules:**
- Each user story implementation MUST be assigned an explicit timebox before starting.
- If the chosen approach has not produced running code by 50% of the timebox,
  implementation MUST pivot to the next simpler alternative.
- Validation (running the code, viewing output, or conducting a brief stakeholder
  demo) MUST occur at the end of every phase before the next phase begins.

**Rationale:** Timeboxes prevent analysis paralysis and ensure momentum. Validation
gates prevent wasted effort from accumulating across phases.

## Prototype Lifecycle

A feature progresses through four explicit stages. Promotion between stages MUST be
a deliberate decision, not an organic drift.

| Stage | Definition | Exit Criteria |
|-------|-----------|---------------|
| **Sketch** | Spec and plan written; no code | Plan approved, user stories prioritised |
| **Prototype** | Simplest running code; smoke tests only | P1 slice demonstrates via CLI/UI/output |
| **Hardened** | Error handling, edge cases, full tests added | All acceptance scenarios pass |
| **Production** | Performance, observability, docs complete | Deployment checklist passed |

Constitution principles **I–V** apply most strictly to the Prototype stage. Later
stages MAY introduce additional complexity, but MUST justify each addition against
Principle II.

## Development Workflow

**Speed standards** for prototype-stage work:

- A new feature MUST reach runnable prototype within **1 working day** of spec
  approval.
- A P1 user story demo MUST be achievable within the first **2 hours** of coding.
- Any external dependency (API, database, third-party SDK) MUST have a local stub or
  mock ready before the prototype phase begins, so network or service availability
  never blocks demonstration.

**Quality gates** (prototype stage):

1. Code runs without crashing on the happy path.
2. P1 user story produces observable output matching the acceptance scenario.
3. At least one smoke test exists and passes.
4. No TODO comments reference hardening work that was silently skipped.

## Governance

This constitution supersedes all other development practices and guidelines for the
Weather Info project. When a conflict exists between a team convention and a principle
defined here, this constitution takes precedence.

**Amendment procedure:**

1. Propose the change as a pull request modifying this file.
2. State which principle is being added, changed, or removed and why.
3. Increment the version following semantic rules defined below.
4. Update all dependent templates listed in the Sync Impact Report header.
5. Merge only after at least one team member reviews and approves.

**Versioning policy:**

- **MAJOR**: A principle is removed or its non-negotiable rules are fundamentally
  redefined in a backward-incompatible way.
- **MINOR**: A new principle or section is added, or existing guidance is materially
  expanded.
- **PATCH**: Clarifications, rewording, typo fixes, or non-semantic refinements.

**Compliance review:**

All pull requests and planning sessions MUST verify compliance with the Constitution
Check section of `plan.md`. Complexity violations MUST be justified in the
Complexity Tracking table before merging.

**Version**: 1.0.0 | **Ratified**: 2026-02-16 | **Last Amended**: 2026-02-16
