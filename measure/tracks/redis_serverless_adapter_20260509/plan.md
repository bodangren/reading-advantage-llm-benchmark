# Plan: Redis Serverless Adapter for Rate Limiting and Scheduling

## Phase 1: Redis Rate Limiter (TDD)
- [x] Write tests for RedisRateLimiter with ioredis mock
- [x] Implement RedisRateLimiter with EXPIRE for automatic TTL cleanup
- [x] Add fallback to memory rate limiter when Redis unavailable
- [x] Tests pass

## Phase 2: Redis Schedule Store (TDD)
- [x] Write tests for RedisScheduleStore
- [x] Implement Redis-backed schedule persistence with JSON serialization
- [x] Add fallback to filesystem store when Redis unavailable
- [x] Tests pass

## Phase 3: Integration and Config
- [x] Add REDIS_URL environment variable support
- [x] Wire adapters into existing app bootstrap
- [x] Update .env.example
- [x] Run full test suite
- [x] Type-check clean

## Phase 4: Documentation
- [x] Update tech-debt.md to mark serverless items resolved
- [x] Update lessons-learned.md with Redis adapter patterns
- [x] Commit and push
