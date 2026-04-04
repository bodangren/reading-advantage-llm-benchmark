import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  difficulty: z.string(),
  description: z.string(),
  rubric: z.string(),
  version: z.string(),
});

export const RunSchema = z.object({
  id: z.string(),
  model: z.string(),
  harness: z.string(),
  benchmark_version: z.string(),
  score: z.number(),
});

export const LeaderboardSchema = z.object({
  model: z.string(),
  averageScore: z.number(),
  totalRuns: z.number(),
});

export type Task = z.infer<typeof TaskSchema>;
export type Run = z.infer<typeof RunSchema>;
export type LeaderboardEntry = z.infer<typeof LeaderboardSchema>;