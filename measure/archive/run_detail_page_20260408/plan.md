# Implementation Plan: Run Detail Page & Artifact Viewer

## Phase 1: Data Layer & Fixture

- [x] Task: Define `Run` TypeScript type and JSON schema.
  - [x] Fields: `id`, `model`, `provider`, `harness_version`, `task_id`, `run_date`, `wall_time_seconds`, `total_score`, `scores` (object with five dimensions), `diff` (string), `test_results[]`, `artifacts[]`.
  - [x] Add `runs/blb-run-001.json` fixture matching the schema.
- [x] Task: Write build-time data loader (`lib/runs.ts`).
  - [x] `getAllRuns(): Run[]` — reads all `runs/*.json`, sorted newest-first by `run_date`.
  - [x] `getRun(id: string): Run | null`.
  - [x] Validate required fields; throw on schema violations.
- [x] Task: Write unit tests for loader with fixture data.
- [x] Task: Measure — User Manual Verification 'Phase 1: Data Layer & Fixture' (Protocol in workflow.md)

## Phase 2: Run Detail Page (`/runs/[id]`)

- [x] Task: Build `/app/runs/[id]/page.tsx` with `generateStaticParams`.
  - [x] Score breakdown: bar or radar chart using shadcn/recharts showing all five dimensions plus total.
  - [x] Run metadata section: model, provider, harness, task (linked to `/tasks/[task_id]`), date, wall time.
  - [x] Breadcrumb: Leaderboard → Task → this run.
- [x] Task: Build diff viewer sub-component.
  - [x] Parse unified diff string into files + hunks.
  - [x] Render as syntax-highlighted, collapsible file sections.
  - [x] Truncate files >200 lines with "Show more" toggle.
- [x] Task: Build test results table sub-component.
  - [x] Grouped by test suite; pass/fail icon per row.
  - [x] Expandable error output for failed tests.
- [x] Task: Build artifact links section (download links from `artifacts[]`).
- [x] Task: Write component tests for each sub-component with fixture run data.
- [x] Task: Measure — User Manual Verification 'Phase 2: Run Detail Page' (Protocol in workflow.md)

## Phase 3: Run Index Page (`/runs`)

- [x] Task: Build `/app/runs/page.tsx` as a static Server Component.
  - [x] List all runs newest-first: model name, provider, task ID (linked), total score, run date.
  - [x] Link each row to `/runs/[id]`.
- [x] Task: Write component tests for index page (empty state, populated).
- [x] Task: Verify static export includes run index and all detail pages.
- [x] Task: Measure — User Manual Verification 'Phase 3: Run Index Page' (Protocol in workflow.md)
