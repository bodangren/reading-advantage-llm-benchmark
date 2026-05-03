# Plan: Regression Detection & Alert System

- [x] Write tests for `compareRuns` function that computes per-task score deltas
- [x] Implement `compareRuns(before: RunDetail, after: RunDetail) -> RegressionReport` function
- [x] Write tests for threshold filtering (only flag regressions exceeding threshold)
- [x] Implement `filterRegressions(report, threshold) -> RegressionItem[]` function
- [x] Write tests for markdown report generation
- [x] Implement `generateRegressionReport(items) -> string` function
- [x] Write tests for CLI exit code (1 on regressions, 0 on clean)
- [x] Implement `asf benchmark regress` CLI subcommand with --model and --threshold flags
- [x] Add example regression report output in docs/
- [x] Write integration test: two mock runs → regress command → markdown output
- [x] Run full test suite: `npm test`

## Implementation Summary

### Phase 1: Core Library
- Created `src/lib/regression.ts` with `compareRuns`, `filterRegressions`, `generateRegressionReport` functions
- Created `tests/lib/regression.test.ts` with 10 passing tests covering all core functions

### Phase 2: CLI Integration
- Extended `scripts/task-cli.ts` with `asf benchmark regress` subcommand
- Added `--model` and `--threshold` flags to CLI parser
- Added `getRunsForModel` utility to `src/lib/runs.ts`
- Exit code 1 when regressions detected, 0 when clean

## Verification
- Tests: 344 passed (44 test files)
- Build: Compiles successfully

## Pending
- None - Track complete
