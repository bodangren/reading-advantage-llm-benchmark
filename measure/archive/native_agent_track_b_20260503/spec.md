# Spec: Track B — Native Agent Evaluation Mode

## Problem

The product defines two evaluation tracks: Track A (Fixed Harness, all models use identical OpenCode config) and Track B (Native Agent, models use their own best agent/harness). Track A is implemented; Track B has no infrastructure. Without Track B, the benchmark cannot compare model-native capabilities against harness-standardized performance.

## Goals

- Define a harness abstraction that allows swapping between fixed OpenCode and model-native agents
- Implement a configuration schema for Track B runs (agent type, custom system prompt, tool access)
- Extend the evaluation workflow to support both tracks in a single run
- Add track metadata to run records for leaderboard filtering

## Non-Goals

- Building custom agent harnesses for each model
- Real-time agent monitoring during evaluation
- Automatic harness selection based on model capabilities

## Acceptance Criteria

- [ ] `TrackConfig` Zod schema supports `fixed` and `native` track types
- [ ] Run records include `track` field with Track A / Track B designation
- [ ] Leaderboard page can filter by track type
- [ ] `asf benchmark run --track native --model gpt-4o` executes with model-native agent config
- [ ] Unit tests cover TrackConfig validation and run record serialization
