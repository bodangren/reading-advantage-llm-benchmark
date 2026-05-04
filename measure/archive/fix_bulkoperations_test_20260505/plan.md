# Plan: Fix BulkOperations Test Warnings

## Phase 1: Import waitFor
- [x] Add `waitFor` to import from `@testing-library/react` in BulkOperations.test.tsx

## Phase 2: Fix each setTimeout pattern
- [x] Fix line 27: `await new Promise(resolve => setTimeout(resolve, 100))` → `await waitFor(() => expect(...))`
- [x] Fix line 57: Same pattern
- [x] Fix line 81: Same pattern
- [x] Fix line 94: Same pattern

## Phase 3: Verify
- [x] Run tests and confirm no act() warnings