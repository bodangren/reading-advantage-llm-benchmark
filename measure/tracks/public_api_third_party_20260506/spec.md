# Track: Public API for Third-Party Integrations

## Overview
Expose a read-only public API so external tools and researchers can consume benchmark data programmatically.

## Goals
- REST API for leaderboard, runs, and tasks
- API key authentication
- Rate limiting
- OpenAPI documentation

## Acceptance Criteria
- [ ] GET /api/v1/leaderboard returns ranked models
- [ ] GET /api/v1/runs/{id} returns run details
- [ ] GET /api/v1/tasks returns task catalog
- [ ] API key required for all endpoints
- [ ] Rate limit: 100 requests/hour per key
- [ ] Tests cover all endpoints and rate limiting

## Non-Goals
- Write endpoints (submit results, create tasks)
- GraphQL
- Webhooks
