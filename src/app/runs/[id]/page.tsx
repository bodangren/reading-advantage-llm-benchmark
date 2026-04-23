import { getRunById, getAllRuns } from "@/lib/runs";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { DiffViewer } from "@/components/DiffViewer";
import { TestResultsTable } from "@/components/TestResultsTable";
import { ArtifactLinks } from "@/components/ArtifactLinks";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface RunPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const runs = await getAllRuns();
  return runs.map((run) => ({
    id: run.id,
  }));
}

export default async function RunDetailPage({ params }: RunPageProps) {
  const { id } = await params;
  const run = await getRunById(id);

  if (!run) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-6">
        <Link href="/leaderboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leaderboard
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Run Details</h1>
        <Badge variant={run.total_score >= 0.8 ? 'default' : run.total_score >= 0.5 ? 'warning' : 'destructive'}>
          Score: {(run.total_score * 100).toFixed(1)}%
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ScoreBreakdown scores={run.scores} totalScore={run.total_score} />

          {run.diff && <DiffViewer diff={run.diff} />}

          <TestResultsTable testResults={run.test_results} />

          <ArtifactLinks artifacts={run.artifacts} />
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Run Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Model</p>
                <p className="text-lg font-semibold">{run.model}</p>
              </div>
              {run.provider && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Provider</p>
                  <p className="text-lg">{run.provider}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Harness</p>
                <p className="text-lg">{run.harness}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Harness Version</p>
                <p className="text-lg">{run.harness_version}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Benchmark Version</p>
                <p className="text-lg">{run.benchmark_version}</p>
              </div>
              {run.dataset_version && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dataset Version</p>
                  <p className="text-lg">{run.dataset_version}</p>
                </div>
              )}
              {run.task_id && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Task</p>
                  <Link
                    href={`/tasks/${run.task_id}`}
                    className="text-lg text-primary hover:underline flex items-center gap-1"
                  >
                    {run.task_id}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Run Date</p>
                <p className="text-lg">{new Date(run.run_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wall Time</p>
                <p className="text-lg">{run.wall_time_seconds.toFixed(1)}s</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}