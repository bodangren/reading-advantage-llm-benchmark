# Track: Fix BulkOperations Test Warnings

## Problem
BulkOperations test file uses `setTimeout(100)` for async state updates instead of proper `waitFor`. Tests intermittently fail with act() warnings.

## Approach
Replace `setTimeout` patterns with `@testing-library/react`'s `waitFor` helper for proper async waiting.

## Spec
- [ ] Fix 4 occurrences of `setTimeout(resolve, 100)` in BulkOperations.test.tsx
- [ ] Import `waitFor` from @testing-library/react
- [ ] Wrap async assertions in `waitFor` blocks
- [ ] All tests pass without act() warnings

## Verification
- Run tests: `bun run test -- --run tests/components/BulkOperations.test.tsx`
- Verify no act() warnings in output