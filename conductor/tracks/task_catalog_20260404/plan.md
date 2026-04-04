# Implementation Plan

## Phase 1: Task Catalog UI [checkpoint: 4291e59]
- [x] Task: Create the main Tasks listing page. 059a778
    - [x] Create `app/tasks/page.tsx`.
    - [x] Fetch tasks using the data pipeline.
    - [x] Render a grid of `TaskCard` components utilizing shadcn/ui.
- [x] Task: Create the Task Detail dynamic route. 91dcd9d
    - [x] Create `app/tasks/[id]/page.tsx` and implement `generateStaticParams`.
    - [x] Render the task description, difficulty, and grading rubric.
- [x] Task: Conductor - User Manual Verification 'Task Catalog UI' (Protocol in workflow.md) 4291e59

## Phase 2: Run Detail UI
- [ ] Task: Create the Run Detail dynamic route.
    - [ ] Create `app/runs/[id]/page.tsx` and implement `generateStaticParams`.
    - [ ] Fetch run details and display the score breakdown.
    - [ ] Create a simple UI to display diff summaries or files changed.
- [ ] Task: Conductor - User Manual Verification 'Run Detail UI' (Protocol in workflow.md)