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

export const TaskStatusSchema = z.enum(['draft', 'review', 'published']);

export const TaskFormDataSchema = z.object({
  id: z.string().min(1, "Task ID is required").regex(/^[a-z0-9_]+$/i, "Task ID must be alphanumeric with underscores only"),
  title: z.string().min(1, "Title is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  domain: z.string(),
  description: z.string().min(1, "Description is required"),
  repo_context: z.string(),
  acceptance_criteria: z.array(z.string()),
  structured_rubric: z.array(RubricDimensionSchema),
  status: TaskStatusSchema.optional().default('draft'),
}).refine(
  (data) => data.structured_rubric.reduce((sum, r) => sum + r.weight, 0) === 100,
  { message: "Rubric weights must sum to 100", path: ["structured_rubric"] }
);

export type TaskFormData = z.infer<typeof TaskFormDataSchema>;

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
  status: TaskStatusSchema.optional().default('draft'),
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
  harness: z.string(),
  harness_version: z.string(),
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
  track: z.enum(['fixed', 'native']).optional(),
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
  track: z.enum(['fixed', 'native']).optional(),
});

export type RubricDimension = z.infer<typeof RubricDimensionSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type Run = z.infer<typeof RunSchema>;
export type RunDetail = z.infer<typeof RunDetailSchema>;
export type LeaderboardEntry = z.infer<typeof LeaderboardSchema>;
export type DatasetVersion = z.infer<typeof DatasetVersionSchema>;
export type TestResult = z.infer<typeof TestResultSchema>;
export type Artifact = z.infer<typeof ArtifactSchema>;
export type RunScores = z.infer<typeof RunScoresSchema>;

export const NormalizedScoreSchema = z.object({
  raw: z.number(),
  normalized: z.number().min(0).max(100),
  scale: z.enum(['0-1', '0-100']),
});

export const ModelResultSchema = z.object({
  model: z.string(),
  provider: z.string().optional(),
  normalizedScore: z.number().min(0).max(100),
  rawScore: z.number(),
  subscores: z.record(z.string(), z.number()).optional(),
  taskResults: z.array(z.object({
    taskId: z.string(),
    taskTitle: z.string(),
    domain: z.string().optional(),
    normalizedScore: z.number().min(0).max(100),
    rawScore: z.number(),
    winner: z.boolean(),
    delta: z.number(),
  })),
});

export const ComparisonReportSchema = z.object({
  id: z.string(),
  generatedAt: z.string(),
  datasetVersion: z.string().optional(),
  taskSet: z.array(z.string()).min(1),
  models: z.array(ModelResultSchema).min(1),
  aggregateScores: z.array(z.object({
    model: z.string(),
    normalizedScore: z.number().min(0).max(100),
    rank: z.number().int().min(1),
  })),
  strengthsWeaknesses: z.array(z.object({
    model: z.string(),
    strengths: z.array(z.object({
      category: z.string(),
      avgScore: z.number(),
      taskCount: z.number(),
    })),
    weaknesses: z.array(z.object({
      category: z.string(),
      avgScore: z.number(),
      taskCount: z.number(),
    })),
  })).optional(),
});

export type NormalizedScore = z.infer<typeof NormalizedScoreSchema>;
export type ModelResult = z.infer<typeof ModelResultSchema>;
export type ComparisonReport = z.infer<typeof ComparisonReportSchema>;

export const TaskVersionSchema = z.object({
  version: z.string(),
  created_at: z.string(),
  task_id: z.string(),
  task_data: TaskSchema,
  change_summary: z.string().optional(),
});

export type TaskVersion = z.infer<typeof TaskVersionSchema>;

export const AgentConfigSchema = z.object({
  agentType: z.enum(['opencode', 'claude-code', 'github-copilot', 'cursor', 'windsurf', 'custom']),
  systemPrompt: z.string().optional(),
  toolAccess: z.array(z.enum(['filesystem', 'bash', 'websearch', 'browser', 'git', 'api'])),
});

export const TrackConfigSchema = z.discriminatedUnion('track', [
  z.object({
    track: z.literal('fixed'),
    agentConfig: z.undefined().optional(),
  }),
  z.object({
    track: z.literal('native'),
    agentConfig: AgentConfigSchema,
  }),
]);

export type AgentConfig = z.infer<typeof AgentConfigSchema>;
export type TrackConfig = z.infer<typeof TrackConfigSchema>;

export const TaskTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  domain: z.string(),
  structured_rubric: z.array(RubricDimensionSchema),
  example_acceptance_criteria: z.array(z.string()),
});

export type TaskTemplate = z.infer<typeof TaskTemplateSchema>;

export const TaskTemplatesSchema = z.object({
  templates: z.array(TaskTemplateSchema),
});

export type TaskTemplates = z.infer<typeof TaskTemplatesSchema>;