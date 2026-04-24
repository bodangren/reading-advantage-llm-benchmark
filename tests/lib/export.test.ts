import { describe, it, expect } from 'vitest';
import { exportToMarkdown, exportToPDF } from '@/lib/export';

describe('Export Module', () => {
  describe('exportToMarkdown', () => {
    it('generates markdown summary table', () => {
      const report = {
        id: 'test-1',
        generatedAt: '2026-04-24T12:00:00.000Z',
        taskSet: ['task-1'],
        models: [],
        aggregateScores: [
          { model: 'gpt-4o', normalizedScore: 85, rank: 1 },
          { model: 'claude-3', normalizedScore: 80, rank: 2 },
        ],
      };
      const md = exportToMarkdown(report);
      expect(md).toContain('Model Comparison Report');
      expect(md).toContain('| Rank |');
      expect(md).toContain('gpt-4o');
    });

    it('generates per-task comparison table', () => {
      const report = {
        id: 'test-2',
        generatedAt: '2026-04-24T12:00:00.000Z',
        taskSet: ['task-1'],
        models: [
          {
            model: 'gpt-4o',
            normalizedScore: 85,
            rawScore: 85,
            taskResults: [
              { taskId: 'task-1', taskTitle: 'Test Task', domain: 'coding', normalizedScore: 85, rawScore: 85, winner: true, delta: 0 },
            ],
          },
        ],
        aggregateScores: [{ model: 'gpt-4o', normalizedScore: 85, rank: 1 }],
      };
      const md = exportToMarkdown(report);
      expect(md).toContain('Per-Task Comparison');
      expect(md).toContain('Test Task');
    });
  });

  describe('exportToPDF', () => {
    it('generates JSON representation for PDF', () => {
      const report = {
        id: 'test-1',
        generatedAt: '2026-04-24T12:00:00.000Z',
        taskSet: ['task-1'],
        models: [],
        aggregateScores: [],
      };
      const pdf = exportToPDF(report);
      const parsed = JSON.parse(pdf);
      expect(parsed.title).toBe('Model Comparison Report');
      expect(parsed.summary).toEqual([]);
    });
  });
});