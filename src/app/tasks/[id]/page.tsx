import { getTaskById, getTasks } from "@/lib/data";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface TaskPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const tasks = await getTasks();
  return tasks.map((task) => ({
    id: task.id,
  }));
}

export default async function TaskDetailPage({ params }: TaskPageProps) {
  const { id } = await params;
  const task = await getTaskById(id);

  if (!task) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-6">
        <Link href="/tasks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{task.title}</h1>
        <Badge variant={task.difficulty === 'hard' ? 'destructive' : task.difficulty === 'medium' ? 'warning' : 'secondary'}>
          {task.difficulty}
        </Badge>
        {task.domain && <Badge variant="outline">{task.domain}</Badge>}
        <span className="text-muted-foreground">v{task.version}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed">{task.description}</p>
              </CardContent>
            </Card>
          </section>

          {task.acceptance_criteria && task.acceptance_criteria.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Acceptance Criteria</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {task.acceptance_criteria.map((criterion, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1 h-4 w-4" disabled />
                        <span className="text-lg">{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          )}

          {task.structured_rubric && task.structured_rubric.length > 0 ? (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Scoring Rubric</h2>
              <Card>
                <CardContent className="pt-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-semibold pb-3">Dimension</th>
                        <th className="text-right font-semibold pb-3">Weight</th>
                        <th className="text-left font-semibold pb-3 pl-4">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {task.structured_rubric.map((dim) => (
                        <tr key={dim.label} className="border-b border-muted">
                          <td className="py-3">{dim.label}</td>
                          <td className="text-right py-3 font-mono">{dim.weight}</td>
                          <td className="py-3 pl-4 text-muted-foreground">{dim.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </section>
          ) : task.rubric && task.rubric.length > 0 ? (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Grading Rubric</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="list-disc pl-6 space-y-2">
                    {task.rubric.map((item, index) => (
                      <li key={index} className="text-lg">{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          ) : null}

          {task.repo_context && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Repository Context</h2>
              <Card>
                <CardContent className="pt-6">
                  <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap">
                    {task.repo_context}
                  </pre>
                </CardContent>
              </Card>
            </section>
          )}
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Task Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p className="text-lg font-mono">{task.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                <p className="text-lg capitalize">{task.difficulty}</p>
              </div>
              {task.domain && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Domain</p>
                  <p className="text-lg">{task.domain}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Version</p>
                <p className="text-lg">{task.version}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
