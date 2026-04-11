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
