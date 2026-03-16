# Measurement Framework

> Tracking AI-assisted SDLC adoption, productivity, and quality

## Key Metrics

### Productivity Metrics

| Metric | Definition | Target | Source |
|--------|-----------|--------|--------|
| PR cycle time | Time from PR open to merge | < 24 hours | GitHub API |
| PR throughput | PRs merged per sprint | +20% vs baseline | GitHub API |
| Time to first review | Time from PR open to first review | < 4 hours | GitHub API |
| Issue resolution time | Time from issue open to close | -15% vs baseline | GitHub API |

### Quality Metrics

| Metric | Definition | Target | Source |
|--------|-----------|--------|--------|
| Test coverage | % of code covered by tests | ≥ 80% | Jest coverage |
| Defect escape rate | Bugs found in production / total changes | < 5% | Bug tracker |
| Rework rate | PRs requiring > 2 review cycles | < 15% | GitHub API |
| Security findings | Critical/high vulnerabilities per sprint | Zero | npm audit + CodeQL |

### Adoption Metrics

| Metric | Definition | Target | Source |
|--------|-----------|--------|--------|
| AI-assisted PR ratio | % of PRs using AI tools | > 60% | PR template data |
| Agent playbook usage | # of agent-triggered workflows per sprint | Growing trend | Issue labels |
| Instruction pack adherence | % of AI PRs using approved prompts | > 80% | PR review data |
| Team enablement completion | % of team members trained | 100% in 90 days | Training tracker |

### Governance Metrics

| Metric | Definition | Target | Source |
|--------|-----------|--------|--------|
| AI disclosure compliance | % of AI PRs with completed disclosure | 100% | PR template audit |
| CI gate pass rate | % of PRs passing all gates on first try | > 85% | GitHub Actions |
| CODEOWNERS compliance | % of PRs with required reviewer approval | 100% | GitHub settings |
| Policy violation rate | # of governance violations per month | Zero | Audit log |

---

## Measurement Cadence

| Frequency | Activity |
|-----------|----------|
| Weekly | Review PR throughput and cycle time |
| Bi-weekly | Sprint retrospective with AI adoption data |
| Monthly | Full metrics dashboard review with leadership |
| Quarterly | ROI assessment and governance policy update |

## Baseline Methodology

1. Measure 4 weeks of pre-AI metrics (PR cycle time, throughput, defect rate)
2. Enable Copilot with governance controls
3. Measure same metrics for 4 weeks post-enablement
4. Calculate delta and report improvement

## Dashboard Recommendations

Build a GitHub Actions-powered metrics dashboard tracking:
- PR volume (AI-assisted vs human-only)
- Average merge time trend
- Test coverage trend
- Security finding trend
- Agent playbook utilization
