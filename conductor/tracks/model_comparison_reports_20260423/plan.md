# Implementation Plan

## Phase 1: Data Model and Score Normalization
- [ ] Task: Define comparison report data model (selected models, task set, normalized scores, deltas).
  - [ ] Add Zod schema validation tests for report structure.
- [ ] Task: Implement score normalizer (0–1 → 0–100, passthrough for already-100-scale).
  - [ ] Add unit tests for each scale conversion path.
  - [ ] Add edge-case tests (0, 1, null/missing scores, out-of-range values).
- [ ] Task: Conductor - User Manual Verification 'Data Model and Score Normalization' (Protocol in workflow.md)

## Phase 2: Comparison Engine
- [ ] Task: Implement comparison engine that computes per-task deltas and aggregate rankings.
  - [ ] Add tests for two-model comparison (winner, delta, tie handling).
  - [ ] Add tests for 3+ model comparison (ranking correctness).
- [ ] Task: Implement strengths/weaknesses analyzer (group tasks by category, rank models per category).
  - [ ] Add tests for category aggregation and edge cases (single-task category, tied scores).
- [ ] Task: Conductor - User Manual Verification 'Comparison Engine' (Protocol in workflow.md)

## Phase 3: UI and Report Generation
- [ ] Task: Build comparison report page with model selector and task-set picker.
  - [ ] Add component tests for selector interactions and report rendering.
- [ ] Task: Build summary table component (model, aggregate score, rank).
  - [ ] Add tests for correct sorting and rank assignment.
- [ ] Task: Build per-task diff visualization (bar chart or table with delta highlighting).
  - [ ] Add tests for correct diff rendering and winner indication.
- [ ] Task: Build strengths/weaknesses section with category breakdown.
  - [ ] Add tests for category grouping display.
- [ ] Task: Conductor - User Manual Verification 'UI and Report Generation' (Protocol in workflow.md)

## Phase 4: Export
- [ ] Task: Implement Markdown export (tables for summary, per-task, and strengths/weaknesses).
  - [ ] Add snapshot tests for Markdown output structure.
- [ ] Task: Implement PDF export (charts rendered to images, styled layout).
  - [ ] Add tests for PDF generation (file produced, page count, content spot-checks).
- [ ] Task: Conductor - User Manual Verification 'Export' (Protocol in workflow.md)
