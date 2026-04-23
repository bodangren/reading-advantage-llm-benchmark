# Implementation Plan

## Phase 1: GitHub Actions Setup
- [ ] Task: Create benchmark workflow YAML with push, PR, and manual-dispatch triggers.
  - [ ] Add tests for workflow syntax validation (actionlint or equivalent).
  - [ ] Verify workflow runs end-to-end on a minimal benchmark subset.
- [ ] Task: Configure workflow matrix for multiple models/prompts.
  - [ ] Add tests for matrix expansion correctness.
- [ ] Task: Conductor - User Manual Verification 'GitHub Actions Setup' (Protocol in workflow.md)

## Phase 2: Cost Tracking Module
- [ ] Task: Define pricing table schema (provider, model, input_price_per_1k, output_price_per_1k).
  - [ ] Add Zod validation tests for pricing entries.
  - [ ] Add tests for missing/unknown model fallback behavior.
- [ ] Task: Implement cost calculator (token counts × pricing).
  - [ ] Add unit tests for cost math across providers.
  - [ ] Add integration tests that parse a mock run result and compute cost.
- [ ] Task: Conductor - User Manual Verification 'Cost Tracking Module' (Protocol in workflow.md)

## Phase 3: Artifact Versioning
- [ ] Task: Define run artifact schema (run_id, git_sha, timestamp, model, prompt_version, dataset_version, scores, token_counts, cost_breakdown).
  - [ ] Add Zod validation tests for artifact structure.
- [ ] Task: Implement artifact emitter that writes versioned JSON to `runs/` and uploads as GitHub Actions artifact.
  - [ ] Add tests for artifact filename convention and content integrity.
  - [ ] Add tests for artifact retrieval and diffing across two mock runs.
- [ ] Task: Conductor - User Manual Verification 'Artifact Versioning' (Protocol in workflow.md)

## Phase 4: Budget Alerts
- [ ] Task: Implement per-run cost threshold check (configurable via workflow env var).
  - [ ] Add tests for threshold comparison logic (under, at, over).
- [ ] Task: Implement cumulative spend tracker across recent runs (rolling window).
  - [ ] Add tests for window calculation and alert triggering.
- [ ] Task: Wire alert output into workflow (annotation warning or job failure).
  - [ ] Add tests for alert message formatting.
- [ ] Task: Conductor - User Manual Verification 'Budget Alerts' (Protocol in workflow.md)
