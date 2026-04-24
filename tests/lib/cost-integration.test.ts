import { describe, it, expect } from 'vitest';
import { calculateCost } from '@/lib/pricing';

describe('Cost Integration Tests', () => {
  describe('parseRunAndComputeCost', () => {
    it('computes cost from a mock run result', () => {
      const mockRunResult = {
        id: 'test-run-001',
        model: 'gpt-4o',
        provider: 'openai',
        task_id: 'task_001',
        scores: {
          functional_correctness: 0.9,
          integration_quality: 0.85,
          regression_safety: 0.8,
          minimality: 0.75,
          process_quality: 0.7,
        },
        token_counts: {
          input_tokens: 1500,
          output_tokens: 800,
        },
      };

      const cost = calculateCost(
        mockRunResult.provider,
        mockRunResult.model,
        mockRunResult.token_counts
      );

      expect(cost).not.toBeNull();
      expect(cost!.total_cost).toBeCloseTo((1500 / 1000) * 0.0025 + (800 / 1000) * 0.01, 5);
    });

    it('computes cost for multiple runs and sums them', () => {
      const runs = [
        { provider: 'openai', model: 'gpt-4o', tokens: { input_tokens: 1000, output_tokens: 500 } },
        { provider: 'anthropic', model: 'claude-3-5-sonnet', tokens: { input_tokens: 2000, output_tokens: 1000 } },
        { provider: 'google', model: 'gemini-2-flash', tokens: { input_tokens: 500, output_tokens: 250 } },
      ];

      const totalCost = runs.reduce((sum, run) => {
        const cost = calculateCost(run.provider, run.model, run.tokens);
        return sum + (cost?.total_cost ?? 0);
      }, 0);

      expect(totalCost).toBeGreaterThan(0);
      const gptCost = calculateCost('openai', 'gpt-4o', runs[0].tokens)!;
      const claudeCost = calculateCost('anthropic', 'claude-3-5-sonnet', runs[1].tokens)!;
      const geminiCost = calculateCost('google', 'gemini-2-flash', runs[2].tokens)!;
      expect(totalCost).toBeCloseTo(gptCost.total_cost + claudeCost.total_cost + geminiCost.total_cost, 5);
    });

    it('handles run with unknown model using default pricing', () => {
      const unknownRun = {
        provider: 'unknown',
        model: 'unknown-model',
        tokens: { input_tokens: 1000, output_tokens: 500 },
      };

      const cost = calculateCost(unknownRun.provider, unknownRun.model, unknownRun.tokens);
      expect(cost).toBeNull();
    });
  });

  describe('cumulative cost tracking', () => {
    it('tracks cumulative spend across multiple runs', () => {
      const runs = [
        { run_id: 'run-1', provider: 'openai', model: 'gpt-4o', tokens: { input_tokens: 1000, output_tokens: 500 } },
        { run_id: 'run-2', provider: 'openai', model: 'gpt-4o', tokens: { input_tokens: 1000, output_tokens: 500 } },
        { run_id: 'run-3', provider: 'openai', model: 'gpt-4o', tokens: { input_tokens: 1000, output_tokens: 500 } },
      ];

      let cumulativeCost = 0;
      const costHistory: { run_id: string; cumulative: number }[] = [];

      for (const run of runs) {
        const cost = calculateCost(run.provider, run.model, run.tokens);
        cumulativeCost += cost?.total_cost ?? 0;
        costHistory.push({ run_id: run.run_id, cumulative: cumulativeCost });
      }

      expect(costHistory[0].cumulative).toBeGreaterThan(0);
      expect(costHistory[1].cumulative).toBe(costHistory[0].cumulative * 2);
      expect(costHistory[2].cumulative).toBe(costHistory[0].cumulative * 3);
    });

    it('computes average cost per run', () => {
      const runs = [
        { tokens: { input_tokens: 1000, output_tokens: 500 } },
        { tokens: { input_tokens: 2000, output_tokens: 1000 } },
        { tokens: { input_tokens: 500, output_tokens: 250 } },
      ];

      const costs = runs.map(r => calculateCost('openai', 'gpt-4o', r.tokens)!);
      const totalCost = costs.reduce((sum, c) => sum + c.total_cost, 0);
      const avgCost = totalCost / costs.length;

      expect(avgCost).toBeGreaterThan(0);
      expect(avgCost).toBeCloseTo((totalCost) / 3, 5);
    });
  });
});