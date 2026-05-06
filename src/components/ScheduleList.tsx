import { ScheduleConfig } from "@/lib/schemas"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCronExpression } from "@/lib/scheduler"

interface ScheduleListProps {
  schedules: ScheduleConfig[]
  onEdit: (schedule: ScheduleConfig) => void
  onDelete: (scheduleId: string) => void
  onToggle: (scheduleId: string, enabled: boolean) => void
}

function formatNextRun(nextRunAt?: string): string {
  if (!nextRunAt) return "Not scheduled"
  const date = new Date(nextRunAt)
  return date.toLocaleString()
}

export function ScheduleList({ schedules, onEdit, onDelete, onToggle }: ScheduleListProps) {
  if (schedules.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No schedules configured. Create one to automate benchmark runs.
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {schedules.map(schedule => (
        <Card key={schedule.id} className={schedule.enabled ? "" : "opacity-60"}>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant={schedule.status === 'active' ? 'default' : schedule.status === 'paused' ? 'secondary' : 'outline'}>
                  {schedule.status}
                </Badge>
                {schedule.status === 'paused' && (
                  <Badge variant="warning">Paused</Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {schedule.enabled ? "Active" : "Disabled"}
              </span>
            </div>
            <CardTitle>{schedule.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span className="font-mono">{schedule.modelId}</span>
              <span>•</span>
              <span>{formatCronExpression(schedule)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {schedule.nextRunAt && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Next run:</span>
                  <span>{formatNextRun(schedule.nextRunAt)}</span>
                </div>
              )}
              {schedule.lastRunAt && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium">Last run:</span>
                  <span>{formatNextRun(schedule.lastRunAt)}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(schedule)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(schedule.id)}>
                Delete
              </Button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-muted-foreground">
                {schedule.enabled ? "Disable" : "Enable"}
              </span>
              <input
                type="checkbox"
                checked={schedule.enabled}
                onChange={(e) => onToggle(schedule.id, e.target.checked)}
                className="toggle"
              />
            </label>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}