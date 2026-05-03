import type { RunDetail } from './schemas';

export interface QueryFilters {
  model?: string;
  task?: string;
  startDate?: string;
  endDate?: string;
  minScore?: number;
  maxScore?: number;
}

export interface SummaryStats {
  mean: number;
  median: number;
  p95: number;
}

export function filterRuns(runs: RunDetail[], filters: QueryFilters): RunDetail[] {
  return runs.filter(run => {
    if (filters.model && run.model !== filters.model) {
      return false;
    }
    if (filters.task && run.task_id !== filters.task) {
      return false;
    }
    if (filters.startDate && run.run_date < filters.startDate) {
      return false;
    }
    if (filters.endDate && run.run_date > filters.endDate) {
      return false;
    }
    if (filters.minScore !== undefined && run.total_score < filters.minScore) {
      return false;
    }
    if (filters.maxScore !== undefined && run.total_score > filters.maxScore) {
      return false;
    }
    return true;
  });
}

export function computeStats(scores: number[]): SummaryStats {
  if (scores.length === 0) {
    return { mean: 0, median: 0, p95: 0 };
  }

  const sorted = [...scores].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / sorted.length;

  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;

  const p95Index = Math.ceil(sorted.length * 0.95) - 1;
  const p95 = sorted[p95Index];

  return { mean, median, p95 };
}

export function exportToCSV(runs: RunDetail[]): string {
  const headers = ['id', 'model', 'run_date', 'total_score', 'task_id', 'harness', 'wall_time_seconds'];
  const lines: string[] = [headers.join(',')];

  for (const run of runs) {
    const row = [
      escapeCSV(run.id),
      escapeCSV(run.model),
      escapeCSV(run.run_date),
      run.total_score.toString(),
      escapeCSV(run.task_id || ''),
      escapeCSV(run.harness),
      run.wall_time_seconds.toString(),
    ];
    lines.push(row.join(','));
  }

  return lines.join('\n');
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function runsToLeaderboardFormat(runs: RunDetail[]) {
  const byModel = new Map<string, RunDetail[]>();
  for (const run of runs) {
    const existing = byModel.get(run.model) || [];
    existing.push(run);
    byModel.set(run.model, existing);
  }

  return Array.from(byModel.entries()).map(([model, modelRuns]) => {
    const scores = modelRuns.map(r => r.total_score);
    const stats = computeStats(scores);
    return {
      model,
      runs: modelRuns.length,
      latestRunDate: modelRuns[0].run_date,
      meanScore: stats.mean,
      medianScore: stats.median,
      p95Score: stats.p95,
    };
  });
}