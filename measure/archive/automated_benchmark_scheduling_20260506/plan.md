# Implementation Plan: Automated Benchmark Scheduling

## Phase 1: Scheduler Core
- [x] Task: Build schedule engine
  - [x] Write tests for cron parsing and next-run calculation (tests/lib/scheduler.test.ts)
  - [x] Support daily and weekly frequencies (src/lib/scheduler.ts)
  - [x] Persist schedule state to JSON file (src/lib/scheduler.ts getSchedules/saveSchedule)
- [x] Task: Add runner integration
  - [x] Write tests for trigger logic (triggerScheduledRun, processDueSchedules tests)
  - [x] Invoke harness with configured model and task set (triggerScheduledRun function)
  - [x] Capture run ID and save to schedule log (addScheduleLogEntry, updateScheduleLastRun)

## Phase 2: Configuration & UI
- [x] Task: Add schedule config UI
  - [x] Write tests for schedule form
  - [x] Model selector, task set selector, frequency picker
  - [x] List active schedules with next run time
- [x] Task: Add completion notifications
  - [x] Log completion to output
  - [x] Flag regressions against previous run

## Phase 3: Verification
- [x] Task: Manual verification
  - [x] Schedule a test run for 1 minute from now
  - [x] Verify it triggers, completes, and archives correctly
