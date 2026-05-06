import { ScheduleConfig, ScheduleLogEntry, ScheduleConfigSchema, ScheduleLogEntrySchema, Run } from './schemas';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SCHEDULES_DIR = path.join(DATA_DIR, 'schedules');
const SCHEDULE_LOG_FILE = path.join(DATA_DIR, 'schedules', 'schedule_log.json');

export type CronField = {
  hour: number;
  minute: number;
  dayOfWeek?: number;
};

export function calculateNextRun(config: ScheduleConfig): Date | null {
  const now = new Date();
  const { frequency, hour, minute, dayOfWeek } = config;

  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);

  if (frequency === 'daily') {
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
  } else if (frequency === 'weekly') {
    const targetDay = dayOfWeek ?? 0;
    const currentDay = now.getDay();
    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget < 0) daysUntilTarget += 7;
    if (daysUntilTarget === 0 && next <= now) daysUntilTarget = 7;
    next.setDate(next.getDate() + daysUntilTarget);
  }

  return next;
}

export function getCronFields(config: ScheduleConfig): CronField {
  return {
    hour: config.hour,
    minute: config.minute,
    dayOfWeek: config.frequency === 'weekly' ? config.dayOfWeek : undefined,
  };
}

export function isScheduleDue(config: ScheduleConfig): boolean {
  if (!config.enabled || config.status !== 'active') return false;

  const now = new Date();

  if (config.nextRunAt) {
    const nextRun = new Date(config.nextRunAt);
    return now >= nextRun;
  }

  const nextRun = calculateNextRun(config);
  if (!nextRun) return false;

  return now >= nextRun;
}

export async function getSchedules(): Promise<ScheduleConfig[]> {
  try {
    await fs.mkdir(SCHEDULES_DIR, { recursive: true });
    const files = await fs.readdir(SCHEDULES_DIR);
    const schedules: ScheduleConfig[] = [];

    for (const file of files) {
      if (file.endsWith('.json') && file !== 'schedule_log.json') {
        const content = await fs.readFile(path.join(SCHEDULES_DIR, file), 'utf-8');
        const parsed = JSON.parse(content);
        const result = ScheduleConfigSchema.safeParse(parsed);
        if (result.success) {
          schedules.push(result.data);
        }
      }
    }

    return schedules;
  } catch {
    return [];
  }
}

export async function getScheduleById(id: string): Promise<ScheduleConfig | null> {
  try {
    const filePath = path.join(SCHEDULES_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    const result = ScheduleConfigSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export async function saveSchedule(config: ScheduleConfig): Promise<void> {
  await fs.mkdir(SCHEDULES_DIR, { recursive: true });
  const validated = ScheduleConfigSchema.parse(config);
  const filePath = path.join(SCHEDULES_DIR, `${config.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(validated, null, 2));
}

export async function deleteSchedule(id: string): Promise<void> {
  try {
    const filePath = path.join(SCHEDULES_DIR, `${id}.json`);
    await fs.unlink(filePath);
  } catch {
    // Ignore if file doesn't exist
  }
}

export async function getScheduleLogs(): Promise<ScheduleLogEntry[]> {
  try {
    const content = await fs.readFile(SCHEDULE_LOG_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed
        .map(p => ScheduleLogEntrySchema.safeParse(p))
        .filter(r => r.success)
        .map(r => r.data);
    }
    return [];
  } catch {
    return [];
  }
}

export async function addScheduleLogEntry(entry: ScheduleLogEntry): Promise<void> {
  await fs.mkdir(SCHEDULES_DIR, { recursive: true });
  const logs = await getScheduleLogs();
  logs.push(entry);
  await fs.writeFile(SCHEDULE_LOG_FILE, JSON.stringify(logs, null, 2));
}

export async function updateScheduleLastRun(
  scheduleId: string,
  lastRunAt: string,
  nextRunAt: string
): Promise<void> {
  const schedule = await getScheduleById(scheduleId);
  if (schedule) {
    schedule.lastRunAt = lastRunAt;
    schedule.nextRunAt = nextRunAt;
    await saveSchedule(schedule);
  }
}

export async function getDueSchedules(): Promise<ScheduleConfig[]> {
  const schedules = await getSchedules();
  return schedules.filter(isScheduleDue);
}

export function formatCronExpression(config: ScheduleConfig): string {
  const { frequency, hour, minute, dayOfWeek } = config;
  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

  if (frequency === 'daily') {
    return `Daily at ${time}`;
  } else {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[dayOfWeek ?? 0];
    return `Weekly on ${dayName} at ${time}`;
  }
}

export interface TriggerResult {
  scheduleId: string;
  runId?: string;
  success: boolean;
  error?: string;
}

export type EvaluationFunction = (
  modelId: string,
  datasetVersion: string
) => Promise<Run>;

export async function triggerScheduledRun(
  schedule: ScheduleConfig,
  runEval: EvaluationFunction
): Promise<TriggerResult> {
  const triggeredAt = new Date().toISOString();

  const logEntry: ScheduleLogEntry = {
    scheduleId: schedule.id,
    runId: '',
    triggeredAt,
    completedAt: undefined,
    status: 'running',
    errorMessage: undefined,
  };

  try {
    const run = await runEval(schedule.modelId, schedule.datasetVersion);

    logEntry.runId = run.id;
    logEntry.status = 'completed';
    logEntry.completedAt = new Date().toISOString();

    await addScheduleLogEntry(logEntry);

    const nextRun = calculateNextRun(schedule);
    if (nextRun) {
      await updateScheduleLastRun(schedule.id, triggeredAt, nextRun.toISOString());
    }

    return {
      scheduleId: schedule.id,
      runId: run.id,
      success: true,
    };
  } catch (error) {
    logEntry.status = 'failed';
    logEntry.errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logEntry.completedAt = new Date().toISOString();

    await addScheduleLogEntry(logEntry);

    return {
      scheduleId: schedule.id,
      success: false,
      error: logEntry.errorMessage,
    };
  }
}

export async function processDueSchedules(
  runEval: EvaluationFunction
): Promise<TriggerResult[]> {
  const dueSchedules = await getDueSchedules();
  const results: TriggerResult[] = [];

  for (const schedule of dueSchedules) {
    const result = await triggerScheduledRun(schedule, runEval);
    results.push(result);
  }

  return results;
}