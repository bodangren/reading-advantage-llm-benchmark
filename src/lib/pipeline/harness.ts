import { ModelConfig, HarnessConfig } from './schemas';
import { Run } from '../schemas';
import { runOpenCodeEvaluation, OpenCodeConfig, DEFAULT_CONFIG } from '../opencode-api';

export async function runEvaluation(
  modelConfig: ModelConfig,
  harnessConfig: HarnessConfig,
  datasetVersion: string
): Promise<Run> {
  const runId = `run-${Date.now()}-${modelConfig.model_id}`;

  if (harnessConfig.harness_id !== 'opencode') {
    return createMockRun(runId, modelConfig, harnessConfig, datasetVersion);
  }

  try {
    const openCodeConfig: Partial<OpenCodeConfig> = {
      apiUrl: process.env.OPENCODE_API_URL || DEFAULT_CONFIG.apiUrl,
      apiKey: process.env.OPENCODE_API_KEY,
      timeout: harnessConfig.max_tokens > 0 ? harnessConfig.max_tokens * 100 : DEFAULT_CONFIG.timeout,
      maxRetries: DEFAULT_CONFIG.maxRetries,
      retryDelay: DEFAULT_CONFIG.retryDelay,
    };

    const defaultPrompt = `Evaluate model ${modelConfig.model_id} with temperature ${harnessConfig.temperature}`;

    const result = await runOpenCodeEvaluation(
      defaultPrompt,
      modelConfig.model_id,
      openCodeConfig
    );

    if (result.error) {
      console.warn(`OpenCode evaluation warning: ${result.error}`);
      return createMockRun(runId, modelConfig, harnessConfig, datasetVersion, 0);
    }

    const score = result.output
      ? Math.min(1, result.output.length / 10000)
      : 0;

    return {
      id: result.id || runId,
      model: modelConfig.model_id,
      provider: modelConfig.provider,
      harness: harnessConfig.harness_id,
      benchmark_version: '1.0.0',
      dataset_version: datasetVersion,
      score,
      date: new Date().toISOString(),
      subscores: result.duration_ms ? { duration_ms: result.duration_ms } : undefined,
    };
  } catch (error) {
    console.warn(`OpenCode API unavailable, using mock: ${error}`);
    return createMockRun(runId, modelConfig, harnessConfig, datasetVersion, 0);
  }
}

function createMockRun(
  runId: string,
  modelConfig: ModelConfig,
  harnessConfig: HarnessConfig,
  datasetVersion: string,
  score: number = 0
): Run {
  return {
    id: runId,
    model: modelConfig.model_id,
    provider: modelConfig.provider,
    harness: harnessConfig.harness_id,
    benchmark_version: '1.0.0',
    dataset_version: datasetVersion,
    score,
    date: new Date().toISOString(),
  };
}