import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/schemas";

interface TaskCardProps {
  task: Task;
  runCount?: number;
}

export function TaskCard({ task, runCount = 0 }: TaskCardProps) {
  return (
    <Card className="flex flex-col h-full hover:border-primary hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant={task.difficulty === 'hard' ? 'destructive' : task.difficulty === 'medium' ? 'warning' : 'secondary'}>
              {task.difficulty}
            </Badge>
            {task.domain && (
              <Badge variant="outline">{task.domain}</Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">v{task.version}</span>
        </div>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription className="line-clamp-2">{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow" />
      <CardFooter className="flex items-center justify-between">
        <Badge variant={runCount > 0 ? "default" : "secondary"} className={runCount === 0 ? "opacity-50" : ""}>
          {runCount} run{runCount !== 1 ? 's' : ''}
        </Badge>
        <Link href={`/tasks/${task.id}`}>
          <Button variant="outline">View Task</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
