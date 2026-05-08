# Plan: Redis Serverless Adapter for Rate Limiting and Scheduling

## Phase 1: Redis Rate Limiter (TDD)
- [ ] Write tests for RedisRateLimiter with ioredis mock
- [ ] Implement RedisRateLimiter with EXPIRE for automatic TTL cleanup
- [ ] Add fallback to memory rate limiter when Redis unavailable
- [ ] Tests pass

## Phase 2: Redis Schedule Store (TDD)
- [ ] Write tests for RedisScheduleStore
- [ ] Implement Redis-backed schedule persistence with JSON serialization
- [ ] Add fallback to filesystem store when Redis unavailable
- [ ] Tests pass

## Phase 3: Integration and Config
- [ ] Add REDIS_URL environment variable support
- [ ] Wire adapters into existing app bootstrap
- [ ] Update .env.example
- [ ] Run full test suite
- [ ] Type-check clean

## Phase 4: Documentation
- [ ] Update tech-debt.md to mark serverless items resolved
- [ ] Update lessons-learned.md with Redis adapter patterns
- [ ] Commit and push
