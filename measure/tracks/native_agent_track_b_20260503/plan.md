# Plan: Track B — Native Agent Evaluation Mode

- [ ] Write tests for TrackConfig Zod schema (fixed/native enum, optional agentConfig)
- [ ] Implement `TrackConfig` schema in `lib/schemas.ts` with track type and agent config fields
- [ ] Write tests for run record serialization with track field
- [ ] Extend `RunDetailSchema` to include `track: "fixed" | "native"` field
- [ ] Write tests for leaderboard filtering by track type
- [ ] Add track filter UI component to leaderboard page
- [ ] Implement `--track` CLI flag in benchmark runner script
- [ ] Write tests for native agent config validation (agentType, systemPrompt, toolAccess)
- [ ] Add example Track B config file for GPT-4o native agent
- [ ] Update methodology page to document Track B evaluation mode
- [ ] Run full test suite: `npm test`
