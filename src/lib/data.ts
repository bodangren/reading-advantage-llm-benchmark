import fs from 'fs/promises';
import path from 'path';
import { Task, TaskSchema, Run, RunSchema, LeaderboardEntry, LeaderboardSchema } from './schemas';
import { z } from 'zod';

const DATA_DIR = path.join(process.cwd(), 'data');

async function readJsonFile<T>(filename: string, schema: z.ZodSchema<T>): Promise<T[]> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Filter out invalid items
    const validItems: T[] = [];
    for (const item of parsed) {
      const result = schema.safeParse(item);
      if (result.success) {
        validItems.push(result.data);
      }
    }
    
    return validItems;
  } catch (error) {
    return [];
  }
}

export async function getTasks(): Promise<Task[]> {
  return readJsonFile('tasks.json', TaskSchema);
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  const tasks = await getTasks();
  return tasks.find(t => t.id === id);
}

export async function getRuns(): Promise<Run[]> {
  return readJsonFile('runs.json', RunSchema);
}

export async function getRunById(id: string): Promise<Run | undefined> {
  const runs = await getRuns();
  return runs.find(r => r.id === id);
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return readJsonFile('leaderboard.json', LeaderboardSchema);
}