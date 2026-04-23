# Track Specification: CI/CD Cost Tracking

## Overview

GitHub Actions CI/CD pipeline that automates benchmark runs, tracks API costs per run (token usage × provider pricing), and emits versioned run artifacts. Makes the benchmark reproducible and cost-transparent.

## Requirements

- GitHub Actions workflow triggered on push, PR, and manual dispatch.
- Per-run API cost calculation: token counts × provider pricing tables.
- Versioned run artifacts (JSON) stored as GitHub Actions artifacts and/or committed to a `runs/` directory.
- Run provenance tracking: model name, prompt version, dataset version, timestamp, git SHA.
- Cost budget alerts when a run or cumulative spend exceeds a configurable threshold.
- Pricing table is externalized and updatable without code changes.

## Acceptance Criteria

- [ ] GitHub Actions workflow runs benchmark suite on push and manual dispatch.
- [ ] Each run produces a versioned artifact with scores, token counts, cost breakdown, and provenance metadata.
- [ ] Cost is calculated as `input_tokens × input_price + output_tokens × output_price` per provider/model.
- [ ] Pricing table covers at minimum OpenAI, Anthropic, and Google models.
- [ ] Budget alert fires (workflow warning or failure) when run cost exceeds configurable threshold.
- [ ] Artifacts are retrievable and diffable across runs.

## Out of Scope

- Real-time streaming cost dashboards.
- Automatic provider billing integration (costs are calculated from token counts, not billing APIs).
- Multi-repo orchestration.
