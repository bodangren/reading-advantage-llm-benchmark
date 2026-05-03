import { describe, it, expect, vi } from 'vitest';
import { OpenAIClient } from '@/lib/llm-client';

describe('OpenAIClient', () => {
  const mockApiKey = 'test-api-key';
  const mockModel = 'gpt-4';

  describe('constructor', () => {
    it('should create client with required options', () => {
      const client = new OpenAIClient({
        apiKey: mockApiKey,
        model: mockModel,
      });
      expect(client).toBeDefined();
    });

    it('should use default base URL when not provided', () => {
      const client = new OpenAIClient({
        apiKey: mockApiKey,
        model: mockModel,
      });
      expect(client).toBeDefined();
    });

    it('should accept custom base URL', () => {
      const client = new OpenAIClient({
        apiKey: mockApiKey,
        model: mockModel,
        baseUrl: 'https://custom.api.endpoint/v1',
      });
      expect(client).toBeDefined();
    });
  });

  describe('complete', () => {
    it('should make a successful API call and return response text', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Generated task JSON here' } }],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const client = new OpenAIClient({
        apiKey: mockApiKey,
        model: mockModel,
      });

      const result = await client.complete('Generate a task');
      expect(result).toBe('Generated task JSON here');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should throw error for 401 unauthorized', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: () => Promise.resolve('Unauthorized'),
        json: () => Promise.resolve({ error: { message: 'Invalid API key' } }),
        headers: new Headers(),
      } as unknown as Response);

      const client = new OpenAIClient({
        apiKey: 'invalid-key',
        model: mockModel,
      });

      await expect(client.complete('test prompt')).rejects.toThrow('API authentication failed');
    });

    it('should retry on 429 rate limit and eventually succeed', async () => {
      let attempts = 0;
      global.fetch = vi.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          return Promise.resolve({
            ok: false,
            status: 429,
            headers: new Headers({ 'Retry-After': '1' }),
            text: () => Promise.resolve('Rate limited'),
          } as unknown as Response);
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ choices: [{ message: { content: 'success' } }] }),
        } as Response);
      });

      const client = new OpenAIClient({
        apiKey: mockApiKey,
        model: mockModel,
        maxRetries: 3,
      });

      const result = await client.complete('test');
      expect(result).toBe('success');
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it('should throw after max retries on persistent 429', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        headers: new Headers({ 'Retry-After': '1' }),
        text: () => Promise.resolve('Rate limited'),
      } as unknown as Response);

      const client = new OpenAIClient({
        apiKey: mockApiKey,
        model: mockModel,
        maxRetries: 3,
      });

      await expect(client.complete('test')).rejects.toThrow('Rate limit exceeded');
      expect(fetch).toHaveBeenCalledTimes(4);
    });

    it('should throw error for 5xx server errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('Server error'),
        headers: new Headers(),
      } as unknown as Response);

      const client = new OpenAIClient({
        apiKey: mockApiKey,
        model: mockModel,
        maxRetries: 1,
      });

      await expect(client.complete('test')).rejects.toThrow('API server error');
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('should throw error for network failures', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const client = new OpenAIClient({
        apiKey: mockApiKey,
        model: mockModel,
      });

      await expect(client.complete('test')).rejects.toThrow('Network error');
    });
  });
});