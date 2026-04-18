import { z } from 'zod';

export const DatasetVersionSchema = z.object({
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Version must be in YYYY-MM-DD format"),
  created_at: z.string(),
  description: z.string(),
  tasks: z.array(z.string()),
});

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  difficulty: z.string(),
  description: z.string(),
  rubric: z.array(z.string()),
  version: z.string(),
});

export const RunSchema = z.object({
  id: z.string(),
  model: z.string(),
  provider: z.string().optional(),
  harness: z.string(),
  benchmark_version: z.string(),
  dataset_version: z.string().optional(),
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

export type Task = z.infer<typeof TaskSchema>;
export type Run = z.infer<typeof RunSchema>;
export type LeaderboardEntry = z.infer<typeof LeaderboardSchema>;
export type DatasetVersion = z.infer<typeof DatasetVersionSchema>;