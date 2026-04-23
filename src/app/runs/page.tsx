import { getAllRuns } from "@/lib/runs";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default async function RunsIndexPage() {
  const runs = await getAllRuns();

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Run History</h1>
        <p className="text-xl text-muted-foreground">
          Browse all benchmark runs with detailed results, diffs, and artifacts.
        </p>
      </div>

      {runs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground">No runs found. Run the benchmark pipeline to generate results.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Task</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Wall Time</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-semibold">{run.model}</TableCell>
                  <TableCell>{run.provider || "-"}</TableCell>
                  <TableCell>
                    {run.task_id ? (
                      <Link
                        href={`/tasks/${run.task_id}`}
                        className="text-primary hover:underline"
                      >
                        {run.task_id}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={run.total_score >= 0.8 ? 'default' : run.total_score >= 0.5 ? 'warning' : 'destructive'}>
                      {(run.total_score * 100).toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {run.wall_time_seconds.toFixed(1)}s
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {new Date(run.run_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/runs/${run.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}