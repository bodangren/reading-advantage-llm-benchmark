# Implementation Plan: Task Difficulty Calibration

## Phase 1: Calibration Engine
- [x] Task: Build difficulty calibration core
  - [x] Write tests for pass-rate analysis (all models, per task)
  - [x] Compute raw pass rate from Run scores (total_score >= threshold)
  - [x] Convert pass rate to 0-100 difficulty score (inverted and scaled)
  - [x] Handle edge cases: zero runs, perfect pass rate, single-model bias
  - [x] Add `calibrated_difficulty` and `difficulty_percentile` fields to Task schema

- [x] Task: Build calibration report generator
  - [x] Write tests for over/under-rated detection
  - [x] Compare manual label vs calibrated score
  - [x] Flag tasks where label diverges by >1 category
  - [x] Export report as JSON

## Phase 2: Reclassification & Data Persistence
- [ ] Task: Add auto-reclassification logic
  - [ ] Write tests for threshold-based reclassification
  - [ ] Define thresholds: easy <= 33, medium 34-66, hard >= 67 difficulty score
  - [ ] CLI command to apply reclassification to task JSON files
  - [ ] Dry-run mode showing proposed changes without writing

- [ ] Task: Add calibration data file
  - [ ] Write tests for calibration JSON structure
  - [ ] Persist calibration results to `data/calibration/difficulty_scores.json`
  - [ ] Include computed_at timestamp and run count used

## Phase 3: UI Integration
- [ ] Task: Update TaskCard with calibrated difficulty
  - [ ] Write tests for difficulty badge rendering
  - [ ] Display difficulty score and percentile alongside manual label
  - [ ] Color-code badge by difficulty tier

- [ ] Task: Add difficulty distribution chart
  - [ ] Write tests for chart data formatting
  - [ ] Histogram of task difficulty scores in task catalog page
  - [ ] Highlight tasks pending reclassification

- [ ] Task: Add calibration report page
  - [ ] Write tests for report rendering
  - [ ] Table of over/under-rated tasks with suggested labels
  - [ ] One-click apply reclassification button (client-side demo)

- [ ] Task: Manual verification
  - [ ] Run calibration against existing runs data
  - [ ] Verify reported difficulty scores are intuitive
  - [ ] Confirm no tasks are incorrectly reclassified
