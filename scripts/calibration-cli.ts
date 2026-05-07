#!/usr/bin/env node

import { getAllRuns } from '../src/lib/runs';
import { calibrateTask, getReclassificationResults, saveCalibrationData, TaskCalibrationData } from '../src/lib/calibration';
import { getTasks } from '../src/lib/data';
import path from 'path';

const CALIBRATION_DIR = path.join(process.cwd(), 'data', 'calibration');
const DEFAULT_OUTPUT = path.join(CALIBRATION_DIR, 'difficulty_scores.json');

interface CliOptions {
  dryRun?: boolean;
  output?: string;
  threshold?: number;
}

function parseArgs(args: string[]): { command: string; options: CliOptions } {
  const command = args[0] || 'calibrate';
  const options: CliOptions = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--output' && i + 1 < args.length) {
      options.output = args[++i];
    } else if (arg === '--threshold' && i + 1 < args.length) {
      options.threshold = parseFloat(args[++i]);
    }
  }

  return { command, options };
}

async function runCalibration(options: CliOptions): Promise<void> {
  console.log('Running difficulty calibration...\n');

  const runs = await getAllRuns();
  if (runs.length === 0) {
    console.log('No runs found. Cannot calibrate without historical data.');
    return;
  }

  const tasks = await getTasks();
  if (tasks.length === 0) {
    console.log('No tasks found.');
    return;
  }

  const runsByTask = new Map<string, typeof runs>();
  for (const run of runs) {
    if (!run.task_id) continue;
    if (!runsByTask.has(run.task_id)) {
      runsByTask.set(run.task_id, []);
    }
    runsByTask.get(run.task_id)!.push(run);
  }

  const calibrations: TaskCalibrationData[] = [];

  for (const task of tasks) {
    const taskRuns = runsByTask.get(task.id) || [];
    if (taskRuns.length === 0) {
      console.log(`Skipping ${task.id}: no runs available`);
      continue;
    }

    const calibration = calibrateTask(task.id, task.difficulty, taskRuns);
    calibrations.push(calibration);

    const status = calibration.calibratedScore <= 33 ? 'easy' :
                  calibration.calibratedScore <= 66 ? 'medium' : 'hard';
    const needsReclass = task.difficulty !== status;

    console.log(`${task.id}:`);
    console.log(`  Label: ${task.difficulty} → Calibrated: ${status} (${calibration.calibratedScore})`);
    console.log(`  Pass rate: ${(calibration.passRate * 100).toFixed(1)}% (${calibration.runCount} runs)`);
    if (needsReclass) {
      console.log(`  ⚠️  Reclassification suggested: ${task.difficulty} → ${status}`);
    }
    console.log('');
  }

  if (options.dryRun) {
    console.log('--- Dry Run Mode ---');
    console.log('No files written. Reclassification results:');
    const results = getReclassificationResults(calibrations);
    const changed = results.filter(r => r.label !== r.suggestedLabel);
    if (changed.length === 0) {
      console.log('No reclassifications needed.');
    } else {
      console.log(`\n${changed.length} task(s) would be reclassified:`);
      for (const r of changed) {
        console.log(`  ${r.taskId}: ${r.label} → ${r.suggestedLabel} (score: ${r.calibratedScore})`);
      }
    }
    return;
  }

  const outputPath = options.output || DEFAULT_OUTPUT;
  await saveCalibrationData(calibrations, outputPath);
  console.log(`Calibration data saved to: ${outputPath}`);

  const results = getReclassificationResults(calibrations);
  const changed = results.filter(r => r.label !== r.suggestedLabel);
  console.log(`\nCalibration complete. ${changed.length} task(s) need reclassification.`);
  console.log('To apply reclassification, use: calibrate apply');
}

async function applyReclassification(dryRun: boolean): Promise<void> {
  console.log('Applying reclassification to tasks...\n');

  const tasks = await getTasks();
  const runs = await getAllRuns();

  const runsByTask = new Map<string, typeof runs>();
  for (const run of runs) {
    if (!run.task_id) continue;
    if (!runsByTask.has(run.task_id)) {
      runsByTask.set(run.task_id, []);
    }
    runsByTask.get(run.task_id)!.push(run);
  }

  const results: Array<{ taskId: string; oldLabel: string; newLabel: string }> = [];

  for (const task of tasks) {
    const taskRuns = runsByTask.get(task.id) || [];
    if (taskRuns.length === 0) continue;

    const calibration = calibrateTask(task.id, task.difficulty, taskRuns);
    const newLabel = calibration.calibratedScore <= 33 ? 'easy' :
                    calibration.calibratedScore <= 66 ? 'medium' : 'hard';

    if (task.difficulty !== newLabel) {
      results.push({ taskId: task.id, oldLabel: task.difficulty, newLabel });
      if (!dryRun) {
        task.difficulty = newLabel;
      }
    }
  }

  if (dryRun) {
    console.log('--- Dry Run Mode ---');
    console.log(`${results.length} task(s) would be reclassified:`);
    for (const r of results) {
      console.log(`  ${r.taskId}: ${r.oldLabel} → ${r.newLabel}`);
    }
  } else {
    console.log(`${results.length} task(s) reclassified:`);
    for (const r of results) {
      console.log(`  ${r.taskId}: ${r.oldLabel} → ${r.newLabel}`);
    }
    console.log('\nNote: Task files are read-only in this implementation.');
    console.log('In a full implementation, this would update task JSON files.');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const { command, options } = parseArgs(args);

  if (command === 'apply') {
    await applyReclassification(options.dryRun || true);
  } else {
    await runCalibration(options);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});