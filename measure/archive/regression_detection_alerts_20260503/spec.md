# Spec: Regression Detection & Alert System

## Problem

No system exists to detect when a model's score regresses across benchmark versions. Without regression detection, degraded model performance goes unnoticed until manual review.

## Goals

- Compare scores across consecutive runs for the same model
- Flag regressions exceeding a configurable threshold (default: 5% absolute drop)
- Generate a regression report as markdown with model, task, and score delta
- Support CI integration via exit code (non-zero on regression detected)

## Non-Goals

- Real-time alerting (Slack, email)
- Automatic model retraining triggers
- Statistical significance testing (simple threshold comparison)

## Acceptance Criteria

- [ ] `asf benchmark regress --model gpt-4o --threshold 5` compares last two runs
- [ ] Regression report lists tasks where score dropped by more than threshold
- [ ] Exit code is 1 when regressions detected, 0 when clean
- [ ] Report includes before/after scores and absolute delta per regressed task
- [ ] Unit tests cover threshold comparison, report generation, and exit code logic
