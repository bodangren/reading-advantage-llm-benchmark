# Track: Task Authoring Interface

## Overview
UI for creating, editing, and managing benchmark tasks with validation, preview, and version control.

## Problem Statement
Tasks are currently authored as raw JSON files, requiring manual schema compliance and offering no preview or validation. This limits task creation to technical users.

## Goals
1. Form-based task creation with schema validation
2. Live preview of task description rendering
3. Task versioning and change tracking
4. Bulk task import/export

## Acceptance Criteria
- [x] Form-based task editor with all required fields
- [x] Real-time schema validation with error messages
- [x] Markdown preview for task descriptions
- [x] Task version history with diff view
- [x] Bulk import/export functionality
- [x] Task status management (draft, review, published)
- [x] Task search and filtering
- [x] Task templates for common patterns

## Technical Notes
- Extend existing task schema with authoring metadata
- Use react-hook-form for form management
- Add markdown renderer for preview
- Store task versions in tasks/versions/