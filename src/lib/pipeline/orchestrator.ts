import { ModelConfig, HarnessConfig, ModelMatrix, ModelRunResult, PipelineResult } from './schemas';
import { Run } from '../schemas';

export type EvaluationFunction = (
  modelConfig: ModelConfig,
  harnessConfig: HarnessConfig,
  datasetVersion: string
) => Promise<Run>;

export async function executeModelRun(
  modelConfig: ModelConfig,
  harnessConfig: HarnessConfig,
  datasetVersion: string,
  runEval: EvaluationFunction
): Promise<ModelRunResult> {
  if (!modelConfig.enabled) {
    return {
      model_id: modelConfig.model_id,
      provider: modelConfig.provider,
      status: 'skipped',
    };
  }

  try {
    const run = await runEval(modelConfig, harnessConfig, datasetVersion);
    return {
      model_id: modelConfig.model_id,
      provider: modelConfig.provider,
      status: 'success',
      run,
    };
  } catch (error) {
    return {
      model_id: modelConfig.model_id,
      provider: modelConfig.provider,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function executePipeline(
  matrix: ModelMatrix,
  runEval: EvaluationFunction = async (m, h, d) => {
    const { runEvaluation } = await import('./harness');
    return runEvaluation(m, h, d);
  }
): Promise<PipelineResult> {
  const startedAt = new Date().toISOString();

  if (matrix.models.length === 0) {
    return {
      pipeline_version: '1.0.0',
      dataset_version: matrix.dataset_version,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      status: 'failed',
      model_results: [],
      error: 'No models to evaluate',
    };
  }

  const results = await Promise.all(
    matrix.models.map(model =>
      executeModelRun(model, matrix.harness, matrix.dataset_version, runEval)
    )
  );

  const completedAt = new Date().toISOString();
  const successCount = results.filter(r => r.status === 'success').length;
  const failedCount = results.filter(r => r.status === 'failed').length;

  let status: 'success' | 'partial_failure' | 'failed';
  if (failedCount === 0) {
    status = 'success';
  } else if (successCount > 0) {
    status = 'partial_failure';
  } else {
    status = 'failed';
  }

  return {
    pipeline_version: '1.0.0',
    dataset_version: matrix.dataset_version,
    started_at: startedAt,
    completed_at: completedAt,
    status,
    model_results: results,
  };
}