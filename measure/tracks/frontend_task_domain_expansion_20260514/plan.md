# Plan: Frontend/UI Task Domain Expansion

## Phase 1: Task Definition and Schema
- [ ] Write schema validation tests for FrontendTask type
- [ ] Define frontend-specific rubric criteria (visual match, a11y pass, responsive breakpoint behavior)
- [ ] Create 3 React component integration tasks (add feature to existing page, refactor class→hooks, fix prop drilling)
- [ ] Create 2 CSS/styling tasks (Tailwind migration, responsive breakpoint fix)
- [ ] Create 2 accessibility tasks (ARIA fixes, keyboard navigation)

## Phase 2: Repo Snapshots
- [ ] Create 3 frontend repo snapshots (Next.js + Tailwind, React + Vite, React Native brownfield)
- [ ] Write integrity tests for each snapshot
- [ ] Ensure snapshots build and test cleanly before benchmarking

## Phase 3: Harness Adaptation
- [ ] Write tests for frontend domain detection
- [ ] Adapt scoring calculation for UI tasks (visual regression weight, build pass gate)
- [ ] Add verification steps: build, component test, a11y audit (axe-core)

## Phase 4: UI Updates
- [ ] Add domain filter for "Frontend/UI" in TaskCatalog
- [ ] Add frontend-specific ScoreBreakdown component
- [ ] Update leaderboard to show domain breakdown

## Phase 5: Integration
- [ ] Add tasks to `data/tasks.json`
- [ ] Run full test suite
- [ ] Build succeeds
- [ ] Update lessons-learned.md
- [ ] Commit and push
