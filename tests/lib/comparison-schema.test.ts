import { describe, it, expect } from 'vitest';
import { ComparisonReportSchema, ModelResultSchema, NormalizedScoreSchema } from '../../src/lib/schemas';

describe('ComparisonReportSchema', () => {
  const validTaskResult = {
    taskId: 'task-1',
    taskTitle: 'Test Task',
    domain: 'Web App',
    normalizedScore: 85,
    rawScore: 0.85,
    winner: true,
    delta: 15,
  };

  const validModelResult = {
    model: 'gpt-5.4',
    provider: 'OpenAI',
    normalizedScore: 82,
    rawScore: 0.82,
    subscores: { functional: 35, integration: 20 },
    taskResults: [validTaskResult],
  };

  const validStrengthsWeaknesses = {
    model: 'gpt-5.4',
    strengths: [{ category: 'Web App', avgScore: 88, taskCount: 3 }],
    weaknesses: [{ category: 'CLI', avgScore: 65, taskCount: 1 }],
  };

  const validReport = {
    id: 'report-001',
    generatedAt: '2026-04-24T12:00:00Z',
    datasetVersion: '2026-04-07',
    taskSet: ['task-1', 'task-2'],
    models: [validModelResult],
    aggregateScores: [{ model: 'gpt-5.4', normalizedScore: 82, rank: 1 }],
    strengthsWeaknesses: [validStrengthsWeaknesses],
  };

  describe('NormalizedScoreSchema', () => {
    it('should validate a normalized score with 0-1 scale', () => {
      const score = { raw: 0.85, normalized: 85, scale: '0-1' as const };
      const result = NormalizedScoreSchema.safeParse(score);
      expect(result.success).toBe(true);
    });

    it('should validate a normalized score with 0-100 scale', () => {
      const score = { raw: 85, normalized: 85, scale: '0-100' as const };
      const result = NormalizedScoreSchema.safeParse(score);
      expect(result.success).toBe(true);
    });

    it('should fail for normalized score out of range', () => {
      const score = { raw: 0.85, normalized: 150, scale: '0-1' as const };
      const result = NormalizedScoreSchema.safeParse(score);
      expect(result.success).toBe(false);
    });
  });

  describe('ModelResultSchema', () => {
    it('should validate a valid model result', () => {
      const result = ModelResultSchema.safeParse(validModelResult);
      expect(result.success).toBe(true);
    });

    it('should validate a model result without provider', () => {
      const modelResult = { ...validModelResult, provider: undefined };
      const result = ModelResultSchema.safeParse(modelResult);
      expect(result.success).toBe(true);
    });

    it('should validate a model result without subscores', () => {
      const modelResult = { ...validModelResult, subscores: undefined };
      const result = ModelResultSchema.safeParse(modelResult);
      expect(result.success).toBe(true);
    });

    it('should fail if model is missing', () => {
      const invalid = { normalizedScore: 82, rawScore: 0.82, taskResults: [] };
      const result = ModelResultSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail if normalizedScore is out of range', () => {
      const invalid = { ...validModelResult, normalizedScore: 150 };
      const result = ModelResultSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('ComparisonReportSchema', () => {
    it('should validate a valid comparison report', () => {
      const result = ComparisonReportSchema.safeParse(validReport);
      expect(result.success).toBe(true);
    });

    it('should validate a report without datasetVersion', () => {
      const report = { ...validReport, datasetVersion: undefined };
      const result = ComparisonReportSchema.safeParse(report);
      expect(result.success).toBe(true);
    });

    it('should validate a report with multiple models', () => {
      const report = {
        ...validReport,
        models: [
          validModelResult,
          { ...validModelResult, model: 'claude-3', normalizedScore: 78, rawScore: 0.78 },
        ],
        aggregateScores: [
          { model: 'gpt-5.4', normalizedScore: 82, rank: 1 },
          { model: 'claude-3', normalizedScore: 78, rank: 2 },
        ],
      };
      const result = ComparisonReportSchema.safeParse(report);
      expect(result.success).toBe(true);
    });

    it('should validate a report without strengthsWeaknesses', () => {
      const report = { ...validReport, strengthsWeaknesses: undefined };
      const result = ComparisonReportSchema.safeParse(report);
      expect(result.success).toBe(true);
    });

    it('should fail if id is missing', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _unused, ...invalid } = validReport;
      const result = ComparisonReportSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail if models array is empty', () => {
      const invalid = { ...validReport, models: [] };
      const result = ComparisonReportSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail if aggregateScores rank is invalid', () => {
      const invalid = {
        ...validReport,
        aggregateScores: [{ model: 'gpt-5.4', normalizedScore: 82, rank: 0 }],
      };
      const result = ComparisonReportSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should fail if taskSet is empty', () => {
      const invalid = { ...validReport, taskSet: [] };
      const result = ComparisonReportSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});