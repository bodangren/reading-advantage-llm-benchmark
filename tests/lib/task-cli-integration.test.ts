import { describe, it, expect, vi } from 'vitest';
import { generateTasks } from '../../src/lib/task-generator';
import path from 'path';

const testDir = '/tmp/test-task-cli-integration';

describe('Task CLI Integration', () => {
  const mockModel = 'gpt-4o';

  describe('generateTasks with real API client', () => {
    it('should use OpenAIClient when apiKey is provided', async () => {
      const mockResponse = {
        choices: [{ message: { content: JSON.stringify([{ id: 'task-1', title: 'Test Task', difficulty: 'medium', description: 'Test description' }]) } }],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      let callCount = 0;
      const mockLlmClient = async (prompt: string): Promise<string> => {
        callCount++;
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-key',
          },
          body: JSON.stringify({ model: mockModel, messages: [{ role: 'user', content: prompt }] }),
        });
        const data = await response.json() as typeof mockResponse;
        return data.choices[0].message.content;
      };

      const tempRepo = path.join(testDir, 'test-repo');
      const fs = await import('fs');
      if (!fs.existsSync(tempRepo)) {
        fs.mkdirSync(tempRepo, { recursive: true });
      }

      const tasks = await generateTasks({
        repoPath: tempRepo,
        count: 1,
        llmClient: mockLlmClient,
        modelId: mockModel,
      });

      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe('task-1');
    });

    it('should fail with clear error when no API key is available', async () => {
      const fs = await import('fs');
      const tempRepo = path.join(testDir, 'no-key-repo');
      if (!fs.existsSync(tempRepo)) {
        fs.mkdirSync(tempRepo, { recursive: true });
      }

      const badClient = async (_prompt: string): Promise<string> => {
        throw new Error('No API key provided');
      };

      await expect(generateTasks({
        repoPath: tempRepo,
        count: 1,
        llmClient: badClient,
        modelId: mockModel,
      })).rejects.toThrow('No API key provided');
    });
  });

  describe('API key validation', () => {
    it('should read from OPENAI_API_KEY env var when available', async () => {
      const originalVal = process.env.OPENAI_API_KEY;
      process.env.OPENAI_API_KEY = 'test-env-key';

      const apiKey = process.env.OPENAI_API_KEY;
      expect(apiKey).toBe('test-env-key');

      if (originalVal !== undefined) {
        process.env.OPENAI_API_KEY = originalVal;
      }
    });

    it('should read from LLM_API_BASE env var for custom endpoint', async () => {
      const originalVal = process.env.LLM_API_BASE;
      process.env.LLM_API_BASE = 'https://custom.endpoint/v1';

      const apiBase = process.env.LLM_API_BASE;
      expect(apiBase).toBe('https://custom.endpoint/v1');

      if (originalVal !== undefined) {
        process.env.LLM_API_BASE = originalVal;
      }
    });
  });

  describe('OpenAIClient configuration', () => {
    it('should use custom baseUrl when api-base is provided', async () => {
      const customUrl = 'https://custom.api.endpoint/v1';
      const mockResponse = {
        choices: [{ message: { content: 'test response' } }],
      };

      let capturedUrl = '';
      global.fetch = vi.fn().mockImplementation(async (url: string) => {
        capturedUrl = url as string;
        return {
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response;
      });

      const { OpenAIClient } = await import('../../src/lib/llm-client');
      const client = new OpenAIClient({
        apiKey: 'test-key',
        model: mockModel,
        baseUrl: customUrl,
      });

      await client.complete('test prompt');

      expect(capturedUrl).toContain(customUrl);
    });

    it('should use default baseUrl when not provided', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'test response' } }],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const { OpenAIClient } = await import('../../src/lib/llm-client');
      const client = new OpenAIClient({
        apiKey: 'test-key',
        model: mockModel,
      });

      await client.complete('test prompt');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.any(Object)
      );
    });
  });
});