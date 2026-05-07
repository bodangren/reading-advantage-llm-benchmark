import { RunDetail } from './schemas';

export interface TrendDataPoint {
  period: string;
  avgScore: number;
  runCount: number;
  movingAvg?: number | null;
}

interface GroupedPeriod {
  period: string;
  runs: RunDetail[];
  avgScore: number;
}

export function groupRunsByPeriod(runs: RunDetail[], period: 'week' | 'month'): GroupedPeriod[] {
  if (runs.length === 0) return [];

  const groups = new Map<string, RunDetail[]>();

  for (const run of runs) {
    const date = new Date(run.run_date);
    let periodKey: string;

    if (period === 'week') {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      periodKey = startOfWeek.toISOString().split('T')[0];
    } else {
      periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    if (!groups.has(periodKey)) {
      groups.set(periodKey, []);
    }
    groups.get(periodKey)!.push(run);
  }

  const result: GroupedPeriod[] = [];
  for (const [periodKey, periodRuns] of groups) {
    const totalScore = periodRuns.reduce((sum, r) => sum + r.total_score, 0);
    result.push({
      period: periodKey,
      runs: periodRuns,
      avgScore: totalScore / periodRuns.length,
    });
  }

  return result.sort((a, b) => a.period.localeCompare(b.period));
}

export function calculateMovingAverage(data: TrendDataPoint[], window: number): TrendDataPoint[] {
  if (data.length === 0) return [];

  const result: TrendDataPoint[] = [];

  for (let i = 0; i < data.length; i++) {
    const startIdx = Math.max(0, i - window + 1);
    const windowData = data.slice(startIdx, i + 1);

    let movingAvg: number | null = null;
    if (windowData.length === window) {
      const sum = windowData.reduce((acc, dp) => acc + dp.avgScore, 0);
      movingAvg = sum / window;
    }

    result.push({
      ...data[i],
      movingAvg,
    });
  }

  return result;
}

export interface RegressionAlert {
  model: string;
  period: string;
  previousScore: number;
  currentScore: number;
  dropPercent: number;
}

export function detectRegressions(
  trendData: TrendDataPoint[],
  threshold: number = 0.05
): RegressionAlert[] {
  const alerts: RegressionAlert[] = [];

  for (let i = 1; i < trendData.length; i++) {
    const previous = trendData[i - 1];
    const current = trendData[i];

    if (previous.avgScore > 0) {
      const drop = (previous.avgScore - current.avgScore) / previous.avgScore;

      if (drop > threshold) {
        alerts.push({
          model: '',
          period: current.period,
          previousScore: previous.avgScore,
          currentScore: current.avgScore,
          dropPercent: drop * 100,
        });
      }
    }
  }

  return alerts;
}