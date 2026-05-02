# Plan: Benchmark Data Export & API Layer

- [ ] Write tests for query filter function (model, task, dateRange, scoreRange params)
- [ ] Implement `filterRuns(runs: RunDetail[], filters: QueryFilters) -> RunDetail[]` function
- [ ] Write tests for summary statistics computation (mean, median, p95)
- [ ] Implement `computeStats(scores: number[]) -> { mean, median, p95 }` function
- [ ] Write tests for CSV generation from run records
- [ ] Implement `exportToCSV(runs: RunDetail[]) -> string` function
- [ ] Write tests for API route handler with query parameter parsing
- [ ] Implement `GET /api/runs` and `GET /api/leaderboard` Next.js route handlers
- [ ] Implement `asf benchmark export` CLI subcommand with --format and --output flags
- [ ] Add example API responses in docs/
- [ ] Run full test suite: `npm test`
