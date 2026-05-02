// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { TaskVersionDiff } from "@/components/TaskVersionDiff"
import type { TaskVersion } from "@/lib/schemas"

describe("TaskVersionDiff", () => {
  const createMockTaskVersion = (version: string, title: string): TaskVersion => ({
    version,
    created_at: "2026-05-03T10:00:00Z",
    task_id: "test_task",
    task_data: {
      id: "test_task",
      title,
      difficulty: "medium",
      description: "Test description",
      version,
      acceptance_criteria: ["Criterion 1"],
      structured_rubric: [],
    },
    change_summary: "Test change",
  })

  it("shows message when less than 2 versions", () => {
    render(<TaskVersionDiff versions={[createMockTaskVersion("1.0", "Title 1")]} />)
    expect(screen.getByText(/Need at least 2 versions to compare/)).toBeDefined()
  })

  it("renders field differences between versions", () => {
    const versions = [
      createMockTaskVersion("1.0", "Title 1"),
      createMockTaskVersion("1.1", "Title 2"),
    ]
    render(<TaskVersionDiff versions={versions} />)
    expect(screen.getByText("Title 1")).toBeDefined()
    expect(screen.getByText("Title 2")).toBeDefined()
  })

  it("shows change summary when present", () => {
    const versions = [
      createMockTaskVersion("1.0", "Title 1"),
      createMockTaskVersion("1.1", "Title 2"),
    ]
    render(<TaskVersionDiff versions={versions} />)
    expect(screen.getByText(/Test change/)).toBeDefined()
  })

  it("detects difficulty changes", () => {
    const v1 = createMockTaskVersion("1.0", "Title")
    v1.task_data.difficulty = "easy"
    const v2 = createMockTaskVersion("1.1", "Title")
    v2.task_data.difficulty = "hard"
    render(<TaskVersionDiff versions={[v1, v2]} />)
    expect(screen.getByText("difficulty")).toBeDefined()
  })

  it("detects description changes", () => {
    const v1 = createMockTaskVersion("1.0", "Title")
    v1.task_data.description = "Old description"
    const v2 = createMockTaskVersion("1.1", "Title")
    v2.task_data.description = "New description"
    render(<TaskVersionDiff versions={[v1, v2]} />)
    expect(screen.getByText("description")).toBeDefined()
  })

  it("shows no changes message when versions are identical", () => {
    const versions = [
      createMockTaskVersion("1.0", "Title"),
      createMockTaskVersion("1.0", "Title"),
    ]
    render(<TaskVersionDiff versions={versions} />)
    expect(screen.getByText(/No field changes detected/)).toBeDefined()
  })
})