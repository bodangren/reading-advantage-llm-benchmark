# Track: Security Audit & Hardening Task Domain

## Overview
Add security-focused brownfield tasks to the BLB catalog. Engineering teams regularly face vulnerability patches, dependency upgrades, auth hardening, and secret sanitization in production codebases. This track measures how well models handle security-sensitive modifications without breaking functionality.

## Goals
- Add 5–8 security audit tasks to the benchmark catalog
- Create repo snapshots with known vulnerabilities (OWASP Top 10 patterns), weak auth, exposed secrets, or outdated dependencies
- Adapt scoring to emphasize regression safety and correctness over speed
- Ensure tasks can run safely in the harness (no real exploit execution)

## Acceptance Criteria
- [ ] At least 5 security tasks added to `data/tasks.json` with repo snapshots and rubrics
- [ ] Repo snapshots cover: SQL injection fix, XSS sanitization, JWT auth hardening, dependency upgrade with breaking changes, secret rotation/cleanup
- [ ] Scoring rubric weights security correctness (40), regression safety (30), test coverage (15), minimality (10), documentation (5)
- [ ] All new tasks pass harness validation
- [ ] Task catalog UI supports "Security" domain filter
- [ ] Methodology page mentions security audit as an evaluation domain

## Non-Goals
- Penetration testing or active exploit development
- Real secret/key rotation (use dummy credentials in snapshots)
- Compliance framework mapping (SOC2, HIPAA, etc.)
