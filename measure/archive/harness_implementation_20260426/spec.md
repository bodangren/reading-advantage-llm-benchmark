# Harness Implementation

## Problem
Pipeline harness interface is a stub returning mock Run objects, preventing real model evaluation.

## Solution
Replace stub harness with real OpenCode API integration for actual model evaluation.

## Acceptance Criteria
- [ ] Harness connects to real OpenCode API
- [ ] Real model evaluations execute successfully
- [ ] Results stored in database
- [ ] Mock mode preserved for development
