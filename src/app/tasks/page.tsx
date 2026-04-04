import { getTasks } from "@/lib/data";
import { TaskCard } from "@/components/TaskCard";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Benchmark Tasks</h1>
        <p className="text-xl text-muted-foreground">
          Explore the challenge tasks used to evaluate LLM performance on complex software engineering problems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground">No tasks found. Ensure the data pipeline has populated the data directory.</p>
        </div>
      )}
    </div>
  );
}
