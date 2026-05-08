# Implementation Plan: Fix Test Schema Drift

## Phase 1: Audit & Catalog
- [ ] Task: Run type-check and catalog every schema violation
  - [ ] Run `tsc --noEmit` and capture all errors in test files
  - [ ] Categorize errors by schema (`TaskSpec`, `BenchmarkConfig`, or other)
  - [ ] Document file paths, line numbers, and missing fields in an audit doc
  - [ ] Confirm no runtime test failures are introduced by the missing fields

- [ ] Task: Define strict mock factory pattern
  - [ ] Write tests for mock factory helpers
  - [ ] Create `createMockTaskSpec(overrides?)` factory that supplies all required fields including `status`
  - [ ] Create `createMockBenchmarkConfig(overrides?)` factory that supplies all required fields including `track`
  - [ ] Place factories in `test/factories.ts` and export them
  - [ ] Ensure factories use Zod schema `.parse()` to guarantee validity at build time

## Phase 2: Fix Existing Mocks
- [ ] Task: Repair `TaskSpec` mock data
  - [ ] Write tests for factory usage (replace inline mocks with factories)
  - [ ] Replace all inline `TaskSpec` mocks in test files with `createMockTaskSpec` calls
  - [ ] Verify `status` field is present and valid on every mock
  - [ ] Run affected test suites to confirm no behavioral regressions

- [ ] Task: Repair `BenchmarkConfig` mock data
  - [ ] Write tests for factory usage (replace inline mocks with factories)
  - [ ] Replace all inline `BenchmarkConfig` mocks in test files with `createMockBenchmarkConfig` calls
  - [ ] Verify `track` field is present and valid on every mock
  - [ ] Run affected test suites to confirm no behavioral regressions

- [ ] Task: Cleanup ad-hoc suppressions
  - [ ] Search for `@ts-expect-error`, `as any`, or `// @ts-ignore` in test files related to these schemas
  - [ ] Remove suppressions and replace with proper typed factories
  - [ ] Confirm clean type-check after removals

## Phase 3: Prevention & CI
- [ ] Task: Add type-check to CI pipeline
  - [ ] Write tests for CI workflow validity (e.g., act or dry-run validation)
  - [ ] Add `tsc --noEmit` step to the GitHub Actions workflow
  - [ ] Configure the step to run before tests and fail fast on type errors
  - [ ] Verify CI blocks merge when test files have schema drift

- [ ] Task: Add type-level regression test
  - [ ] Write a type-level test using `expectType` or `satisfies` to assert that mock factories return valid schema types
  - [ ] Ensure the test fails at compile time if a required field is removed from a factory
  - [ ] Place test in `test/types/schema-mocks.test.ts`

- [ ] Task: Manual verification
  - [ ] Run full test suite and confirm all tests pass
  - [ ] Run `tsc --noEmit` and confirm zero errors
  - [ ] Open a test PR with an intentionally broken mock and confirm CI catches it
