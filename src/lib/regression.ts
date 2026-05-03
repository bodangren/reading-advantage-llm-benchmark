import type { RunDetail } from './schemas';

export interface RegressionItem {
  taskId: string;
  beforeScore: number;
  afterScore: number;
  delta: number;
}

export interface RegressionReport {
  model: string;
  generatedAt: string;
  beforeRunId: string;
  afterRunId: string;
  regressions: RegressionItem[];
}

export function compareRuns(before: RunDetail, after: RunDetail): RegressionReport {
  const beforeScore = before.total_score;
  const afterScore = after.total_score;
  const delta = beforeScore - afterScore;

  return {
    model: before.model,
    generatedAt: new Date().toISOString(),
    beforeRunId: before.id,
    afterRunId: after.id,
    regressions: [{
      taskId: before.task_id || 'aggregate',
      beforeScore,
      afterScore,
      delta,
    }],
  };
}

export function filterRegressions(report: RegressionReport, threshold: number): RegressionItem[] {
  return report.regressions.filter(r => r.delta >= threshold);
}

export function generateRegressionReport(items: RegressionItem[], model: string): string {
  if (items.length === 0) {
    return `# Regression Report\n\nNo regressions detected for ${model}.\n`;
  }

  const lines: string[] = [];
  lines.push(`# Regression Report`);
  lines.push(`\nModel: ${model}`);
  lines.push(`\nDetected ${items.length} regression(s):\n`);
  lines.push('| Task | Before | After | Delta |');
  lines.push('|------|--------|-------|-------|');

  for (const item of items) {
    lines.push(`| ${item.taskId} | ${item.beforeScore.toFixed(3)} | ${item.afterScore.toFixed(3)} | -${item.delta.toFixed(3)} |`);
  }

  return lines.join('\n');
}