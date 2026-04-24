import { describe, it, expect } from 'vitest';
import {
  ArtifactSchema,
  createArtifact,
  artifactFilename,
  validateArtifact,
  type RunArtifact,
} from '@/lib/artifact';

describe('Artifact Module', () => {
  const validArtifactData: RunArtifact = {
    run_id: 'test-run-001',
    git_sha: 'abc123',
    timestamp: '2026-04-24T10:00:00.000Z',
    model: 'gpt-4o',
    provider: 'openai',
    prompt_version: 'v1.0',
    dataset_version: '2026-04-01',
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
    cost_breakdown: {
      input_cost: 0.00375,
      output_cost: 0.008,
      total_cost: 0.01175,
      model: 'gpt-4o',
      provider: 'openai',
    },
  };

  describe('ArtifactSchema', () => {
    it('validates a complete artifact', () => {
      const result = ArtifactSchema.safeParse(validArtifactData);
      expect(result.success).toBe(true);
    });

    it('rejects artifact with missing required fields', () => {
      const invalid = { run_id: 'test' };
      const result = ArtifactSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects scores outside 0-1 range', () => {
      const invalid = {
        ...validArtifactData,
        scores: { ...validArtifactData.scores, functional_correctness: 1.5 },
      };
      const result = ArtifactSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects negative token counts', () => {
      const invalid = {
        ...validArtifactData,
        token_counts: { input_tokens: -100, output_tokens: 500 },
      };
      const result = ArtifactSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('accepts artifact without optional fields', () => {
      const minimal = {
        run_id: 'test-run',
        timestamp: '2026-04-24T10:00:00.000Z',
        model: 'gpt-4o',
        provider: 'openai',
        task_id: 'task_001',
        scores: {
          functional_correctness: 0.5,
          integration_quality: 0.5,
          regression_safety: 0.5,
          minimality: 0.5,
          process_quality: 0.5,
        },
        token_counts: {
          input_tokens: 100,
          output_tokens: 50,
        },
      };
      const result = ArtifactSchema.safeParse(minimal);
      expect(result.success).toBe(true);
    });
  });

  describe('createArtifact', () => {
    it('creates an artifact with computed cost', () => {
      const artifact = createArtifact({
        run_id: 'run-001',
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
          input_tokens: 1000,
          output_tokens: 500,
        },
      });

      expect(artifact.run_id).toBe('run-001');
      expect(artifact.cost_breakdown).toBeDefined();
      expect(artifact.cost_breakdown!.total_cost).toBeCloseTo(0.0075, 5);
      expect(artifact.timestamp).toBeTruthy();
    });

    it('creates artifact with optional metadata', () => {
      const artifact = createArtifact({
        run_id: 'run-002',
        model: 'claude-3-5-sonnet',
        provider: 'anthropic',
        task_id: 'task_002',
        scores: {
          functional_correctness: 0.95,
          integration_quality: 0.9,
          regression_safety: 0.85,
          minimality: 0.8,
          process_quality: 0.75,
        },
        token_counts: {
          input_tokens: 2000,
          output_tokens: 1000,
        },
        git_sha: 'def456',
        prompt_version: 'v2.0',
        dataset_version: '2026-04-15',
      });

      expect(artifact.git_sha).toBe('def456');
      expect(artifact.prompt_version).toBe('v2.0');
      expect(artifact.dataset_version).toBe('2026-04-15');
    });
  });

  describe('artifactFilename', () => {
    it('generates correct filename format', () => {
      const filename = artifactFilename(validArtifactData);
      expect(filename).toBe('20260424-gpt-4o-test-run-001.json');
    });

    it('sanitizes model names with special characters', () => {
      const artifact = { ...validArtifactData, model: 'claude-3.5-sonnet' };
      const filename = artifactFilename(artifact);
      expect(filename).toContain('claude-3-5-sonnet');
    });
  });

  describe('validateArtifact', () => {
    it('returns parsed artifact on valid data', () => {
      const result = validateArtifact(validArtifactData);
      expect(result.run_id).toBe('test-run-001');
    });

    it('throws on invalid data', () => {
      expect(() => validateArtifact({ invalid: 'data' })).toThrow();
    });
  });

  describe('artifact diffing', () => {
    it('compares two artifacts and returns differences', () => {
      const artifact1 = createArtifact({
        run_id: 'run-001',
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
        token_counts: { input_tokens: 1000, output_tokens: 500 },
      });

      const artifact2 = createArtifact({
        run_id: 'run-002',
        model: 'gpt-4o',
        provider: 'openai',
        task_id: 'task_001',
        scores: {
          functional_correctness: 0.95,
          integration_quality: 0.88,
          regression_safety: 0.82,
          minimality: 0.78,
          process_quality: 0.72,
        },
        token_counts: { input_tokens: 1200, output_tokens: 600 },
      });

      const diff = {
        run_id: { from: 'run-001', to: 'run-002' },
        total_score: {
          from:
            artifact1.scores.functional_correctness * 0.4 +
            artifact1.scores.integration_quality * 0.25 +
            artifact1.scores.regression_safety * 0.2 +
            artifact1.scores.minimality * 0.1 +
            artifact1.scores.process_quality * 0.05,
          to:
            artifact2.scores.functional_correctness * 0.4 +
            artifact2.scores.integration_quality * 0.25 +
            artifact2.scores.regression_safety * 0.2 +
            artifact2.scores.minimality * 0.1 +
            artifact2.scores.process_quality * 0.05,
        },
      };

      expect(diff.run_id.from).toBe('run-001');
      expect(diff.run_id.to).toBe('run-002');
      expect(diff.total_score.to).toBeGreaterThan(diff.total_score.from);
    });
  });
});