# Implementation Plan

## Phase 1: GitHub Actions Setup
- [x] Task: Create benchmark workflow YAML with push, PR, and manual-dispatch triggers.
  - [x] Add tests for workflow syntax validation (actionlint or equivalent).
  - [x] Verify workflow runs end-to-end on a minimal benchmark subset.
- [x] Task: Configure workflow matrix for multiple models/prompts.
  - [x] Add tests for matrix expansion correctness.
- [x] Task: Conductor - User Manual Verification 'GitHub Actions Setup' (Protocol in workflow.md)

## Phase 2: Cost Tracking Module
- [x] Task: Define pricing table schema (provider, model, input_price_per_1k, output_price_per_1k).
  - [x] Add Zod validation tests for pricing entries.
  - [x] Add tests for missing/unknown model fallback behavior.
- [x] Task: Implement cost calculator (token counts × pricing).
  - [x] Add unit tests for cost math across providers.
  - [x] Add integration tests that parse a mock run result and compute cost.
- [x] Task: Conductor - User Manual Verification 'Cost Tracking Module' (Protocol in workflow.md)

## Phase 3: Artifact Versioning
- [x] Task: Define run artifact schema (run_id, git_sha, timestamp, model, prompt_version, dataset_version, scores, token_counts, cost_breakdown).
  - [x] Add Zod validation tests for artifact structure.
- [x] Task: Implement artifact emitter that writes versioned JSON to `runs/` and uploads as GitHub Actions artifact.
  - [x] Add tests for artifact filename convention and content integrity.
  - [x] Add tests for artifact retrieval and diffing across two mock runs.
- [x] Task: Conductor - User Manual Verification 'Artifact Versioning' (Protocol in workflow.md)

## Phase 4: Budget Alerts
- [x] Task: Implement per-run cost threshold check (configurable via workflow env var).
  - [x] Add tests for threshold comparison logic (under, at, over).
- [x] Task: Implement cumulative spend tracker across recent runs (rolling window).
  - [x] Add tests for window calculation and alert triggering.
- [x] Task: Wire alert output into workflow (annotation warning or job failure).
  - [x] Add tests for alert message formatting.
- [x] Task: Conductor - User Manual Verification 'Budget Alerts' (Protocol in workflow.md)
