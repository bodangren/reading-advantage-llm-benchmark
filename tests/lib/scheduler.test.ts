import { describe, it, expect, vi } from 'vitest';
import {
  calculateNextRun,
  getCronFields,
  isScheduleDue,
  formatCronExpression,
  triggerScheduledRun,
  processDueSchedules,
} from '../../src/lib/scheduler';
import { ScheduleConfig, Run } from '../../src/lib/schemas';

vi.mock('fs/promises');

const mockRun: Run = {
  id: 'run-123',
  model: 'gpt-4',
  harness: 'opencode',
  benchmark_version: '1.0.0',
  dataset_version: '2026-05-06',
  score: 0.85,
  date: '2026-05-06T10:00:00Z',
};

describe('Scheduler', () => {
  describe('calculateNextRun', () => {
    it('should return tomorrow for daily schedule when time has passed today', () => {
      const config: ScheduleConfig = {
        id: 'test-daily',
        name: 'Test Daily',
        frequency: 'daily',
        hour: 3,
        minute: 0,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      };

      vi.setSystemTime(new Date('2026-05-06T10:00:00Z'));

      const nextRun = calculateNextRun(config);

      expect(nextRun).toBeInstanceOf(Date);
      expect(nextRun!.getDate()).toBe(7);
      expect(nextRun!.getHours()).toBe(3);
      expect(nextRun!.getMinutes()).toBe(0);
    });

    it('should return same day for daily schedule when time has not passed', () => {
      const config: ScheduleConfig = {
        id: 'test-daily-morning',
        name: 'Test Daily Morning',
        frequency: 'daily',
        hour: 23,
        minute: 59,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      };

      vi.setSystemTime(new Date('2026-05-06T10:00:00Z'));

      const nextRun = calculateNextRun(config);

      expect(nextRun).toBeInstanceOf(Date);
      expect(nextRun!.getHours()).toBe(23);
      expect(nextRun!.getMinutes()).toBe(59);
      expect(nextRun!.getTime()).toBeGreaterThan(new Date('2026-05-06T10:00:00Z').getTime());
    });

    it('should calculate next weekly run for same day when time has not passed', () => {
      const config: ScheduleConfig = {
        id: 'test-weekly',
        name: 'Test Weekly',
        frequency: 'weekly',
        hour: 12,
        minute: 0,
        dayOfWeek: 2,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      };

      vi.setSystemTime(new Date('2026-05-06T10:00:00Z'));

      const nextRun = calculateNextRun(config);

      expect(nextRun).toBeInstanceOf(Date);
      expect(nextRun!.getDate()).toBe(12);
      expect(nextRun!.getHours()).toBe(12);
      expect(nextRun!.getMinutes()).toBe(0);
    });

    it('should calculate next weekly run for next week when time has passed', () => {
      const config: ScheduleConfig = {
        id: 'test-weekly-passed',
        name: 'Test Weekly Passed',
        frequency: 'weekly',
        hour: 9,
        minute: 0,
        dayOfWeek: 2,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      };

      vi.setSystemTime(new Date('2026-05-06T10:00:00Z'));

      const nextRun = calculateNextRun(config);

      expect(nextRun).toBeInstanceOf(Date);
      expect(nextRun!.getDate()).toBe(12);
      expect(nextRun!.getHours()).toBe(9);
      expect(nextRun!.getMinutes()).toBe(0);
    });

    it('should default dayOfWeek to 0 (Sunday) for weekly schedule', () => {
      const config: ScheduleConfig = {
        id: 'test-weekly-sunday',
        name: 'Test Weekly Sunday',
        frequency: 'weekly',
        hour: 18,
        minute: 0,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      };

      vi.setSystemTime(new Date('2026-05-06T10:00:00Z'));

      const nextRun = calculateNextRun(config);

      expect(nextRun).toBeInstanceOf(Date);
      expect(nextRun!.getDay()).toBe(0);
    });
  });

  describe('getCronFields', () => {
    it('should extract cron fields from daily schedule', () => {
      const config: ScheduleConfig = {
        id: 'test-cron',
        name: 'Test Cron',
        frequency: 'daily',
        hour: 14,
        minute: 30,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      };

      const fields = getCronFields(config);

      expect(fields.hour).toBe(14);
      expect(fields.minute).toBe(30);
      expect(fields.dayOfWeek).toBeUndefined();
    });

    it('should extract cron fields from weekly schedule with dayOfWeek', () => {
      const config: ScheduleConfig = {
        id: 'test-cron-weekly',
        name: 'Test Cron Weekly',
        frequency: 'weekly',
        hour: 10,
        minute: 0,
        dayOfWeek: 5,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      };

      const fields = getCronFields(config);

      expect(fields.hour).toBe(10);
      expect(fields.minute).toBe(0);
      expect(fields.dayOfWeek).toBe(5);
    });
  });

  describe('isScheduleDue', () => {
    it('should return true for active schedule that is due', () => {
      const config: ScheduleConfig = {
        id: 'test-due',
        name: 'Test Due',
        frequency: 'daily',
        hour: 10,
        minute: 0,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
        nextRunAt: '2026-05-06T10:00:00Z',
      };

      vi.setSystemTime(new Date('2026-05-06T10:05:00Z'));

      expect(isScheduleDue(config)).toBe(true);
    });

    it('should return false for paused schedule', () => {
      const config: ScheduleConfig = {
        id: 'test-paused',
        name: 'Test Paused',
        frequency: 'daily',
        hour: 10,
        minute: 0,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'paused',
      };

      vi.setSystemTime(new Date('2026-05-06T10:05:00Z'));

      expect(isScheduleDue(config)).toBe(false);
    });

    it('should return false for disabled schedule', () => {
      const config: ScheduleConfig = {
        id: 'test-disabled',
        name: 'Test Disabled',
        frequency: 'daily',
        hour: 10,
        minute: 0,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: false,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      };

      vi.setSystemTime(new Date('2026-05-06T10:05:00Z'));

      expect(isScheduleDue(config)).toBe(false);
    });
  });

  describe('formatCronExpression', () => {
    it('should format daily schedule as readable string', () => {
      const config: ScheduleConfig = {
        id: 'test-format',
        name: 'Test Format',
        frequency: 'daily',
        hour: 9,
        minute: 15,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      };

      expect(formatCronExpression(config)).toBe('Daily at 09:15');
    });

    it('should format weekly schedule with day name', () => {
      const config: ScheduleConfig = {
        id: 'test-format-weekly',
        name: 'Test Format Weekly',
        frequency: 'weekly',
        hour: 14,
        minute: 30,
        dayOfWeek: 3,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      };

      expect(formatCronExpression(config)).toBe('Weekly on Wednesday at 14:30');
    });

    it('should default to Sunday for weekly without dayOfWeek', () => {
      const config: ScheduleConfig = {
        id: 'test-format-weekly-sunday',
        name: 'Test Format Weekly Sunday',
        frequency: 'weekly',
        hour: 18,
        minute: 0,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      };

      expect(formatCronExpression(config)).toBe('Weekly on Sunday at 18:00');
    });
  });

  describe('triggerScheduledRun', () => {
    it('should trigger a scheduled run and log success', async () => {
      const config: ScheduleConfig = {
        id: 'trigger-test',
        name: 'Trigger Test',
        frequency: 'daily',
        hour: 10,
        minute: 0,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      };

      const mockRunEval = vi.fn().mockResolvedValue(mockRun);

      const result = await triggerScheduledRun(config, mockRunEval);

      expect(result.success).toBe(true);
      expect(result.runId).toBe('run-123');
      expect(result.scheduleId).toBe('trigger-test');
      expect(mockRunEval).toHaveBeenCalledWith('gpt-4', '2026-05-06');
    });

    it('should handle run evaluation failure', async () => {
      const config: ScheduleConfig = {
        id: 'trigger-fail-test',
        name: 'Trigger Fail Test',
        frequency: 'daily',
        hour: 10,
        minute: 0,
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: true,
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      };

      const mockRunEval = vi.fn().mockRejectedValue(new Error('API unavailable'));

      const result = await triggerScheduledRun(config, mockRunEval);

      expect(result.success).toBe(false);
      expect(result.error).toBe('API unavailable');
      expect(result.scheduleId).toBe('trigger-fail-test');
    });
  });

  describe('processDueSchedules', () => {
    it('should process multiple due schedules', async () => {
      vi.setSystemTime(new Date('2026-05-06T10:05:00Z'));

      const mockRunEval = vi.fn().mockResolvedValue(mockRun);

      const result = await processDueSchedules(mockRunEval);

      expect(Array.isArray(result)).toBe(true);
    });
  });
});