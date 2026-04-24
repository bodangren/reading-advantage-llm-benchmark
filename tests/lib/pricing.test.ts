import { describe, it, expect } from 'vitest';
import {
  findPricing,
  calculateCost,
  calculateCostOrDefault,
  PRICING_TABLE,
} from '@/lib/pricing';

describe('Pricing Module', () => {
  describe('findPricing', () => {
    it('finds pricing entry for known provider and model', () => {
      const entry = findPricing('openai', 'gpt-4o');
      expect(entry).not.toBeNull();
      expect(entry?.model).toBe('gpt-4o');
      expect(entry?.provider).toBe('openai');
      expect(entry?.input_price_per_1k).toBe(0.0025);
      expect(entry?.output_price_per_1k).toBe(0.01);
    });

    it('returns null for unknown model', () => {
      const entry = findPricing('openai', 'unknown-model');
      expect(entry).toBeNull();
    });

    it('returns null for unknown provider', () => {
      const entry = findPricing('unknown-provider', 'gpt-4o');
      expect(entry).toBeNull();
    });

    it('finds Anthropic pricing', () => {
      const entry = findPricing('anthropic', 'claude-3-5-sonnet');
      expect(entry).not.toBeNull();
      expect(entry?.input_price_per_1k).toBe(0.003);
    });

    it('finds Google pricing', () => {
      const entry = findPricing('google', 'gemini-2-flash');
      expect(entry).not.toBeNull();
      expect(entry?.input_price_per_1k).toBe(0.0001);
    });
  });

  describe('calculateCost', () => {
    it('calculates cost for OpenAI gpt-4o', () => {
      const tokens = { input_tokens: 1000, output_tokens: 500 };
      const cost = calculateCost('openai', 'gpt-4o', tokens);
      expect(cost).not.toBeNull();
      expect(cost!.input_cost).toBe(0.0025);
      expect(cost!.output_cost).toBe(0.005);
      expect(cost!.total_cost).toBe(0.0075);
    });

    it('calculates cost for Anthropic claude-3-5-sonnet', () => {
      const tokens = { input_tokens: 2000, output_tokens: 1000 };
      const cost = calculateCost('anthropic', 'claude-3-5-sonnet', tokens);
      expect(cost).not.toBeNull();
      expect(cost!.input_cost).toBe(0.006);
      expect(cost!.output_cost).toBe(0.015);
      expect(cost!.total_cost).toBe(0.021);
    });

    it('returns null for unknown model', () => {
      const tokens = { input_tokens: 1000, output_tokens: 500 };
      const cost = calculateCost('openai', 'unknown-model', tokens);
      expect(cost).toBeNull();
    });

    it('handles zero tokens', () => {
      const tokens = { input_tokens: 0, output_tokens: 0 };
      const cost = calculateCost('openai', 'gpt-4o', tokens);
      expect(cost).not.toBeNull();
      expect(cost!.total_cost).toBe(0);
    });

    it('rounds to 6 decimal places', () => {
      const tokens = { input_tokens: 333, output_tokens: 777 };
      const cost = calculateCost('openai', 'gpt-4o', tokens);
      const expected_input = (333 / 1000) * 0.0025;
      const expected_output = (777 / 1000) * 0.01;
      expect(cost!.input_cost).toBeCloseTo(expected_input, 6);
      expect(cost!.output_cost).toBeCloseTo(expected_output, 6);
    });
  });

  describe('calculateCostOrDefault', () => {
    it('returns calculated cost when pricing exists', () => {
      const tokens = { input_tokens: 1000, output_tokens: 500 };
      const cost = calculateCostOrDefault('openai', 'gpt-4o', tokens);
      expect(cost.total_cost).toBe(0.0075);
    });

    it('returns default cost when pricing not found', () => {
      const tokens = { input_tokens: 1000, output_tokens: 500 };
      const cost = calculateCostOrDefault('unknown', 'unknown-model', tokens, 0.01);
      expect(cost.total_cost).toBe(0.01);
      expect(cost.model).toBe('unknown-model');
      expect(cost.provider).toBe('unknown');
    });

    it('uses zero as default when not specified', () => {
      const tokens = { input_tokens: 1000, output_tokens: 500 };
      const cost = calculateCostOrDefault('unknown', 'unknown-model', tokens);
      expect(cost.total_cost).toBe(0);
    });
  });

  describe('PRICING_TABLE', () => {
    it('contains entries for all workflow matrix models', () => {
      const workflowModels = ['gpt-4.5', 'gpt-4o', 'claude-3-5-sonnet', 'gemini-2-flash'];
      for (const model of workflowModels) {
        const entry = PRICING_TABLE.find(p => p.model === model);
        expect(entry).toBeDefined();
      }
    });

    it('has valid price values for all entries', () => {
      for (const entry of PRICING_TABLE) {
        expect(entry.input_price_per_1k).toBeGreaterThan(0);
        expect(entry.output_price_per_1k).toBeGreaterThan(0);
      }
    });
  });
});