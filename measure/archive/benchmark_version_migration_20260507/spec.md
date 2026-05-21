# Track: Benchmark Version Migration

## Overview
Enable version-aware comparison of benchmark results. As the BLB dataset, harness, or scoring evolves, scores across different `benchmark_version` values become incomparable. This track introduces version filtering, cross-version normalization, and a version history page so users can fairly compare models across benchmark iterations.

## Goals
- Filter leaderboard and analytics by benchmark version
- Normalize scores across versions using a stable baseline
- Surface version history and changelog to users
- Flag runs collected under outdated benchmark versions

## Acceptance Criteria
- [ ] Leaderboard page includes a version selector dropdown
- [ ] Version-specific leaderboard computed correctly from filtered runs
- [ ] Cross-version normalization produces comparable scores using a baseline version
- [ ] Version history/changelog page lists all benchmark versions with release notes
- [ ] Runs from non-latest versions show an "outdated" warning badge
- [ ] Version compatibility matrix shows which versions can be directly compared
- [ ] Tests cover version filtering, normalization math, and compatibility logic

## Non-Goals
- Automatically migrating or rewriting historical run data
- Backfilling missing versions for old runs
- Write endpoints to publish new versions
