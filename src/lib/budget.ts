import type { CostBreakdown } from './pricing';

export interface BudgetAlert {
  type: 'per_run' | 'cumulative';
  threshold: number;
  actual: number;
  message: string;
}

export interface SpendWindow {
  runs: Array<{
    run_id: string;
    cost: number;
    timestamp: string;
  }>;
  windowSize: number;
}

export function checkPerRunThreshold(
  cost: CostBreakdown,
  threshold: number
): BudgetAlert | null {
  if (cost.total_cost > threshold) {
    return {
      type: 'per_run',
      threshold,
      actual: cost.total_cost,
      message: formatAlertMessage('per_run', cost.total_cost, threshold),
    };
  }
  return null;
}

export function createSpendWindow(windowSize: number): SpendWindow {
  return {
    runs: [],
    windowSize,
  };
}

export function addRunToWindow(
  window: SpendWindow,
  runId: string,
  cost: number,
  timestamp?: string
): SpendWindow {
  const newRun = {
    run_id: runId,
    cost,
    timestamp: timestamp ?? new Date().toISOString(),
  };

  const updatedRuns = [...window.runs, newRun];

  if (updatedRuns.length > window.windowSize) {
    updatedRuns.shift();
  }

  return {
    runs: updatedRuns,
    windowSize: window.windowSize,
  };
}

export function getCumulativeSpend(window: SpendWindow): number {
  return window.runs.reduce((sum, run) => sum + run.cost, 0);
}

export function checkCumulativeThreshold(
  window: SpendWindow,
  threshold: number
): BudgetAlert | null {
  const cumulative = getCumulativeSpend(window);
  if (cumulative > threshold) {
    return {
      type: 'cumulative',
      threshold,
      actual: cumulative,
      message: formatAlertMessage('cumulative', cumulative, threshold),
    };
  }
  return null;
}

export function formatAlertMessage(
  type: 'per_run' | 'cumulative',
  actual: number,
  threshold: number
): string {
  const typeLabel = type === 'per_run' ? 'Per-run cost' : 'Cumulative spend';
  const percentOver = ((actual - threshold) / threshold) * 100;
  return `${typeLabel} $${actual.toFixed(6)} exceeds threshold $${threshold.toFixed(6)} by ${percentOver.toFixed(1)}%`;
}

export function shouldAlert(alert: BudgetAlert | null): alert is BudgetAlert {
  return alert !== null;
}