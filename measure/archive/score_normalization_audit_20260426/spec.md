# Score Normalization Audit

## Problem
Score format is ambiguous (0-1 vs 0-100) in LeaderboardTable, causing confusion.

## Solution
Standardize score format across all components (0-100 display, 0-1 internal).

## Acceptance Criteria
- [ ] All scores stored as 0-1 internally
- [ ] All scores displayed as 0-100 in UI
- [ ] No mixed formats in codebase
- [ ] Documentation updated
