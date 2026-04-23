import { PipelineResult, ModelRunResult } from './schemas';
import { LeaderboardEntry } from '../schemas';

export interface AggregationOptions {
  includeMetadata?: boolean;
  formatVersion?: string;
}

export function aggregateLeaderboardEntries(
  pipelineResult: PipelineResult,
  _options: AggregationOptions = {}
): LeaderboardEntry[] {
  return pipelineResult.model_results
    .filter((result) => result.status === 'success' && result.run !== undefined)
    .map((result) => {
      const run = result.run!;
      return {
        model: run.model,
        provider: result.provider || run.provider,
        harness: run.harness,
        score: run.score,
        subscores: run.subscores,
        date: run.date,
        dataset_version: pipelineResult.dataset_version,
      };
    });
}

export function aggregateByModel(
  pipelineResult: PipelineResult
): Map<string, LeaderboardEntry[]> {
  const entries = aggregateLeaderboardEntries(pipelineResult);
  const byModel = new Map<string, LeaderboardEntry[]>();

  for (const entry of entries) {
    const existing = byModel.get(entry.model) || [];
    existing.push(entry);
    byModel.set(entry.model, existing);
  }

  return byModel;
}

export function getAverageScore(
  entries: LeaderboardEntry[]
): number | null {
  if (entries.length === 0) return null;

  const sum = entries.reduce((acc, entry) => acc + entry.score, 0);
  return sum / entries.length;
}

export function getBestScore(
  entries: LeaderboardEntry[]
): LeaderboardEntry | null {
  if (entries.length === 0) return null;

  return entries.reduce((best, current) =>
    current.score > best.score ? current : best
  );
}

export function formatLeaderboardSummary(
  pipelineResult: PipelineResult
): {
  total_models: number;
  successful_runs: number;
  failed_runs: number;
  skipped_runs: number;
  aggregated_entries: number;
  dataset_version: string;
} {
  return {
    total_models: pipelineResult.model_results.length,
    successful_runs: pipelineResult.model_results.filter(r => r.status === 'success').length,
    failed_runs: pipelineResult.model_results.filter(r => r.status === 'failed').length,
    skipped_runs: pipelineResult.model_results.filter(r => r.status === 'skipped').length,
    aggregated_entries: aggregateLeaderboardEntries(pipelineResult).length,
    dataset_version: pipelineResult.dataset_version,
  };
}