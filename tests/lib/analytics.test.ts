import { describe, it, expect } from 'vitest';
import { groupRunsByPeriod, calculateMovingAverage, TrendDataPoint, detectRegressions } from '@/lib/analytics';

describe('Time Series Grouping', () => {
  describe('groupRunsByPeriod', () => {
    it('should group runs by week', () => {
      const runs = [
        { id: '1', model: 'gpt-4', run_date: '2026-04-06T10:00:00Z', total_score: 0.75 },
        { id: '2', model: 'gpt-4', run_date: '2026-04-07T10:00:00Z', total_score: 0.78 },
        { id: '3', model: 'gpt-4', run_date: '2026-04-14T10:00:00Z', total_score: 0.80 },
        { id: '4', model: 'gpt-4', run_date: '2026-04-15T10:00:00Z', total_score: 0.82 },
      ];

      const grouped = groupRunsByPeriod(runs, 'week');

      expect(grouped).toHaveLength(2);
      expect(grouped[0].period).toBe('2026-04-05');
      expect(grouped[0].runs).toHaveLength(2);
      expect(grouped[0].avgScore).toBeCloseTo(0.765, 2);
    });

    it('should group runs by month', () => {
      const runs = [
        { id: '1', model: 'gpt-4', run_date: '2026-04-06T10:00:00Z', total_score: 0.75 },
        { id: '2', model: 'gpt-4', run_date: '2026-04-20T10:00:00Z', total_score: 0.78 },
        { id: '3', model: 'gpt-4', run_date: '2026-05-05T10:00:00Z', total_score: 0.80 },
        { id: '4', model: 'gpt-4', run_date: '2026-05-15T10:00:00Z', total_score: 0.82 },
      ];

      const grouped = groupRunsByPeriod(runs, 'month');

      expect(grouped).toHaveLength(2);
      expect(grouped[0].period).toBe('2026-04');
      expect(grouped[0].runs).toHaveLength(2);
      expect(grouped[1].period).toBe('2026-05');
      expect(grouped[1].runs).toHaveLength(2);
    });

    it('should return empty array for empty input', () => {
      const grouped = groupRunsByPeriod([], 'week');
      expect(grouped).toEqual([]);
    });

    it('should handle single run', () => {
      const runs = [
        { id: '1', model: 'gpt-4', run_date: '2026-04-06T10:00:00Z', total_score: 0.75 },
      ];

      const grouped = groupRunsByPeriod(runs, 'week');

      expect(grouped).toHaveLength(1);
      expect(grouped[0].avgScore).toBe(0.75);
    });
  });

  describe('calculateMovingAverage', () => {
    it('should calculate 3-period moving average', () => {
      const dataPoints: TrendDataPoint[] = [
        { period: '2026-04-01', avgScore: 0.70, runCount: 2 },
        { period: '2026-04-08', avgScore: 0.75, runCount: 2 },
        { period: '2026-04-15', avgScore: 0.80, runCount: 2 },
        { period: '2026-04-22', avgScore: 0.85, runCount: 2 },
      ];

      const result = calculateMovingAverage(dataPoints, 3);

      expect(result).toHaveLength(4);
      expect(result[0].movingAvg).toBeNull();
      expect(result[1].movingAvg).toBeNull();
      expect(result[2].movingAvg).toBeCloseTo(0.75, 2);
      expect(result[3].movingAvg).toBeCloseTo(0.80, 2);
    });

    it('should handle window larger than data', () => {
      const dataPoints: TrendDataPoint[] = [
        { period: '2026-04-01', avgScore: 0.75, runCount: 2 },
      ];

      const result = calculateMovingAverage(dataPoints, 3);

      expect(result).toHaveLength(1);
      expect(result[0].movingAvg).toBeNull();
    });

    it('should handle empty data', () => {
      const result = calculateMovingAverage([], 3);
      expect(result).toEqual([]);
    });
  });

  describe('detectRegressions', () => {
    it('should detect score drop above threshold', () => {
      const dataPoints: TrendDataPoint[] = [
        { period: '2026-04-01', avgScore: 0.80, runCount: 2 },
        { period: '2026-04-08', avgScore: 0.74, runCount: 2 },
        { period: '2026-04-15', avgScore: 0.78, runCount: 2 },
      ];

      const alerts = detectRegressions(dataPoints, 0.05);

      expect(alerts).toHaveLength(1);
      expect(alerts[0].previousScore).toBeCloseTo(0.80, 2);
      expect(alerts[0].currentScore).toBeCloseTo(0.74, 2);
      expect(alerts[0].dropPercent).toBeCloseTo(7.5, 1);
    });

    it('should not alert for small drops', () => {
      const dataPoints: TrendDataPoint[] = [
        { period: '2026-04-01', avgScore: 0.80, runCount: 2 },
        { period: '2026-04-08', avgScore: 0.79, runCount: 2 },
      ];

      const alerts = detectRegressions(dataPoints, 0.05);

      expect(alerts).toHaveLength(0);
    });

    it('should handle no regression', () => {
      const dataPoints: TrendDataPoint[] = [
        { period: '2026-04-01', avgScore: 0.75, runCount: 2 },
        { period: '2026-04-08', avgScore: 0.78, runCount: 2 },
        { period: '2026-04-15', avgScore: 0.82, runCount: 2 },
      ];

      const alerts = detectRegressions(dataPoints, 0.05);

      expect(alerts).toHaveLength(0);
    });
  });
});