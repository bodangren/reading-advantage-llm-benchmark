# Track: Serverless-Compatible Persistence Layer

## Overview
The current benchmark platform relies on in-memory state for rate limiting and filesystem persistence for the scheduler. These patterns break on serverless deployments (Vercel, AWS Lambda) where functions are ephemeral and local disk is not shared. This track replaces both subsystems with a serverless-compatible persistence backend—initially Redis via Upstash—so rate limits survive across invocations and scheduled benchmark runs are tracked in durable storage.

## Goals
- Replace in-memory rate limiting with Redis-backed token-bucket rate limiting
- Replace filesystem-based scheduler persistence with Redis-backed job queue and state
- Maintain backward compatibility for local development (fallback to memory/filesystem when Redis is not configured)
- Keep existing public API surface unchanged

## Acceptance Criteria
- [ ] Rate limiter uses Redis when `REDIS_URL` / `UPSTASH_REDIS_REST_URL` is configured, otherwise falls back to memory
- [ ] Scheduler stores job definitions, run history, and cron state in Redis instead of local files
- [ ] All existing rate-limit tests pass against both memory and Redis adapters
- [ ] All existing scheduler tests pass against both filesystem and Redis adapters
- [ ] Local development works without Redis (fallback mode)
- [ ] Deployment documentation updated with required Redis environment variables
- [ ] No regression in public API behavior or response schemas

## Non-Goals
- Replacing the primary benchmark result database (this track focuses on ephemeral state)
- Implementing a custom distributed scheduler from scratch (use Redis primitives)
- Multi-region Redis replication or advanced caching strategies
- Changing the task catalog or leaderboard data storage