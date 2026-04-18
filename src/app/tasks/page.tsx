import { getTasks, getRuns } from "@/lib/data";
import { TaskListWithFilters } from "@/components/TaskListWithFilters";

export default async function TasksPage() {
  const tasks = await getTasks();
  const runs = await getRuns();

  const runCounts: Record<string, number> = {};
  for (const run of runs) {
    if (run.task_id) {
      runCounts[run.task_id] = (runCounts[run.task_id] ?? 0) + 1;
    }
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Benchmark Tasks</h1>
        <p className="text-xl text-muted-foreground">
          Explore the challenge tasks used to evaluate LLM performance on complex software engineering problems.
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground">No tasks found. Ensure the data pipeline has populated the data directory.</p>
        </div>
      ) : (
        <TaskListWithFilters tasks={tasks} runCounts={runCounts} />
      )}
    </div>
  );
}
