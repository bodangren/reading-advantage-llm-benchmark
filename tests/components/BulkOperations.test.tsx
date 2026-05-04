// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BulkOperations } from "@/components/BulkOperations"

describe("BulkOperations", () => {
  beforeEach(() => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url")
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
    HTMLAnchorElement.prototype.click = vi.fn()
  })

  it("renders upload area", () => {
    render(<BulkOperations />)
    expect(screen.getByText(/Drag & drop a JSON file/)).toBeDefined()
    expect(screen.getByText(/Choose File/)).toBeDefined()
  })

  it("validates JSON and shows errors for invalid data", async () => {
    render(<BulkOperations />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['[{invalid}]'], "tasks.json", { type: "application/json" })

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/Validation Errors/i)).toBeDefined()
    })
  })

  it("shows valid task count after successful import", async () => {
    render(<BulkOperations />)

    const validTasks = [
      {
        id: "task_1",
        title: "Task 1",
        difficulty: "medium",
        description: "Desc",
        version: "1.0",
      },
      {
        id: "task_2",
        title: "Task 2",
        difficulty: "hard",
        description: "Desc 2",
        version: "1.0",
      },
    ]

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File([JSON.stringify(validTasks)], "tasks.json", { type: "application/json" })

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/2 valid/)).toBeDefined()
    })
  })

  it("calls onImportComplete callback with valid tasks", async () => {
    const onImportComplete = vi.fn()
    render(<BulkOperations onImportComplete={onImportComplete} />)

    const validTasks = [
      {
        id: "task_1",
        title: "Task 1",
        difficulty: "medium",
        description: "Desc",
        version: "1.0",
      },
    ]

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File([JSON.stringify(validTasks)], "tasks.json", { type: "application/json" })

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(onImportComplete).toHaveBeenCalledWith(validTasks)
    })
  })

  it("shows error for non-array JSON", async () => {
    render(<BulkOperations />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['{"invalid": "format"}'], "tasks.json", { type: "application/json" })

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/Expected an array/)).toBeDefined()
    })
  })
})