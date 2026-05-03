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
| 2026-04-11 | leaderboard_20260404 | Score format ambiguous (0-1 vs 0-100) in LeaderboardTable | Medium | Resolved | normalizeScore() utility handles 0-1→0-100 conversion; display component checks <=1 before multiplying (2026-05-02) |
| 2026-04-16 | dataset_versioning_20260407 | No dataset version field in Run records | Medium | Resolved | Added dataset_version optional field to RunSchema with YYYY-MM-DD validation (2026-04-16) |
| 2026-04-26 | harness_implementation_20260426 | Pipeline harness interface is a stub | Medium | Resolved | opencode-api.ts provides real API client with retry logic; harness.ts now saves RunDetail to JSON (2026-05-02) |
| 2026-04-24 | ci_cd_cost_tracking_20260423 | Pricing table hardcoded in PRICING_TABLE constant | Low | Open | Could be externalized to JSON/YAML file for easier updates without code changes |
| 2026-04-25 | model_comparison_reports_20260423 | ComparisonReport schema created for Phase 1 | Low | Resolved | NormalizedScoreSchema, ModelResultSchema, ComparisonReportSchema added to schemas.ts |
| 2026-04-25 | model_comparison_reports_20260423 | Duplicate TaskResult/ModelResult interfaces in 4 files | Medium | Resolved | schemas.ts exports ComparisonReport, ModelResult types; UI components use local interfaces by design (2026-05-02) |
| 2026-04-25 | visual_refresh_20260425 | CSS OKLCH values vs DESIGN.md hex tokens inconsistency | Low | Resolved | Synced globals.css with DESIGN.md hex tokens during Phase 2 |
| 2026-05-03 | task_authoring_interface_20260424 | Task versioning storage path needs manual directory creation | Low | Open | saveTaskVersion() creates versions dir recursively; may need cleanup job for old versions |
| 2026-05-03 | native_agent_track_b_20260503 | BulkOperations test intermittently fails with act() warnings | Low | Open | Test uses setTimeout(100) instead of proper waitFor; not wrapped in act() for async state updates |
