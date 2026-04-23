# Lessons Learned

> This file is curated working memory, not an append-only log. Keep it at or below **50 lines**.
> Remove or condense entries that are no longer relevant to near-term planning.

## Architecture & Design

- (2026-04-09, leaderboard_20260404) Tabs components need React context for state coordination - independent useState in each subcomponent doesn't share state

## Recurring Gotchas

- (2026-04-09, leaderboard_20260404) SortIcon defined inside component render causes lint error "Cannot create components during render" - **FIXED** by extracting to separate function with proper props passing
- (2026-04-11, methodology_20260404) Pages with inline `<header>` elements duplicate the shared Header from layout - **FIXED** by removing inline header and relying on layout's shared Header component

## Patterns That Worked Well

- (2026-04-09, leaderboard_20260404) TDD: writing tests before implementation caught tab state coordination issues early
- (2026-04-10, leaderboard_20260404) Fix lint errors immediately when discovered to prevent accumulation
- (2026-10, methodology_20260404) Static pages using Next.js App Router - no need for 'use client' if only server data fetching
- (2026-04-14, methodology_20260404) Use `cn()` utility for conditional classes (active vs hover states on sortable table headers)
- (2026-04-15, methodology_20260404) Phase verification: automated tests + lint + build must all pass before creating checkpoint
- (2026-04-16, dataset_versioning_20260407) Zod schemas for backward compatibility - use optional() fields for new features on existing types

## Patterns That Worked Well

- (2026-04-23, cross_model_eval_pipeline_20260407) Dependency injection for testability - pass EvaluationFunction as parameter instead of dynamic import
- (2026-04-23, cross_model_eval_pipeline_20260407) Zod's omit({}) trick to create variant schemas from existing ones
- (2026-04-23, cross_model_eval_pipeline_20260407) TypeScript type assertion in filter() - use explicit type guard instead of complex generics

## Architecture & Design

- (2026-04-23, cross_model_eval_pipeline_20260407) Promise.all for parallel execution with isolated failure handling - each model run is independent

## Architecture & Design

- (2026-04-24, run_detail_page_20260408) Nested Zod schemas - RunScoresSchema, TestResultSchema, ArtifactSchema inside RunDetailSchema works well for composability

## Planning Improvements
