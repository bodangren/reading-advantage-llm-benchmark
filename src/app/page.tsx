import Link from "next/link";
import { getLeaderboard } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  const leaderboard = await getLeaderboard();
  const trackAEntries = leaderboard
    .filter((e) => e.harness === "track-a")
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <main className="container mx-auto px-4 py-16">
      <section className="mb-16 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Measuring LLM Reading Comprehension
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          The Reading Advantage benchmark evaluates how well large language models 
          understand and reason about complex texts. Our framework uses Track A 
          (fixed harness) for consistent evaluation and Track B (native agent) 
          for open-ended comprehension tasks.
        </p>
        <div className="flex gap-4">
          <Link
            href="/leaderboard"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View Full Leaderboard
          </Link>
          <Link
            href="/tasks"
            className="inline-flex h-10 items-center justify-center rounded-full border border-input bg-background px-6 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Explore Tasks
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Top Models (Track A)</h2>
          <Link href="/leaderboard" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium w-[80px]">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Model</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Provider</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {trackAEntries.map((entry, index) => (
                <tr key={entry.model} className="border-b last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold">{entry.model}</td>
                  <td className="px-4 py-3 text-muted-foreground">{entry.provider || "-"}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    <Badge variant={entry.score >= 95 ? "default" : "secondary"}>
                      {entry.score.toFixed(1)}%
                    </Badge>
                  </td>
                </tr>
              ))}
              {trackAEntries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No leaderboard data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
