



# AI-Governed SDLC Demo

> **A complete reference implementation demonstrating AI-assisted software delivery with GitHub Copilot Agent Mode, governance controls, CI/CD validation, and security scanning.**

[![CI Security Pipeline](https://img.shields.io/badge/CI-Passing-brightgreen)]()
[![Copilot Governance](https://img.shields.io/badge/Copilot-Governed-blue)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]()

---

## What This Project Demonstrates

This is **not** a production application — it is a **reference architecture** showing how to operationalize GitHub Copilot and AI agents across the SDLC with enterprise-grade governance.

### Core Concepts

| Concept | Implementation |
|---------|---------------|
| **AI-Assisted Code Generation** | Copilot generates services, tests, and docs |
| **Governed PR Workflow** | PR templates capture AI usage and enforce review |
| **CI/CD Validation** | GitHub Actions run build, test, lint, security scan |
| **Security Controls** | Secret scanning, dependency audit, CodeQL-ready |
| **Agent Mode Ready** | Issue templates trigger Copilot agent workflows |
| **Custom Agents** | Specialized `.agent.md` profiles (migration, security) |
| **Agent Hooks** | Policy enforcement at execution time (secret scan, path restriction) |
| **Human-in-the-Loop** | CODEOWNERS + branch protection enforce approval |
| **Traceability** | Every AI commit is tagged with generation metadata |

---

## Architecture

```
Developer / Copilot Agent
        │
        ▼
┌─────────────────────┐
│   GitHub Issue       │  ← Agent Mode trigger
│   (from template)    │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│   Copilot Agent      │  ← Generates code + tests
│   (copilot/ branch)  │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│   Pull Request       │  ← AI Usage documented
│   (from PR template) │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│   CI Pipeline        │  ← Automated validation
│   ├─ Build           │
│   ├─ Unit Tests      │
│   ├─ Linting         │
│   ├─ Security Audit  │
│   └─ Coverage Check  │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│   CODEOWNERS Review  │  ← Human approval gate
│   + Branch Protection│
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│   Merge to main      │  ← Governed merge
└─────────────────────┘
```

---

## Project Structure

```
ai-governed-sdlc-demo/
│
├── src/                          # Application source code
│   ├── userService.js            # User management service
│   ├── orderService.js           # Order processing service
│   ├── validationMiddleware.js   # Input validation layer
│   └── index.js                  # Express API entry point
│
├── tests/                        # Test suite
│   ├── userService.test.js       # User service unit tests
│   ├── orderService.test.js      # Order service unit tests
│   └── validation.test.js        # Validation middleware tests
│
├── docs/                         # Governance documentation
│   ├── AI_USAGE_POLICY.md        # Acceptable AI usage guidelines
│   ├── GOVERNANCE_PLAYBOOK.md    # Full governance framework
│   ├── AGENT_PLAYBOOK.md         # Agent orchestration playbook
│   └── MEASUREMENT_FRAMEWORK.md  # Metrics and KPIs
│
├── scripts/                      # Automation scripts
│   └── ai-commit-check.sh        # Validates AI commit metadata
│
├── .github/
│   ├── workflows/
│   │   └── ci-security.yml       # CI pipeline (build+test+lint+security)
│   ├── agents/                    # Custom Copilot agents (NEW - Mar 2026)
│   │   ├── migration-planner.agent.md   # Migration specialist agent
│   │   └── security-reviewer.agent.md   # Security review agent
│   ├── hooks/                     # Agent hooks for policy enforcement (NEW)
│   │   ├── hooks.json             # Hook definitions
│   │   └── scripts/
│   │       ├── check-secrets.sh   # Post-write secret scanning
│   │       └── validate-file-access.sh  # Pre-write path restriction
│   ├── ISSUE_TEMPLATE/
│   │   ├── feature-request.yml   # Copilot agent-ready issue template
│   │   └── bug-report.yml        # Bug report template
│   ├── PULL_REQUEST_TEMPLATE.md  # PR template with AI disclosure
│   └── copilot-instructions.md   # Org-level Copilot instructions
│
├── CODEOWNERS                    # Mandatory reviewer assignments
├── .eslintrc.json                # Linting configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- A free GitHub account

### Local Setup

```bash
# Clone the repo
git clone https://github.com/<your-username>/ai-governed-sdlc-demo.git
cd ai-governed-sdlc-demo

# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint

# Run security audit
npm audit

# Start the API server
npm start
```

### Deploy to GitHub (Free Tier)

1. Create a new repository on GitHub (free account works)
2. Push this project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI-governed SDLC demo"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ai-governed-sdlc-demo.git
   git push -u origin main
   ```
3. GitHub Actions CI will run automatically on every PR
4. Enable branch protection on `main`:
   - Go to **Settings → Branches → Add rule**
   - Branch name pattern: `main`
   - Check: **Require a pull request before merging**
   - Check: **Require status checks to pass before merging**
   - Select: `build-test-security` as required check
   - Check: **Require review from Code Owners**

---

## How to Demo This in an Interview

### Step 1: Show the Repository Structure
> "This repo demonstrates a governed AI-assisted development workflow. Every component — from issue templates to CI pipelines to CODEOWNERS — is designed to ensure AI accelerates delivery without bypassing governance."

### Step 2: Show the CI Pipeline
> "Every pull request triggers automated validation: build, unit tests, linting, and security audit. AI-generated code passes the same gates as human code."

### Step 3: Show the PR Template
> "The PR template requires developers to disclose whether AI was used, document the prompt, and complete a security checklist. This creates traceability."

### Step 4: Show CODEOWNERS
> "Mandatory reviewers are assigned by file path. Security-sensitive files require security team approval. This enforces human-in-the-loop governance."

### Step 5: Show the Governance Docs
> "The docs/ folder contains the governance playbook, agent orchestration playbook, AI usage policy, and measurement framework — exactly what the role requires in the first 60–90 days."

### Key Statement
> "AI should accelerate the SDLC, not bypass it. This project proves that pattern."

---

## Interview-Ready Architecture

If asked "How would you implement AI agents in the SDLC?", reference this project:

| Layer | This Project's Implementation |
|-------|-------------------------------|
| **Trigger** | Issue templates designed for Copilot agent assignment |
| **Generation** | Copilot generates services + tests following instruction pack |
| **Control** | PR template, CODEOWNERS, branch protection |
| **Validation** | GitHub Actions CI: build → test → lint → security |
| **Approval** | Human reviewer required before merge |
| **Traceability** | AI usage documented in every PR |
| **Measurement** | Metrics framework in docs/ |

---

## License

MIT — free to use, modify, and present in interviews.
