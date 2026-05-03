import { TaskSpec } from './task-generator';
import fs from 'fs';
import path from 'path';

export type CandidateStatus = 'pending' | 'approved' | 'rejected';

export interface CandidateTask {
  id: string;
  task: TaskSpec;
  status: CandidateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SaveOptions {
  candidatesDir: string;
}

export interface ListOptions {
  candidatesDir: string;
  status?: CandidateStatus;
}

export async function saveCandidateTasks(
  tasks: TaskSpec[],
  options: SaveOptions
): Promise<CandidateTask[]> {
  const { candidatesDir } = options;

  if (!fs.existsSync(candidatesDir)) {
    fs.mkdirSync(candidatesDir, { recursive: true });
  }

  const now = new Date().toISOString();
  const candidates: CandidateTask[] = [];

  for (const task of tasks) {
    const candidate: CandidateTask = {
      id: task.id,
      task,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    const filePath = path.join(candidatesDir, `${task.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(candidate, null, 2));
    candidates.push(candidate);
  }

  return candidates;
}

export async function loadCandidateTasks(
  options: ListOptions
): Promise<CandidateTask[]> {
  const { candidatesDir } = options;

  if (!fs.existsSync(candidatesDir)) {
    return [];
  }

  const files = fs.readdirSync(candidatesDir).filter(f => f.endsWith('.json'));
  const candidates: CandidateTask[] = [];

  for (const file of files) {
    const filePath = path.join(candidatesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    candidates.push(JSON.parse(content));
  }

  return candidates;
}

export async function listCandidates(
  options: ListOptions
): Promise<CandidateTask[]> {
  const { candidatesDir, status } = options;

  let candidates = await loadCandidateTasks({ candidatesDir });

  if (status) {
    candidates = candidates.filter(c => c.status === status);
  }

  return candidates;
}

export async function updateCandidateStatus(
  taskId: string,
  newStatus: CandidateStatus,
  options: SaveOptions
): Promise<CandidateTask | null> {
  const { candidatesDir } = options;
  const filePath = path.join(candidatesDir, `${taskId}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const candidate: CandidateTask = JSON.parse(content);

  candidate.status = newStatus;
  candidate.updatedAt = new Date().toISOString();

  fs.writeFileSync(filePath, JSON.stringify(candidate, null, 2));

  return candidate;
}