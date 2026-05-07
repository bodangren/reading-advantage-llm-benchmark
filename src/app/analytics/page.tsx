import { getAllRuns } from '@/lib/runs';
import { groupRunsByPeriod, calculateMovingAverage, detectRegressions, formatChartData, ChartDataPoint, RegressionAlert } from '@/lib/analytics';
import { AnalyticsClient } from './AnalyticsClient';

export default async function AnalyticsPage() {
  const allRuns = await getAllRuns();

  const runsByModel: Record<string, typeof allRuns> = {};
  for (const run of allRuns) {
    if (!runsByModel[run.model]) {
      runsByModel[run.model] = [];
    }
    runsByModel[run.model].push(run);
  }

  const chartData: Record<string, ChartDataPoint[]> = {};
  const allRegressions: RegressionAlert[] = [];

  for (const [model, modelRuns] of Object.entries(runsByModel)) {
    const grouped = groupRunsByPeriod(modelRuns, 'week');
    const trendPoints = grouped.map(g => ({
      period: g.period,
      avgScore: g.avgScore,
      runCount: g.runs.length,
    }));
    const withMA = calculateMovingAverage(trendPoints, 3);
    chartData[model] = formatChartData(withMA, model);

    const modelRegressions = detectRegressions(withMA, 0.05);
    for (const reg of modelRegressions) {
      reg.model = model;
      allRegressions.push(reg);
    }
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Benchmark Analytics</h1>
        <p className="text-xl text-muted-foreground">
          Track model performance over time with trend charts and regression detection.
        </p>
      </div>
      <AnalyticsClient
        chartData={chartData}
        scoreType="overall"
        onScoreTypeChange={() => {}}
        regressionAlerts={allRegressions}
      />
    </div>
  );
}