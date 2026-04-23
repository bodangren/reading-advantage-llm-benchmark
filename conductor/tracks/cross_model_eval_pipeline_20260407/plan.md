# Implementation Plan

## Phase 1: Pipeline Skeleton and Contracts
- [x] Task: Define model matrix input format and validation.
  - [x] Add schema tests for model/harness config.
  - [x] Add guardrails for unsupported combinations.
- [ ] Task: Build execution orchestrator scaffold.
  - [ ] Implement per-model run loop with isolated result capture.
  - [ ] Add tests for partial-failure behavior.
- [ ] Task: Conductor - User Manual Verification 'Pipeline Skeleton and Contracts' (Protocol in workflow.md)

## Phase 2: Aggregation and Reporting
- [ ] Task: Implement normalized aggregation output for leaderboard ingestion.
  - [ ] Add mapping tests for key metrics and metadata.
  - [ ] Validate compatibility with existing leaderboard components.
- [ ] Task: Add operator command/docs for one-shot pipeline runs.
- [ ] Task: Conductor - User Manual Verification 'Aggregation and Reporting' (Protocol in workflow.md)

