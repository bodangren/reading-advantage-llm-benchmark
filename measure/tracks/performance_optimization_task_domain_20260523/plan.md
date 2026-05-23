# Implementation Plan: Performance Optimization Task Domain

## Phase 1: Task Schema & Performance Domain Adapter
- [ ] Task: Extend task schema for performance domain
  - [ ] Write tests for performance task validation in `schemas.test.ts`
  - [ ] Add `performance` to the `TaskDomain` union in `schemas.ts`
  - [ ] Add performance-specific rubric fields (measurable improvement, metric documentation)
  - [ ] Verify schema migration doesn't break existing tasks

- [ ] Task: Create performance repo snapshot templates
  - [ ] Write tests for snapshot integrity validation
  - [ ] Snapshot A: N+1 query problem in Prisma/Drizzle API route
  - [ ] Snapshot B: Unmemoized React component causing excessive re-renders
  - [ ] Snapshot C: Missing HTTP cache headers in Express API
  - [ ] Snapshot D: Large un-split JavaScript bundle in Next.js app
  - [ ] Snapshot E: Memory leak in event listener or closure
  - [ ] Each snapshot includes a `benchmark.js` script with baseline/target metrics
  - [ ] Run `npm run validate:snapshots` and ensure all pass

## Phase 2: Task Definition & Harness Integration
- [ ] Task: Add performance tasks to catalog
  - [ ] Write tests for task catalog filtering by "Performance" domain
  - [ ] Create 5 task definitions in `data/tasks.json` with difficulty ratings
  - [ ] Add acceptance criteria rubrics with metric thresholds
  - [ ] Verify harness can execute at least one performance task end-to-end

- [ ] Task: Update scoring computation
  - [ ] Write tests for performance rubric scoring in `scoring.test.ts`
  - [ ] Add `measurableImprovement` and `metricDocumentation` sub-scores
  - [ ] Ensure total score still sums to 100
  - [ ] Validate scoring against a mock run

## Phase 3: UI & Documentation
- [ ] Task: Task catalog domain filter
  - [ ] Write tests for domain filter UI in `TaskCatalog.test.tsx`
  - [ ] Add "Performance" chip/filter to TaskCatalog and TaskListWithFilters
  - [ ] Verify mobile responsiveness

- [ ] Task: Documentation updates
  - [ ] Update `METHODODOLOGY.md` to list Performance as supported domain
  - [ ] Add performance task examples to README
  - [ ] Update `data/templates/task_templates.json` with Performance template

## Phase 4: Verification
- [ ] Task: Full test suite and build
  - [ ] Run `npm test` — all existing + new tests pass
  - [ ] Run `npm run build` — Next.js export succeeds
  - [ ] Run `npm run lint` — zero errors
  - [ ] Run harness validation on all 5 new tasks
  - [ ] Update `tech-debt.md` and `lessons-learned.md`
  - [ ] Commit and push
