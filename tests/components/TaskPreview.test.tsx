// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { TaskPreview } from "@/components/TaskPreview"

describe("TaskPreview", () => {
  it("renders task title", () => {
    render(<TaskPreview task={{ title: "Test Task Title" }} />)
    expect(screen.getByText("Test Task Title")).toBeDefined()
  })

  it("renders difficulty badge", () => {
    render(<TaskPreview task={{ title: "Test", difficulty: "hard" }} />)
    expect(screen.getByText("hard")).toBeDefined()
  })

  it("renders domain badge when present", () => {
    render(<TaskPreview task={{ title: "Test", domain: "Web App" }} />)
    expect(screen.getByText("Web App")).toBeDefined()
  })

  it("renders description with markdown rendering", () => {
    render(<TaskPreview task={{ title: "Test", description: "This is **bold** text" }} />)
    expect(screen.getByText(/This is/)).toBeDefined()
    expect(document.body.innerHTML).toContain("<strong>bold</strong>")
  })

  it("shows placeholder when no description", () => {
    render(<TaskPreview task={{ title: "Test" }} />)
    expect(screen.getByText(/No description yet/)).toBeDefined()
  })

  it("renders acceptance criteria", () => {
    render(
      <TaskPreview
        task={{
          title: "Test",
          acceptance_criteria: ["First criterion", "Second criterion"],
        }}
      />
    )
    expect(screen.getByText("First criterion")).toBeDefined()
    expect(screen.getByText("Second criterion")).toBeDefined()
  })

  it("filters empty acceptance criteria", () => {
    render(
      <TaskPreview
        task={{
          title: "Test",
          acceptance_criteria: ["Valid criterion", "", "  "],
        }}
      />
    )
    const criteria = screen.getAllByText(/Valid criterion/)
    expect(criteria.length).toBe(1)
  })

  it("renders structured rubric with weights", () => {
    render(
      <TaskPreview
        task={{
          title: "Test",
          structured_rubric: [
            { label: "Functional correctness", weight: 40, description: "Test works" },
            { label: "Integration quality", weight: 60, description: "Good code" },
          ],
        }}
      />
    )
    expect(screen.getByText("Functional correctness")).toBeDefined()
    expect(screen.getByText("40")).toBeDefined()
    expect(screen.getByText("60")).toBeDefined()
  })

  it("calculates total rubric weight", () => {
    render(
      <TaskPreview
        task={{
          title: "Test",
          structured_rubric: [
            { label: "A", weight: 40, description: "" },
            { label: "B", weight: 60, description: "" },
          ],
        }}
      />
    )
    expect(screen.getByText("100")).toBeDefined()
  })

  it("renders repo context in code block", () => {
    render(
      <TaskPreview
        task={{
          title: "Test",
          repo_context: "const x = 1;",
        }}
      />
    )
    expect(screen.getByText(/const x = 1;/)).toBeDefined()
  })

  it("handles empty task gracefully", () => {
    render(<TaskPreview task={{}} />)
    expect(screen.getByText("Untitled Task")).toBeDefined()
  })
})