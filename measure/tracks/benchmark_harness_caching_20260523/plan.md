# Implementation Plan: Benchmark Harness Result Caching

## Phase 1: Cache Key Design & Core Store
- [ ] Task: Design deterministic cache key
  - [ ] Write tests for cache key generation in `cache/key.test.ts`
  - [ ] Implement `generateCacheKey(modelId, taskId, taskVersion, harnessCommit, snapshotHash, promptHash)`
  - [ ] Use SHA-256 for content hashing
  - [ ] Verify key changes when any input changes

- [ ] Task: Implement filesystem cache store
  - [ ] Write tests for cache store CRUD in `cache/store.test.ts`
  - [ ] Create `CacheStore` class with `get(key)`, `set(key, result, ttl)`, `delete(key)`, `clear()`
  - [ ] Store results as JSON in `.cache/blb-runs/<key>.json`
  - [ ] Implement LRU eviction with max size (default 500 entries)
  - [ ] Handle filesystem errors gracefully (disable cache on error)

## Phase 2: Harness Integration
- [ ] Task: Wire cache into harness execution
  - [ ] Write tests for cache hit path in `harness.test.ts`
  - [ ] Before running agent, check cache for existing result
  - [ ] On cache hit: return cached RunDetail with `cached: true` flag
  - [ ] On cache miss: run normal execution, store result on success
  - [ ] Write tests for cache miss path
  - [ ] Verify cache doesn't interfere with error handling

- [ ] Task: Cache invalidation & CLI flag
  - [ ] Write tests for invalidation logic in `cache/invalidation.test.ts`
  - [ ] Auto-invalidate when task version, harness commit, or snapshot hash changes
  - [ ] Add `--no-cache` CLI flag to `task-cli.ts`
  - [ ] Write tests for `--no-cache` bypass
  - [ ] Document CLI flag in help text

## Phase 3: Monitoring & Safety
- [ ] Task: Cache metrics and logging
  - [ ] Write tests for hit/miss ratio tracking
  - [ ] Add `cacheHits` and `cacheMisses` counters to run metadata
  - [ ] Log cache hit at info level with key prefix
  - [ ] Add cache stats endpoint to public API (`/api/cache/stats`)

- [ ] Task: Safety and edge cases
  - [ ] Write tests for corrupted cache file recovery
  - [ ] Handle malformed JSON in cache (delete and re-run)
  - [ ] Ensure cache is disabled in CI environments (`CI=true`)
  - [ ] Verify no sensitive data (API keys) is stored in cache files

## Phase 4: Verification
- [ ] Task: Full test suite and build
  - [ ] Run `npm test` — all existing + new tests pass
  - [ ] Run `npm run build` — Next.js export succeeds
  - [ ] Run `npm run lint` — zero errors
  - [ ] Run manual smoke test: execute same task twice, confirm cache hit
  - [ ] Update `tech-debt.md` and `lessons-learned.md`
  - [ ] Commit and push
