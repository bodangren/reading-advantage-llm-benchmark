# Implementation Plan: Public API

## Phase 1: API Endpoints
- [ ] Task: Build leaderboard endpoint
  - [ ] Write tests for ranking and filtering
  - [ ] GET /api/v1/leaderboard with model, provider, score
  - [ ] Support query params for provider filter
- [ ] Task: Build runs endpoint
  - [ ] Write tests for run retrieval
  - [ ] GET /api/v1/runs/{id} with full detail
  - [ ] GET /api/v1/runs with pagination
- [ ] Task: Build tasks endpoint
  - [ ] Write tests for catalog listing
  - [ ] GET /api/v1/tasks with difficulty filter

## Phase 2: Auth & Rate Limiting
- [ ] Task: Add API key auth
  - [ ] Write tests for key validation
  - [ ] Simple in-memory key store
  - [ ] Reject requests without valid key
- [ ] Task: Add rate limiting
  - [ ] Write tests for limit enforcement
  - [ ] 100 requests/hour per key
  - [ ] Return 429 with Retry-After header

## Phase 3: Documentation
- [ ] Task: Add OpenAPI spec
  - [ ] Document all endpoints, params, and responses
  - [ ] Serve Swagger UI at /api/docs
- [ ] Task: Manual verification
  - [ ] Test all endpoints with curl
  - [ ] Verify rate limiting triggers correctly
