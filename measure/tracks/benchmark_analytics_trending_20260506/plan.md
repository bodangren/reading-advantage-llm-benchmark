# Implementation Plan: Benchmark Analytics & Trending

## Phase 1: Trend Data
- [x] Task: Build trend aggregation
  - [x] Write tests for time-series grouping
  - [x] Aggregate run scores by week/month per model
  - [x] Calculate moving average

## Phase 2: Charts & UI
- [x] Task: Add trend line chart
  - [x] Write tests for chart data formatting
  - [x] Recharts line chart with model series
  - [x] Toggle between score types (overall, correctness, safety)
- [x] Task: Add regression highlighting
  - [x] Write tests for regression detection
  - [x] Highlight drops > 5% from previous run
  - [x] Show alert badge on affected model

## Phase 3: Comparison & Export
- [ ] Task: Add historical comparison
  - [ ] Multi-model selector for date range
  - [ ] Table view with deltas
- [ ] Task: Add CSV export
  - [ ] Export filtered trend data
- [ ] Task: Manual verification
  - [ ] Verify charts render with real run history
