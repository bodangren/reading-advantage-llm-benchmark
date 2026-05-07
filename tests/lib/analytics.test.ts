import { describe, it, expect } from 'vitest';
import { formatChartData, groupRegressionsByModel, getScoreTypeLabel, exportTrendDataToCSV } from '@/lib/analytics';

describe('Chart Data Formatting', () => {
  describe('formatChartData', () => {
    it('should transform grouped data to chart format', () => {
      const groupedData = [
        { period: '2026-04-01', avgScore: 0.75, runCount: 3 },
        { period: '2026-04-08', avgScore: 0.78, runCount: 2 },
      ];

      const chartData = formatChartData(groupedData, 'gpt-4o');

      expect(chartData).toHaveLength(2);
      expect(chartData[0]).toMatchObject({
        period: '2026-04-01',
        score: 75,
        model: 'gpt-4o',
        movingAvg: null,
      });
      expect(chartData[1].score).toBe(78);
    });

    it('should include moving average when available', () => {
      const groupedData = [
        { period: '2026-04-01', avgScore: 0.70, runCount: 2, movingAvg: 0.72 },
        { period: '2026-04-08', avgScore: 0.75, runCount: 2, movingAvg: 0.73 },
      ];

      const chartData = formatChartData(groupedData, 'claude');

      expect(chartData[0].movingAvg).toBe(72);
      expect(chartData[1].movingAvg).toBe(73);
    });

    it('should handle empty data', () => {
      const chartData = formatChartData([], 'model');
      expect(chartData).toEqual([]);
    });

    it('should normalize 0-1 scores to 0-100', () => {
      const groupedData = [
        { period: '2026-04-01', avgScore: 0.5, runCount: 2 },
      ];

      const chartData = formatChartData(groupedData, 'model');
      expect(chartData[0].score).toBe(50);
    });

    it('should pass through already 0-100 scores', () => {
      const groupedData = [
        { period: '2026-04-01', avgScore: 75, runCount: 2 },
      ];

      const chartData = formatChartData(groupedData, 'model');
      expect(chartData[0].score).toBe(75);
    });
  });

  describe('getScoreTypeLabel', () => {
    it('should return correct labels for each score type', () => {
      expect(getScoreTypeLabel('overall')).toBe('Overall Score');
      expect(getScoreTypeLabel('correctness')).toBe('Functional Correctness');
      expect(getScoreTypeLabel('safety')).toBe('Regression Safety');
    });
  });

  describe('groupRegressionsByModel', () => {
    it('should group regression alerts by model', () => {
      const alerts = [
        { model: 'gpt-4', period: '2026-04-08', previousScore: 80, currentScore: 74, dropPercent: 7.5 },
        { model: 'claude-3', period: '2026-04-08', previousScore: 85, currentScore: 78, dropPercent: 8.2 },
      ];

      const grouped = groupRegressionsByModel(alerts);

      expect(grouped['gpt-4']).toHaveLength(1);
      expect(grouped['claude-3']).toHaveLength(1);
      expect(grouped['claude-3'][0].dropPercent).toBeCloseTo(8.2, 1);
    });

    it('should handle empty alerts', () => {
      const grouped = groupRegressionsByModel([]);
      expect(grouped).toEqual({});
    });
  });
});

describe('Multi-Model Chart Data', () => {
  it('should format data for multiple models', () => {
    const modelARuns = [
      { period: '2026-04-01', avgScore: 75, runCount: 2 },
      { period: '2026-04-08', avgScore: 78, runCount: 2 },
    ];
    const modelBRuns = [
      { period: '2026-04-01', avgScore: 80, runCount: 2 },
      { period: '2026-04-08', avgScore: 79, runCount: 2 },
    ];

    const chartA = formatChartData(modelARuns, 'Model A');
    const chartB = formatChartData(modelBRuns, 'Model B');

    expect(chartA[0].model).toBe('Model A');
    expect(chartB[0].model).toBe('Model B');
    expect(chartA[0].score).toBe(75);
    expect(chartB[0].score).toBe(80);
  });
});

describe('CSV Export', () => {
  it('should export trend data to CSV format', () => {
    const chartData = {
      'Model A': [
        { period: '2026-04-01', score: 75, model: 'Model A', movingAvg: null },
        { period: '2026-04-08', score: 78, model: 'Model A', movingAvg: 76.5 },
      ],
      'Model B': [
        { period: '2026-04-01', score: 80, model: 'Model B', movingAvg: null },
        { period: '2026-04-08', score: 79, model: 'Model B', movingAvg: 79.5 },
      ],
    };

    const csv = exportTrendDataToCSV(chartData);
    const lines = csv.split('\n');

    expect(lines[0]).toBe('period,Model A,Model B');
    expect(lines[1]).toBe('2026-04-01,75,80');
    expect(lines[2]).toBe('2026-04-08,78,79');
  });

  it('should handle missing periods for some models', () => {
    const chartData = {
      'Model A': [
        { period: '2026-04-01', score: 75, model: 'Model A', movingAvg: null },
      ],
      'Model B': [
        { period: '2026-04-08', score: 79, model: 'Model B', movingAvg: null },
      ],
    };

    const csv = exportTrendDataToCSV(chartData);
    const lines = csv.split('\n');

    expect(lines[0]).toBe('period,Model A,Model B');
    expect(lines[1]).toBe('2026-04-01,75,');
    expect(lines[2]).toBe('2026-04-08,,79');
  });

  it('should handle empty chart data', () => {
    const csv = exportTrendDataToCSV({});
    expect(csv).toBe('period');
  });
});