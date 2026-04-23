import { describe, it, expect } from 'vitest';
import { ModelMatrixSchema, ModelConfigSchema, HarnessConfigSchema, PipelineResultSchema } from '../../src/lib/pipeline';

describe('Pipeline Schemas', () => {
  describe('ModelConfigSchema', () => {
    it('should validate a valid model config', () => {
      const validConfig = {
        model_id: 'gemini-2.5-pro',
        provider: 'google',
        enabled: true,
      };
      const result = ModelConfigSchema.safeParse(validConfig);
      expect(result.success).toBe(true);
    });

    it('should validate a model config without optional provider', () => {
      const validConfig = {
        model_id: 'gemini-2.5-pro',
        enabled: true,
      };
      const result = ModelConfigSchema.safeParse(validConfig);
      expect(result.success).toBe(true);
    });

    it('should fail if model_id is missing', () => {
      const invalidConfig = {
        provider: 'google',
        enabled: true,
      };
      const result = ModelConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });

    it('should fail if enabled is not a boolean', () => {
      const invalidConfig = {
        model_id: 'gemini-2.5-pro',
        enabled: 'yes',
      };
      const result = ModelConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });
  });

  describe('HarnessConfigSchema', () => {
    it('should validate a valid harness config', () => {
      const validConfig = {
        harness_id: 'opencode',
        temperature: 0.7,
        max_tokens: 4096,
      };
      const result = HarnessConfigSchema.safeParse(validConfig);
      expect(result.success).toBe(true);
    });

    it('should validate harness config with defaults', () => {
      const validConfig = {
        harness_id: 'opencode',
      };
      const result = HarnessConfigSchema.safeParse(validConfig);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.temperature).toBe(0.0);
        expect(result.data.max_tokens).toBe(2048);
      }
    });

    it('should fail if harness_id is missing', () => {
      const invalidConfig = {
        temperature: 0.7,
      };
      const result = HarnessConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });

    it('should fail if temperature is out of range', () => {
      const invalidConfig = {
        harness_id: 'opencode',
        temperature: 2.5,
      };
      const result = HarnessConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });
  });

  describe('ModelMatrixSchema', () => {
    it('should validate a valid model matrix', () => {
      const validMatrix = {
        dataset_version: '2026-04-07',
        models: [
          { model_id: 'gemini-2.5-pro', provider: 'google', enabled: true },
          { model_id: 'gpt-5', provider: 'openai', enabled: true },
        ],
        harness: {
          harness_id: 'opencode',
          temperature: 0.7,
          max_tokens: 4096,
        },
      };
      const result = ModelMatrixSchema.safeParse(validMatrix);
      expect(result.success).toBe(true);
    });

    it('should validate a matrix with no enabled models', () => {
      const validMatrix = {
        dataset_version: '2026-04-07',
        models: [
          { model_id: 'gemini-2.5-pro', enabled: false },
        ],
        harness: { harness_id: 'opencode' },
      };
      const result = ModelMatrixSchema.safeParse(validMatrix);
      expect(result.success).toBe(true);
    });

    it('should fail if dataset_version is invalid format', () => {
      const invalidMatrix = {
        dataset_version: '1.0.0',
        models: [{ model_id: 'gemini', enabled: true }],
        harness: { harness_id: 'opencode' },
      };
      const result = ModelMatrixSchema.safeParse(invalidMatrix);
      expect(result.success).toBe(false);
    });

    it('should fail if models array is empty', () => {
      const invalidMatrix = {
        dataset_version: '2026-04-07',
        models: [],
        harness: { harness_id: 'opencode' },
      };
      const result = ModelMatrixSchema.safeParse(invalidMatrix);
      expect(result.success).toBe(false);
    });

    it('should fail if harness is missing', () => {
      const invalidMatrix = {
        dataset_version: '2026-04-07',
        models: [{ model_id: 'gemini', enabled: true }],
      };
      const result = ModelMatrixSchema.safeParse(invalidMatrix);
      expect(result.success).toBe(false);
    });
  });

  describe('PipelineResultSchema', () => {
    it('should validate a successful pipeline result', () => {
      const validResult = {
        pipeline_version: '1.0.0',
        dataset_version: '2026-04-07',
        started_at: '2026-04-07T12:00:00Z',
        completed_at: '2026-04-07T12:05:00Z',
        status: 'success',
        model_results: [
          {
            model_id: 'gemini-2.5-pro',
            provider: 'google',
            status: 'success',
            run: {
              id: 'run-1',
              model: 'gemini-2.5-pro',
              harness: 'opencode',
              benchmark_version: '1.0.0',
              dataset_version: '2026-04-07',
              score: 0.92,
            },
          },
        ],
      };
      const result = PipelineResultSchema.safeParse(validResult);
      expect(result.success).toBe(true);
    });

    it('should validate a partial failure result', () => {
      const validResult = {
        pipeline_version: '1.0.0',
        dataset_version: '2026-04-07',
        started_at: '2026-04-07T12:00:00Z',
        completed_at: '2026-04-07T12:05:00Z',
        status: 'partial_failure',
        model_results: [
          {
            model_id: 'gemini-2.5-pro',
            provider: 'google',
            status: 'success',
            run: {
              id: 'run-1',
              model: 'gemini-2.5-pro',
              harness: 'opencode',
              benchmark_version: '1.0.0',
              dataset_version: '2026-04-07',
              score: 0.92,
            },
          },
          {
            model_id: 'gpt-5',
            provider: 'openai',
            status: 'failed',
            error: 'API rate limit exceeded',
          },
        ],
      };
      const result = PipelineResultSchema.safeParse(validResult);
      expect(result.success).toBe(true);
    });

    it('should validate a failed pipeline result', () => {
      const validResult = {
        pipeline_version: '1.0.0',
        dataset_version: '2026-04-07',
        started_at: '2026-04-07T12:00:00Z',
        completed_at: '2026-04-07T12:05:00Z',
        status: 'failed',
        model_results: [],
        error: 'Dataset not found',
      };
      const result = PipelineResultSchema.safeParse(validResult);
      expect(result.success).toBe(true);
    });

    it('should fail if model_result has invalid status', () => {
      const invalidResult = {
        pipeline_version: '1.0.0',
        dataset_version: '2026-04-07',
        started_at: '2026-04-07T12:00:00Z',
        completed_at: '2026-04-07T12:05:00Z',
        status: 'success',
        model_results: [
          {
            model_id: 'gemini-2.5-pro',
            status: 'unknown_status',
          },
        ],
      };
      const result = PipelineResultSchema.safeParse(invalidResult);
      expect(result.success).toBe(false);
    });
  });
});

describe('Unsupported Combinations Guardrails', () => {
  it('should reject unknown harness types', () => {
    const invalidMatrix = {
      dataset_version: '2026-04-07',
      models: [{ model_id: 'gemini', enabled: true }],
      harness: { harness_id: 'unknown-harness' },
    };
    const result = ModelMatrixSchema.safeParse(invalidMatrix);
    expect(result.success).toBe(false);
  });

  it('should reject temperature above 2.0', () => {
    const invalidMatrix = {
      dataset_version: '2026-04-07',
      models: [{ model_id: 'gemini', enabled: true }],
      harness: { harness_id: 'opencode', temperature: 2.5 },
    };
    const result = ModelMatrixSchema.safeParse(invalidMatrix);
    expect(result.success).toBe(false);
  });

  it('should reject max_tokens below 100', () => {
    const invalidMatrix = {
      dataset_version: '2026-04-07',
      models: [{ model_id: 'gemini', enabled: true }],
      harness: { harness_id: 'opencode', max_tokens: 50 },
    };
    const result = ModelMatrixSchema.safeParse(invalidMatrix);
    expect(result.success).toBe(false);
  });
});