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
| 2026-04-11 | leaderboard_20260404 | Score format ambiguous (0-1 vs 0-100) in LeaderboardTable | Medium | Open | normalizeScore() in scoreNormalizer.ts mitigates display issue; source data still needs normalization |
| 2026-04-16 | dataset_versioning_20260407 | No dataset version field in Run records | Medium | Resolved | Added dataset_version optional field to RunSchema with YYYY-MM-DD validation (2026-04-16) |
| 2026-04-23 | cross_model_eval_pipeline_20260407 | Pipeline harness interface is a stub | Medium | Open | harness.ts needs real API integration - currently returns mock Run objects |
| 2026-04-24 | ci_cd_cost_tracking_20260423 | Pricing table hardcoded in PRICING_TABLE constant | Low | Open | Could be externalized to JSON/YAML file for easier updates without code changes |
| 2026-04-25 | model_comparison_reports_20260423 | ComparisonReport schema created for Phase 1 | Low | Resolved | NormalizedScoreSchema, ModelResultSchema, ComparisonReportSchema added to schemas.ts |
