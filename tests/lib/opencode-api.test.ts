import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runOpenCodeEvaluation, evaluateWithOpenCode, OpenCodeConfig, DEFAULT_CONFIG } from '../../src/lib/opencode-api';

interface MockFetchResponse {
  ok: boolean;
  status?: number;
  statusText?: string;
  json: () => Promise<unknown>;
}

function createMockFetch(response: MockFetchResponse) {
  return vi.fn().mockResolvedValue(response) as unknown as typeof fetch;
}

describe('OpenCode API', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('runOpenCodeEvaluation', () => {
    it('should call the correct endpoint with proper payload', async () => {
      const mockResponse = {
        id: 'run-123',
        model: 'test-model',
        output: 'Test output',
        duration_ms: 1000,
      };

      global.fetch = createMockFetch({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await runOpenCodeEvaluation('test prompt', 'test-model');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/run'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            model: 'test-model',
            prompt: 'test prompt',
            temperature: 0.0,
            max_tokens: 2048,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should include auth header when apiKey is provided', async () => {
      process.env.OPENCODE_API_KEY = 'test-api-key';

      global.fetch = createMockFetch({
        ok: true,
        json: () => Promise.resolve({ id: 'run-123', model: 'test', output: '' }),
      });

      await runOpenCodeEvaluation('test', 'test-model', { apiKey: 'test-api-key' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
        })
      );
    });

    it('should throw on HTTP error', async () => {
      global.fetch = createMockFetch({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({}),
      });

      await expect(runOpenCodeEvaluation('test', 'test-model')).rejects.toThrow(
        'HTTP 500: Internal Server Error'
      );
    });

    it('should handle fetch errors gracefully', async () => {
      global.fetch = createMockFetch({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({}),
      });

      await expect(runOpenCodeEvaluation('test', 'test-model')).rejects.toThrow('HTTP 400: Bad Request');
    });

    it('should use custom config values', async () => {
      global.fetch = createMockFetch({
        ok: true,
        json: () => Promise.resolve({ id: 'run-123', model: 'test', output: '' }),
      });

      const customConfig: Partial<OpenCodeConfig> = {
        apiUrl: 'http://custom:8080',
        timeout: 60000,
        maxRetries: 5,
        retryDelay: 2000,
      };

      await runOpenCodeEvaluation('test', 'test-model', customConfig);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('http://custom:8080'),
        expect.any(Object)
      );
    });
  });

  describe('evaluateWithOpenCode', () => {
    it('should return a Run object on success', async () => {
      const mockResponse = {
        id: 'run-456',
        model: 'test-model',
        output: 'This is a test output with some content',
        duration_ms: 2000,
      };

      global.fetch = createMockFetch({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const task = {
        id: 'task-1',
        prompt: 'Write something',
        acceptance_criteria: ['test', 'content'],
      };

      const run = await evaluateWithOpenCode(task, 'test-model');

      expect(run).toMatchObject({
        id: 'run-456',
        model: 'test-model',
        harness: 'opencode',
        benchmark_version: '1.0.0',
      });
      expect(typeof run.score).toBe('number');
    });

    it('should throw when max retries exceeded', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Connection refused')) as typeof fetch;

      const task = { id: 'task-1', prompt: 'test' };

      await expect(evaluateWithOpenCode(task, 'test-model', { maxRetries: 0 })).rejects.toThrow(
        'Connection refused'
      );
    });
  });

  describe('DEFAULT_CONFIG', () => {
    it('should have sensible defaults', () => {
      expect(DEFAULT_CONFIG.apiUrl).toBe('http://127.0.0.1:9090');
      expect(DEFAULT_CONFIG.timeout).toBe(300000);
      expect(DEFAULT_CONFIG.maxRetries).toBe(3);
      expect(DEFAULT_CONFIG.retryDelay).toBe(1000);
    });
  });
});