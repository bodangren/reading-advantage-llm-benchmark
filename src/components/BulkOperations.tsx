"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, AlertCircle, CheckCircle, FileJson } from "lucide-react"
import { TaskSchema, type Task } from "@/lib/schemas"

interface ValidationError {
  index: number
  taskId: string
  errors: string[]
}

interface BulkImportResult {
  valid: Task[]
  errors: ValidationError[]
}

interface BulkOperationsProps {
  onImportComplete?: (tasks: Task[]) => void
}

export function BulkOperations({ onImportComplete }: BulkOperationsProps) {
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const validateTasks = (jsonData: unknown): BulkImportResult => {
    if (!Array.isArray(jsonData)) {
      return {
        valid: [],
        errors: [{ index: -1, taskId: "root", errors: ["Expected an array of tasks"] }],
      }
    }

    const valid: Task[] = []
    const errors: ValidationError[] = []

    jsonData.forEach((item, index) => {
      const result = TaskSchema.safeParse(item)
      if (result.success) {
        valid.push(result.data)
      } else {
        errors.push({
          index,
          taskId: (item as { id?: string }).id || `index_${index}`,
          errors: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
        })
      }
    })

    return { valid, errors }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const jsonData = JSON.parse(content)
        const result = validateTasks(jsonData)
        setImportResult(result)
        if (result.valid.length > 0 && onImportComplete) {
          onImportComplete(result.valid)
        }
      } catch (err) {
        setImportResult({
          valid: [],
          errors: [{ index: -1, taskId: "file", errors: [`Failed to parse JSON: ${err}`] }],
        })
      }
    }
    reader.readAsText(file)
    event.target.value = ""
  }

  const handleExport = (format: "json" | "csv") => {
    const tasksJson = importResult?.valid || []
    const tasksCsv = [
      ["id", "title", "difficulty", "domain", "version"].join(","),
      ...tasksJson.map((t) => [t.id, `"${t.title}"`, t.difficulty, t.domain || "", t.version].join(",")),
    ].join("\n")

    const blob = new Blob([format === "json" ? JSON.stringify(tasksJson, null, 2) : tasksCsv], {
      type: format === "json" ? "application/json" : "text/csv",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tasks_export_${Date.now()}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-muted"
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            const file = e.dataTransfer.files[0]
            if (file && file.name.endsWith(".json")) {
              const reader = new FileReader()
              reader.onload = (event) => {
                try {
                  const content = event.target?.result as string
                  const jsonData = JSON.parse(content)
                  const result = validateTasks(jsonData)
                  setImportResult(result)
                } catch {
                  setImportResult({
                    valid: [],
                    errors: [{ index: -1, taskId: "file", errors: ["Failed to parse dropped file"] }],
                  })
                }
              }
              reader.readAsText(file)
            }
          }}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            Drag & drop a JSON file with task array, or click to upload
          </p>
<label className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-input bg-background hover:bg-muted hover:text-foreground h-8 gap-1.5 px-2.5 text-sm">
                  Choose File
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
        </div>

        {importResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {importResult.valid.length} valid
              </Badge>
              {importResult.errors.length > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {importResult.errors.length} errors
                </Badge>
              )}
            </div>

            {importResult.errors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  Validation Errors
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {importResult.errors.map((error, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-mono text-muted-foreground">
                        {error.taskId} (index {error.index}):
                      </span>
                      <ul className="ml-4 text-destructive">
                        {error.errors.map((e, j) => (
                          <li key={j}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {importResult.valid.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExport("json")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            )}

            {importResult.valid.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  <span className="text-sm font-medium">Imported Tasks</span>
                </div>
                <div className="divide-y max-h-64 overflow-y-auto">
                  {importResult.valid.map((task) => (
                    <div key={task.id} className="px-4 py-2 flex items-center justify-between">
                      <div>
                        <span className="font-medium">{task.title}</span>
                        <span className="text-muted-foreground ml-2 text-sm">v{task.version}</span>
                      </div>
                      <Badge variant="outline">{task.difficulty}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}