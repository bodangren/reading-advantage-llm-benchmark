import fs from 'fs/promises';
import path from 'path';
import { Task, TaskSchema, Run, RunSchema, LeaderboardEntry, LeaderboardSchema, DatasetVersion, DatasetVersionSchema, TaskVersion, TaskVersionSchema, TaskTemplate, TaskTemplatesSchema } from './schemas';
import { z } from 'zod';

const DATA_DIR = path.join(process.cwd(), 'data');

async function readJsonDirectory<T>(dirName: string, schema: z.ZodSchema<T>): Promise<T[]> {
  try {
    const dirPath = path.join(DATA_DIR, dirName);
    const files = await fs.readdir(dirPath);
    
    const validItems: T[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(dirPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        
        // Handle both single objects and arrays of objects
        const items = Array.isArray(parsed) ? parsed : (parsed.entries ? parsed.entries : [parsed]);

        for (const item of items) {
          const result = schema.safeParse(item);
          if (result.success) {
            validItems.push(result.data);
          }
        }
      }
    }
    
    return validItems;
  } catch {
    return [];
  }
}

export async function getTasks(): Promise<Task[]> {
  return readJsonDirectory('tasks', TaskSchema);
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  const tasks = await getTasks();
  return tasks.find(t => t.id === id);
}

export async function getRuns(): Promise<Run[]> {
  return readJsonDirectory('runs', RunSchema);
}

export async function getRunById(id: string): Promise<Run | undefined> {
  const runs = await getRuns();
  return runs.find(r => r.id === id);
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return readJsonDirectory('leaderboard', LeaderboardSchema);
}

export async function getCurrentDatasetVersion(): Promise<DatasetVersion | null> {
  try {
    const filePath = path.join(DATA_DIR, 'datasets', 'dataset.json');
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    const result = DatasetVersionSchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getRunsByVersion(version: string): Promise<Run[]> {
  const runs = await getRuns();
  return runs.filter(r => r.dataset_version === version);
}

export async function getRunCountForTask(taskId: string): Promise<number> {
  const runs = await getRuns();
  return runs.filter(r => r.task_id === taskId).length;
}

export async function getTaskVersions(taskId: string): Promise<TaskVersion[]> {
  const versionsDir = path.join(DATA_DIR, 'tasks', 'versions', taskId);
  try {
    const files = await fs.readdir(versionsDir);
    const versions: TaskVersion[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(versionsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        const result = TaskVersionSchema.safeParse(parsed);
        if (result.success) {
          versions.push(result.data);
        }
      }
    }

    return versions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch {
    return [];
  }
}

export async function saveTaskVersion(taskId: string, taskData: Task, changeSummary?: string): Promise<TaskVersion> {
  const versionsDir = path.join(DATA_DIR, 'tasks', 'versions', taskId);
  await fs.mkdir(versionsDir, { recursive: true });

  const version = taskData.version || '1.0';
  const timestamp = new Date().toISOString();
  const versionId = `${version}_${Date.now()}`;

  const taskVersion: TaskVersion = {
    version,
    created_at: timestamp,
    task_id: taskId,
    task_data: taskData,
    change_summary: changeSummary,
  };

  const filePath = path.join(versionsDir, `${versionId}.json`);
  await fs.writeFile(filePath, JSON.stringify(taskVersion, null, 2));

  return taskVersion;
}

export async function getTaskTemplates(): Promise<TaskTemplate[]> {
  try {
    const filePath = path.join(DATA_DIR, 'templates', 'task_templates.json');
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    const result = TaskTemplatesSchema.safeParse(parsed);
    if (result.success) {
      return result.data.templates;
    }
    return [];
  } catch {
    return [];
  }
}