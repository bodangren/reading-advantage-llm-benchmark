# Track: CLI LLM Integration — Replace Mock with Real API

## Overview

Replace the hardcoded mock LLM client in `scripts/task-cli.ts` with a real API-based client that integrates with OpenAI-compatible endpoints. The CLI should accept an API key and model ID, then make actual API calls for task generation.

## Functional Requirements

1. **API Client Abstraction**
   - Create a reusable `OpenAIClient` class in `src/lib/llm-client.ts`
   - Support generic OpenAI-compatible API endpoints (configurable base URL)
   - Implement retry logic with exponential backoff (3 retries, delays: 1s, 2s, 4s)
   - Handle rate limiting (429 responses) with automatic backoff
   - Support API key authentication via `Authorization: Bearer` header

2. **CLI Integration**
   - Add `--api-key` option for authentication
   - Add `--api-base` option for custom endpoint URLs (default: `https://api.openai.com/v1`)
   - Add `--model` option (already exists, use for actual API calls)
   - Validate API key is provided when using real API mode

3. **Error Handling**
   - Graceful degradation: if API call fails after retries, output clear error message
   - Distinguish between auth errors (401), rate limit (429), server errors (5xx), and network errors
   - Log retry attempts for debugging

4. **Configuration via Environment**
   - Support `OPENAI_API_KEY` environment variable as fallback
   - Support `LLM_API_BASE` environment variable for custom endpoints

## Non-Functional Requirements

- **Timeout:** Individual API calls timeout after 30 seconds
- **Max Retries:** 3 attempts per request
- **Backoff:** Exponential (1s, 2s, 4s) + jitter

## Acceptance Criteria

1. `asf task generate --repo <path> --count 3 --model gpt-4o --api-key <key>` makes real API calls and returns parsed tasks
2. `asf task generate --repo <path> --count 3 --model gpt-4o` with no API key shows clear error message
3. Failed API calls are retried with exponential backoff before failing
4. API responses are properly parsed into `TaskSpec[]` objects
5. Environment variables `OPENAI_API_KEY` and `LLM_API_BASE` are respected when options not provided
6. CLI documentation (--help) reflects all new options

## Out of Scope

- Streaming responses
- Vision/audio models
- Function calling / tool use
- Batch API endpoints