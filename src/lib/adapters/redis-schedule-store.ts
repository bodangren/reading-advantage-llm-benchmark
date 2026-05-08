import { ScheduleConfig, ScheduleLogEntry } from '../schemas';
import { RedisClient, createRedisClient } from '../redis-client';

const memorySchedules = new Map<string, ScheduleConfig>();
const memoryLogs: ScheduleLogEntry[] = [];

export class RedisScheduleStore {
  private redis: RedisClient | null = null;
  private useFallback = false;

  async connect(): Promise<void> {
    this.redis = await createRedisClient();
    this.useFallback = !this.redis;
  }

  async getSchedules(): Promise<ScheduleConfig[]> {
    if (!this.redis || this.useFallback) {
      return this.getSchedulesFromFilesystem();
    }

    try {
      const keys = await this.redis.keys('scheduler:job:*');
      const schedules: ScheduleConfig[] = [];

      for (const key of keys) {
        const data = await this.redis.hgetall(key);
        if (data && Object.keys(data).length > 0) {
          const schedule = this.deserializeSchedule(data);
          if (schedule) schedules.push(schedule);
        }
      }

      return schedules;
    } catch {
      return this.getSchedulesFromFilesystem();
    }
  }

  private async getSchedulesFromFilesystem(): Promise<ScheduleConfig[]> {
    try {
      const { getSchedules } = await import('../scheduler');
      return await getSchedules();
    } catch {
      return [];
    }
  }

  async saveSchedule(config: ScheduleConfig): Promise<void> {
    if (this.redis && !this.useFallback) {
      try {
        const serialized = this.serializeSchedule(config);
        await this.redis.hset(`scheduler:job:${config.id}`, serialized);
        return;
      } catch {
        // Fall through to filesystem
      }
    }

    const { saveSchedule } = await import('../scheduler');
    await saveSchedule(config);
  }

  async getScheduleById(id: string): Promise<ScheduleConfig | null> {
    if (this.redis && !this.useFallback) {
      try {
        const data = await this.redis.hgetall(`scheduler:job:${id}`);
        if (!data || Object.keys(data).length === 0) return null;
        return this.deserializeSchedule(data);
      } catch {
        // Fall through
      }
    }

    const { getScheduleById } = await import('../scheduler');
    return await getScheduleById(id);
  }

  async deleteSchedule(id: string): Promise<void> {
    if (this.redis && !this.useFallback) {
      try {
        await this.redis.del(`scheduler:job:${id}`);
        return;
      } catch {
        // Fall through
      }
    }

    const { deleteSchedule } = await import('../scheduler');
    await deleteSchedule(id);
  }

  async getScheduleLogs(): Promise<ScheduleLogEntry[]> {
    if (this.redis && !this.useFallback) {
      try {
        const rawLogs = await this.redis.zrange('scheduler:logs', 0, -1);
        return rawLogs
          .map(log => {
            try {
              return JSON.parse(log) as ScheduleLogEntry;
            } catch {
              return null;
            }
          })
          .filter((log): log is ScheduleLogEntry => log !== null);
      } catch {
        // Fall through
      }
    }

    const { getScheduleLogs } = await import('../scheduler');
    return await getScheduleLogs();
  }

  async addScheduleLogEntry(entry: ScheduleLogEntry): Promise<void> {
    if (this.redis && !this.useFallback) {
      try {
        const score = new Date(entry.triggeredAt).getTime();
        await this.redis.zadd('scheduler:logs', score, JSON.stringify(entry));
        return;
      } catch {
        // Fall through
      }
    }

    const { addScheduleLogEntry: fsAddLog } = await import('../scheduler');
    await fsAddLog(entry);
  }

  private serializeSchedule(config: ScheduleConfig): Record<string, string> {
    return {
      id: config.id,
      name: config.name,
      frequency: config.frequency,
      hour: String(config.hour),
      minute: String(config.minute),
      modelId: config.modelId,
      datasetVersion: config.datasetVersion,
      enabled: String(config.enabled),
      createdAt: config.createdAt,
      status: config.status,
      ...(config.dayOfWeek !== undefined && { dayOfWeek: String(config.dayOfWeek) }),
      ...(config.lastRunAt && { lastRunAt: config.lastRunAt }),
      ...(config.nextRunAt && { nextRunAt: config.nextRunAt }),
    };
  }

  private deserializeSchedule(data: Record<string, string>): ScheduleConfig | null {
    try {
      return {
        id: data.id,
        name: data.name,
        frequency: data.frequency as 'daily' | 'weekly',
        hour: parseInt(data.hour, 10),
        minute: parseInt(data.minute, 10),
        modelId: data.modelId,
        datasetVersion: data.datasetVersion,
        enabled: data.enabled === 'true',
        createdAt: data.createdAt,
        status: data.status as 'active' | 'paused' | 'completed',
        dayOfWeek: data.dayOfWeek ? parseInt(data.dayOfWeek, 10) : undefined,
        lastRunAt: data.lastRunAt,
        nextRunAt: data.nextRunAt,
      };
    } catch {
      return null;
    }
  }
}

export function createScheduleStore(): RedisScheduleStore {
  return new RedisScheduleStore();
}