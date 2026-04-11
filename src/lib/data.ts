import fs from 'fs/promises';
import path from 'path';
import { Task, TaskSchema, Run, RunSchema, LeaderboardEntry, LeaderboardSchema } from './schemas';
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