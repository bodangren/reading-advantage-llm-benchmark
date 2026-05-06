# Track: Task Difficulty Calibration

## Overview
Replace manually-assigned difficulty labels with statistically validated, data-driven difficulty scores computed from historical model performance. A credible benchmark requires that "hard" tasks are actually hard and "easy" tasks are actually easy.

## Goals
- Compute per-task difficulty scores from actual pass rates across all models
- Automatically reclassify tasks when empirical difficulty diverges from label
- Surface difficulty distribution and calibration health in the UI
- Provide a calibration report that identifies over/under-rated tasks

## Acceptance Criteria
- [ ] Difficulty calibration engine analyzes historical runs and emits a 0-100 difficulty score per task
- [ ] Tasks are auto-reclassified (easy/medium/hard) based on calibrated thresholds
- [ ] TaskCard displays calibrated difficulty with a percentile badge
- [ ] Task catalog includes a difficulty distribution chart
- [ ] Calibration report lists over-rated and under-rated tasks with suggested new labels
- [ ] Tests cover calibration logic, threshold edge cases, and reclassification rules

## Non-Goals
- Predicting difficulty for brand-new tasks with zero run history
- Real-time recalculation on every new run (batch/offline process is fine)
- Modifying the scoring rubric or weights
