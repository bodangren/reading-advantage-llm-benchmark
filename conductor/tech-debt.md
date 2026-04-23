# Tech Debt Registry

> This file is curated working memory, not an append-only log. Keep it at or below **50 lines**.
> Remove or summarize resolved items when they no longer need to influence near-term planning.
>
> **Severity:** `Critical` | `High` | `Medium` | `Low`
> **Status:** `Open` | `Resolved`

| Date | Track | Item | Severity | Status | Notes |
|------|-------|------|----------|--------|-------|
| 2026-04-09 | leaderboard_20260404 | SortIcon component defined inside render | Medium | Resolved | Moved to separate function outside component (2026-04-10) |
| 2026-04-10 | leaderboard_20260404 | Same SortIcon lint errors persist at verification | Medium | Resolved | Phase 2 checkpoint - tech-debt item resolved in Phase 3 |
| 2026-04-11 | methodology_20260404 | Header/nav duplicated between home and methodology pages | Low | Resolved | Removed inline header from methodology page - now uses shared Header from layout (2026-04-11) |
| 2026-04-11 | leaderboard_20260404 | Score format ambiguous (0-1 vs 0-100) in LeaderboardTable | Medium | Open | Line 137 does `score <= 1 ? score*100 : score` — normalize data format at source |
| 2026-04-16 | dataset_versioning_20260407 | No dataset version field in Run records | Medium | Resolved | Added dataset_version optional field to RunSchema with YYYY-MM-DD validation (2026-04-16) |
| 2026-04-23 | cross_model_eval_pipeline_20260407 | Pipeline harness interface is a stub | Medium | Open | harness.ts needs real API integration - currently returns mock Run objects |
