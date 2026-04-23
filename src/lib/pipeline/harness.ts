import { ModelConfig, HarnessConfig } from './schemas';
import { Run } from '../schemas';

export async function runEvaluation(
  modelConfig: ModelConfig,
  harnessConfig: HarnessConfig,
  datasetVersion: string
): Promise<Run> {
  const runId = `run-${Date.now()}-${modelConfig.model_id}`;
  return {
    id: runId,
    model: modelConfig.model_id,
    provider: modelConfig.provider,
    harness: harnessConfig.harness_id,
    benchmark_version: '1.0.0',
    dataset_version: datasetVersion,
    score: 0,
    date: new Date().toISOString(),
  };
}