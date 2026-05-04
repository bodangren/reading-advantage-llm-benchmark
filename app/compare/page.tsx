import { getLeaderboard, getTasks } from '@/lib/data';
import { CompareClient } from './CompareClient';

export default async function ComparePage() {
  const [leaderboardEntries, tasks] = await Promise.all([
    getLeaderboard(),
    getTasks(),
  ]);

  const availableTasks = tasks.map(t => ({
    id: t.id,
    title: t.title,
    domain: t.domain,
  }));

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Model Comparison</h1>
        <p className="text-xl text-muted-foreground">
          Select two or more models and a task set to generate a comparison report.
        </p>
      </div>
      <CompareClient leaderboardEntries={leaderboardEntries} availableTasks={availableTasks} />
    </div>
  );
}