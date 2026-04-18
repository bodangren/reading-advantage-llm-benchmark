# Implementation Plan: Task Catalog & Detail UI

## Phase 1: Data Layer & Fixture

- [x] Task: Define `Task` TypeScript type and JSON schema. deb0f81
  - [x] Fields: `id`, `title`, `difficulty`, `domain`, `description`, `repo_context`, `acceptance_criteria[]`, `rubric` (object with five scoring dimensions).
  - [x] Add `tasks/blb-task-001.json` fixture matching the schema.
- [x] Task: Write build-time data loader (`lib/tasks.ts`). deb0f81
  - [x] `getAllTasks(): Task[]` — reads all `tasks/*.json` at build time using `fs`.
  - [x] `getTask(id: string): Task | null`.
  - [x] Validate that each JSON file matches the schema (throw on missing required fields).
- [x] Task: Write unit tests for loader with fixture data. deb0f81
- [ ] Task: Conductor — User Manual Verification 'Phase 1: Data Layer & Fixture' (Protocol in workflow.md)

## Phase 2: Task List Page (`/tasks`)

- [x] Task: Build `/app/tasks/page.tsx` as a static Server Component. 4b86216
  - [x] Call `getAllTasks()` at build time.
  - [x] Render task cards: title, difficulty badge, domain tag, description, run count badge.
  - [x] Client component wrapper for difficulty/domain filter controls.
- [x] Task: Implement run count badge. 4b86216
  - [x] `getRunCountForTask(taskId)` — counts matching entries across `runs/*.json`.
  - [x] Greyed badge for zero runs.
- [x] Task: Write component tests with fixture tasks (empty state, populated state, filter). 4b86216
- [ ] Task: Conductor — User Manual Verification 'Phase 2: Task List Page' (Protocol in workflow.md)

## Phase 3: Task Detail Page (`/tasks/[id]`)

- [~] Task: Build `/app/tasks/[id]/page.tsx` with `generateStaticParams`.
  - [ ] Acceptance criteria rendered as a read-only checklist.
  - [ ] Rubric table showing each dimension, its weight, and description.
  - [ ] Repo context shown in a collapsible code block.
  - [ ] "Back to Tasks" and breadcrumb navigation.
- [ ] Task: Write component tests for detail page with fixture task.
- [ ] Task: Verify static export includes all generated task detail pages.
- [ ] Task: Conductor — User Manual Verification 'Phase 3: Task Detail Page' (Protocol in workflow.md)
