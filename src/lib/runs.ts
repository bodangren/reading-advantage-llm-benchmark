import fs from 'fs/promises';
import path from 'path';
import { RunDetail, RunDetailSchema } from './schemas';

const RUNS_DATA_DIR = path.join(process.cwd(), 'data', 'runs');

export async function getAllRuns(): Promise<RunDetail[]> {
  const runs = await loadRunsFromDirectory();
  return runs.sort((a, b) => {
    const dateA = new Date(a.run_date).getTime();
    const dateB = new Date(b.run_date).getTime();
    return dateB - dateA;
  });
}

export async function getRunById(id: string): Promise<RunDetail | null> {
  const runs = await getAllRuns();
  return runs.find(r => r.id === id) || null;
}

async function loadRunsFromDirectory(): Promise<RunDetail[]> {
  try {
    const files = await fs.readdir(RUNS_DATA_DIR);
    const runs: RunDetail[] = [];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filePath = path.join(RUNS_DATA_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(content);

      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        const result = RunDetailSchema.safeParse(item);
        if (result.success) {
          runs.push(result.data);
        }
      }
    }

    return runs;
  } catch {
    return [];
  }
}

export function validateRun(run: unknown): RunDetail {
  const result = RunDetailSchema.safeParse(run);
  if (!result.success) {
    throw new Error(`Run validation failed: ${result.error.message}`);
  }
  return result.data;
}

export async function saveRun(run: RunDetail): Promise<string> {
  await fs.mkdir(RUNS_DATA_DIR, { recursive: true });
  const fileName = `${run.id}.json`;
  const filePath = path.join(RUNS_DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(run, null, 2), 'utf-8');
  return filePath;
}