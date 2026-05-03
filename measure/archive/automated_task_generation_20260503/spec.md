# Spec: Automated Task Generation Pipeline

## Problem

Task authoring is manual — each task requires hand-writing descriptions, acceptance criteria, and rubrics. This limits benchmark scale. An LLM-assisted pipeline can generate candidate tasks from repo snapshots, which humans then review and approve.

## Goals

- Accept a repo snapshot and generate candidate task specifications via LLM
- Produce structured task JSON with description, difficulty, acceptance criteria, and rubric
- Store generated tasks in a review queue before promoting to the active catalog
- Track provenance (which model generated the task, prompt used)

## Non-Goals

- Fully automated task approval (human review required)
- Generating tasks from scratch without a repo context
- Multi-language repo support (English-only tasks)

## Acceptance Criteria

- [ ] CLI command `asf task generate --repo snapshots/webapp-v1 --count 5` produces 5 candidate tasks
- [ ] Each candidate task conforms to the TaskSchema (description, difficulty, criteria, rubric)
- [ ] Tasks include `generatedBy` and `generationPrompt` metadata fields
- [ ] Generated tasks are written to `tasks/candidates/` directory
- [ ] `asf task review` CLI lists candidates for human approval
- [ ] Unit tests cover task generation, schema validation, and review flow
