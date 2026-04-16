# Implementation Plan

## Phase 1: Dataset Version Contract
- [x] Task: Define dataset version metadata fields and storage location.
  - [x] Add validation for version format.
  - [x] Add tests for parse/validation behavior.
- [x] Task: Wire dataset version into benchmark run records.
  - [x] Persist version with run outputs.
  - [x] Add tests for backward compatibility with existing records.
- [ ] Task: Conductor - User Manual Verification 'Dataset Version Contract' (Protocol in workflow.md)

## Phase 2: Reproducibility Surfacing
- [ ] Task: Surface dataset version in leaderboard and run detail views.
- [ ] Task: Add reproducibility smoke test for same-version reruns.
- [ ] Task: Document version bump and migration process.
- [ ] Task: Conductor - User Manual Verification 'Reproducibility Surfacing' (Protocol in workflow.md)

