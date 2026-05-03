#!/usr/bin/env node

import { generateTasks } from '../src/lib/task-generator';
import { listCandidates, updateCandidateStatus, CandidateStatus } from '../src/lib/candidate-storage';
import { getAllRuns, getRunsForModel } from '../src/lib/runs';
import { compareRuns, filterRegressions, generateRegressionReport } from '../src/lib/regression';
import { exportToCSV, filterRuns } from '../src/lib/export';
import { OpenAIClient } from '../src/lib/llm-client';
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
    } else if (arg === '--threshold' && i + 1 < args.length) {
      options.threshold = parseFloat(args[++i]);
    } else if (arg === '--format' && i + 1 < args.length) {
      options.format = args[++i];
    } else if (arg === '--output' && i + 1 < args.length) {
      options.output = args[++i];
    } else if (arg === '--api-key' && i + 1 < args.length) {
      options['api-key'] = args[++i];
    } else if (arg === '--api-base' && i + 1 < args.length) {
      options['api-base'] = args[++i];
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
  const modelId = (options.model as string) || 'gpt-4o';
  const apiKey = (options['api-key'] as string) || process.env.OPENAI_API_KEY;
  const apiBase = (options['api-base'] as string) || process.env.LLM_API_BASE;

  if (!repoPath) {
    console.error('Error: --repo is required');
    console.error('Usage: asf task generate --repo <path> [--count 5] [--model gpt-4o] [--api-key <key>] [--api-base <url>]');
    process.exit(1);
  }

  console.log(`Generating ${count} task(s) from repository: ${repoPath}`);
  console.log(`Using model: ${modelId}`);

  let llmClient: (prompt: string) => Promise<string>;

  if (apiKey) {
    const client = new OpenAIClient({
      apiKey,
      model: modelId,
      baseUrl: apiBase || 'https://api.openai.com/v1',
      maxRetries: 3,
    });
    llmClient = async (prompt: string) => {
      console.log('\n[INFO] Sending request to LLM API...');
      const response = await client.complete(prompt);
      console.log('[INFO] Received response from LLM API');
      return response;
    };
  } else {
    console.error('\nError: --api-key is required for real API calls');
    console.error('Alternatively, set the OPENAI_API_KEY environment variable.');
    console.error('Usage: asf task generate --repo <path> --api-key <your-api-key> [--count 3] [--model gpt-4o]');
    process.exit(1);
  }

  try {
    const tasks = await generateTasks({
      repoPath,
      count,
      llmClient,
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

async function handleRegress(options: Record<string, string | number>): Promise<void> {
  const model = options.model as string | undefined;
  const threshold = (options.threshold as number) || 0.05;

  if (!model) {
    console.error('Error: --model is required');
    console.error('Usage: asf benchmark regress --model <model-id> [--threshold <value>]');
    process.exit(1);
  }

  console.log(`Checking regressions for model: ${model}`);
  console.log(`Threshold: ${(threshold * 100).toFixed(0)}%\n`);

  try {
    const runs = await getRunsForModel(model);

    if (runs.length < 2) {
      console.log(`Not enough runs found for ${model} to compare. Found ${runs.length}, need at least 2.`);
      console.log('No regressions detected.');
      process.exit(0);
    }

    const sortedRuns = runs.sort((a, b) => new Date(a.run_date).getTime() - new Date(b.run_date).getTime());
    const beforeRun = sortedRuns[0];
    const afterRun = sortedRuns[sortedRuns.length - 1];

    console.log(`Comparing runs:`);
    console.log(`  Before: ${beforeRun.id} (${beforeRun.run_date}) - score ${(beforeRun.total_score * 100).toFixed(1)}%`);
    console.log(`  After:  ${afterRun.id} (${afterRun.run_date}) - score ${(afterRun.total_score * 100).toFixed(1)}%\n`);

    const report = compareRuns(beforeRun, afterRun);
    const filtered = filterRegressions(report, threshold);
    const markdown = generateRegressionReport(filtered, model);

    console.log(markdown);

    process.exit(filtered.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('Regression check failed:', error);
    process.exit(1);
  }
}

async function handleExport(options: Record<string, string | number>): Promise<void> {
  const model = options.model as string | undefined;
  const format = (options.format as string) || 'csv';
  const outputFile = options.output as string | undefined;

  if (format !== 'csv' && format !== 'json') {
    console.error('Error: --format must be csv or json');
    console.error('Usage: asf benchmark export --format csv --output results.csv [--model gpt-4o]');
    process.exit(1);
  }

  try {
    let runs = await getAllRuns();

    if (model) {
      runs = filterRuns(runs, { model });
    }

    if (runs.length === 0) {
      console.log('No runs found to export.');
      process.exit(0);
    }

    let content: string;
    let extension: string;

    if (format === 'csv') {
      content = exportToCSV(runs);
      extension = 'csv';
    } else {
      content = JSON.stringify(runs, null, 2);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      extension = 'json';
    }

    if (outputFile) {
      await fs.writeFile(outputFile, content, 'utf-8');
      console.log(`Exported ${runs.length} run(s) to ${outputFile}`);
    } else {
      console.log(content);
    }

    process.exit(0);
  } catch (error) {
    console.error('Export failed:', error);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.command === 'task') {
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
  } else if (args.command === 'benchmark') {
    switch (args.subcommand) {
      case 'regress':
        await handleRegress(args.options);
        break;
      case 'export':
        await handleExport(args.options);
        break;
      default:
        console.error(`Unknown subcommand: ${args.subcommand}`);
        console.error('Available subcommands: regress, export');
        process.exit(1);
    }
  } else {
    console.error('Expected: asf task <subcommand> or asf benchmark <subcommand>');
    console.error('Available commands:');
    console.error('  task      - Task generation and review');
    console.error('  benchmark - Benchmark analysis');
    process.exit(1);
  }
}

main();