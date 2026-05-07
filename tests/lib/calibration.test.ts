import { describe, it, expect } from 'vitest';
import {
  calculatePassRate,
  computeDifficultyScore,
  computeDifficultyPercentile,
  classifyDifficulty,
  generateCalibrationReport,
  TaskCalibrationData,
} from '../../src/lib/calibration';
import { RunDetail } from '@/lib/schemas';

describe('Difficulty Calibration', () => {
  const mockRuns: RunDetail[] = [
    {
      id: 'run-1',
      model: 'gpt-4o',
      harness: 'opencode',
      harness_version: '1.0',
      benchmark_version: '1.0',
      run_date: '2026-04-01T10:00:00Z',
      wall_time_seconds: 100,
      total_score: 0.85,
      scores: { functional_correctness: 34, integration_quality: 22, regression_safety: 18, minimality: 8, process_quality: 4 },
      test_results: [],
      artifacts: [],
      task_id: 'task-1',
    },
    {
      id: 'run-2',
      model: 'claude-3',
      harness: 'opencode',
      harness_version: '1.0',
      benchmark_version: '1.0',
      run_date: '2026-04-01T10:00:00Z',
      wall_time_seconds: 100,
      total_score: 0.72,
      scores: { functional_correctness: 28, integration_quality: 20, regression_safety: 15, minimality: 7, process_quality: 2 },
      test_results: [],
      artifacts: [],
      task_id: 'task-1',
    },
    {
      id: 'run-3',
      model: 'gemini-2',
      harness: 'opencode',
      harness_version: '1.0',
      benchmark_version: '1.0',
      run_date: '2026-04-01T10:00:00Z',
      wall_time_seconds: 100,
      total_score: 0.65,
      scores: { functional_correctness: 25, integration_quality: 18, regression_safety: 14, minimality: 6, process_quality: 2 },
      test_results: [],
      artifacts: [],
      task_id: 'task-1',
    },
  ];

  describe('calculatePassRate', () => {
    it('should compute pass rate correctly with passing runs', () => {
      const passRate = calculatePassRate(mockRuns, 0.7);
      expect(passRate).toBeCloseTo(2 / 3, 4);
    });

    it('should return 0 when no runs pass threshold', () => {
      const failingRuns = mockRuns.map(r => ({ ...r, total_score: 0.5 }));
      const passRate = calculatePassRate(failingRuns, 0.7);
      expect(passRate).toBe(0);
    });

    it('should return 1 when all runs pass threshold', () => {
      const passingRuns = mockRuns.map(r => ({ ...r, total_score: 0.85 }));
      const passRate = calculatePassRate(passingRuns, 0.7);
      expect(passRate).toBe(1);
    });

    it('should return 0 for empty runs array', () => {
      const passRate = calculatePassRate([], 0.7);
      expect(passRate).toBe(0);
    });

    it('should return 0 for single run that fails', () => {
      const singleFailingRun = [{ ...mockRuns[0], total_score: 0.5 }];
      const passRate = calculatePassRate(singleFailingRun, 0.7);
      expect(passRate).toBe(0);
    });

    it('should return 1 for single run that passes', () => {
      const singlePassingRun = [{ ...mockRuns[0], total_score: 0.85 }];
      const passRate = calculatePassRate(singlePassingRun, 0.7);
      expect(passRate).toBe(1);
    });

    it('should handle threshold at boundary (exactly 0.7)', () => {
      const boundaryRuns = [
        { ...mockRuns[0], total_score: 0.7 },
        { ...mockRuns[1], total_score: 0.69 },
      ];
      const passRate = calculatePassRate(boundaryRuns, 0.7);
      expect(passRate).toBe(0.5);
    });
  });

  describe('computeDifficultyScore', () => {
    it('should invert pass rate to difficulty (high pass = low difficulty)', () => {
      const difficulty = computeDifficultyScore(0.66);
      expect(difficulty).toBeCloseTo(34, 4);
    });

    it('should return 0 for perfect pass rate (all models pass)', () => {
      const difficulty = computeDifficultyScore(1.0);
      expect(difficulty).toBe(0);
    });

    it('should return 100 for zero pass rate (all models fail)', () => {
      const difficulty = computeDifficultyScore(0);
      expect(difficulty).toBe(100);
    });

    it('should return 50 for 50% pass rate', () => {
      const difficulty = computeDifficultyScore(0.5);
      expect(difficulty).toBe(50);
    });

    it('should return 100 for empty runs (handled externally)', () => {
      const difficulty = computeDifficultyScore(0);
      expect(difficulty).toBe(100);
    });
  });

  describe('classifyDifficulty', () => {
    it('should classify 0-33 as easy', () => {
      expect(classifyDifficulty(0)).toBe('easy');
      expect(classifyDifficulty(15)).toBe('easy');
      expect(classifyDifficulty(33)).toBe('easy');
    });

    it('should classify 34-66 as medium', () => {
      expect(classifyDifficulty(34)).toBe('medium');
      expect(classifyDifficulty(50)).toBe('medium');
      expect(classifyDifficulty(66)).toBe('medium');
    });

    it('should classify 67-100 as hard', () => {
      expect(classifyDifficulty(67)).toBe('hard');
      expect(classifyDifficulty(85)).toBe('hard');
      expect(classifyDifficulty(100)).toBe('hard');
    });

    it('should handle boundary at 33 correctly', () => {
      expect(classifyDifficulty(33)).toBe('easy');
      expect(classifyDifficulty(34)).toBe('medium');
    });

    it('should handle boundary at 66 correctly', () => {
      expect(classifyDifficulty(66)).toBe('medium');
      expect(classifyDifficulty(67)).toBe('hard');
    });
  });

  describe('computeDifficultyPercentile', () => {
    it('should return 0 for empty scores array', () => {
      const percentile = computeDifficultyPercentile([], 50);
      expect(percentile).toBe(0);
    });

    it('should return 0 for score at minimum', () => {
      const percentile = computeDifficultyPercentile([10, 20, 30], 10);
      expect(percentile).toBe(0);
    });

    it('should return 100 for score at maximum', () => {
      const percentile = computeDifficultyPercentile([10, 20, 30], 30);
      expect(percentile).toBe(100);
    });

    it('should return 50 for score at median', () => {
      const percentile = computeDifficultyPercentile([0, 50, 100], 50);
      expect(percentile).toBe(50);
    });

    it('should return correct percentile for uneven distribution', () => {
      const scores = [10, 20, 30, 40, 90];
      expect(computeDifficultyPercentile(scores, 10)).toBe(0);
      expect(computeDifficultyPercentile(scores, 30)).toBe(50);
      expect(computeDifficultyPercentile(scores, 90)).toBe(100);
    });
  });

  describe('generateCalibrationReport', () => {
    const calibrationData: TaskCalibrationData[] = [
      { taskId: 'task-1', label: 'medium', calibratedScore: 34, percentile: 34, passRate: 0.66, runCount: 3 },
      { taskId: 'task-2', label: 'easy', calibratedScore: 85, percentile: 85, passRate: 0.2, runCount: 5 },
      { taskId: 'task-3', label: 'hard', calibratedScore: 15, percentile: 15, passRate: 0.9, runCount: 2 },
    ];

    it('should identify over-rated tasks (label easier than actual)', () => {
      const report = generateCalibrationReport(calibrationData);
      expect(report.overRated).toHaveLength(1);
      expect(report.overRated[0].taskId).toBe('task-2');
      expect(report.overRated[0].suggestedLabel).toBe('hard');
    });

    it('should identify under-rated tasks (label easier than actual)', () => {
      const report = generateCalibrationReport(calibrationData);
      expect(report.underRated).toHaveLength(1);
      expect(report.underRated[0].taskId).toBe('task-3');
      expect(report.underRated[0].suggestedLabel).toBe('easy');
    });

    it('should correctly classify correctly-rated tasks', () => {
      const report = generateCalibrationReport(calibrationData);
      expect(report.correctlyRated).toHaveLength(1);
      expect(report.correctlyRated[0].taskId).toBe('task-1');
    });

    it('should return empty arrays when all tasks are correctly rated', () => {
      const allCorrect: TaskCalibrationData[] = [
        { taskId: 'task-a', label: 'hard', calibratedScore: 85, percentile: 85, passRate: 0.1, runCount: 3 },
      ];
      const report = generateCalibrationReport(allCorrect);
      expect(report.overRated).toHaveLength(0);
      expect(report.underRated).toHaveLength(0);
      expect(report.correctlyRated).toHaveLength(1);
    });

    it('should return empty arrays for empty input', () => {
      const report = generateCalibrationReport([]);
      expect(report.overRated).toHaveLength(0);
      expect(report.underRated).toHaveLength(0);
      expect(report.correctlyRated).toHaveLength(0);
    });
  });
});