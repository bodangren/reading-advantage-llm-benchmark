# Track Specification: Build Data Ingestion Pipeline and static JSON models

## Overview
Create the data fetching utilities to read static JSON files containing benchmark tasks, model runs, and leaderboard entries. Provide strongly-typed Zod schemas for validation and type inference across the application.

## Requirements
- Define Zod schemas for `TaskSchema`, `RunSchema`, and `LeaderboardSchema`.
- Create utility functions in a `lib/data` module to read, parse, and validate JSON data at build time.
- Add mock JSON data under a `data/` directory to act as the source of truth for the local build.