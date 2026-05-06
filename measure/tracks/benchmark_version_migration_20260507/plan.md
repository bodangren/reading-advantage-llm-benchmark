# Implementation Plan: Benchmark Version Migration

## Phase 1: Version-Aware Data Layer
- [ ] Task: Build version grouping and filtering utilities
  - [ ] Write tests for grouping runs by benchmark_version
  - [ ] Extract unique versions from run data with run counts
  - [ ] Filter leaderboard entries by selected version
  - [ ] Detect latest benchmark_version from runs

- [ ] Task: Build version metadata schema
  - [ ] Write tests for version metadata validation
  - [ ] Create BenchmarkVersionSchema (version, release_date, description, breaking_changes, baseline_task_count)
  - [ ] Load version metadata from `data/versions.json`
  - [ ] Default to derived metadata when `versions.json` is missing

## Phase 2: Cross-Version Normalization
- [ ] Task: Implement score normalization engine
  - [ ] Write tests for baseline version selection and score adjustment
  - [ ] Compute mean score per version across common models
  - [ ] Calculate version drift factor relative to baseline version
  - [ ] Apply drift factor to normalize scores for fair comparison
  - [ ] Store normalization metadata alongside leaderboard data

- [ ] Task: Build version compatibility matrix
  - [ ] Write tests for compatibility detection
  - [ ] Determine if two versions share enough common tasks/models for direct comparison
  - [ ] Export compatibility matrix as JSON
  - [ ] Flag incompatible version pairs

## Phase 3: UI & Documentation
- [ ] Task: Add version selector to leaderboard
  - [ ] Write tests for version selector component
  - [ ] Dropdown to switch between benchmark versions
  - [ ] Default to latest version on initial load
  - [ ] Show run count per version in dropdown

- [ ] Task: Add outdated version warnings
  - [ ] Write tests for outdated badge rendering
  - [ ] Show "outdated" badge on run detail pages when run.version !== latest
  - [ ] Tooltip explaining the version mismatch
  - [ ] Banner on leaderboard when viewing an older version

- [ ] Task: Add version history page
  - [ ] Write tests for version history rendering
  - [ ] Page at `/versions` listing all benchmark versions
  - [ ] Show release date, description, breaking changes, and task count per version
  - [ ] Link from methodology page

- [ ] Task: Manual verification
  - [ ] Verify version selector filters leaderboard correctly
  - [ ] Confirm normalized scores look reasonable across versions
  - [ ] Check outdated badges appear on applicable runs
