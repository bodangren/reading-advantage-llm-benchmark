"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScheduleConfig, ScheduleFrequency } from "@/lib/schemas"

interface ScheduleFormProps {
  initialSchedule?: Partial<ScheduleConfig>
  models: string[]
  onSubmit: (schedule: Partial<ScheduleConfig>) => void
  onCancel: () => void
}

export function ScheduleForm({ initialSchedule, models, onSubmit, onCancel }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    name: initialSchedule?.name ?? "",
    modelId: initialSchedule?.modelId ?? (models[0] ?? ""),
    frequency: initialSchedule?.frequency ?? ("daily" as ScheduleFrequency),
    hour: initialSchedule?.hour ?? 9,
    minute: initialSchedule?.minute ?? 0,
    dayOfWeek: initialSchedule?.dayOfWeek ?? 0,
    enabled: initialSchedule?.enabled ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Schedule name is required"
    }

    if (!formData.modelId) {
      newErrors.modelId = "Model is required"
    }

    if (formData.hour < 0 || formData.hour > 23) {
      newErrors.hour = "Hour must be between 0 and 23"
    }

    if (formData.minute < 0 || formData.minute > 59) {
      newErrors.minute = "Minute must be between 0 and 59"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        ...formData,
        datasetVersion: initialSchedule?.datasetVersion ?? "2026-04-07",
      })
    }
  }

  const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Schedule Name</label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Daily GPT-4o Evaluation"
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="model">Model</label>
          <select
            id="model"
            value={formData.modelId}
            onChange={(e) => updateField("modelId", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          {errors.modelId && <p className="text-sm text-destructive mt-1">{errors.modelId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="frequency">Frequency</label>
          <select
            id="frequency"
            value={formData.frequency}
            onChange={(e) => updateField("frequency", e.target.value as ScheduleFrequency)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        {formData.frequency === "weekly" && (
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="dayOfWeek">Day of Week</label>
            <select
              id="dayOfWeek"
              value={formData.dayOfWeek}
              onChange={(e) => updateField("dayOfWeek", Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
              <option value={2}>Tuesday</option>
              <option value={3}>Wednesday</option>
              <option value={4}>Thursday</option>
              <option value={5}>Friday</option>
              <option value={6}>Saturday</option>
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="hour">Hour (0-23)</label>
            <Input
              id="hour"
              type="number"
              min={0}
              max={23}
              value={formData.hour}
              onChange={(e) => updateField("hour", Number(e.target.value))}
            />
            {errors.hour && <p className="text-sm text-destructive mt-1">{errors.hour}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="minute">Minute (0-59)</label>
            <Input
              id="minute"
              type="number"
              min={0}
              max={59}
              value={formData.minute}
              onChange={(e) => updateField("minute", Number(e.target.value))}
            />
            {errors.minute && <p className="text-sm text-destructive mt-1">{errors.minute}</p>}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit">Save Schedule</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}