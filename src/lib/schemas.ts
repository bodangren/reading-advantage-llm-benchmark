import { z } from 'zod';

export const DatasetVersionSchema = z.object({
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Version must be in YYYY-MM-DD format"),
  created_at: z.string(),
  description: z.string(),
  tasks: z.array(z.string()),
});

export const RubricDimensionSchema = z.object({
  label: z.string(),
  weight: z.number(),
  description: z.string(),
});

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  difficulty: z.string(),
  domain: z.string().optional(),
  description: z.string(),
  repo_context: z.string().optional(),
  acceptance_criteria: z.array(z.string()).optional(),
  rubric: z.array(z.string()).optional(),
  structured_rubric: z.array(RubricDimensionSchema).optional(),
  version: z.string(),
});

export const TestResultSchema = z.object({
  suite: z.string(),
  name: z.string(),
  status: z.enum(['pass', 'fail', 'skip']),
  duration_ms: z.number().optional(),
  error_message: z.string().optional(),
});

export const ArtifactSchema = z.object({
  name: z.string(),
  type: z.enum(['log', 'screenshot', 'report', 'other']),
  url: z.string(),
  size_bytes: z.number().optional(),
});

export const RunScoresSchema = z.object({
  functional_correctness: z.number().min(0).max(40),
  integration_quality: z.number().min(0).max(25),
  regression_safety: z.number().min(0).max(20),
  minimality: z.number().min(0).max(10),
  process_quality: z.number().min(0).max(5),
});

export const RunDetailSchema = z.object({
  id: z.string(),
  model: z.string(),
  provider: z.string().optional(),
  harness_version: z.string(),
  harness: z.string(),
  benchmark_version: z.string(),
  dataset_version: z.string().optional(),
  task_id: z.string().optional(),
  run_date: z.string(),
  wall_time_seconds: z.number(),
  total_score: z.number().min(0).max(1),
  scores: RunScoresSchema,
  diff: z.string().optional(),
  test_results: z.array(TestResultSchema),
  artifacts: z.array(ArtifactSchema),
});

export const RunSchema = z.object({
  id: z.string(),
  model: z.string(),
  provider: z.string().optional(),
  harness: z.string(),
  benchmark_version: z.string(),
  dataset_version: z.string().optional(),
  task_id: z.string().optional(),
  score: z.number(),
  subscores: z.record(z.string(), z.number()).optional(),
  date: z.string().optional(),
});

export const LeaderboardSchema = z.object({
  model: z.string(),
  provider: z.string().optional(),
  harness: z.string().optional(),
  score: z.number(),
  subscores: z.record(z.string(), z.number()).optional(),
  date: z.string().optional(),
  dataset_version: z.string().optional(),
});

export type RubricDimension = z.infer<typeof RubricDimensionSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Run = z.infer<typeof RunSchema>;
export type RunDetail = z.infer<typeof RunDetailSchema>;
export type LeaderboardEntry = z.infer<typeof LeaderboardSchema>;
export type DatasetVersion = z.infer<typeof DatasetVersionSchema>;
export type TestResult = z.infer<typeof TestResultSchema>;
export type Artifact = z.infer<typeof ArtifactSchema>;
export type RunScores = z.infer<typeof RunScoresSchema>;