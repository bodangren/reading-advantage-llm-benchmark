# Track: Benchmark Harness Result Caching

## Overview
BLB benchmark runs are expensive (LLM API calls + compute time). Identical configurations (same model, same task version, same harness commit) currently re-run from scratch. This track adds intelligent result caching to the harness so repeat runs with identical inputs return cached results instantly, cutting fleet costs without sacrificing accuracy.

## Goals
- Add deterministic cache-key generation based on model, task version, harness version, and repo snapshot hash
- Implement a filesystem-backed result cache with TTL and size limits
- Ensure cache invalidation when task versions, harness code, or snapshot content changes
- Maintain full backward compatibility (cached runs are opt-in or transparent)

## Acceptance Criteria
- [ ] Cache key derived from: model ID, task ID + version, harness git commit, snapshot content hash, system prompt hash
- [ ] Cache store reads/writes JSON run results to `.cache/blb-runs/` with LRU eviction
- [ ] Cache hit returns result in < 100ms without invoking LLM or worktree
- [ ] Cache miss triggers normal harness execution and stores result
- [ ] Cache auto-invalidates when task version, harness commit, or snapshot changes
- [ ] CLI flag `--no-cache` bypasses cache for explicit re-runs
- [ ] Tests cover: cache hit, cache miss, invalidation, eviction, --no-cache flag
- [ ] No regression in existing harness behavior when cache is disabled

## Non-Goals
- Distributed caching across multiple machines
- Cloud-backed cache (S3, Redis)
- Cache sharing between different benchmark versions
