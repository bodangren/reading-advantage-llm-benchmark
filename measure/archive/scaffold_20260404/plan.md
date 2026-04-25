# Implementation Plan

## Phase 1: Setup and Architecture [checkpoint: 5d2f7c6]
- [x] Task: Initialize Next.js project with App Router, TypeScript, Tailwind, and shadcn/ui. 7754a3a
    - [x] Run `npx create-next-app@latest` with appropriate flags.
    - [x] Configure `components.json` for shadcn/ui.
- [x] Task: Setup baseline directory structure for components, lib, and static data. 9259f4f
    - [x] Create `data/`, `components/ui/`, `components/layout/`.
    - [x] Add basic JSON mock data for tasks and leaderboard.
- [x] Task: Measure - User Manual Verification 'Setup and Architecture' (Protocol in workflow.md)

## Phase 2: Core Layout Implementation [checkpoint: 0fb1710]
- [x] Task: Implement main application shell (Header, Navigation, Footer). 2f21527
    - [x] Create `Header.tsx` with logo and dark mode toggle.
    - [x] Create `Footer.tsx` with benchmark metadata.
    - [x] Apply to `app/layout.tsx`.
- [x] Task: Measure - User Manual Verification 'Core Layout Implementation' (Protocol in workflow.md)