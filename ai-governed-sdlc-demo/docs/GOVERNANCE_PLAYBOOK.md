# Governance Playbook

> AI-Assisted SDLC Governance Framework

## Five Pillars of AI Governance

### 1. Permissions to Trigger
- Only approved team members can assign issues to Copilot agent
- Repository-level permissions control who can trigger agent workflows
- Admin approval required to enable agent mode on new repositories

### 2. Constrained Execution
- Copilot coding agent operates on `copilot/` branches only
- Agent runs in ephemeral environments with no production access
- Agent cannot modify CI/CD pipeline definitions
- Agent cannot access secrets or environment variables directly

### 3. Required Validation
Every AI-generated PR must pass these gates before review:

| Gate | Tool | Threshold |
|------|------|-----------|
| Unit tests | Jest | All passing |
| Code coverage | Jest + Istanbul | ≥ 70% |
| Linting | ESLint | Zero warnings |
| Dependency audit | npm audit | No moderate+ vulnerabilities |
| Secret scanning | GitHub / grep patterns | No matches |
| AI traceability | PR template check | Disclosure completed |

### 4. Independent Review
- AI-generated PRs are created as **draft PRs**
- Minimum 1 human reviewer required (2 for security-sensitive files)
- CODEOWNERS assigns domain-specific reviewers automatically
- Reviewer must verify: correctness, security, test adequacy, AI disclosure

### 5. Measurable Outcomes
Track these metrics monthly:

| Metric | Target | Source |
|--------|--------|--------|
| PR cycle time | < 24 hours | GitHub metrics |
| PR throughput | +20% over baseline | GitHub metrics |
| Test coverage | ≥ 80% | Jest coverage reports |
| Defect escape rate | < 5% | Bug tracking |
| Security findings | Zero critical | npm audit + CodeQL |
| AI adoption rate | > 60% of eligible tasks | PR template data |

---

## PR Review Checklist for AI-Generated Code

When reviewing an AI-generated PR, verify:

- [ ] AI usage is properly disclosed in the PR template
- [ ] Generated code follows project coding standards
- [ ] No hardcoded secrets, tokens, or credentials
- [ ] Input validation is present for all user inputs
- [ ] Error handling is appropriate (no stack traces exposed)
- [ ] Unit tests cover both success and failure paths
- [ ] Dependencies are from trusted sources
- [ ] No unnecessary permissions or access patterns
- [ ] Documentation is accurate and complete
- [ ] Code does not duplicate existing functionality

---

## Branch Protection Configuration

Apply these settings to the `main` branch:

```
Require pull request before merging: ✓
  Required approving reviews: 1
  Require review from Code Owners: ✓
  Dismiss stale reviews: ✓

Require status checks to pass: ✓
  Required checks: build-test-security
  Require branches to be up to date: ✓

Require conversation resolution: ✓
Do not allow bypassing: ✓
Block force pushes: ✓
```
