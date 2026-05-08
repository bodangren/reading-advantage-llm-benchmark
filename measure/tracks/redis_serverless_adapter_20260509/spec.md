# Track: Redis Serverless Adapter for Rate Limiting and Scheduling

## Problem
The current rate limiter uses an in-memory Map (resets on each Vercel function invocation) and the scheduler writes JSON to disk (incompatible with serverless). This blocks serverless deployment.

## Goal
Replace in-memory rate limiting and filesystem scheduling with Redis-backed adapters that work in serverless environments while maintaining a local-dev fallback.

## Acceptance Criteria
- [ ] RedisRateLimiter implements same interface as in-memory rate limiter
- [ ] RedisScheduleStore implements same interface as filesystem scheduler
- [ ] Local development falls back to in-memory/fs when Redis is unavailable
- [ ] All existing tests pass with both adapters
- [ ] CI type-check gate passes
- [ ] Build succeeds
