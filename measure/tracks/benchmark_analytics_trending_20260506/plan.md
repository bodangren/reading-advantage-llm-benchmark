# Implementation Plan: Benchmark Analytics & Trending

## Phase 1: Trend Data
- [ ] Task: Build trend aggregation
  - [ ] Write tests for time-series grouping
  - [ ] Aggregate run scores by week/month per model
  - [ ] Calculate moving average

## Phase 2: Charts & UI
- [ ] Task: Add trend line chart
  - [ ] Write tests for chart data formatting
  - [ ] Recharts line chart with model series
  - [ ] Toggle between score types (overall, correctness, safety)
- [ ] Task: Add regression highlighting
  - [ ] Write tests for regression detection
  - [ ] Highlight drops > 5% from previous run
  - [ ] Show alert badge on affected model

## Phase 3: Comparison & Export
- [ ] Task: Add historical comparison
  - [ ] Multi-model selector for date range
  - [ ] Table view with deltas
- [ ] Task: Add CSV export
  - [ ] Export filtered trend data
- [ ] Task: Manual verification
  - [ ] Verify charts render with real run history
