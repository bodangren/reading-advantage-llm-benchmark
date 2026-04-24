import { describe, it, expect } from 'vitest';
import {
  checkPerRunThreshold,
  createSpendWindow,
  addRunToWindow,
  getCumulativeSpend,
  checkCumulativeThreshold,
  formatAlertMessage,
  shouldAlert,
  type BudgetAlert,
} from '@/lib/budget';

describe('Budget Alerts Module', () => {
  describe('checkPerRunThreshold', () => {
    it('returns null when under threshold', () => {
      const cost = {
        input_cost: 0.001,
        output_cost: 0.002,
        total_cost: 0.003,
        model: 'gpt-4o',
        provider: 'openai',
      };
      const alert = checkPerRunThreshold(cost, 0.01);
      expect(alert).toBeNull();
    });

    it('returns alert when at threshold', () => {
      const cost = {
        input_cost: 0.005,
        output_cost: 0.0051,
        total_cost: 0.0101,
        model: 'gpt-4o',
        provider: 'openai',
      };
      const alert = checkPerRunThreshold(cost, 0.01);
      expect(alert).not.toBeNull();
      expect(alert!.type).toBe('per_run');
      expect(alert!.actual).toBe(0.0101);
      expect(alert!.threshold).toBe(0.01);
    });

    it('returns alert when over threshold', () => {
      const cost = {
        input_cost: 0.01,
        output_cost: 0.02,
        total_cost: 0.03,
        model: 'gpt-4o',
        provider: 'openai',
      };
      const alert = checkPerRunThreshold(cost, 0.01);
      expect(alert).not.toBeNull();
      expect(alert!.actual).toBe(0.03);
      expect(alert!.threshold).toBe(0.01);
      expect(alert!.message).toContain('exceeds');
    });
  });

  describe('SpendWindow', () => {
    it('creates empty window', () => {
      const window = createSpendWindow(5);
      expect(window.runs).toHaveLength(0);
      expect(window.windowSize).toBe(5);
    });

    it('adds runs to window', () => {
      let window = createSpendWindow(3);
      window = addRunToWindow(window, 'run-1', 0.01);
      window = addRunToWindow(window, 'run-2', 0.02);

      expect(window.runs).toHaveLength(2);
      expect(window.runs[0].run_id).toBe('run-1');
      expect(window.runs[1].run_id).toBe('run-2');
    });

    it('evicts oldest run when window is full', () => {
      let window = createSpendWindow(2);
      window = addRunToWindow(window, 'run-1', 0.01);
      window = addRunToWindow(window, 'run-2', 0.02);
      window = addRunToWindow(window, 'run-3', 0.03);

      expect(window.runs).toHaveLength(2);
      expect(window.runs[0].run_id).toBe('run-2');
      expect(window.runs[1].run_id).toBe('run-3');
    });

    it('calculates cumulative spend', () => {
      let window = createSpendWindow(5);
      window = addRunToWindow(window, 'run-1', 0.01);
      window = addRunToWindow(window, 'run-2', 0.02);
      window = addRunToWindow(window, 'run-3', 0.03);

      expect(getCumulativeSpend(window)).toBeCloseTo(0.06, 5);
    });

    it('handles empty window cumulative spend', () => {
      const window = createSpendWindow(5);
      expect(getCumulativeSpend(window)).toBe(0);
    });
  });

  describe('checkCumulativeThreshold', () => {
    it('returns null when under cumulative threshold', () => {
      let window = createSpendWindow(5);
      window = addRunToWindow(window, 'run-1', 0.001);
      window = addRunToWindow(window, 'run-2', 0.002);

      const alert = checkCumulativeThreshold(window, 0.01);
      expect(alert).toBeNull();
    });

    it('returns alert when cumulative exceeds threshold', () => {
      let window = createSpendWindow(5);
      window = addRunToWindow(window, 'run-1', 0.005);
      window = addRunToWindow(window, 'run-2', 0.006);

      const alert = checkCumulativeThreshold(window, 0.01);
      expect(alert).not.toBeNull();
      expect(alert!.type).toBe('cumulative');
      expect(alert!.actual).toBe(0.011);
      expect(alert!.threshold).toBe(0.01);
    });

    it('tracks rolling window correctly', () => {
      let window = createSpendWindow(2);
      window = addRunToWindow(window, 'run-1', 0.004);
      window = addRunToWindow(window, 'run-2', 0.005);

      let alert = checkCumulativeThreshold(window, 0.01);
      expect(alert).toBeNull();

      window = addRunToWindow(window, 'run-3', 0.006);

      alert = checkCumulativeThreshold(window, 0.01);
      expect(alert).not.toBeNull();
    });
  });

  describe('formatAlertMessage', () => {
    it('formats per-run alert message', () => {
      const message = formatAlertMessage('per_run', 0.03, 0.01);
      expect(message).toContain('Per-run cost');
      expect(message).toContain('$0.030000');
      expect(message).toContain('$0.010000');
      expect(message).toContain('200.0%');
    });

    it('formats cumulative alert message', () => {
      const message = formatAlertMessage('cumulative', 0.015, 0.01);
      expect(message).toContain('Cumulative spend');
      expect(message).toContain('50.0%');
    });
  });

  describe('shouldAlert', () => {
    it('returns false for null', () => {
      expect(shouldAlert(null)).toBe(false);
    });

    it('returns true for alert', () => {
      const alert: BudgetAlert = {
        type: 'per_run',
        threshold: 0.01,
        actual: 0.03,
        message: 'test',
      };
      expect(shouldAlert(alert)).toBe(true);
    });
  });

  describe('alert message formatting', () => {
    it('formats percentage correctly for small overages', () => {
      const message = formatAlertMessage('per_run', 0.0101, 0.01);
      expect(message).toContain('1.0%');
    });

    it('formats percentage correctly for large overages', () => {
      const message = formatAlertMessage('per_run', 0.10, 0.01);
      expect(message).toContain('900.0%');
    });
  });
});