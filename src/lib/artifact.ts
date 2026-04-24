import { z } from 'zod';
import { calculateCost } from './pricing';

export const ArtifactSchema = z.object({
  run_id: z.string(),
  git_sha: z.string().optional(),
  timestamp: z.string(),
  model: z.string(),
  provider: z.string(),
  prompt_version: z.string().optional(),
  dataset_version: z.string().optional(),
  task_id: z.string(),
  scores: z.object({
    functional_correctness: z.number().min(0).max(1),
    integration_quality: z.number().min(0).max(1),
    regression_safety: z.number().min(0).max(1),
    minimality: z.number().min(0).max(1),
    process_quality: z.number().min(0).max(1),
  }),
  token_counts: z.object({
    input_tokens: z.number().int().nonnegative(),
    output_tokens: z.number().int().nonnegative(),
  }),
  cost_breakdown: z
    .object({
      input_cost: z.number(),
      output_cost: z.number(),
      total_cost: z.number(),
      model: z.string(),
      provider: z.string(),
    })
    .optional(),
});

export type RunArtifact = z.infer<typeof ArtifactSchema>;

export function createArtifact(params: {
  run_id: string;
  model: string;
  provider: string;
  task_id: string;
  scores: RunArtifact['scores'];
  token_counts: RunArtifact['token_counts'];
  git_sha?: string;
  prompt_version?: string;
  dataset_version?: string;
}): RunArtifact {
  const cost = calculateCost(params.provider, params.model, params.token_counts);

  return {
    run_id: params.run_id,
    git_sha: params.git_sha,
    timestamp: new Date().toISOString(),
    model: params.model,
    provider: params.provider,
    prompt_version: params.prompt_version,
    dataset_version: params.dataset_version,
    task_id: params.task_id,
    scores: params.scores,
    token_counts: params.token_counts,
    cost_breakdown: cost ?? undefined,
  };
}

export function artifactFilename(artifact: RunArtifact): string {
  const date = artifact.timestamp.split('T')[0].replace(/-/g, '');
  const safeModel = artifact.model.replace(/[^a-zA-Z0-9]/g, '-');
  return `${date}-${safeModel}-${artifact.run_id}.json`;
}

export function validateArtifact(data: unknown): RunArtifact {
  return ArtifactSchema.parse(data);
}