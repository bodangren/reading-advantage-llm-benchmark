# Implementation Plan

## Phase 1: Dataset Version Contract
- [ ] Task: Define dataset version metadata fields and storage location.
  - [ ] Add validation for version format.
  - [ ] Add tests for parse/validation behavior.
- [ ] Task: Wire dataset version into benchmark run records.
  - [ ] Persist version with run outputs.
  - [ ] Add tests for backward compatibility with existing records.
- [ ] Task: Conductor - User Manual Verification 'Dataset Version Contract' (Protocol in workflow.md)

## Phase 2: Reproducibility Surfacing
- [ ] Task: Surface dataset version in leaderboard and run detail views.
- [ ] Task: Add reproducibility smoke test for same-version reruns.
- [ ] Task: Document version bump and migration process.
- [ ] Task: Conductor - User Manual Verification 'Reproducibility Surfacing' (Protocol in workflow.md)

