# Implementation Plan: Mobile Task Domain Expansion

## Phase 1: Task Definition
- [ ] Task: Define React Native task templates
  - [ ] Write tests for task schema validation
  - [ ] Create task for native module integration
  - [ ] Create task for navigation refactor
  - [ ] Create task for async storage migration
- [ ] Task: Update scoring rubric
  - [ ] Add mobile-specific criteria (platform parity, permission handling)
  - [ ] Write tests for rubric scoring

## Phase 2: Harness Support
- [ ] Task: Add React Native repo detection
  - [ ] Write tests for repo type detection
  - [ ] Detect package.json with react-native dependency
  - [ ] Set environment variables for mobile runs
- [ ] Task: Update runner for mobile build steps
  - [ ] Support `npm run ios` / `npm run android` as build commands
  - [ ] Capture metro bundler errors in artifacts

## Phase 3: Catalog Integration
- [ ] Task: Publish tasks to catalog
  - [ ] Write tests for catalog listing
  - [ ] Add mobile category filter to UI
  - [ ] Verify tasks appear on methodology page
