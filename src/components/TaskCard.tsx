import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/schemas";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant={task.difficulty === 'hard' ? 'destructive' : task.difficulty === 'medium' ? 'warning' : 'secondary' as any}>
            {task.difficulty}
          </Badge>
          <span className="text-xs text-muted-foreground">v{task.version}</span>
        </div>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription className="line-clamp-2">{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Potentially some task stats or tags here */}
      </CardContent>
      <CardFooter>
        <Link href={`/tasks/${task.id}`} className="w-full">
          <Button variant="outline" className="w-full">View Task</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
