export interface AggregateScore {
  model: string;
  normalizedScore: number;
  rank: number;
}

export interface TaskResult {
  taskId: string;
  taskTitle: string;
  domain?: string;
  normalizedScore: number;
  rawScore: number;
  winner: boolean;
  delta: number;
}

export interface ModelResult {
  model: string;
  provider?: string;
  normalizedScore: number;
  rawScore: number;
  taskResults: TaskResult[];
}

export interface StrengthsWeaknesses {
  category: string;
  avgScore: number;
  taskCount: number;
}

export interface ComparisonReport {
  id: string;
  generatedAt: string;
  datasetVersion?: string;
  taskSet: string[];
  models: ModelResult[];
  aggregateScores: AggregateScore[];
  strengthsWeaknesses?: {
    model: string;
    strengths: StrengthsWeaknesses[];
    weaknesses: StrengthsWeaknesses[];
  }[];
}

export function exportToMarkdown(report: ComparisonReport): string {
  const lines: string[] = [];
  
  lines.push(`# Model Comparison Report`);
  lines.push(`Generated: ${new Date(report.generatedAt).toLocaleString()}`);
  lines.push('');

  lines.push(`## Summary`);
  lines.push('');
  lines.push('| Rank | Model | Score |');
  lines.push('|------|-------|-------|');
  for (const score of report.aggregateScores) {
    lines.push(`| ${score.rank} | ${score.model} | ${score.normalizedScore.toFixed(1)} |`);
  }
  lines.push('');

  if (report.models.length > 0 && report.models[0].taskResults.length > 0) {
    lines.push('## Per-Task Comparison');
    lines.push('');
    const taskIds = report.models[0].taskResults.map(t => t.taskId);
    
    lines.push('| Task | ' + report.models.map(m => m.model).join(' | ') + ' |');
    lines.push('|------|' + report.models.map(() => '------').join('|') + '|');
    
    for (const taskId of taskIds) {
      const taskResults = report.models.map(m => m.taskResults.find(t => t.taskId === taskId)!);
      const taskTitle = taskResults[0]?.taskTitle || taskId;
      const row = [`| ${taskTitle}`];
      for (const t of taskResults) {
        const winnerMark = t.winner ? ' **(+)**' : '';
        row.push(` ${t.normalizedScore.toFixed(1)}${winnerMark} |`);
      }
      lines.push(row.join('|'));
    }
    lines.push('');
  }

  if (report.strengthsWeaknesses && report.strengthsWeaknesses.length > 0) {
    lines.push('## Strengths & Weaknesses');
    lines.push('');
    for (const sw of report.strengthsWeaknesses) {
      lines.push(`### ${sw.model}`);
      lines.push('');
      if (sw.strengths.length > 0) {
        lines.push('**Strengths:**');
        for (const s of sw.strengths) {
          lines.push(`- ${s.category} (${s.taskCount} tasks, avg ${s.avgScore.toFixed(1)})`);
        }
        lines.push('');
      }
      if (sw.weaknesses.length > 0) {
        lines.push('**Weaknesses:**');
        for (const w of sw.weaknesses) {
          lines.push(`- ${w.category} (${w.taskCount} tasks, avg ${w.avgScore.toFixed(1)})`);
        }
        lines.push('');
      }
    }
  }

  return lines.join('\n');
}

export function exportToPDF(report: ComparisonReport): string {
  return JSON.stringify({
    title: 'Model Comparison Report',
    generatedAt: report.generatedAt,
    summary: report.aggregateScores,
    taskComparison: report.models.map(m => ({
      model: m.model,
      tasks: m.taskResults.map(t => ({
        title: t.taskTitle,
        score: t.normalizedScore,
        winner: t.winner,
      })),
    })),
  });
}