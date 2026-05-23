# Track: Performance Optimization Task Domain

## Overview
Add performance-focused brownfield tasks to the BLB catalog. Real engineering work often involves optimizing slow database queries, reducing bundle sizes, or adding caching layers without changing external behavior. This track evaluates model capability to diagnose and fix performance issues in existing production code.

## Goals
- Add 5–8 performance optimization tasks to the benchmark catalog
- Create repo snapshots with measurable performance problems: N+1 queries, missing indexes, large bundle sizes, unmemoized React renders, missing HTTP caching
- Include baseline and target metrics for each task (e.g., query time < 100ms, bundle < 200KB)
- Adapt scoring to reward measurable improvement and safety

## Acceptance Criteria
- [ ] At least 5 performance tasks added to `data/tasks.json` with repo snapshots and rubrics
- [ ] Repo snapshots cover: database query optimization, React render optimization, API response caching, bundle/code splitting, memory leak fix
- [ ] Each task includes measurable baseline/target metrics and a validation script
- [ ] Scoring rubric weights performance improvement (35), regression safety (30), test preservation (20), minimality (10), metric documentation (5)
- [ ] All new tasks pass harness validation
- [ ] Leaderboard supports "Performance" domain filter

## Non-Goals
- Distributed systems performance (single-node only)
- Load testing infrastructure (focus on code-level fixes)
- GPU/ML inference optimization
