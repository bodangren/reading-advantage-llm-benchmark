# Implementation Plan

## Phase 1: Pipeline Skeleton and Contracts
- [x] Task: Define model matrix input format and validation.
  - [x] Add schema tests for model/harness config.
  - [x] Add guardrails for unsupported combinations.
- [x] Task: Build execution orchestrator scaffold.
  - [x] Implement per-model run loop with isolated result capture.
  - [x] Add tests for partial-failure behavior.
- [x] Task: Conductor - User Manual Verification 'Pipeline Skeleton and Contracts' [checkpoint: faec7ac] (Protocol in workflow.md)

## Phase 2: Aggregation and Reporting
- [x] Task: Implement normalized aggregation output for leaderboard ingestion.
  - [x] Add mapping tests for key metrics and metadata.
  - [x] Validate compatibility with existing leaderboard components.
- [x] Task: Add operator command/docs for one-shot pipeline runs.
- [ ] Task: Conductor - User Manual Verification 'Aggregation and Reporting' (Protocol in workflow.md)

