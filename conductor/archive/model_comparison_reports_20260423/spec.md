# Track Specification: Model Comparison Reports

## Overview

Side-by-side model comparison reports. Select 2+ models and a task set, generate a diff report showing score deltas, per-task breakdowns, strengths/weaknesses analysis. Exportable as PDF and Markdown.

## Requirements

- Report data model that captures selected models, task set, normalized scores, and computed deltas.
- Scoring normalization: all scores displayed on a consistent 0–100 scale regardless of underlying raw scale (0–1 vs 0–100).
- Comparison UI with summary table and per-task diff visualization.
- Per-task breakdown showing which model wins on each task and by how much.
- Strengths/weaknesses analysis: aggregate which model excels at which task categories.
- Export to PDF and Markdown formats.

## Acceptance Criteria

- [ ] User can select 2+ models and a task subset to generate a comparison report.
- [ ] Scores are normalized to 0–100 before display, regardless of raw scale.
- [ ] Summary table shows each model's aggregate score and rank.
- [ ] Per-task diff view highlights winner and delta for each task.
- [ ] Strengths/weaknesses section identifies top-performing categories per model.
- [ ] Report is exportable as PDF with charts and as Markdown with tables.
- [ ] Comparison data is derived from existing run artifacts (no new benchmark execution).

## Out of Scope

- Statistical significance testing across multiple runs.
- Real-time collaborative report editing.
- Historical trend analysis over time (single snapshot only).
