# Product Definition

## 1. Overview
**Product Name:** Brownfield LLM Benchmark (BLB)

**Definition:**
A benchmark platform that evaluates large language models (LLMs) and agent systems on their ability to perform real-world feature integration tasks in an existing production codebase.

**Core Principle:**
Measure *brownfield engineering capability* (integration, correctness, safety), not synthetic coding performance.

## 2. Target Audience & Goals
**Primary Target Audience:** Engineering teams evaluating LLMs for practical, real-world task success rates.
**Primary Goals:** Provide a credible, reproducible benchmark for real-world software engineering tasks; enable apples-to-apples comparison of models under a fixed harness.

## 3. Benchmark Philosophy & Harness Standardization
- BLB evaluates models under a **fixed agent runtime** (e.g., OpenCode pinned version).
- Harness is part of the benchmark definition; results are *model-in-harness*.
- Fixed Parameters: System prompt, tool access, max steps/turns, time limits, repo snapshots, task prompt template, scoring logic.

## 4. Evaluation Tracks
- **Track A (Primary):** Fixed Harness (All models use identical OpenCode configuration).
- **Track B (Secondary):** Native Agent (Models use their own best agent/harness).

## 5. Core Features
- **Leaderboard:** Displays Model, Provider, Harness, Benchmark version, scores, and date.
- **Task Catalog:** Tasks include description, difficulty, repo context, acceptance criteria, and rubric.
- **Run Detail Page:** Score breakdown, diff summary, test results, and artifacts.
- **Methodology Page:** Explains benchmark philosophy, harness design, and scoring system.

## 6. Task Design
**Complexity:** Medium (Feature Integration) - Adding standard features, integrating modules, etc.
**Initial Domain:** Web Applications (Adding pages, components, API routes to an existing web app).
**Task Nature:** Multi-step, cross-cutting tasks using real production repo snapshots.

## 7. Scoring System
Total Score: 100
- Functional correctness: 40
- Integration quality: 25
- Regression safety: 20
- Minimality: 10
- Process quality: 5

## 8. Technical Specification Highlights
- **Evaluation Workflow:** Create Git worktree -> Run OpenCode agent -> Capture diffs/logs -> Execute tests/build -> Compute scores -> Emit JSON.
- **Data Storage:** Static JSON files in repo (`/tasks`, `/runs`, `/leaderboard`).
- **Frontend:** Static Next.js export, no backend required. Deployed to CDN/GitHub Pages.