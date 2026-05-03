# Lessons Learned

> This file is curated working memory, not an append-only log. Keep it at or below **50 lines**.
> Remove or condense entries that are no longer relevant to near-term planning.

## Architecture & Design

- (2026-04-09) Tabs components need React context for state coordination - independent useState doesn't share state
- (2026-04-23) Promise.all for parallel execution with isolated failure handling - each model run is independent
- (2026-04-24) Nested Zod schemas (RunScoresSchema, TestResultSchema, ArtifactSchema inside RunDetailSchema) works well for composability
- (2026-04-25) Separate comparison logic (compareModels, rankModels) from UI concerns for testability
- (2026-04-25) Strengths/weaknesses analyzer uses midpoint splitting - top half strengths, bottom half weaknesses sorted ascending

## Recurring Gotchas

- (2026-04-09) SortIcon defined inside component render causes lint error "Cannot create components during render" - **FIXED** by extracting to separate function
- (2026-04-11) Pages with inline `<header>` elements duplicate the shared Header - **FIXED** by relying on layout's shared Header
- (2026-04-24) shadcn Button component does not support asChild prop - use plain anchor tags for download links
- (2026-04-24) getAllByRole for multiple elements with same accessible name, not getByRole
- (2026-04-25) React impure function error for Date.now() in useMemo - use stable ID instead
- (2026-04-25) Delta calculation is relative to max score (winner=0), not absolute difference

## Patterns That Worked Well

- (2026-04-09) TDD: writing tests before implementation caught tab state coordination issues early
- (2026-04-10) Fix lint errors immediately when discovered to prevent accumulation
- (2026-04-14) Use `cn()` utility for conditional classes (active vs hover states on sortable table headers)
- (2026-04-15) Phase verification: automated tests + lint + build must all pass before creating checkpoint
- (2026-04-16) Zod schemas for backward compatibility - use optional() fields for new features on existing types
- (2026-04-23) Dependency injection for testability - pass EvaluationFunction as parameter instead of dynamic import
- (2026-04-23) Zod's omit({}) trick to create variant schemas from existing ones
- (2026-04-23) TypeScript type assertion in filter() - use explicit type guard instead of complex generics
- (2026-04-24) Immutability patterns (createSpendWindow returns new window) make state management predictable and testable
- (2026-04-24) Externalized pricing table as constant makes updates possible without code changes
- (2026-04-24) Test boundary conditions explicitly (at threshold vs over threshold) rather than assuming <= behavior
- (2026-04-24) Score normalization: `normalizeScore()` handles 0-1→0-100 and pass-through for 0-100 scale
- (2026-04-24) Use Zod schemas for new data models - provides validation and TypeScript types with `infer`
- (2026-04-24) Use `.min(1)` on array schemas to prevent empty arrays
- (2026-04-25) Client component pattern with CompareClient for interactive model selection
- (2026-04-25) Export module separates Markdown and PDF generation for testability
- (2026-05-01) Exponential backoff with sleep() for retry logic - delay doubles on each retry
- (2026-05-02) File-based persistence via saveRun() to data/runs/ directory - Run converted to RunDetail before storage
- (2026-05-03) Zod discriminatedUnion for mutually exclusive fields (fixed vs native track) - requires distinct literal values on discriminator field
- (2026-05-03) LLM task generation needs proper prompt templates with examples for consistent output format
- (2026-05-04) API Client: `OpenAIClient.complete()` retries with exponential backoff (1s, 2s, 4s + jitter)
- (2026-05-04) LLM API client reads from env vars `OPENAI_API_KEY` and `LLM_API_BASE` as fallback
- (2026-05-04) Test mock Response objects need `as unknown as Response` cast to avoid TypeScript errors
- (2026-05-04) Fetch retry loop: `attempt < this.maxRetries` check must happen BEFORE incrementing attempt to get correct call count

## Visual Design (2026-04-25)

- (2026-04-25) OKLCH color values in CSS don't match DESIGN.md hex tokens - need to sync both during refactoring
- (2026-04-25) Convert OKLCH to hex tokens when updating globals.css to match DESIGN.md specification
- (2026-05-03) Basic markdown rendering can be done with regex chain; full library needed for complex cases