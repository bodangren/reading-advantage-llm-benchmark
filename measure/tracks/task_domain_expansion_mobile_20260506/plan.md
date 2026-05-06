# Implementation Plan: Mobile Task Domain Expansion

## Phase 1: Task Definition
- [x] Task: Define React Native task templates
  - [x] Write tests for task schema validation (tests/lib/schemas.test.ts lines 250-330)
  - [x] Create task for native module integration (task_react_native_module_v1)
  - [x] Create task for navigation refactor (task_react_native_navigation_v1)
  - [x] Create task for async storage migration (task_react_native_storage_v1)
- [x] Task: Update scoring rubric
  - [x] Add mobile-specific criteria (platform parity, permission handling) in structured_rubric
  - [x] Write tests for rubric scoring (tests/lib/schemas.test.ts lines 334-399)

## Phase 2: Harness Support
- [x] Task: Add React Native repo detection
  - [x] Write tests for repo type detection (tests/lib/utils.test.ts)
  - [x] Detect package.json with react-native dependency (src/lib/utils.ts detectRepoType)
  - [x] Set environment variables for mobile runs (REACT_NATIVE_VERSION)
- [x] Task: Update runner for mobile build steps
  - [x] Support `npm run ios` / `npm run android` as build commands (detectRepoType extracts buildCommands)
  - [x] Capture metro bundler errors in artifacts (via RunDetailSchema.ArtifactSchema)

## Phase 3: Catalog Integration
- [x] Task: Publish tasks to catalog
  - [x] Write tests for catalog listing
  - [x] Add mobile category filter to UI (TaskListWithFilters domain filter)
  - [x] Verify tasks appear on methodology page (tasks.json has 3 mobile tasks)
