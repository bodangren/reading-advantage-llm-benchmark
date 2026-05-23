# Implementation Plan: Security Audit & Hardening Task Domain

## Phase 1: Task Schema & Security Domain Adapter
- [ ] Task: Extend task schema for security domain
  - [ ] Write tests for security task validation in `schemas.test.ts`
  - [ ] Add `security` to the `TaskDomain` union in `schemas.ts`
  - [ ] Add security-specific rubric fields (vulnerability coverage, test preservation)
  - [ ] Verify schema migration doesn't break existing tasks

- [ ] Task: Create security repo snapshot templates
  - [ ] Write tests for snapshot integrity validation
  - [ ] Snapshot A: SQL injection in Express route with existing tests
  - [ ] Snapshot B: XSS vulnerability in React component
  - [ ] Snapshot C: Weak JWT secret and missing expiration in auth middleware
  - [ ] Snapshot D: Outdated dependency with known CVE (use mock package)
  - [ ] Snapshot E: Hardcoded secrets in source code and env files
  - [ ] Run `npm run validate:snapshots` and ensure all pass

## Phase 2: Task Definition & Harness Integration
- [ ] Task: Add security tasks to catalog
  - [ ] Write tests for task catalog filtering by "Security" domain
  - [ ] Create 5 task definitions in `data/tasks.json` with difficulty ratings
  - [ ] Add acceptance criteria rubrics emphasizing safety over speed
  - [ ] Verify harness can execute at least one security task end-to-end

- [ ] Task: Update scoring computation
  - [ ] Write tests for security rubric scoring in `scoring.test.ts`
  - [ ] Add `vulnerabilityCoverage` and `testPreservation` sub-scores
  - [ ] Ensure total score still sums to 100
  - [ ] Validate scoring against a mock run

## Phase 3: UI & Documentation
- [ ] Task: Task catalog domain filter
  - [ ] Write tests for domain filter UI in `TaskCatalog.test.tsx`
  - [ ] Add "Security" chip/filter to TaskCatalog and TaskListWithFilters
  - [ ] Verify mobile responsiveness

- [ ] Task: Documentation updates
  - [ ] Update `METHODODOLOGY.md` to list Security as supported domain
  - [ ] Add security task examples to README
  - [ ] Update `data/templates/task_templates.json` with Security template

## Phase 4: Verification
- [ ] Task: Full test suite and build
  - [ ] Run `npm test` — all existing + new tests pass
  - [ ] Run `npm run build` — Next.js export succeeds
  - [ ] Run `npm run lint` — zero errors
  - [ ] Run harness validation on all 5 new tasks
  - [ ] Update `tech-debt.md` and `lessons-learned.md`
  - [ ] Commit and push
