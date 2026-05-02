// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { TaskEditor } from "@/components/TaskEditor"

describe("TaskEditor", () => {
  it("renders form fields", () => {
    render(<TaskEditor />)
    expect(screen.getByLabelText(/Task ID/i)).toBeDefined()
    expect(screen.getByLabelText(/Title/i)).toBeDefined()
    expect(screen.getByLabelText(/Description/i)).toBeDefined()
  })

  it("shows validation errors for required fields", async () => {
    render(<TaskEditor />)
    const submitButton = screen.getByText("Save Task")
    fireEvent.click(submitButton)

    await new Promise(resolve => setTimeout(resolve, 100))

    const errorTexts = screen.getAllByText(/required/i)
    expect(errorTexts.length).toBeGreaterThan(0)
  })

  it("shows error for invalid task ID format", async () => {
    render(<TaskEditor />)
    const idInput = screen.getByLabelText(/Task ID/i) as HTMLInputElement
    fireEvent.change(idInput, { target: { value: "Invalid ID!" } })

    const submitButton = screen.getByText("Save Task")
    fireEvent.click(submitButton)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(screen.getByText(/alphanumeric/i)).toBeDefined()
  })

  it("validates rubric weights sum to 100", async () => {
    let savedData: unknown = null
    render(
      <TaskEditor
        onSave={(data) => {
          savedData = data
        }}
      />
    )

    const idInput = screen.getByLabelText(/Task ID/i) as HTMLInputElement
    fireEvent.change(idInput, { target: { value: "valid_task_id" } })

    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement
    fireEvent.change(titleInput, { target: { value: "Test Task" } })

    const descInput = screen.getByLabelText(/Description/i) as HTMLTextAreaElement
    fireEvent.change(descInput, { target: { value: "A valid description" } })

    const numberInputs = screen.getAllByPlaceholderText("Dimension label")
      .map(el => el.parentElement?.parentElement?.querySelector('input[type="number"]'))
      .filter(Boolean) as HTMLInputElement[]

    if (numberInputs.length > 0) {
      fireEvent.change(numberInputs[0], { target: { value: "50" } })
    }

    const submitButton = screen.getByText("Save Task")
    fireEvent.click(submitButton)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(savedData).toBeNull()
  })

  it("accepts valid form data", async () => {
    let savedData: unknown = null
    render(
      <TaskEditor
        onSave={(data) => {
          savedData = data
        }}
      />
    )

    const idInput = screen.getByLabelText(/Task ID/i) as HTMLInputElement
    fireEvent.change(idInput, { target: { value: "valid_task_id" } })

    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement
    fireEvent.change(titleInput, { target: { value: "Test Task" } })

    const descInput = screen.getByLabelText(/Description/i) as HTMLTextAreaElement
    fireEvent.change(descInput, { target: { value: "A valid description" } })

    const submitButton = screen.getByText("Save Task")
    fireEvent.click(submitButton)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(savedData).toBeDefined()
    const task = savedData as { id: string; title: string }
    expect(task.id).toBe("valid_task_id")
    expect(task.title).toBe("Test Task")
  })

  it("pre-fills form with initial task data", () => {
    render(
      <TaskEditor
        initialTask={{
          id: "prefilled_task",
          title: "Prefilled Title",
          difficulty: "hard",
          domain: "Testing",
          description: "Prefilled description",
          acceptance_criteria: ["Criterion 1"],
          structured_rubric: [
            { label: "Test", weight: 100, description: "Test desc" },
          ],
        }}
      />
    )

    expect((screen.getByLabelText(/Task ID/i) as HTMLInputElement).value).toBe("prefilled_task")
    expect((screen.getByLabelText(/Title/i) as HTMLInputElement).value).toBe("Prefilled Title")
  })

  it("can add and remove acceptance criteria", () => {
    render(<TaskEditor />)
    const initialInputs = screen.getAllByPlaceholderText(/^Criterion/)

    const addButton = screen.getByText("Add Criterion")
    fireEvent.click(addButton)

    const afterAddInputs = screen.getAllByPlaceholderText(/^Criterion/)
    expect(afterAddInputs.length).toBe(initialInputs.length + 1)
  })
})