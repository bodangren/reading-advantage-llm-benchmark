# Specification: Fix App Router Pages Discovery

## Overview
Next.js 16 build only showed 4 routes (/_not-found, /api/leaderboard, /api/runs) despite `src/app/` containing multiple page components. The project had two app directories with routing confusion.

## Root Cause
Next.js 16 prioritizes root `app/` directory over `src/app/`. With both directories existing, only root `app/` was used (containing only API routes), while `src/app/` pages were ignored during build.

## Solution Implemented
Copied all pages from `src/app/` to root `app/`:
- `app/page.tsx` - home page
- `app/layout.tsx` - root layout
- `app/globals.css` - global styles
- `app/favicon.ico` - favicon
- `app/leaderboard/page.tsx` - leaderboard
- `app/methodology/page.tsx` - methodology
- `app/tasks/page.tsx` + `app/tasks/[id]/page.tsx` - tasks
- `app/runs/page.tsx` + `app/runs/[id]/page.tsx` - runs
- `app/compare/page.tsx` + `app/compare/CompareClient.tsx` - compare

## Acceptance Criteria
- [x] Build output shows all expected routes (11 routes, was 4)
- [x] All pages render correctly
- [x] Tests pass (375 tests)
- [x] `src/app/` retained for test compatibility (tests import from src/app directly)