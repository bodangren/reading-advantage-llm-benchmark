export interface PricingEntry {
  provider: string;
  model: string;
  input_price_per_1k: number;
  output_price_per_1k: number;
}

export const PRICING_TABLE: PricingEntry[] = [
  { provider: 'openai', model: 'gpt-4.5', input_price_per_1k: 0.005, output_price_per_1k: 0.015 },
  { provider: 'openai', model: 'gpt-4o', input_price_per_1k: 0.0025, output_price_per_1k: 0.01 },
  { provider: 'openai', model: 'gpt-4o-mini', input_price_per_1k: 0.00015, output_price_per_1k: 0.0006 },
  { provider: 'anthropic', model: 'claude-3-5-sonnet', input_price_per_1k: 0.003, output_price_per_1k: 0.015 },
  { provider: 'anthropic', model: 'claude-3-5-haiku', input_price_per_1k: 0.0008, output_price_per_1k: 0.004 },
  { provider: 'google', model: 'gemini-2-flash', input_price_per_1k: 0.0001, output_price_per_1k: 0.0005 },
  { provider: 'google', model: 'gemini-2-pro', input_price_per_1k: 0.002, output_price_per_1k: 0.01 },
];

export interface TokenCounts {
  input_tokens: number;
  output_tokens: number;
}

export interface CostBreakdown {
  input_cost: number;
  output_cost: number;
  total_cost: number;
  model: string;
  provider: string;
}

export function findPricing(provider: string, model: string): PricingEntry | null {
  return PRICING_TABLE.find(p => p.provider === provider && p.model === model) ?? null;
}

export function calculateCost(provider: string, model: string, tokens: TokenCounts): CostBreakdown | null {
  const pricing = findPricing(provider, model);
  if (!pricing) return null;

  const input_cost = (tokens.input_tokens / 1000) * pricing.input_price_per_1k;
  const output_cost = (tokens.output_tokens / 1000) * pricing.output_price_per_1k;

  return {
    input_cost: Math.round(input_cost * 1000000) / 1000000,
    output_cost: Math.round(output_cost * 1000000) / 1000000,
    total_cost: Math.round((input_cost + output_cost) * 1000000) / 1000000,
    model,
    provider,
  };
}

export function calculateCostOrDefault(provider: string, model: string, tokens: TokenCounts, defaultCost = 0): CostBreakdown {
  return calculateCost(provider, model, tokens) ?? {
    input_cost: defaultCost,
    output_cost: defaultCost,
    total_cost: defaultCost,
    model,
    provider,
  };
}