import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { RedisScheduleStore } from '../../../src/lib/adapters/redis-schedule-store';
import { ScheduleConfig, ScheduleLogEntry } from '../../../src/lib/schemas';
import { resetRedisClient, createRedisClient } from '../../../src/lib/redis-client';

vi.mock('../../../src/lib/redis-client');

const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  incr: vi.fn(),
  expire: vi.fn(),
  del: vi.fn(),
  ping: vi.fn(),
  ttl: vi.fn(),
  keys: vi.fn(),
  hset: vi.fn(),
  hget: vi.fn(),
  hgetall: vi.fn(),
  zadd: vi.fn(),
  zrange: vi.fn(),
};

describe('RedisScheduleStore', () => {
  const testSchedule: ScheduleConfig = {
    id: 'test-schedule-1',
    name: 'Test Schedule',
    frequency: 'daily',
    hour: 10,
    minute: 0,
    modelId: 'gpt-4',
    datasetVersion: '2026-05-06',
    enabled: true,
    createdAt: '2026-05-06T00:00:00Z',
    status: 'active',
  };

  const testLogEntry: ScheduleLogEntry = {
    scheduleId: 'test-schedule-1',
    runId: 'run-123',
    triggeredAt: '2026-05-06T10:00:00Z',
    status: 'completed',
    completedAt: '2026-05-06T10:05:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    resetRedisClient();

    mockRedis.get.mockResolvedValue(null);
    mockRedis.set.mockResolvedValue('OK');
    mockRedis.incr.mockResolvedValue(1);
    mockRedis.expire.mockResolvedValue(1);
    mockRedis.del.mockResolvedValue(1);
    mockRedis.ping.mockResolvedValue('PONG');
    mockRedis.ttl.mockResolvedValue(3600);
    mockRedis.keys.mockResolvedValue([]);
    mockRedis.hset.mockResolvedValue(1);
    mockRedis.hget.mockResolvedValue(null);
    mockRedis.hgetall.mockResolvedValue({});
    mockRedis.zadd.mockResolvedValue(1);
    mockRedis.zrange.mockResolvedValue([]);

    vi.mocked(createRedisClient).mockResolvedValue(mockRedis);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSchedules', () => {
    it('should return empty array when no schedules exist', async () => {
      mockRedis.keys.mockResolvedValue([]);

      const store = new RedisScheduleStore();
      await store.connect();
      const schedules = await store.getSchedules();

      expect(schedules).toEqual([]);
    });

    it('should return schedules from Redis', async () => {
      mockRedis.keys.mockResolvedValue(['scheduler:job:test-schedule-1']);
      mockRedis.hgetall.mockResolvedValue({
        id: 'test-schedule-1',
        name: 'Test Schedule',
        frequency: 'daily',
        hour: '10',
        minute: '0',
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: 'true',
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      });

      const store = new RedisScheduleStore();
      await store.connect();
      const schedules = await store.getSchedules();

      expect(schedules).toHaveLength(1);
      expect(schedules[0].id).toBe('test-schedule-1');
      expect(schedules[0].name).toBe('Test Schedule');
    });

    it('should fall back to filesystem when Redis unavailable', async () => {
      vi.mocked(createRedisClient).mockResolvedValue(null);

      const store = new RedisScheduleStore();
      await store.connect();
      const schedules = await store.getSchedules();

      expect(Array.isArray(schedules)).toBe(true);
    });
  });

  describe('saveSchedule', () => {
    it('should save schedule to Redis hash', async () => {
      const store = new RedisScheduleStore();
      await store.connect();
      await store.saveSchedule(testSchedule);

      expect(mockRedis.hset).toHaveBeenCalledWith(
        'scheduler:job:test-schedule-1',
        expect.any(Object)
      );
    });
  });

  describe('getScheduleById', () => {
    it('should return null when schedule not found', async () => {
      mockRedis.hgetall.mockResolvedValue({});

      const store = new RedisScheduleStore();
      await store.connect();
      const schedule = await store.getScheduleById('nonexistent');

      expect(schedule).toBeNull();
    });

    it('should return schedule when found', async () => {
      mockRedis.hgetall.mockResolvedValue({
        id: 'test-schedule-1',
        name: 'Test Schedule',
        frequency: 'daily',
        hour: '10',
        minute: '0',
        modelId: 'gpt-4',
        datasetVersion: '2026-05-06',
        enabled: 'true',
        createdAt: '2026-05-06T00:00:00Z',
        status: 'active',
      });

      const store = new RedisScheduleStore();
      await store.connect();
      const schedule = await store.getScheduleById('test-schedule-1');

      expect(schedule).not.toBeNull();
      expect(schedule!.id).toBe('test-schedule-1');
    });
  });

  describe('deleteSchedule', () => {
    it('should delete schedule from Redis', async () => {
      const store = new RedisScheduleStore();
      await store.connect();
      await store.deleteSchedule('test-schedule-1');

      expect(mockRedis.del).toHaveBeenCalledWith('scheduler:job:test-schedule-1');
    });
  });

  describe('getScheduleLogs', () => {
    it('should return logs from Redis sorted set', async () => {
      mockRedis.zrange.mockResolvedValue([JSON.stringify(testLogEntry)]);

      const store = new RedisScheduleStore();
      await store.connect();
      const logs = await store.getScheduleLogs();

      expect(logs).toHaveLength(1);
      expect(logs[0].scheduleId).toBe('test-schedule-1');
    });

    it('should return empty array when no logs exist', async () => {
      mockRedis.zrange.mockResolvedValue([]);

      const store = new RedisScheduleStore();
      await store.connect();
      const logs = await store.getScheduleLogs();

      expect(logs).toEqual([]);
    });
  });

  describe('addScheduleLogEntry', () => {
    it('should add log entry to Redis sorted set', async () => {
      const store = new RedisScheduleStore();
      await store.connect();
      await store.addScheduleLogEntry(testLogEntry);

      expect(mockRedis.zadd).toHaveBeenCalledWith(
        'scheduler:logs',
        expect.any(Number),
        JSON.stringify(testLogEntry)
      );
    });
  });
});