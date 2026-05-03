# Plan: Benchmark Data Export & API Layer

- [x] Write tests for query filter function (model, task, dateRange, scoreRange params)
- [x] Implement `filterRuns(runs: RunDetail[], filters: QueryFilters) -> RunDetail[]` function
- [x] Write tests for summary statistics computation (mean, median, p95)
- [x] Implement `computeStats(scores: number[]) -> { mean, median, p95 }` function
- [x] Write tests for CSV generation from run records
- [x] Implement `exportToCSV(runs: RunDetail[]) -> string` function
- [x] Write tests for API route handler with query parameter parsing
- [x] Implement `GET /api/runs` and `GET /api/leaderboard` Next.js route handlers
- [x] Implement `asf benchmark export` CLI subcommand with --format and --output flags
- [x] Add example API responses in docs/
- [x] Run full test suite: `npm test`

## Verification
- Tests: 360 passed (45 test files)
- Build: Compiles successfully

## Pending
- None - Track complete
