import { Task } from './schemas';

export interface TaskSpec extends Task {
  generatedBy: string;
  generationPrompt: string;
}

export interface GenerateTasksOptions {
  repoPath: string;
  count: number;
  llmClient: (prompt: string) => Promise<string>;
  modelId?: string;
}

const TASK_GENERATION_PROMPT = `You are a benchmark task generator. Given a repository context, generate realistic coding tasks that test LLM capabilities.

Generate {count} task(s) in JSON array format. Each task must have:
- id: unique identifier (snake_case)
- title: short descriptive title
- difficulty: "easy" | "medium" | "hard"
- description: detailed task description
- version: "1.0.0"

Example format:
[{"id": "task_name", "title": "Task Title", "difficulty": "medium", "description": "Detailed description...", "version": "1.0.0"}]

Repository context:
{context}`;

export class TaskGenerator {
  constructor(private repoPath: string) {}

  async generate(options: {
    count: number;
    llmClient: (prompt: string) => Promise<string>;
    modelId?: string;
  }): Promise<TaskSpec[]> {
    return generateTasks({
      repoPath: this.repoPath,
      ...options,
    });
  }
}

export async function generateTasks(options: GenerateTasksOptions): Promise<TaskSpec[]> {
  const { repoPath, count, llmClient, modelId = 'unknown' } = options;

  const context = `Repository path: ${repoPath}`;
  const prompt = TASK_GENERATION_PROMPT
    .replace('{count}', String(count))
    .replace('{context}', context);

  const response = await llmClient(prompt);

  let parsedTasks: Task[];
  try {
    parsedTasks = JSON.parse(response);
  } catch {
    throw new Error('Failed to parse LLM response as JSON');
  }

  if (!Array.isArray(parsedTasks)) {
    throw new Error('LLM response must be a JSON array');
  }

  return parsedTasks.map((task) => ({
    ...task,
    generatedBy: modelId,
    generationPrompt: prompt,
  }));
}