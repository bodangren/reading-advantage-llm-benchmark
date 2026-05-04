# Plan: Fix App Router Pages Discovery

## Root Cause
Next.js 16 prioritizes root `app/` directory over `src/app/`. With both directories existing, only root `app/` was used (containing only API routes), while `src/app/` pages were ignored during build.

## Solution
Copied all pages from `src/app/` to root `app/`. Kept `src/app/` in place since tests reference it directly (375 tests pass).

## Tasks

- [x] Copy page.tsx, layout.tsx, globals.css, favicon.ico to app/
- [x] Copy all route directories (leaderboard, methodology, tasks, runs, compare) to app/
- [x] Verify build shows all 11 routes (was 4)
- [x] Verify tests pass (375 tests)
- [x] Run lint check

## Build Output (After Fix)
```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/leaderboard
├ ƒ /api/runs
├ ○ /compare
├ ○ /leaderboard
├ ○ /methodology
├ ○ /runs
├ ● /runs/[id]
├ ○ /tasks
└ ● /tasks/[id]
```

## Notes
- `src/app/` kept for test compatibility (tests import from src/app directly)
- `app/` now has the actual production pages
- `app/api/` (existing) provides /api/leaderboard and /api/runs routes