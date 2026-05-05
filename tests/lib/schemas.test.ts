import { describe, it, expect } from 'vitest';
import { TaskSchema, RunSchema, LeaderboardSchema, DatasetVersionSchema, RubricDimensionSchema, TrackConfigSchema, TaskFormDataSchema } from '../../src/lib/schemas';

describe('Zod Schemas', () => {
  describe('TaskSchema', () => {
    it('should validate a valid task', () => {
      const validTask = {
        id: 'task-1',
        title: 'Task 1',
        difficulty: 'easy',
        description: 'A test task',
        rubric: ['Pass if it works', 'Fails if it crashes'],
        version: '1.0.0',
      };
      const result = TaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should validate a task with full structured fields', () => {
      const validTask = {
        id: 'task-1',
        title: 'Task 1',
        difficulty: 'medium',
        domain: 'Web App',
        description: 'A test task',
        repo_context: 'Next.js project with App Router',
        acceptance_criteria: ['Criterion 1', 'Criterion 2'],
        structured_rubric: [
          { label: 'Functional correctness', weight: 40, description: 'Works end-to-end' },
          { label: 'Integration quality', weight: 25, description: 'Follows patterns' },
        ],
        rubric: ['Functional correctness (40)'],
        version: '1.0.0',
      };
      const result = TaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.domain).toBe('Web App');
        expect(result.data.repo_context).toBe('Next.js project with App Router');
        expect(result.data.acceptance_criteria).toHaveLength(2);
        expect(result.data.structured_rubric).toHaveLength(2);
        expect(result.data.structured_rubric![0].weight).toBe(40);
      }
    });

    it('should validate a task without optional fields', () => {
      const validTask = {
        id: 'task-1',
        title: 'Task 1',
        difficulty: 'easy',
        description: 'A test task',
        version: '1.0.0',
      };
      const result = TaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should fail if missing required fields', () => {
      const invalidTask = {
        id: 'task-1',
      };
      const result = TaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });
  });

  describe('RubricDimensionSchema', () => {
    it('should validate a valid rubric dimension', () => {
      const valid = { label: 'Functional correctness', weight: 40, description: 'Works correctly' };
      const result = RubricDimensionSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should fail if weight is not a number', () => {
      const invalid = { label: 'Test', weight: '40', description: 'Test' };
      const result = RubricDimensionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('RunSchema', () => {
    it('should validate a valid run', () => {
      const validRun = {
        id: 'run-1',
        model: 'gemini-pro',
        harness: 'opencode',
        benchmark_version: '1.0.0',
        score: 0.95,
      };
      const result = RunSchema.safeParse(validRun);
      expect(result.success).toBe(true);
    });

    it('should validate a run with dataset_version', () => {
      const validRun = {
        id: 'run-1',
        model: 'gemini-pro',
        harness: 'opencode',
        benchmark_version: '1.0.0',
        dataset_version: '2026-04-07',
        score: 0.95,
      };
      const result = RunSchema.safeParse(validRun);
      expect(result.success).toBe(true);
    });

    it('should fail if score is invalid', () => {
      const invalidRun = {
        id: 'run-1',
        model: 'gemini-pro',
        harness: 'opencode',
        benchmark_version: '1.0.0',
        score: 'not-a-number',
      };
      const result = RunSchema.safeParse(invalidRun);
      expect(result.success).toBe(false);
    });
  });

  describe('LeaderboardSchema', () => {
    it('should validate a valid leaderboard entry', () => {
      const validEntry = {
        model: 'gemini-pro',
        provider: 'Google',
        harness: 'opencode',
        score: 0.85,
        subscores: { functional: 10 },
        date: '2026-04-04'
      };
      const result = LeaderboardSchema.safeParse(validEntry);
      if (!result.success) console.log(result.error);
      expect(result.success).toBe(true);
    });
  });

  describe('DatasetVersionSchema', () => {
    it('should validate a valid dataset version', () => {
      const validDataset = {
        version: '2026-04-07',
        created_at: '2026-04-07T12:00:00Z',
        description: 'Initial dataset',
        tasks: ['task-1', 'task-2'],
      };
      const result = DatasetVersionSchema.safeParse(validDataset);
      expect(result.success).toBe(true);
    });

    it('should fail for invalid version format', () => {
      const invalidDataset = {
        version: '1.0.0',
        created_at: '2026-04-07T12:00:00Z',
        description: 'Invalid version format',
        tasks: ['task-1'],
      };
      const result = DatasetVersionSchema.safeParse(invalidDataset);
      expect(result.success).toBe(false);
    });

    it('should fail for missing required fields', () => {
      const invalidDataset = {
        version: '2026-04-07',
      };
      const result = DatasetVersionSchema.safeParse(invalidDataset);
      expect(result.success).toBe(false);
    });
  });

  describe('TrackConfigSchema', () => {
    it('should validate a fixed track type', () => {
      const fixedTrack = {
        track: 'fixed' as const,
        agentConfig: undefined,
      };
      const result = TrackConfigSchema.safeParse(fixedTrack);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.track).toBe('fixed');
        expect(result.data.agentConfig).toBeUndefined();
      }
    });

    it('should validate a native track type with agent config', () => {
      const nativeTrack = {
        track: 'native' as const,
        agentConfig: {
          agentType: 'opencode',
          systemPrompt: 'You are a helpful coding assistant.',
          toolAccess: ['filesystem', 'bash', 'websearch'],
        },
      };
      const result = TrackConfigSchema.safeParse(nativeTrack);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.track).toBe('native');
        expect(result.data.agentConfig).toBeDefined();
        expect(result.data.agentConfig!.agentType).toBe('opencode');
        expect(result.data.agentConfig!.toolAccess).toContain('filesystem');
      }
    });

    it('should reject invalid track type', () => {
      const invalidTrack = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        track: 'unknown' as any,
      };
      const result = TrackConfigSchema.safeParse(invalidTrack);
      expect(result.success).toBe(false);
    });

    it('should reject native track without agentConfig', () => {
      const invalidTrack = {
        track: 'native' as const,
        agentConfig: undefined,
      };
      const result = TrackConfigSchema.safeParse(invalidTrack);
      expect(result.success).toBe(false);
    });

    it('should validate agentConfig with all required fields', () => {
      const validAgentConfig = {
        track: 'native' as const,
        agentConfig: {
          agentType: 'claude-code',
          systemPrompt: 'You are an expert programmer.',
          toolAccess: ['filesystem', 'bash'],
        },
      };
      const result = TrackConfigSchema.safeParse(validAgentConfig);
      expect(result.success).toBe(true);
    });

    it('should reject agentConfig with unknown tool', () => {
      const invalidAgentConfig = {
        track: 'native' as const,
        agentConfig: {
          agentType: 'opencode',
          systemPrompt: 'Test',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          toolAccess: ['unknown_tool' as any],
        },
      };
      const result = TrackConfigSchema.safeParse(invalidAgentConfig);
      expect(result.success).toBe(false);
    });
  });

  describe('React Native Task Validation', () => {
    it('should validate a React Native task with mobile domain', () => {
      const rnTask = {
        id: 'task_react_native_module',
        title: 'Native Module Integration',
        difficulty: 'hard',
        domain: 'Mobile & React Native',
        description: 'Integrate a native iOS/Android module with React Native bridge',
        repo_context: 'React Native 0.76+ project with TypeScript',
        acceptance_criteria: [
          'Native module bridge is properly configured',
          'JavaScript can call native methods',
          'Permissions are declared in AndroidManifest.xml and Info.plist',
        ],
        structured_rubric: [
          { label: 'Functional correctness', weight: 35, description: 'Native methods callable from JS' },
          { label: 'Platform parity', weight: 20, description: 'Works on both iOS and Android' },
          { label: 'Permission handling', weight: 15, description: 'Permissions properly declared' },
          { label: 'Regression safety', weight: 20, description: 'No existing functionality broken' },
          { label: 'Minimality', weight: 10, description: 'No unnecessary native code' },
        ],
        version: '1.0',
        status: 'published',
      };
      const result = TaskSchema.safeParse(rnTask);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.domain).toBe('Mobile & React Native');
        expect(result.data.structured_rubric).toHaveLength(5);
        expect(result.data.structured_rubric![0].label).toBe('Functional correctness');
      }
    });

    it('should validate React Native task with navigation domain', () => {
      const navTask = {
        id: 'task_react_native_navigation',
        title: 'Navigation Refactor',
        difficulty: 'medium',
        domain: 'Mobile & React Native',
        description: 'Migrate from React Navigation v5 to v6 with typed routes',
        repo_context: 'React Native project with React Navigation',
        acceptance_criteria: [
          'Routes are properly typed',
          'Navigation state persists across app restart',
          'Deep linking works for both platforms',
        ],
        structured_rubric: [
          { label: 'Functional correctness', weight: 35, description: 'All navigation flows work' },
          { label: 'Type safety', weight: 25, description: 'Routes are fully typed' },
          { label: 'Deep linking', weight: 15, description: 'URLs open correct screens' },
          { label: 'Regression safety', weight: 15, description: 'Existing navigation not broken' },
          { label: 'Minimality', weight: 10, description: 'Minimal code changes' },
        ],
        version: '1.0',
        status: 'published',
      };
      const result = TaskSchema.safeParse(navTask);
      expect(result.success).toBe(true);
    });

    it('should validate React Native task with async storage domain', () => {
      const storageTask = {
        id: 'task_react_native_storage',
        title: 'Async Storage Migration',
        difficulty: 'medium',
        domain: 'Mobile & React Native',
        description: 'Migrate from AsyncStorage to @react-native-async-storage/async-storage',
        repo_context: 'React Native 0.72+ project',
        acceptance_criteria: [
          'All data migrations complete successfully',
          'Existing user data is preserved',
          'Storage quota is handled gracefully',
        ],
        structured_rubric: [
          { label: 'Functional correctness', weight: 30, description: 'Data persists correctly' },
          { label: 'Migration completeness', weight: 25, description: 'All data migrated, none lost' },
          { label: 'Error handling', weight: 20, description: 'Quota errors handled gracefully' },
          { label: 'Regression safety', weight: 15, description: 'Existing features unaffected' },
          { label: 'Minimality', weight: 10, description: 'Clean migration path' },
        ],
        version: '1.0',
        status: 'published',
      };
      const result = TaskSchema.safeParse(storageTask);
      expect(result.success).toBe(true);
    });

    it('should validate mobile-specific rubric dimensions', () => {
      const mobileRubric = {
        label: 'Platform parity',
        weight: 20,
        description: 'Feature works equivalently on iOS and Android',
      };
      const result = RubricDimensionSchema.safeParse(mobileRubric);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.label).toBe('Platform parity');
        expect(result.data.weight).toBe(20);
      }
    });

    it('should validate permission handling rubric dimension', () => {
      const permissionRubric = {
        label: 'Permission handling',
        weight: 15,
        description: 'Runtime permissions requested and handled properly',
      };
      const result = RubricDimensionSchema.safeParse(permissionRubric);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.label).toBe('Permission handling');
      }
    });

    it('should reject task with rubric weights not summing to 100', () => {
      const invalidTask = {
        id: 'task_invalid',
        title: 'Invalid Rubric Task',
        difficulty: 'medium',
        domain: 'Mobile & React Native',
        description: 'This task has rubric weights that do not sum to 100',
        structured_rubric: [
          { label: 'Functional correctness', weight: 30, description: 'Works' },
          { label: 'Integration quality', weight: 30, description: 'Follows patterns' },
        ],
        version: '1.0',
      };
      const result = TaskFormDataSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should validate task with rubric weights summing to 100', () => {
      const validTask = {
        id: 'task_valid_mobile',
        title: 'Valid Mobile Task',
        difficulty: 'easy',
        domain: 'Mobile & React Native',
        description: 'Valid mobile task with proper weights',
        repo_context: 'React Native project',
        acceptance_criteria: ['Criterion 1', 'Criterion 2'],
        structured_rubric: [
          { label: 'Functional correctness', weight: 40, description: 'Works' },
          { label: 'Platform parity', weight: 25, description: 'iOS and Android' },
          { label: 'Regression safety', weight: 20, description: 'No breaks' },
          { label: 'Minimality', weight: 15, description: 'Clean code' },
        ],
        version: '1.0',
      };
      const result = TaskFormDataSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });
  });
});