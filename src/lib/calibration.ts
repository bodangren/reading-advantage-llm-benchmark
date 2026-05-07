import { RunDetail } from './schemas';

export const PASS_RATE_THRESHOLD = 0.7;

export interface TaskCalibrationData {
  taskId: string;
  label: string;
  calibratedScore: number;
  percentile: number;
  passRate: number;
  runCount: number;
}

export interface CalibrationReport {
  overRated: Array<TaskCalibrationData & { suggestedLabel: string }>;
  underRated: Array<TaskCalibrationData & { suggestedLabel: string }>;
  correctlyRated: TaskCalibrationData[];
}

export function calculatePassRate(runs: RunDetail[], threshold: number = PASS_RATE_THRESHOLD): number {
  if (runs.length === 0) return 0;
  const passed = runs.filter(r => r.total_score >= threshold).length;
  return passed / runs.length;
}

export function computeDifficultyScore(passRate: number): number {
  return Math.round((1 - passRate) * 100);
}

export function classifyDifficulty(difficultyScore: number): 'easy' | 'medium' | 'hard' {
  if (difficultyScore <= 33) return 'easy';
  if (difficultyScore <= 66) return 'medium';
  return 'hard';
}

export function computeDifficultyPercentile(allScores: number[], score: number): number {
  if (allScores.length === 0) return 0;
  const sorted = [...allScores].sort((a, b) => a - b);
  const rank = sorted.findIndex(s => s >= score);
  if (rank === -1) return 100;
  return Math.round((rank / (sorted.length - 1)) * 100);
}

export function generateCalibrationReport(data: TaskCalibrationData[]): CalibrationReport {
  const overRated: CalibrationReport['overRated'] = [];
  const underRated: CalibrationReport['underRated'] = [];
  const correctlyRated: TaskCalibrationData[] = [];

  for (const task of data) {
    const suggested = classifyDifficulty(task.calibratedScore);

    if (task.label === 'easy' && task.calibratedScore > 50) {
      overRated.push({ ...task, suggestedLabel: suggested });
    } else if (task.label === 'medium' && (task.calibratedScore <= 33 || task.calibratedScore >= 67)) {
      if (task.calibratedScore <= 33) {
        underRated.push({ ...task, suggestedLabel: 'easy' });
      } else {
        overRated.push({ ...task, suggestedLabel: 'hard' });
      }
    } else if (task.label === 'hard' && task.calibratedScore < 50) {
      underRated.push({ ...task, suggestedLabel: suggested });
    } else {
      correctlyRated.push(task);
    }
  }

  return { overRated, underRated, correctlyRated };
}

export function calibrateTask(
  taskId: string,
  label: string,
  runs: RunDetail[]
): TaskCalibrationData {
  const passRate = calculatePassRate(runs);
  const calibratedScore = computeDifficultyScore(passRate);

  return {
    taskId,
    label,
    calibratedScore,
    percentile: 0,
    passRate,
    runCount: runs.length,
  };
}