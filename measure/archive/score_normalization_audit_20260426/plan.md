# Score Normalization Audit — Implementation Plan

## Phase 1: Audit [x]
- [x] List all score-related code locations
- [x] Identify current format (0-1 vs 0-100) at each location
- [x] Document normalization requirements

## Phase 2: Standardize [x]
- [x] Update internal storage to 0-1 format (RunDetailSchema.total_score uses min(0).max(1))
- [x] Update display components to 0-100 format (LeaderboardTable checks <=1 for conversion)
- [x] Add conversion utilities where needed (normalizeScore in scoreNormalizer.ts)

## Phase 3: Validate [x]
- [x] Test leaderboard display
- [x] Test score comparisons
- [x] Update API documentation
