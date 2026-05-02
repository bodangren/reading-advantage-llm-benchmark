import { z } from 'zod';
import { RunSchema } from '../schemas';

const SUPPORTED_HARNESSES = ['opencode', 'anthropic', 'openai', 'google'] as const;

export const ModelConfigSchema = z.object({
  model_id: z.string().min(1, 'model_id is required'),
  provider: z.string().optional(),
  enabled: z.boolean().default(true),
});

export const HarnessConfigSchema = z.object({
  harness_id: z.string().refine(
    (val) => SUPPORTED_HARNESSES.includes(val as typeof SUPPORTED_HARNESSES[number]),
    { message: `harness_id must be one of: ${SUPPORTED_HARNESSES.join(', ')}` }
  ),
  temperature: z.number().min(0).max(2.0).default(0.0),
  max_tokens: z.number().min(100).max(128000).default(2048),
});

export const ModelMatrixSchema = z.object({
  dataset_version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Version must be in YYYY-MM-DD format'),
  models: z.array(ModelConfigSchema).min(1, 'At least one model is required'),
  harness: HarnessConfigSchema,
  track: z.enum(['fixed', 'native']).default('fixed'),
  agent_config: z.object({
    agentType: z.enum(['opencode', 'claude-code', 'github-copilot', 'cursor', 'windsurf', 'custom']),
    systemPrompt: z.string().optional(),
    toolAccess: z.array(z.enum(['filesystem', 'bash', 'websearch', 'browser', 'git', 'api'])),
  }).optional(),
});

export const ModelRunResultSchema = z.object({
  model_id: z.string(),
  provider: z.string().optional(),
  status: z.enum(['success', 'failed', 'skipped']),
  run: RunSchema.omit({}).optional(),
  error: z.string().optional(),
});

export const PipelineResultSchema = z.object({
  pipeline_version: z.string(),
  dataset_version: z.string(),
  started_at: z.string(),
  completed_at: z.string(),
  status: z.enum(['success', 'partial_failure', 'failed']),
  model_results: z.array(ModelRunResultSchema),
  error: z.string().optional(),
});

export type ModelConfig = z.infer<typeof ModelConfigSchema>;
export type HarnessConfig = z.infer<typeof HarnessConfigSchema>;
export type ModelMatrix = z.infer<typeof ModelMatrixSchema>;
export type ModelRunResult = z.infer<typeof ModelRunResultSchema>;
export type PipelineResult = z.infer<typeof PipelineResultSchema>;