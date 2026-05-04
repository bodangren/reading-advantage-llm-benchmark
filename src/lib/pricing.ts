import fs from 'fs';
import path from 'path';

export interface PricingEntry {
  provider: string;
  model: string;
  input_price_per_1k: number;
  output_price_per_1k: number;
}

interface PricingData {
  entries: PricingEntry[];
}

let cachedPricingTable: PricingEntry[] | null = null;

function getPricingFilePath(): string {
  return path.join(process.cwd(), 'data', 'pricing.json');
}

function loadPricingFromFile(): PricingEntry[] {
  const filePath = getPricingFilePath();
  const content = fs.readFileSync(filePath, 'utf-8');
  const data: PricingData = JSON.parse(content);

  if (!data.entries || !Array.isArray(data.entries)) {
    throw new Error('Invalid pricing file: missing or invalid entries array');
  }

  for (const entry of data.entries) {
    if (
      typeof entry.provider !== 'string' ||
      typeof entry.model !== 'string' ||
      typeof entry.input_price_per_1k !== 'number' ||
      typeof entry.output_price_per_1k !== 'number'
    ) {
      throw new Error('Invalid pricing entry: missing required fields');
    }
  }

  return data.entries;
}

export function getPricingTable(): PricingEntry[] {
  if (cachedPricingTable === null) {
    cachedPricingTable = loadPricingFromFile();
  }
  return cachedPricingTable;
}

export function findPricing(provider: string, model: string): PricingEntry | null {
  return getPricingTable().find(p => p.provider === provider && p.model === model) ?? null;
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

export const PRICING_TABLE: PricingEntry[] = getPricingTable();