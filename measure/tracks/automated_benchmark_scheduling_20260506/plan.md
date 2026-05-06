# Implementation Plan: Automated Benchmark Scheduling

## Phase 1: Scheduler Core
- [x] Task: Build schedule engine
  - [x] Write tests for cron parsing and next-run calculation (tests/lib/scheduler.test.ts)
  - [x] Support daily and weekly frequencies (src/lib/scheduler.ts)
  - [x] Persist schedule state to JSON file (src/lib/scheduler.ts getSchedules/saveSchedule)
- [ ] Task: Add runner integration
  - [ ] Write tests for trigger logic
  - [ ] Invoke harness with configured model and task set
  - [ ] Capture run ID and save to schedule log

## Phase 2: Configuration & UI
- [ ] Task: Add schedule config UI
  - [ ] Write tests for schedule form
  - [ ] Model selector, task set selector, frequency picker
  - [ ] List active schedules with next run time
- [ ] Task: Add completion notifications
  - [ ] Log completion to output
  - [ ] Flag regressions against previous run

## Phase 3: Verification
- [ ] Task: Manual verification
  - [ ] Schedule a test run for 1 minute from now
  - [ ] Verify it triggers, completes, and archives correctly
