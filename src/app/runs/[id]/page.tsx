import { getRunById, getRuns } from "@/lib/data";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RunPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const runs = await getRuns();
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
      <div className="flex items-center space-x-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Run Details</h1>
        <Badge variant={run.score >= 0.8 ? 'default' : run.score >= 0.5 ? 'warning' : 'destructive'}>
          Score: {(run.score * 100).toFixed(1)}%
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Score Breakdown</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Overall Score</span>
                    <span className="text-2xl font-bold">{(run.score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-4">
                    <div 
                      className="bg-primary h-4 rounded-full" 
                      style={{ width: `${run.score * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {run.subscores && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Detailed Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(run.subscores).map(([key, value]) => (
                  <Card key={key}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium uppercase text-muted-foreground">{key}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Diff Summary</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Detailed diff summary and artifact viewing coming soon.</p>
              </CardContent>
            </Card>
          </section>
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
              <div>
                <p className="text-sm font-medium text-muted-foreground">Provider</p>
                <p className="text-lg">{run.provider || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Harness</p>
                <p className="text-lg">{run.harness}</p>
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
              {run.date && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-lg">{run.date}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
