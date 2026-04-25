# Implementation Plan

## Phase 1: Dataset Version Contract
- [x] Task: Define dataset version metadata fields and storage location.
  - [x] Add validation for version format.
  - [x] Add tests for parse/validation behavior.
- [x] Task: Wire dataset version into benchmark run records.
  - [x] Persist version with run outputs.
  - [x] Add tests for backward compatibility with existing records.
- [ ] Task: Measure - User Manual Verification 'Dataset Version Contract' (Protocol in workflow.md)

## Phase 2: Reproducibility Surfacing [checkpoint: 5a3d760]
- [x] Task: Surface dataset version in leaderboard and run detail views. caf334b
- [x] Task: Add reproducibility smoke test for same-version reruns. 57b0e78
- [x] Task: Document version bump and migration process. b4cbb8d
- [x] Task: Measure - User Manual Verification 'Reproducibility Surfacing' (Protocol in workflow.md) 5a3d760

