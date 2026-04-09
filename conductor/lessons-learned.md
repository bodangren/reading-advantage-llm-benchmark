# Lessons Learned

> This file is curated working memory, not an append-only log. Keep it at or below **50 lines**.
> Remove or condense entries that are no longer relevant to near-term planning.

## Architecture & Design

- (2026-04-09, leaderboard_20260404) Tabs components need React context for state coordination - independent useState in each subcomponent doesn't share state

## Recurring Gotchas

- (2026-04-09, leaderboard_20260404) SortIcon defined inside component render causes lint error "Cannot create components during render" - move to separate function outside render

## Patterns That Worked Well

- (2026-04-09, leaderboard_20260404) TDD: writing tests before implementation caught tab state coordination issues early

## Planning Improvements
