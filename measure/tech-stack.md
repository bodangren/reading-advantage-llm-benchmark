# Tech Stack

## 1. Programming Languages
- **TypeScript:** Primary language for all frontend logic, providing strict type-safety and excellent IDE support.

## 2. Frontend Framework
- **Next.js (App Router):** The core framework, utilizing React Server Components and static export support to generate a fast, CDN-deployable site.

## 3. Styling & UI Components
- **Tailwind CSS:** Utility-first CSS framework for rapid and consistent styling.
- **shadcn/ui:** Pre-built, accessible, and highly customizable UI components (e.g., tables, cards, dialogs).

## 4. Data Management
- **Local JSON files:** Benchmark data (tasks, runs, leaderboard) will be stored statically in the repository as JSON and parsed directly at build time to populate the frontend.

## 5. Evaluation Harness (External)
- **OpenCode:** A standardized, version-pinned evaluation harness responsible for creating Git worktrees, executing agents, running tests, and generating the static JSON output.

## 6. Deployment
- **Static Export:** The application is built using `next export` and deployed to a static host (e.g., GitHub Pages or Vercel) without requiring a runtime backend.