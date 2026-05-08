# Lessons Learned

> Curated working memory ≤50 lines. Remove stale entries.

## Architecture

- Tabs need React context for state coordination (independent useState doesn't share)
- Promise.all for parallel execution with isolated failure handling
- Nested Zod schemas (RunScoresSchema, TestResultSchema, ArtifactSchema inside RunDetailSchema) for composability
- Separate comparison logic (compareModels, rankModels) from UI for testability

## Gotchas

- SortIcon defined inside component render causes lint error - **FIXED** by extracting to separate function
- shadcn Button does not support asChild prop - use plain anchor tags for download links
- getAllByRole for multiple elements with same name, not getByRole
- React impure function error for Date.now() in useMemo - use stable ID instead
- Delta calculation is relative to max score (winner=0), not absolute difference
- Use `waitFor` from @testing-library/react instead of `setTimeout` for async state updates in tests
- Zod schemas must be defined BEFORE they are referenced - "Cannot access 'XSchema' before initialization" means the schema is used before it's defined in the file
- vi.setSystemTime must be called BEFORE creating `now` variable used in tests - setSystemTime only affects Date() calls after it is set

## Patterns That Work

- TDD: tests before implementation caught issues early
- `cn()` utility for conditional classes
- Phase verification: tests + lint + build all pass before checkpoint
- Zod omit({}) trick to create variant schemas
- Immutability patterns (createSpendWindow returns new window); JSON config with getXxx() caching
- Test boundary conditions explicitly (at vs over threshold)
- Score normalization: `normalizeScore()` handles 0-1→0-100 and pass-through
- Use `.min(1)` on array schemas to prevent empty arrays
- Client component pattern with CompareClient for interactive selection
- Export module separates Markdown and PDF generation for testability
- Mock factories with Zod parse() guarantee validity at build time

## Key Implementation Notes

- Exponential backoff with sleep() for retry logic - delay doubles on each retry
- File-based persistence to data/runs/ directory
- discriminatedUnion requires distinct literal values on discriminator field
- Test mock Response objects need `as unknown as Response` cast
- Fetch retry: `attempt < this.maxRetries` check BEFORE incrementing attempt
- API Client: reads from env vars `OPENAI_API_KEY` and `LLM_API_BASE`
- Next.js 16: root `app/` takes precedence over `src/app/` - both exist = only root used
- detectRepoType() identifies react-native via dependencies['react-native'] presence
- Redis adapter pattern: RedisRateLimiter uses EXPIRE for TTL + falls back to in-memory; RedisScheduleStore uses Redis hashes/sorted sets + falls back to filesystem
- Mock factories should NOT include optional fields by default - only add them when explicitly provided in overrides

## Calibration

- Difficulty = (1 - passRate) * 100; thresholds: easy <= 33, medium 34-66, hard >= 67; flags over/under-rated tasks