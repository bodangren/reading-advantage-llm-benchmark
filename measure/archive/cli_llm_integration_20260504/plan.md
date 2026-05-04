# Implementation Plan: CLI LLM Integration

## Phase 1: API Client Abstraction

### Tasks

- [x] Write unit tests for `OpenAIClient` class in `tests/lib/llm-client.test.ts`
  - Test retry logic with mock failures
  - Test exponential backoff timing
  - Test successful response parsing
  - Test error handling for 401, 429, 5xx responses

- [x] Implement `OpenAIClient` class in `src/lib/llm-client.ts`
  - Constructor accepts `{ apiKey, baseUrl, model, timeout, maxRetries }`
  - `complete(prompt: string): Promise<string>` method
  - Implement retry with exponential backoff
  - Handle rate limit (429) with respect to `Retry-After` header
  - Throw descriptive errors for auth/server/network failures

- [x] Run tests and fix any failures

- [x] Verify build succeeds

## Phase 2: CLI Integration

### Tasks

- [x] Write integration tests for CLI that test real API mode in `tests/lib/task-cli.test.ts`
  - Test API key validation
  - Test environment variable fallback
  - Test custom endpoint configuration

- [x] Update `scripts/task-cli.ts`:
  - Import `OpenAIClient` from `@/lib/llm-client`
  - Add `--api-key` option
  - Add `--api-base` option
  - Replace mock client with real `OpenAIClient` when API key present
  - Read from `OPENAI_API_KEY` and `LLM_API_BASE` env vars as fallback

- [x] Run tests and fix any failures

- [x] Verify build succeeds

## Phase 3: Documentation

### Tasks

- [x] Update CLI help text to reflect new options
- [x] Add usage examples in script comments

## Phase 4: Verification

### Tasks

- [x] Run full test suite
- [x] Run lint check
- [x] Commit with git note