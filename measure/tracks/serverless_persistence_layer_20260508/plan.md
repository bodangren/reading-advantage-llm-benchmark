# Implementation Plan: Serverless-Compatible Persistence Layer

## Phase 1: Abstraction & Adapter Design
- [ ] Task: Define rate limiter adapter interface
  - [ ] Write tests for the adapter contract (memory and Redis implementations)
  - [ ] Create `RateLimitAdapter` interface with `checkLimit(key, limit, window)`, `increment(key)`, and `reset(key)`
  - [ ] Implement `MemoryRateLimitAdapter` (extract current in-memory logic into adapter)
  - [ ] Implement `RedisRateLimitAdapter` using token-bucket algorithm with Upstash/ioredis
  - [ ] Add factory `createRateLimitAdapter()` that selects adapter based on env vars

- [ ] Task: Define scheduler persistence adapter interface
  - [ ] Write tests for the adapter contract (filesystem and Redis implementations)
  - [ ] Create `SchedulerPersistenceAdapter` interface with `loadJobs()`, `saveJob(job)`, `loadRunHistory()`, and `appendRun(run)`
  - [ ] Implement `FilesystemSchedulerAdapter` (extract current filesystem logic into adapter)
  - [ ] Implement `RedisSchedulerAdapter` using Redis hashes and sorted sets for job/run storage
  - [ ] Add factory `createSchedulerAdapter()` that selects adapter based on env vars

## Phase 2: Redis Adapter Implementation
- [ ] Task: Implement Redis rate limiter adapter
  - [ ] Write tests for token-bucket logic with Redis (use testcontainers or Upstash local emulator)
  - [ ] Implement token-bucket refill math in `RedisRateLimitAdapter.checkLimit`
  - [ ] Handle connection errors gracefully (fail open or fail closed with config flag)
  - [ ] Add integration test verifying rate limits persist across adapter instances

- [ ] Task: Implement Redis scheduler adapter
  - [ ] Write tests for job CRUD and run history with Redis
  - [ ] Store job definitions as Redis hashes keyed by `scheduler:job:<id>`
  - [ ] Store run history as Redis sorted set keyed by `scheduler:runs` with timestamp scores
  - [ ] Implement cron state as a Redis string `scheduler:cron:state`
  - [ ] Add integration test verifying scheduler state survives adapter reinstantiation

## Phase 3: Integration & Fallback
- [ ] Task: Wire adapters into existing services
  - [ ] Write tests for factory selection logic
  - [ ] Replace direct in-memory rate limiter usage with `createRateLimitAdapter()`
  - [ ] Replace direct filesystem scheduler usage with `createSchedulerAdapter()`
  - [ ] Ensure env-driven fallback: if no Redis config, use memory/filesystem adapters
  - [ ] Run full test suite and confirm zero regressions

- [ ] Task: Add environment configuration and documentation
  - [ ] Write tests for config validation (Zod schema for Redis env vars)
  - [ ] Add `REDIS_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` to env schema
  - [ ] Update `.env.example` with optional Redis variables and local-dev fallback notes
  - [ ] Add deployment docs section explaining Redis setup for Vercel/Serverless

- [ ] Task: Manual verification
  - [ ] Verify local dev works without Redis (fallback mode)
  - [ ] Verify Redis mode works with a local Redis instance or Upstash free tier
  - [ ] Confirm rate limits persist across serverless cold starts in a preview deployment
  - [ ] Confirm scheduler jobs and run history are retained after function restarts
