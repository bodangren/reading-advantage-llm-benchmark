#!/usr/bin/env node

import { generateTasks } from '../src/lib/task-generator';
import { listCandidates, updateCandidateStatus, CandidateStatus } from '../src/lib/candidate-storage';
import fs from 'fs/promises';
import path from 'path';

const CANDIDATES_DIR = path.join(process.cwd(), 'tasks', 'candidates');

function parseArgs(args: string[]): { command: string; subcommand: string; options: Record<string, string | number> } {
  const command = args[0] || '';
  const subcommand = args[1] || '';
  const options: Record<string, string | number> = {};

  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--repo' && i + 1 < args.length) {
      options.repo = args[++i];
    } else if (arg === '--count' && i + 1 < args.length) {
      options.count = parseInt(args[++i], 10);
    } else if (arg === '--status' && i + 1 < args.length) {
      options.status = args[++i] as CandidateStatus;
    } else if (arg === '--model' && i + 1 < args.length) {
      options.model = args[++i];
    } else if (arg === 'approve' || arg === 'reject') {
      options.action = arg;
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        options.taskId = args[++i];
      }
    }
  }

  return { command, subcommand, options };
}

async function handleGenerate(options: Record<string, string | number>): Promise<void> {
  const repoPath = options.repo as string;
  const count = (options.count as number) || 5;
  const modelId = (options.model as string) || 'gpt-4';

  if (!repoPath) {
    console.error('Error: --repo is required');
    console.error('Usage: asf task generate --repo <path> [--count 5] [--model gpt-4]');
    process.exit(1);
  }

  console.log(`Generating ${count} task(s) from repository: ${repoPath}`);
  console.log(`Using model: ${modelId}`);

  const mockLlmClient = async (prompt: string): Promise<string> => {
    console.log('\n[DEBUG] LLM Prompt sent:');
    console.log(prompt.substring(0, 200) + '...\n');
    const tasks = [
      {
        id: `generated_task_${Date.now()}_1`,
        title: 'Implement User Authentication',
        difficulty: 'medium',
        description: 'Add JWT-based authentication to the application with login/logout functionality.',
        version: '1.0.0',
      },
      {
        id: `generated_task_${Date.now()}_2`,
        title: 'Add Data Export Feature',
        difficulty: 'easy',
        description: 'Create an export feature that allows users to download their data as CSV.',
        version: '1.0.0',
      },
    ];
    return JSON.stringify(tasks.slice(0, count));
  };

  try {
    const tasks = await generateTasks({
      repoPath,
      count,
      llmClient: mockLlmClient,
      modelId,
    });

    const { saveCandidateTasks } = await import('../src/lib/candidate-storage');
    const candidates = await saveCandidateTasks(tasks, { candidatesDir: CANDIDATES_DIR });

    console.log(`\nGenerated ${candidates.length} candidate task(s):`);
    for (const c of candidates) {
      console.log(`  - ${c.task.id} (${c.task.difficulty}): ${c.task.title}`);
    }
    console.log(`\nCandidates saved to: ${CANDIDATES_DIR}`);
  } catch (error) {
    console.error('Task generation failed:', error);
    process.exit(1);
  }
}

async function handleReview(options: Record<string, string | number>): Promise<void> {
  const status = options.status as CandidateStatus | undefined;
  const action = options.action as string | undefined;
  const taskId = options.taskId as string | undefined;

  if (action && taskId) {
    if (action !== 'approve' && action !== 'reject') {
      console.error(`Error: Unknown action '${action}'. Use 'approve' or 'reject'.`);
      process.exit(1);
    }

    const newStatus: CandidateStatus = action === 'approve' ? 'approved' : 'rejected';

    try {
      const updated = await updateCandidateStatus(taskId, newStatus, { candidatesDir: CANDIDATES_DIR });

      if (!updated) {
        console.error(`Error: Candidate task '${taskId}' not found.`);
        process.exit(1);
      }

      console.log(`Task '${taskId}' has been ${newStatus}.`);
    } catch (error) {
      console.error('Failed to update task status:', error);
      process.exit(1);
    }

    return;
  }

  try {
    const candidates = await listCandidates({ candidatesDir: CANDIDATES_DIR, status });

    if (candidates.length === 0) {
      console.log(`No ${status ? status : ''} candidates found.`);
      return;
    }

    console.log(`\nCandidate Tasks (${status || 'all'}):`);
    console.log('─'.repeat(70));
    console.log('ID                  Status     Difficulty  Title');
    console.log('─'.repeat(70));

    for (const c of candidates) {
      const id = c.id.padEnd(19);
      const statusStr = c.status.padEnd(10);
      const diff = (c.task.difficulty || '').padEnd(10);
      console.log(`${id} ${statusStr} ${diff} ${c.task.title}`);
    }

    console.log('─'.repeat(70));
    console.log(`Total: ${candidates.length} candidate(s)`);
    console.log('\nTo approve/reject a task:');
    console.log('  asf task review approve <task-id>');
    console.log('  asf task review reject <task-id>');
  } catch (error) {
    console.error('Failed to list candidates:', error);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.command !== 'task') {
    console.error('Expected: asf task <subcommand>');
    console.error('Available subcommands:');
    console.error('  generate  - Generate candidate tasks from a repository');
    console.error('  review     - Review and manage candidate tasks');
    process.exit(1);
  }

  switch (args.subcommand) {
    case 'generate':
      await handleGenerate(args.options);
      break;
    case 'review':
      await handleReview(args.options);
      break;
    default:
      console.error(`Unknown subcommand: ${args.subcommand}`);
      console.error('Available subcommands: generate, review');
      process.exit(1);
  }
}

main();