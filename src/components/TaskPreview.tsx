"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TaskFormData } from "@/lib/schemas"

interface TaskPreviewProps {
  task: Partial<TaskFormData>
}

function renderMarkdown(text: string): string {
  if (!text) return ""

  let html = text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/\n/g, '<br>')

  return html
}

export function TaskPreview({ task }: TaskPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <h2 className="text-2xl font-bold">{task.title || "Untitled Task"}</h2>
        {task.difficulty && (
          <Badge variant={
            task.difficulty === "hard" ? "destructive" :
            task.difficulty === "medium" ? "warning" : "secondary"
          }>
            {task.difficulty}
          </Badge>
        )}
        {task.domain && <Badge variant="outline">{task.domain}</Badge>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          {task.description ? (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(task.description) }}
            />
          ) : (
            <p className="text-muted-foreground italic">No description yet...</p>
          )}
        </CardContent>
      </Card>

      {task.acceptance_criteria && task.acceptance_criteria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Acceptance Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {task.acceptance_criteria.filter(c => c.trim()).map((criterion, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 h-4 w-4 rounded border border-primary flex-shrink-0" />
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {task.structured_rubric && task.structured_rubric.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scoring Rubric</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-semibold pb-3">Dimension</th>
                  <th className="text-right font-semibold pb-3">Weight</th>
                  <th className="text-left font-semibold pb-3 pl-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {task.structured_rubric.map((dim, index) => (
                  <tr key={index} className="border-b border-muted">
                    <td className="py-3">{dim.label || "Unnamed dimension"}</td>
                    <td className="text-right py-3 font-mono">{dim.weight}</td>
                    <td className="py-3 pl-4 text-muted-foreground">
                      {dim.description || "No description"}
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-3">Total</td>
                  <td className="text-right py-3 font-mono">
                    {task.structured_rubric.reduce((sum, r) => sum + r.weight, 0)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {task.repo_context && (
        <Card>
          <CardHeader>
            <CardTitle>Repository Context</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap">
              {task.repo_context}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}