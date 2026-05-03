import { Task } from './schemas';
import { WEBAPP_TASK_PROMPT } from './prompts/webapp-task-prompt';

export interface TaskSpec extends Task {
  generatedBy: string;
  generationPrompt: string;
}

export interface GenerateTasksOptions {
  repoPath: string;
  count: number;
  llmClient: (prompt: string) => Promise<string>;
  modelId?: string;
  promptTemplate?: string;
}

const DEFAULT_PROMPT_TEMPLATE = WEBAPP_TASK_PROMPT;

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
  const { repoPath, count, llmClient, modelId = 'unknown', promptTemplate = DEFAULT_PROMPT_TEMPLATE } = options;

  const context = `Repository path: ${repoPath}`;
  const prompt = promptTemplate
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