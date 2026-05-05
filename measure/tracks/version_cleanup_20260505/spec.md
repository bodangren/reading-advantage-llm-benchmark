# Spec: Task Versioning Storage Cleanup

## Problem

Task versions are stored at `data/tasks/versions/<taskId>/<version>_<timestamp>.json`. Over time, this directory can accumulate many version files with no automatic cleanup mechanism.

## Solution

Create a cleanup utility that:
1. Removes old version files beyond a configurable retention limit (default: 50 versions per task)
2. Keeps the most recent N versions (by created_at timestamp)
3. Provides a CLI command for manual cleanup
4. Can be run as a standalone script

## Acceptance Criteria

- [ ] `cleanupTaskVersions(taskId, maxVersions?)` function in data.ts
- [ ] CLI command `bun run task-cli.ts cleanup` for manual execution
- [ ] Only keeps most recent `maxVersions` files per task
- [ ] Returns count of deleted versions
- [ ] Unit tests for cleanup logic