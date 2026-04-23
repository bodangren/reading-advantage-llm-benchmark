import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executePipeline, executeModelRun } from '../../../src/lib/pipeline/orchestrator';
import { ModelMatrix, ModelConfig, HarnessConfig, Run } from '../../../src/lib/pipeline';

describe('Pipeline Orchestrator', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('executeModelRun', () => {
    it('should return successful result when evaluation succeeds', async () => {
      const mockRun: Run = {
        id: 'run-1',
        model: 'gemini-2.5-pro',
        harness: 'opencode',
        benchmark_version: '1.0.0',
        dataset_version: '2026-04-07',
        score: 0.92,
      };

      const runEval = vi.fn().mockResolvedValue(mockRun);

      const modelConfig: ModelConfig = { model_id: 'gemini-2.5-pro', provider: 'google', enabled: true };
      const harnessConfig: HarnessConfig = { harness_id: 'opencode', temperature: 0.0, max_tokens: 2048 };
      const datasetVersion = '2026-04-07';

      const result = await executeModelRun(modelConfig, harnessConfig, datasetVersion, runEval);

      expect(result.status).toBe('success');
      expect(result.model_id).toBe('gemini-2.5-pro');
      expect(result.provider).toBe('google');
      expect(result.run).toEqual(mockRun);
    });

    it('should return failed result when evaluation throws', async () => {
      const runEval = vi.fn().mockRejectedValue(new Error('API rate limit exceeded'));

      const modelConfig: ModelConfig = { model_id: 'gpt-5', provider: 'openai', enabled: true };
      const harnessConfig: HarnessConfig = { harness_id: 'opencode', temperature: 0.0, max_tokens: 2048 };
      const datasetVersion = '2026-04-07';

      const result = await executeModelRun(modelConfig, harnessConfig, datasetVersion, runEval);

      expect(result.status).toBe('failed');
      expect(result.model_id).toBe('gpt-5');
      expect(result.error).toBe('API rate limit exceeded');
      expect(result.run).toBeUndefined();
    });

    it('should skip disabled models', async () => {
      const runEval = vi.fn();

      const modelConfig: ModelConfig = { model_id: 'disabled-model', enabled: false };
      const harnessConfig: HarnessConfig = { harness_id: 'opencode', temperature: 0.0, max_tokens: 2048 };
      const datasetVersion = '2026-04-07';

      const result = await executeModelRun(modelConfig, harnessConfig, datasetVersion, runEval);

      expect(result.status).toBe('skipped');
      expect(result.model_id).toBe('disabled-model');
      expect(runEval).not.toHaveBeenCalled();
    });
  });

  describe('executePipeline', () => {
    it('should execute pipeline and aggregate results', async () => {
      const mockRun1: Run = {
        id: 'run-1',
        model: 'gemini-2.5-pro',
        harness: 'opencode',
        benchmark_version: '1.0.0',
        dataset_version: '2026-04-07',
        score: 0.92,
      };
      const mockRun2: Run = {
        id: 'run-2',
        model: 'gpt-5',
        harness: 'opencode',
        benchmark_version: '1.0.0',
        dataset_version: '2026-04-07',
        score: 0.88,
      };

      const runEval = vi.fn()
        .mockResolvedValueOnce(mockRun1)
        .mockResolvedValueOnce(mockRun2);

      const matrix: ModelMatrix = {
        dataset_version: '2026-04-07',
        models: [
          { model_id: 'gemini-2.5-pro', provider: 'google', enabled: true },
          { model_id: 'gpt-5', provider: 'openai', enabled: true },
        ],
        harness: { harness_id: 'opencode', temperature: 0.0, max_tokens: 2048 },
      };

      const result = await executePipeline(matrix, runEval);

      expect(result.status).toBe('success');
      expect(result.model_results).toHaveLength(2);
      expect(result.model_results.every(r => r.status === 'success')).toBe(true);
    });

    it('should return partial_failure when some models fail', async () => {
      const mockRun: Run = {
        id: 'run-1',
        model: 'gemini-2.5-pro',
        harness: 'opencode',
        benchmark_version: '1.0.0',
        dataset_version: '2026-04-07',
        score: 0.92,
      };

      const runEval = vi.fn()
        .mockResolvedValueOnce(mockRun)
        .mockRejectedValueOnce(new Error('API error'));

      const matrix: ModelMatrix = {
        dataset_version: '2026-04-07',
        models: [
          { model_id: 'gemini-2.5-pro', provider: 'google', enabled: true },
          { model_id: 'gpt-5', provider: 'openai', enabled: true },
        ],
        harness: { harness_id: 'opencode', temperature: 0.0, max_tokens: 2048 },
      };

      const result = await executePipeline(matrix, runEval);

      expect(result.status).toBe('partial_failure');
      expect(result.model_results).toHaveLength(2);
      expect(result.model_results.filter(r => r.status === 'success')).toHaveLength(1);
      expect(result.model_results.filter(r => r.status === 'failed')).toHaveLength(1);
    });

    it('should return failed when all models fail', async () => {
      const runEval = vi.fn()
        .mockRejectedValueOnce(new Error('API error 1'))
        .mockRejectedValueOnce(new Error('API error 2'));

      const matrix: ModelMatrix = {
        dataset_version: '2026-04-07',
        models: [
          { model_id: 'gemini-2.5-pro', provider: 'google', enabled: true },
          { model_id: 'gpt-5', provider: 'openai', enabled: true },
        ],
        harness: { harness_id: 'opencode', temperature: 0.0, max_tokens: 2048 },
      };

      const result = await executePipeline(matrix, runEval);

      expect(result.status).toBe('failed');
    });

    it('should handle empty models array', async () => {
      const runEval = vi.fn();

      const matrix: ModelMatrix = {
        dataset_version: '2026-04-07',
        models: [],
        harness: { harness_id: 'opencode', temperature: 0.0, max_tokens: 2048 },
      };

      const result = await executePipeline(matrix, runEval);

      expect(result.status).toBe('failed');
      expect(result.error).toBe('No models to evaluate');
    });

    it('should skip disabled models in pipeline execution', async () => {
      const mockRun: Run = {
        id: 'run-1',
        model: 'gemini-2.5-pro',
        harness: 'opencode',
        benchmark_version: '1.0.0',
        dataset_version: '2026-04-07',
        score: 0.92,
      };

      const runEval = vi.fn().mockResolvedValue(mockRun);

      const matrix: ModelMatrix = {
        dataset_version: '2026-04-07',
        models: [
          { model_id: 'gemini-2.5-pro', provider: 'google', enabled: true },
          { model_id: 'gpt-5', provider: 'openai', enabled: false },
        ],
        harness: { harness_id: 'opencode', temperature: 0.0, max_tokens: 2048 },
      };

      const result = await executePipeline(matrix, runEval);

      expect(result.status).toBe('success');
      expect(result.model_results).toHaveLength(2);
      expect(result.model_results.filter(r => r.status === 'skipped')).toHaveLength(1);
      expect(runEval).toHaveBeenCalledTimes(1);
    });
  });

  describe('Partial Failure Behavior', () => {
    it('should isolate failures - one model failure should not stop pipeline', async () => {
      const mockRun: Run = {
        id: 'run-1',
        model: 'gemini-2.5-pro',
        harness: 'opencode',
        benchmark_version: '1.0.0',
        dataset_version: '2026-04-07',
        score: 0.92,
      };

      const runEval = vi.fn()
        .mockResolvedValueOnce(mockRun)
        .mockRejectedValueOnce(new Error('Temporary error'))
        .mockResolvedValueOnce(mockRun);

      const matrix: ModelMatrix = {
        dataset_version: '2026-04-07',
        models: [
          { model_id: 'model-1', enabled: true },
          { model_id: 'model-2', enabled: true },
          { model_id: 'model-3', enabled: true },
        ],
        harness: { harness_id: 'opencode', temperature: 0.0, max_tokens: 2048 },
      };

      const result = await executePipeline(matrix, runEval);

      expect(result.status).toBe('partial_failure');
      expect(result.model_results).toHaveLength(3);
      expect(result.model_results.filter(r => r.status === 'success')).toHaveLength(2);
      expect(result.model_results.filter(r => r.status === 'failed')).toHaveLength(1);
    });

    it('should capture error messages for failed runs', async () => {
      const runEval = vi.fn().mockRejectedValue(new Error('Connection timeout'));

      const matrix: ModelMatrix = {
        dataset_version: '2026-04-07',
        models: [{ model_id: 'failing-model', enabled: true }],
        harness: { harness_id: 'opencode', temperature: 0.0, max_tokens: 2048 },
      };

      const result = await executePipeline(matrix, runEval);

      const failedResult = result.model_results[0];
      expect(failedResult.status).toBe('failed');
      expect(failedResult.error).toBe('Connection timeout');
    });
  });
});