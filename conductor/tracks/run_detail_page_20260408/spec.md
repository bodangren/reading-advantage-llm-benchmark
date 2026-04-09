# Track: Run Detail Page & Artifact Viewer

## Overview

The leaderboard shows aggregate scores, but evaluators need to drill into individual runs to understand *why* a model scored as it did. The BLB product definition specifies a Run Detail page with score breakdown, diff summary, test results, and artifact links. This track builds `/runs/[id]` as a statically-generated page powered by run JSON files in the repo.

## Functional Requirements

- A `/runs/[id]` page loads `runs/<id>.json` at build time and displays:
  - **Score Breakdown**: Five-dimension radar/bar chart (functional correctness 40, integration quality 25, regression safety 20, minimality 10, process quality 5) plus total score.
  - **Run Metadata**: Model, provider, harness version, task ID (linked to task detail), run date, total wall time.
  - **Diff Summary**: Collapsible file-by-file diff of the agent's changes (rendered from a diff string in the JSON).
  - **Test Results Table**: Pass/fail per test, grouped by suite, with expandable error output.
  - **Artifact Links**: Download links for any artifacts (logs, screenshots) referenced in the JSON.
- A breadcrumb links back to the leaderboard and to the associated task detail page.
- A `/runs` index page lists all runs, newest first, with model name, task, total score, and date.

## Non-Functional Requirements

- All pages statically generated — no runtime backend.
- Diff rendering must handle large diffs (>500 lines) without layout breakage (use virtual scrolling or truncation with "show more").
- Run JSON schema must be documented and validated at build time.

## Acceptance Criteria

- [ ] `/runs/[id]` renders score breakdown, metadata, diff, test results, and artifact links from a fixture JSON.
- [ ] Score breakdown is displayed as a visual chart (shadcn chart or recharts).
- [ ] Diff is syntax-highlighted and collapsible per file.
- [ ] Test results table shows pass/fail counts and expandable error output.
- [ ] Breadcrumb links to leaderboard and task detail are correct.
- [ ] `/runs` index page lists all runs newest-first.
- [ ] At least one fixture run JSON is added to the repo to validate the build.
- [ ] Pages are included in static export and load without a server.

## Out of Scope

- Submitting or triggering new runs from the UI.
- Real-time run status (async job polling).
