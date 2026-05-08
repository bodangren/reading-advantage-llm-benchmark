# Track: Fix Test Schema Drift

## Overview
The benchmark's TypeScript schemas have evolved, but test mock data has not kept pace. `TaskSpec` now requires a `status` field and `BenchmarkConfig` requires a `track` field, yet existing test mocks omit these fields. This causes TypeScript compilation errors in test files and erodes confidence in the test suite. This track systematically audits and repairs all test mock data to align with current schemas, then adds a CI gate to prevent future drift.

## Goals
- Eliminate all TypeScript errors in test mock data
- Ensure every test mock conforming to `TaskSpec` includes `status`
- Ensure every test mock conforming to `BenchmarkConfig` includes `track`
- Prevent future schema drift with a type-check gate in CI

## Acceptance Criteria
- [ ] `npm run type-check` (or `tsc --noEmit`) passes cleanly across the entire project including tests
- [ ] All test mocks referencing `TaskSpec` include a valid `status` value
- [ ] All test mocks referencing `BenchmarkConfig` include a valid `track` string
- [ ] CI workflow runs type-check on every PR and blocks merge on failure
- [ ] A lint rule or type-level test flags mock objects that are missing required schema fields
- [ ] No `@ts-expect-error` or `as any` workarounds introduced to suppress the errors

## Non-Goals
- Changing production runtime behavior or API contracts
- Refactoring business logic in non-test files
- Adding new features to schemas (only aligning mocks to existing schemas)
- Converting the entire test suite to a different framework