# Agent Orchestration Playbook

> Repeatable AI agent workflows for common SDLC tasks

## Playbook 1: Feature Implementation

**Trigger:** Issue created with label `copilot-eligible`

| Step | Agent | Input | Output |
|------|-------|-------|--------|
| 1 | Planning Agent | Issue description + acceptance criteria | Task breakdown with file list |
| 2 | Code Agent | Task list + instruction pack + existing code | Implementation files |
| 3 | Test Agent | Implementation files + test patterns | Unit test files |
| 4 | Doc Agent | Implementation + API changes | Updated documentation |
| 5 | PR Agent | All generated files | Draft PR with AI disclosure |

**Validation gates:** Build → Test → Lint → Security → Human review

---

## Playbook 2: Migration Task (Legacy → Modern)

**Trigger:** Migration issue with metadata context attached

| Step | Agent | Input | Output |
|------|-------|-------|--------|
| 1 | Metadata Extraction | Source system metadata (schema, UI, rules) | Structured JSON context |
| 2 | Architecture Agent | Metadata context + target platform spec | Service/component design |
| 3 | Code Generation Agent | Architecture + instruction pack | Target platform code |
| 4 | Test Generation Agent | Generated code + business rules | Integration + unit tests |
| 5 | PR Agent | All artifacts | Draft PR with migration context |

**Validation gates:** Build → Test → Schema validation → Security → Human review

---

## Playbook 3: Refactoring

**Trigger:** Issue with label `refactor` + `copilot-eligible`

| Step | Agent | Input | Output |
|------|-------|-------|--------|
| 1 | Analysis Agent | Target file(s) + refactoring goal | Refactoring plan |
| 2 | Code Agent | Plan + SOLID principles instruction pack | Refactored code |
| 3 | Test Agent | Refactored code + existing tests | Updated test suite |
| 4 | PR Agent | Changes + before/after comparison | Draft PR |

**Validation gates:** All existing tests pass → Lint → No new warnings → Human review

---

## Playbook 4: Test Generation

**Trigger:** Issue with label `needs-tests`

| Step | Agent | Input | Output |
|------|-------|-------|--------|
| 1 | Analysis Agent | Source file(s) | Function signatures + edge cases |
| 2 | Test Agent | Analysis + testing instruction pack | Comprehensive test file(s) |
| 3 | Coverage Agent | Test results | Coverage delta report |
| 4 | PR Agent | Test files + coverage report | Draft PR |

**Validation gates:** Tests pass → Coverage ≥ 80% → Lint → Human review

---

## Playbook Governance Rules

1. Every playbook execution creates a **draft PR** (never auto-merged)
2. Agent works on `copilot/` branches only
3. All outputs pass the same CI gates as human code
4. PR template must document which playbook was used
5. Human reviewer validates output against acceptance criteria
6. Playbook usage is tracked for adoption metrics
