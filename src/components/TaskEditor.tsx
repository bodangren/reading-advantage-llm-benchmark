"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TaskFormDataSchema, type TaskFormData } from "@/lib/schemas"

interface TaskEditorProps {
  initialTask?: {
    id?: string
    title?: string
    difficulty?: string
    domain?: string
    description?: string
    repo_context?: string
    acceptance_criteria?: string[]
    structured_rubric?: { label: string; weight: number; description: string }[]
  }
  onSave?: (task: TaskFormData) => void
  onCancel?: () => void
}

export function TaskEditor({ initialTask, onSave, onCancel }: TaskEditorProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    id: initialTask?.id ?? "",
    title: initialTask?.title ?? "",
    difficulty: (initialTask?.difficulty as "easy" | "medium" | "hard") ?? "medium",
    domain: initialTask?.domain ?? "",
    description: initialTask?.description ?? "",
    repo_context: initialTask?.repo_context ?? "",
    acceptance_criteria: initialTask?.acceptance_criteria ?? [""],
    structured_rubric: initialTask?.structured_rubric ?? [
      { label: "Functional correctness", weight: 40, description: "" },
      { label: "Integration quality", weight: 25, description: "" },
      { label: "Regression safety", weight: 20, description: "" },
      { label: "Minimality", weight: 10, description: "" },
      { label: "Process quality", weight: 5, description: "" },
    ],
    status: "draft",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const result = TaskFormDataSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const path = issue.path.join(".")
        newErrors[path] = issue.message
      }
      setErrors(newErrors)
      return false
    }
    setErrors({})
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm() && onSave) {
      onSave(formData)
    }
  }

  const updateCriterion = (index: number, value: string) => {
    const newCriteria = [...formData.acceptance_criteria]
    newCriteria[index] = value
    setFormData({ ...formData, acceptance_criteria: newCriteria })
  }

  const addCriterion = () => {
    setFormData({
      ...formData,
      acceptance_criteria: [...formData.acceptance_criteria, ""],
    })
  }

  const removeCriterion = (index: number) => {
    const newCriteria = formData.acceptance_criteria.filter((_, i) => i !== index)
    setFormData({ ...formData, acceptance_criteria: newCriteria })
  }

  const updateRubricItem = (index: number, field: "label" | "weight" | "description", value: string | number) => {
    const newRubric = [...formData.structured_rubric]
    if (field === "weight") {
      newRubric[index] = { ...newRubric[index], weight: Number(value) }
    } else {
      newRubric[index] = { ...newRubric[index], [field]: value }
    }
    setFormData({ ...formData, structured_rubric: newRubric })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="id" className="block text-sm font-medium mb-1">
            Task ID
          </label>
          <input
            id="id"
            type="text"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            placeholder="e.g., my_new_task_v1"
            disabled={!!initialTask?.id}
          />
          {errors.id && <p className="text-destructive text-sm mt-1">{errors.id}</p>}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            placeholder="e.g., Implement User Authentication"
          />
          {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value as "easy" | "medium" | "hard" })
              }
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label htmlFor="domain" className="block text-sm font-medium mb-1">
              Domain
            </label>
            <input
              id="domain"
              type="text"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
              placeholder="e.g., Web App"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm min-h-[120px]"
            placeholder="Describe the task in detail. Markdown is supported."
          />
          {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="repo_context" className="block text-sm font-medium mb-1">
            Repository Context
          </label>
          <textarea
            id="repo_context"
            value={formData.repo_context}
            onChange={(e) => setFormData({ ...formData, repo_context: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm min-h-[80px]"
            placeholder="Describe the codebase context needed to complete this task."
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium">Acceptance Criteria</label>
          <Button type="button" variant="outline" size="sm" onClick={addCriterion}>
            Add Criterion
          </Button>
        </div>
        <div className="space-y-2">
          {formData.acceptance_criteria.map((criterion, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={criterion}
                onChange={(e) => updateCriterion(index, e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm"
                placeholder={`Criterion ${index + 1}`}
              />
              {formData.acceptance_criteria.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeCriterion(index)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-4">Scoring Rubric</label>
        {errors.rubric && <p className="text-destructive text-sm mb-2">{errors.rubric}</p>}
        <div className="space-y-3">
          {formData.structured_rubric.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_80px_1fr] gap-3 items-start">
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateRubricItem(index, "label", e.target.value)}
                className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
                placeholder="Dimension label"
              />
              <input
                type="number"
                value={item.weight}
                onChange={(e) => updateRubricItem(index, "weight", e.target.value)}
                className="px-3 py-2 rounded-lg border border-input bg-background text-sm text-center"
                min={0}
                max={100}
              />
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateRubricItem(index, "description", e.target.value)}
                className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
                placeholder="Description"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save Task</Button>
      </div>
    </form>
  )
}