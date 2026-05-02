#!/usr/bin/env node

import { executePipeline } from '../src/lib/pipeline';
import { aggregateLeaderboardEntries, formatLeaderboardSummary } from '../src/lib/pipeline';
import { ModelMatrixSchema } from '../src/lib/pipeline/schemas';
import fs from 'fs/promises';
import path from 'path';

function parseArgs(args: string[]) {
  const result: { matrixPath?: string; track?: 'fixed' | 'native' } = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--track' && i + 1 < args.length) {
      result.track = args[++i] as 'fixed' | 'native';
    } else if (!args[i].startsWith('--')) {
      result.matrixPath = args[i];
    }
  }

  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.matrixPath) {
    console.error('Usage: run-pipeline <matrix-file> [--track fixed|native]');
    console.error('  matrix-file: Path to JSON file containing model matrix configuration');
    console.error('  --track: Evaluation track (fixed or native, default: fixed)');
    process.exit(1);
  }

  const matrixPath = args.matrixPath;

  try {
    console.log(`Reading matrix from: ${matrixPath}`);
    const matrixContent = await fs.readFile(matrixPath, 'utf-8');
    const matrixJson = JSON.parse(matrixContent);

    if (args.track) {
      matrixJson.track = args.track;
    }

    const parseResult = ModelMatrixSchema.safeParse(matrixJson);
    if (!parseResult.success) {
      console.error('Invalid matrix configuration:');
      console.error(parseResult.error.format());
      process.exit(1);
    }

    console.log('Starting pipeline execution...');
    console.log(`Dataset version: ${parseResult.data.dataset_version}`);
    console.log(`Models: ${parseResult.data.models.length}`);
    console.log(`Harness: ${parseResult.data.harness.harness_id}`);
    console.log(`Track: ${parseResult.data.track}`);

    const result = await executePipeline(parseResult.data);

    console.log('\nPipeline completed!');
    console.log(`Status: ${result.status}`);
    console.log(`Started: ${result.started_at}`);
    console.log(`Completed: ${result.completed_at}`);

    const summary = formatLeaderboardSummary(result);
    console.log('\nSummary:');
    console.log(`  Total models: ${summary.total_models}`);
    console.log(`  Successful: ${summary.successful_runs}`);
    console.log(`  Failed: ${summary.failed_runs}`);
    console.log(`  Skipped: ${summary.skipped_runs}`);

    if (result.status === 'failed' && result.error) {
      console.error(`\nError: ${result.error}`);
    }

    const entries = aggregateLeaderboardEntries(result);
    if (entries.length > 0) {
      console.log('\nLeaderboard Entries:');
      for (const entry of entries) {
        console.log(`  ${entry.model}: ${entry.score.toFixed(4)}`);
      }

      const outputPath = path.join(process.cwd(), 'data', 'leaderboard', `pipeline_${Date.now()}.json`);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(entries, null, 2));
      console.log(`\nResults written to: ${outputPath}`);
    }

    process.exit(result.status === 'failed' ? 1 : 0);
  } catch (error) {
    console.error('Pipeline execution failed:', error);
    process.exit(1);
  }
}

main();