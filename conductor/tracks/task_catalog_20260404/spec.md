# Track Specification: Implement Task Catalog and Run Detail Pages

## Overview
Develop the dynamic routes and UI components required to list benchmark tasks (`/tasks`), view detailed task descriptions (`/tasks/[id]`), and review individual model performance on specific tasks (`/runs/[id]`).

## Requirements
- Create a grid/list UI for displaying all available tasks.
- Implement dynamic routing in Next.js using `generateStaticParams` for tasks and runs.
- Develop the Task Detail Page to display the description, difficulty, rubric, and repo context.
- Develop the Run Detail Page to display the score breakdown, diff summary, and artifacts.