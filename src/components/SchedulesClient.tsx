"use client"

import { useState, useEffect } from "react"
import { ScheduleForm } from "@/components/ScheduleForm"
import { ScheduleList } from "@/components/ScheduleList"
import { Button } from "@/components/ui/button"
import { ScheduleConfig } from "@/lib/schemas"
import { Plus } from "lucide-react"

const AVAILABLE_MODELS = [
  "gpt-4o",
  "gpt-4o-mini",
  "claude-3.5-sonnet",
  "claude-3.5-haiku",
  "gemini-2.0-flash",
  "gemini-2.5-pro",
]

export function SchedulesClient({ initialSchedules }: { initialSchedules: ScheduleConfig[] }) {
  const [schedules, setSchedules] = useState<ScheduleConfig[]>(initialSchedules)
  const [isCreating, setIsCreating] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ScheduleConfig | null>(null)

  useEffect(() => {
    setSchedules(initialSchedules)
  }, [initialSchedules])

  const handleSubmit = async (scheduleData: Partial<ScheduleConfig>) => {
    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...scheduleData,
          id: editingSchedule?.id,
          createdAt: editingSchedule?.createdAt,
          status: "active",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save schedule")
      }

      const saved = await response.json()
      setSchedules(prev => {
        if (editingSchedule) {
          return prev.map(s => s.id === saved.id ? saved : s)
        }
        return [...prev, saved]
      })
      setIsCreating(false)
      setEditingSchedule(null)
    } catch (error) {
      console.error("Failed to save schedule:", error)
    }
  }

  const handleDelete = async (scheduleId: string) => {
    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete schedule")
      }

      setSchedules(prev => prev.filter(s => s.id !== scheduleId))
    } catch (error) {
      console.error("Failed to delete schedule:", error)
    }
  }

  const handleToggle = async (scheduleId: string, enabled: boolean) => {
    const schedule = schedules.find(s => s.id === scheduleId)
    if (!schedule) return

    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...schedule, enabled }),
      })

      if (!response.ok) {
        throw new Error("Failed to update schedule")
      }

      setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, enabled } : s))
    } catch (error) {
      console.error("Failed to toggle schedule:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Active Schedules</h2>
          <p className="text-muted-foreground">Manage automated benchmark schedules</p>
        </div>
        {!isCreating && !editingSchedule && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Schedule
          </Button>
        )}
      </div>

      {(isCreating || editingSchedule) && (
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingSchedule ? "Edit Schedule" : "Create New Schedule"}
          </h3>
          <ScheduleForm
            initialSchedule={editingSchedule || undefined}
            models={AVAILABLE_MODELS}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsCreating(false)
              setEditingSchedule(null)
            }}
          />
        </div>
      )}

      <ScheduleList
        schedules={schedules}
        onEdit={setEditingSchedule}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
    </div>
  )
}