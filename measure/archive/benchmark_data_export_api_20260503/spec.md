# Spec: Benchmark Data Export & API Layer

## Problem

Benchmark data is stored as static JSON files with no programmatic access. External tools, CI pipelines, and research teams cannot query or export results without parsing raw files.

## Goals

- Provide a read-only API endpoint that serves benchmark data as JSON
- Support filtering by model, task, date range, and score range
- Export benchmark results as CSV for spreadsheet analysis
- Generate summary statistics (mean, median, p95 scores per model)

## Non-Goals

- Write/mutation API (data remains file-based)
- Authentication (internal tool, network-restricted)
- GraphQL (REST is sufficient for current needs)

## Acceptance Criteria

- [ ] `GET /api/runs?model=gpt-4o` returns filtered run records as JSON
- [ ] `GET /api/leaderboard` returns sorted leaderboard with summary stats
- [ ] `asf benchmark export --format csv --output results.csv` produces valid CSV
- [ ] Summary stats include mean, median, p95 per model across all tasks
- [ ] Unit tests cover query filtering, CSV generation, and stat computation
