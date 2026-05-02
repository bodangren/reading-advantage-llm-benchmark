"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import type { TaskVersion } from "@/lib/schemas"

interface TaskVersionDiffProps {
  versions: TaskVersion[]
}

interface DiffItem {
  field: string
  oldValue: string
  newValue: string
}

function computeFieldDiffs(v1: TaskVersion, v2: TaskVersion): DiffItem[] {
  const diffs: DiffItem[] = []
  const oldData = v1.task_data
  const newData = v2.task_data

  if (oldData.title !== newData.title) {
    diffs.push({ field: "title", oldValue: oldData.title, newValue: newData.title })
  }
  if (oldData.description !== newData.description) {
    diffs.push({ field: "description", oldValue: oldData.description, newValue: newData.description })
  }
  if (oldData.difficulty !== newData.difficulty) {
    diffs.push({ field: "difficulty", oldValue: oldData.difficulty, newValue: newData.difficulty })
  }
  if (oldData.domain !== newData.domain) {
    diffs.push({ field: "domain", oldValue: oldData.domain || "", newValue: newData.domain || "" })
  }
  if (oldData.version !== newData.version) {
    diffs.push({ field: "version", oldValue: oldData.version, newValue: newData.version })
  }

  const oldCriteria = JSON.stringify(oldData.acceptance_criteria || [])
  const newCriteria = JSON.stringify(newData.acceptance_criteria || [])
  if (oldCriteria !== newCriteria) {
    diffs.push({ field: "acceptance_criteria", oldValue: oldCriteria, newValue: newCriteria })
  }

  const oldRubric = JSON.stringify(oldData.structured_rubric || [])
  const newRubric = JSON.stringify(newData.structured_rubric || [])
  if (oldRubric !== newRubric) {
    diffs.push({ field: "structured_rubric", oldValue: oldRubric, newValue: newRubric })
  }

  return diffs
}

export function TaskVersionDiff({ versions }: TaskVersionDiffProps) {
  if (versions.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Need at least 2 versions to compare.</p>
        </CardContent>
      </Card>
    )
  }

  const [older, newer] = versions
  const diffs = computeFieldDiffs(older, newer)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version Changes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>v{older.version} ({new Date(older.created_at).toLocaleDateString()})</span>
          </div>
          <span>→</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>v{newer.version} ({new Date(newer.created_at).toLocaleDateString()})</span>
          </div>
        </div>

        {newer.change_summary && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">Change summary:</p>
            <p className="text-sm text-muted-foreground">{newer.change_summary}</p>
          </div>
        )}

        {diffs.length === 0 ? (
          <p className="text-muted-foreground">No field changes detected.</p>
        ) : (
          <div className="space-y-3">
            {diffs.map((diff) => (
              <div key={diff.field} className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{diff.field}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Old</p>
                    <div className="bg-red-500/10 border border-red-500/20 rounded p-2 text-sm">
                      {formatValue(diff.oldValue)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">New</p>
                    <div className="bg-green-500/10 border border-green-500/20 rounded p-2 text-sm">
                      {formatValue(diff.newValue)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatValue(value: string): string {
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.map((item: string) => `• ${item}`).join("\n")
    }
    return value
  } catch {
    return value.length > 200 ? value.slice(0, 200) + "..." : value
  }
}