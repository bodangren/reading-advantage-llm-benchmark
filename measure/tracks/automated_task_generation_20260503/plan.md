# Plan: Automated Task Generation Pipeline

- [ ] Write tests for TaskGenerator that accepts repo path and count, returns list of TaskSpec
- [ ] Implement `TaskGenerator` class with LLM prompt template for task generation
- [ ] Write tests for generated task schema validation (all required fields present)
- [ ] Implement `TaskSpec` Zod schema with generatedBy and generationPrompt metadata
- [ ] Write tests for candidate storage (writes JSON to tasks/candidates/ directory)
- [ ] Implement `saveCandidateTasks` function that writes and indexes generated tasks
- [ ] Write tests for review CLI listing candidates with status
- [ ] Implement `asf task generate` CLI subcommand
- [ ] Implement `asf task review` CLI subcommand with approve/reject actions
- [ ] Add example generation prompt template for web application repos
- [ ] Write integration test: generate → validate → review → approve task flow
- [ ] Run full test suite: `npm test`
