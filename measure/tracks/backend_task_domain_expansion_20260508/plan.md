# Plan: Backend/API Task Domain Expansion

## Phase 1: Task Definition (TDD)
- [x] Write tests for BackendTask schema validation
- [x] Define 5 backend task specs with acceptance criteria and repo snapshots
- [x] Create scoring rubric for backend tasks (type safety 25%, tests 25%, integration 25%, regression 25%)

## Phase 2: Repo Snapshots (TDD)
- [x] Prepare 5 repo snapshots with existing backend code (Node/Go/Python)
- [x] Write tests for snapshot loading and integrity
- [ ] Verify each snapshot has working tests before task is applied

## Phase 3: Harness Adaptation (TDD)
- [x] Write tests for backend-specific verification (typecheck, unit test, integration test)
- [x] Extend harness to run backend verification steps
- [x] Update scoring logic to use backend rubric when task.domain === 'backend'

## Phase 4: UI Updates (TDD)
- [ ] Write tests for domain badge and filter in TaskCatalog
- [ ] Add domain filter to task list
- [ ] Update run detail page to show backend-specific score breakdown

## Phase 5: Integration & Verification
- [ ] Run pilot benchmark with one model on all 5 backend tasks
- [ ] Validate scoring and leaderboard behavior
- [ ] Update tracks.md and commit
