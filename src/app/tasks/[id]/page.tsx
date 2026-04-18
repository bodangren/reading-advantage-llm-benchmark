import { getTaskById, getTasks } from "@/lib/data";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="flex items-center space-x-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{task.title}</h1>
        <Badge variant={task.difficulty === 'hard' ? 'destructive' : task.difficulty === 'medium' ? 'warning' : 'secondary'}>
          {task.difficulty}
        </Badge>
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

          <section>
            <h2 className="text-2xl font-semibold mb-4">Grading Rubric</h2>
            <Card>
              <CardContent className="pt-6">
                {task.rubric && task.rubric.length > 0 ? (
                  <ul className="list-disc pl-6 space-y-2">
                    {task.rubric.map((item, index) => (
                      <li key={index} className="text-lg">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No rubric defined.</p>
                )}
              </CardContent>
            </Card>
          </section>
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
