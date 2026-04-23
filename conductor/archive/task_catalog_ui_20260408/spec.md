# Track: Task Catalog & Detail UI

## Overview

The BLB product definition calls for a Task Catalog where evaluators and consumers can browse the full set of benchmark tasks — understanding each task's domain, difficulty, acceptance criteria, and scoring rubric before interpreting leaderboard results. Currently no `/tasks` page exists. This track builds it as a statically-exported Next.js page powered by the JSON task files already in the repo.

## Functional Requirements

- A `/tasks` page lists all tasks loaded from `/tasks/*.json` at build time.
- Each task card shows: task ID, title, difficulty label, domain tag, and a one-line description.
- Filters allow narrowing by difficulty (Easy / Medium / Hard) and domain (Web App, API, etc.).
- Clicking a task card opens `/tasks/[id]` with full detail: description, repo context snippet, acceptance criteria checklist, and scoring rubric breakdown (40/25/20/10/5 dimensions).
- A "Run count" badge on each card shows how many benchmark runs exist for that task.
- Tasks with zero runs are still listed (greyed badge).

## Non-Functional Requirements

- All pages are statically generated (`generateStaticParams`) — no runtime backend.
- Task detail pages must be shareable via direct URL.
- Page must be mobile-responsive.

## Acceptance Criteria

- [ ] `/tasks` renders all tasks from `/tasks/*.json` via `generateStaticParams`.
- [ ] Difficulty and domain filter controls update the visible task list client-side.
- [ ] `/tasks/[id]` renders full task detail with acceptance criteria and rubric.
- [ ] Run count badge reflects the correct number of runs referencing that task ID.
- [ ] Tasks with no runs show a greyed "0 runs" badge.
- [ ] Pages are included in the static export and load without a server.
- [ ] At least one fixture task JSON is added to the repo to validate the build.

## Out of Scope

- Task submission or editing from the UI.
- Authentication or access control.
