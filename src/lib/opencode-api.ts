import { Run } from './schemas';

export type OpenCodeResponse = {
  id: string;
  model: string;
  output?: string;
  error?: string;
  duration_ms?: number;
};

export interface OpenCodeConfig {
  apiUrl: string;
  apiKey?: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
}

const DEFAULT_CONFIG: OpenCodeConfig = {
  apiUrl: process.env.OPENCODE_API_URL || 'http://127.0.0.1:9090',
  apiKey: process.env.OPENCODE_API_KEY,
  timeout: 300000,
  maxRetries: 3,
  retryDelay: 1000,
};

export { DEFAULT_CONFIG };

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  config: OpenCodeConfig,
  attempt: number = 0
): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (attempt >= config.maxRetries) {
      throw error;
    }

    const isRetryable =
      error instanceof TypeError ||
      (error instanceof Error && error.message.includes('abort'));

    if (isRetryable) {
      await sleep(config.retryDelay * Math.pow(2, attempt));
      return fetchWithRetry<T>(url, options, config, attempt + 1);
    }

    throw error;
  }
}

export async function runOpenCodeEvaluation(
  prompt: string,
  modelId: string,
  config: Partial<OpenCodeConfig> = {}
): Promise<OpenCodeResponse> {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (fullConfig.apiKey) {
    headers['Authorization'] = `Bearer ${fullConfig.apiKey}`;
  }

  const response = await fetchWithRetry<OpenCodeResponse>(
    `${fullConfig.apiUrl}/api/v1/run`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: modelId,
        prompt,
        temperature: 0.0,
        max_tokens: 2048,
      }),
    },
    fullConfig
  );

  return response;
}

export async function evaluateWithOpenCode(
  task: {
    id: string;
    prompt: string;
    acceptance_criteria?: string[];
  },
  modelId: string,
  config: Partial<OpenCodeConfig> = {}
): Promise<Run> {
  const startTime = Date.now();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= (config.maxRetries ?? DEFAULT_CONFIG.maxRetries); attempt++) {
    try {
      const result = await runOpenCodeEvaluation(task.prompt, modelId, config);

      if (result.error) {
        throw new Error(`OpenCode error: ${result.error}`);
      }

      const score = evaluateResponse(result.output || '', task.acceptance_criteria || []);

      return {
        id: result.id || `run-${Date.now()}-${modelId}`,
        model: modelId,
        harness: 'opencode',
        benchmark_version: '1.0.0',
        dataset_version: '',
        score,
        date: new Date().toISOString(),
        subscores: {
          response_length: (result.output || '').length,
          duration_ms: result.duration_ms ?? Date.now() - startTime,
        },
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < (config.maxRetries ?? DEFAULT_CONFIG.maxRetries)) {
        await sleep(DEFAULT_CONFIG.retryDelay * Math.pow(2, attempt));
      }
    }
  }

  throw lastError || new Error('OpenCode evaluation failed after retries');
}

function evaluateResponse(
  output: string,
  acceptanceCriteria: string[]
): number {
  if (!acceptanceCriteria.length) {
    return 0.5;
  }

  const matchedCriteria = acceptanceCriteria.filter(criterion => {
    const keywords = criterion.toLowerCase().split(/\s+/);
    const outputLower = output.toLowerCase();
    return keywords.some(keyword => outputLower.includes(keyword));
  });

  return matchedCriteria.length / acceptanceCriteria.length;
}

export function isOpenCodeAvailable(config: Partial<OpenCodeConfig> = {}): boolean {
  try {
    const url = config.apiUrl || DEFAULT_CONFIG.apiUrl;
    return typeof window === 'undefined' && Boolean(url);
  } catch {
    return false;
  }
}