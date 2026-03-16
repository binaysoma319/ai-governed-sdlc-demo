# AI Usage Policy

> Version 1.0 | Effective: March 2026

## Purpose

This policy defines acceptable and restricted uses of AI tools (GitHub Copilot, Copilot Agent Mode) within our development organization. The goal is to accelerate delivery while maintaining security, quality, and governance standards.

---

## Acceptable Uses

| Use Case | Tool | Governance |
|----------|------|-----------|
| Code generation (services, APIs, utilities) | Copilot / Agent Mode | PR review required |
| Unit test generation | Copilot / Agent Mode | Coverage threshold enforced |
| Code refactoring | Copilot | Human review of changes |
| Documentation generation | Copilot | Accuracy review required |
| Infrastructure as Code (Terraform, Bicep) | Copilot | Security scan required |
| CI/CD pipeline creation | Copilot | DevOps team review |
| Bug fix suggestions | Copilot | Developer validates fix |

## Restricted Uses

| Activity | Reason |
|----------|--------|
| Generating code with production secrets | Data exposure risk |
| Using production data in prompts | PII / compliance violation |
| AI self-approving or merging PRs | Governance bypass |
| Disabling security checks for AI code | Security risk |
| Using AI for access control decisions | Safety-critical scope |
| Generating cryptographic implementations | Requires expert review |

## Security Controls

1. **Secret scanning** — GitHub secret scanning enabled on all repos
2. **Dependency scanning** — `npm audit` runs on every PR
3. **Static analysis** — ESLint with security rules enforced
4. **CodeQL** — Enable for production repos (GitHub Advanced Security)
5. **PR approval** — Minimum 1 reviewer, CODEOWNERS enforced
6. **Branch protection** — Direct pushes to `main` blocked

## AI Traceability Requirements

Every AI-generated or AI-assisted contribution must include:

- **PR template disclosure** — Was AI used? What tool? What prompt?
- **File header metadata** — `Generated with: GitHub Copilot (AI-assisted)`
- **Commit message tag** — Include `[ai-assisted]` in commit messages for AI-generated code

## Prompt Handling

- Never include production credentials in prompts
- Never include customer PII in prompts
- Use approved instruction packs for standardized context
- Document non-standard prompts in the PR description

## Violation Response

Violations of this policy are handled through:
1. Automated detection (CI pipeline blocks)
2. PR review catch (human reviewer flags)
3. Retroactive audit (periodic compliance review)
4. Remediation (fix and document root cause)
