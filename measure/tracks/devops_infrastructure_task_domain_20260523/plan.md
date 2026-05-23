# Implementation Plan: DevOps & Infrastructure Task Domain Expansion

## Phase 1: Task Schema & Domain Adapter
- [ ] Task: Extend task schema for DevOps domain
  - [ ] Write tests for DevOps task validation in `schemas.test.ts`
  - [ ] Add `devops` to the `TaskDomain` union in `schemas.ts`
  - [ ] Add DevOps-specific rubric fields (rollback awareness, idempotency check)
  - [ ] Verify schema migration doesn't break existing tasks

- [ ] Task: Create DevOps repo snapshot templates
  - [ ] Write tests for snapshot integrity validation
  - [ ] Snapshot A: Broken GitHub Actions workflow (failing tests, missing env)
  - [ ] Snapshot B: Missing Dockerfile for existing Node.js app
  - [ ] Snapshot C: Incomplete docker-compose with service wiring bugs
  - [ ] Snapshot D: Terraform module with missing resource dependencies
  - [ ] Snapshot E: CI/CD pipeline with insecure secret handling
  - [ ] Run `npm run validate:snapshots` and ensure all pass

## Phase 2: Task Definition & Harness Integration
- [ ] Task: Add DevOps tasks to catalog
  - [ ] Write tests for task catalog filtering by "DevOps" domain
  - [ ] Create 5 task definitions in `data/tasks.json` with difficulty ratings
  - [ ] Add acceptance criteria rubrics adapted for infrastructure safety
  - [ ] Verify harness can execute at least one DevOps task end-to-end

- [ ] Task: Update scoring computation
  - [ ] Write tests for DevOps rubric scoring in `scoring.test.ts`
  - [ ] Add `rollbackAwareness` and `idempotency` sub-scores
  - [ ] Ensure total score still sums to 100
  - [ ] Validate scoring against a mock run

## Phase 3: UI & Documentation
- [ ] Task: Task catalog domain filter
  - [ ] Write tests for domain filter UI in `TaskCatalog.test.tsx`
  - [ ] Add "DevOps" chip/filter to TaskCatalog and TaskListWithFilters
  - [ ] Verify mobile responsiveness

- [ ] Task: Documentation updates
  - [ ] Update `METHODODOLOGY.md` to list DevOps as supported domain
  - [ ] Add DevOps task examples to README
  - [ ] Update `data/templates/task_templates.json` with DevOps template

## Phase 4: Verification
- [ ] Task: Full test suite and build
  - [ ] Run `npm test` — all existing + new tests pass
  - [ ] Run `npm run build` — Next.js export succeeds
  - [ ] Run `npm run lint` — zero errors
  - [ ] Run harness validation on all 5 new tasks
  - [ ] Update `tech-debt.md` and `lessons-learned.md`
  - [ ] Commit and push
