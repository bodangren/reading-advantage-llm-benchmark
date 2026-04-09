# Implementation Plan: Run Detail Page & Artifact Viewer

## Phase 1: Data Layer & Fixture

- [ ] Task: Define `Run` TypeScript type and JSON schema.
  - [ ] Fields: `id`, `model`, `provider`, `harness_version`, `task_id`, `run_date`, `wall_time_seconds`, `total_score`, `scores` (object with five dimensions), `diff` (string), `test_results[]`, `artifacts[]`.
  - [ ] Add `runs/blb-run-001.json` fixture matching the schema.
- [ ] Task: Write build-time data loader (`lib/runs.ts`).
  - [ ] `getAllRuns(): Run[]` — reads all `runs/*.json`, sorted newest-first by `run_date`.
  - [ ] `getRun(id: string): Run | null`.
  - [ ] Validate required fields; throw on schema violations.
- [ ] Task: Write unit tests for loader with fixture data.
- [ ] Task: Conductor — User Manual Verification 'Phase 1: Data Layer & Fixture' (Protocol in workflow.md)

## Phase 2: Run Detail Page (`/runs/[id]`)

- [ ] Task: Build `/app/runs/[id]/page.tsx` with `generateStaticParams`.
  - [ ] Score breakdown: bar or radar chart using shadcn/recharts showing all five dimensions plus total.
  - [ ] Run metadata section: model, provider, harness, task (linked to `/tasks/[task_id]`), date, wall time.
  - [ ] Breadcrumb: Leaderboard → Task → this run.
- [ ] Task: Build diff viewer sub-component.
  - [ ] Parse unified diff string into files + hunks.
  - [ ] Render as syntax-highlighted, collapsible file sections.
  - [ ] Truncate files >200 lines with "Show more" toggle.
- [ ] Task: Build test results table sub-component.
  - [ ] Grouped by test suite; pass/fail icon per row.
  - [ ] Expandable error output for failed tests.
- [ ] Task: Build artifact links section (download links from `artifacts[]`).
- [ ] Task: Write component tests for each sub-component with fixture run data.
- [ ] Task: Conductor — User Manual Verification 'Phase 2: Run Detail Page' (Protocol in workflow.md)

## Phase 3: Run Index Page (`/runs`)

- [ ] Task: Build `/app/runs/page.tsx` as a static Server Component.
  - [ ] List all runs newest-first: model name, provider, task ID (linked), total score, run date.
  - [ ] Link each row to `/runs/[id]`.
- [ ] Task: Write component tests for index page (empty state, populated).
- [ ] Task: Verify static export includes run index and all detail pages.
- [ ] Task: Conductor — User Manual Verification 'Phase 3: Run Index Page' (Protocol in workflow.md)
