# Plan: Track B — Native Agent Evaluation Mode

- [x] Write tests for TrackConfig Zod schema (fixed/native enum, optional agentConfig)
- [x] Implement `TrackConfig` schema in `lib/schemas.ts` with track type and agent config fields
- [x] Write tests for run record serialization with track field
- [x] Extend `RunDetailSchema` to include `track: "fixed" | "native"` field
- [x] Write tests for leaderboard filtering by track type
- [x] Add track filter UI component to leaderboard page
- [x] Implement `--track` CLI flag in benchmark runner script
- [x] Write tests for native agent config validation (agentType, systemPrompt, toolAccess)
- [x] Add example Track B config file for GPT-4o native agent
- [x] Update methodology page to document Track B evaluation mode
- [x] Run full test suite: `npm test`

## Implementation Summary

### Phase 1: Schema Foundation
- Added `TrackConfigSchema` with discriminatedUnion for fixed/native track types
- Added `AgentConfigSchema` with agentType, systemPrompt, toolAccess fields
- Extended `RunDetailSchema` with optional `track` field
- Added comprehensive tests for TrackConfig validation

### Phase 2: Leaderboard Filtering
- Added `track` field to `LeaderboardSchema`
- Added `filterByTrack()` utility for filtering entries by track type
- Added `normalizeScore()` utility for score normalization (0-1 → 0-100)
- Added Track badge component with icon (Bot for native, Settings for fixed)
- Added leaderboard filter tests with sort verification

### Phase 3: CLI Integration
- Extended `ModelMatrixSchema` with track and agent_config fields
- Added `parseArgs()` function to extract --track CLI flag
- Pipeline runner now accepts --track flag: `fixed` (default) or `native`
- Pipeline runner displays track info in startup summary

### Phase 4: Documentation & Examples
- Added `configs/track-b-native-example.json` with full native agent config
- Updated methodology page with Track B details, tool access list, and CLI usage

## Verification
- Tests: 298 passed (19 schema + 14 runs + 6 leaderboard + 259 other)
- Build: Compiles successfully, all routes generated
- All acceptance criteria met