# Plan: Regression Detection & Alert System

- [ ] Write tests for `compareRuns` function that computes per-task score deltas
- [ ] Implement `compareRuns(before: RunDetail, after: RunDetail) -> RegressionReport` function
- [ ] Write tests for threshold filtering (only flag regressions exceeding threshold)
- [ ] Implement `filterRegressions(report, threshold) -> RegressionItem[]` function
- [ ] Write tests for markdown report generation
- [ ] Implement `generateRegressionReport(items) -> string` function
- [ ] Write tests for CLI exit code (1 on regressions, 0 on clean)
- [ ] Implement `asf benchmark regress` CLI subcommand with --model and --threshold flags
- [ ] Add example regression report output in docs/
- [ ] Write integration test: two mock runs → regress command → markdown output
- [ ] Run full test suite: `npm test`
