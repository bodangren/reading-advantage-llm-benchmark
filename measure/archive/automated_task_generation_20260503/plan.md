# Plan: Automated Task Generation Pipeline

- [x] Write tests for TaskGenerator that accepts repo path and count, returns list of TaskSpec
- [x] Implement `TaskGenerator` class with LLM prompt template for task generation
- [x] Write tests for generated task schema validation (all required fields present)
- [x] Implement `TaskSpec` Zod schema with generatedBy and generationPrompt metadata
- [x] Write tests for candidate storage (writes JSON to tasks/candidates/ directory)
- [x] Implement `saveCandidateTasks` function that writes and indexes generated tasks
- [x] Write tests for review CLI listing candidates with status
- [x] Implement `asf task generate` CLI subcommand
- [x] Implement `asf task review` CLI subcommand with approve/reject actions
- [x] Add example generation prompt template for web application repos
- [x] Write integration test: generate → validate → review → approve task flow
- [x] Run full test suite: `npm test`