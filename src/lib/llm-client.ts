export interface LLMClientOptions {
  apiKey: string;
  model: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

interface ChatMessage {
  role: 'user';
  content: string;
}

interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
    type: string;
    code?: string;
  };
}

export class OpenAIClient {
  private apiKey: string;
  private model: string;
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;

  constructor(options: LLMClientOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model;
    this.baseUrl = options.baseUrl || 'https://api.openai.com/v1';
    this.timeout = options.timeout || 30000;
    this.maxRetries = options.maxRetries ?? 3;
  }

  async complete(prompt: string): Promise<string> {
    const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
    const request: ChatRequest = {
      model: this.model,
      messages,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await this.executeWithTimeout(request);
        return result;
      } catch (error) {
        lastError = error as Error;

        if (error instanceof APIError) {
          const isLastAttempt = attempt >= this.maxRetries;
          if (!isLastAttempt && error.status === 429) {
            const retryDelay = this.getRetryDelay(error.retryAfter);
            console.log(`Rate limited, retrying in ${retryDelay}ms...`);
            await this.sleep(retryDelay);
            continue;
          }
          if (!isLastAttempt && error.status >= 500) {
            const backoffDelay = this.getBackoffDelay(attempt);
            console.log(`Server error, retrying in ${backoffDelay}ms...`);
            await this.sleep(backoffDelay);
            continue;
          }
        }

        throw error;
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  private async executeWithTimeout(request: ChatRequest): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        const status = response.status;
        const statusText = response.statusText;
        const retryAfter = response.headers.get('Retry-After');

        if (status === 401) {
          throw new APIError('API authentication failed. Check your API key.', status, statusText, retryAfter);
        }
        if (status === 429) {
          throw new APIError('Rate limit exceeded. Please slow down requests.', status, statusText, retryAfter);
        }
        if (status >= 500) {
          throw new APIError(`API server error (${status}): ${statusText}`, status, statusText, retryAfter);
        }
        throw new APIError(`API request failed (${status}): ${statusText} - ${errorBody}`, status, statusText, retryAfter);
      }

      const data = await response.json() as ChatResponse;

      if (data.error) {
        throw new Error(`API error: ${data.error.message}`);
      }

      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response content from API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }

      throw error;
    }
  }

  private getRetryDelay(retryAfter: string | null): number {
    if (retryAfter) {
      const delay = parseInt(retryAfter, 10) * 1000;
      if (!isNaN(delay) && delay > 0) {
        return delay;
      }
    }
    return 1000;
  }

  private getBackoffDelay(attempt: number): number {
    const baseDelay = 1000;
    const maxDelay = 4000;
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    const jitter = Math.random() * 500;
    return Math.floor(delay + jitter);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class APIError extends Error {
  status: number;
  statusText: string;
  retryAfter: string | null;

  constructor(message: string, status: number, statusText: string, retryAfter: string | null) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.retryAfter = retryAfter;
  }
}

export function createLLMClient(options: LLMClientOptions): OpenAIClient {
  return new OpenAIClient(options);
}