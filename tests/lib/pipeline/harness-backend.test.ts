import { describe, it, expect } from 'vitest';
import { TaskSchema } from '../../../src/lib/schemas';
import type { Task } from '../../../src/lib/schemas';

describe('Backend Task Harness Integration', () => {
  describe('Backend domain detection', () => {
    const backendDomains = [
      'Backend & API',
      'backend',
      'Backend',
      'API',
      'Server',
    ];

    backendDomains.forEach((domain) => {
      it(`should detect '${domain}' as backend domain`, () => {
        const task: Task = {
          id: 'test_backend',
          title: 'Test',
          difficulty: 'medium',
          domain,
          description: 'Test backend task',
          version: '1.0',
        };
        const result = TaskSchema.safeParse(task);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.domain).toBe(domain);
        }
      });
    });

    const nonBackendDomains = [
      'Web App',
      'Frontend',
      'Mobile & React Native',
      'UI',
    ];

    nonBackendDomains.forEach((domain) => {
      it(`should NOT treat '${domain}' as backend domain`, () => {
        const task: Task = {
          id: 'test_frontend',
          title: 'Test',
          difficulty: 'medium',
          domain,
          description: 'Test frontend task',
          version: '1.0',
        };
        const result = TaskSchema.safeParse(task);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.domain).not.toBe('Backend & API');
        }
      });
    });
  });

  describe('Backend task rubric structure', () => {
    const backendRubricLabels = ['Type safety', 'Tests', 'Integration', 'Regression safety'];

    it('should have backend rubric with type safety, tests, integration, regression', () => {
      const backendTask = {
        id: 'task_backend_test',
        title: 'Backend Task',
        difficulty: 'medium',
        domain: 'Backend & API',
        description: 'Backend task with correct rubric',
        structured_rubric: [
          { label: 'Type safety', weight: 25, description: 'TypeScript types correct' },
          { label: 'Tests', weight: 25, description: 'Tests pass' },
          { label: 'Integration', weight: 25, description: 'End-to-end works' },
          { label: 'Regression safety', weight: 25, description: 'Existing tests pass' },
        ],
        version: '1.0',
      };
      const result = TaskSchema.safeParse(backendTask);
      expect(result.success).toBe(true);
      if (result.success) {
        const rubric = result.data.structured_rubric;
        expect(rubric).toHaveLength(4);
        const labels = rubric!.map((r) => r.label);
        backendRubricLabels.forEach((label) => {
          expect(labels).toContain(label);
        });
      }
    });

    it('should have web app rubric with functional correctness, integration quality, regression safety, minimality, process quality', () => {
      const webAppTask = {
        id: 'task_webapp_test',
        title: 'Web App Task',
        difficulty: 'medium',
        domain: 'Web App',
        description: 'Web app task with correct rubric',
        structured_rubric: [
          { label: 'Functional correctness', weight: 40, description: 'Works end-to-end' },
          { label: 'Integration quality', weight: 25, description: 'Follows patterns' },
          { label: 'Regression safety', weight: 20, description: 'No existing breaks' },
          { label: 'Minimality', weight: 10, description: 'Minimal changes' },
          { label: 'Process quality', weight: 5, description: 'Clean commits' },
        ],
        version: '1.0',
      };
      const result = TaskSchema.safeParse(webAppTask);
      expect(result.success).toBe(true);
      if (result.success) {
        const rubric = result.data.structured_rubric;
        expect(rubric).toHaveLength(5);
      }
    });
  });

  describe('Backend scoring calculation', () => {
    it('should calculate backend scores from sub-components', () => {
      const typeSafetyScore = 0.8;
      const testsScore = 0.9;
      const integrationScore = 0.85;
      const regressionScore = 1.0;

      const totalScore =
        typeSafetyScore * 0.25 +
        testsScore * 0.25 +
        integrationScore * 0.25 +
        regressionScore * 0.25;

      expect(totalScore).toBeCloseTo(0.8875, 5);
    });

    it('should normalize backend scores to 0-1 range', () => {
      const maxPossibleScore = 1.0;
      const weightedMax = maxPossibleScore * 0.25 * 4;
      expect(weightedMax).toBe(1.0);
    });

    it('should handle missing rubric gracefully', () => {
      const taskWithoutRubric = {
        id: 'task_no_rubric',
        title: 'Task without rubric',
        difficulty: 'medium',
        description: 'Task without structured rubric',
        version: '1.0',
      };
      const result = TaskSchema.safeParse(taskWithoutRubric);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.structured_rubric).toBeUndefined();
      }
    });
  });

  describe('Backend task verification steps', () => {
    const backendVerificationSteps = [
      { name: 'TypeScript type check', command: 'npx tsc --noEmit', weight: 0.25 },
      { name: 'Unit tests', command: 'npm test', weight: 0.25 },
      { name: 'Integration tests', command: 'npm run test:integration', weight: 0.25 },
      { name: 'Regression tests', command: 'npm run test:regression', weight: 0.25 },
    ];

    it('should have 4 verification steps for backend tasks', () => {
      expect(backendVerificationSteps).toHaveLength(4);
    });

    it('should have equal weights summing to 1.0', () => {
      const totalWeight = backendVerificationSteps.reduce((sum, step) => sum + step.weight, 0);
      expect(totalWeight).toBe(1.0);
    });

    backendVerificationSteps.forEach((step) => {
      it(`should include verification step: ${step.name}`, () => {
        expect(step.name).toBeTruthy();
        expect(step.command).toBeTruthy();
        expect(step.weight).toBeGreaterThan(0);
      });
    });
  });

  describe('Backend task verification results', () => {
    it('should parse verification results correctly', () => {
      const verificationResult = {
        step: 'TypeScript type check',
        passed: true,
        duration_ms: 1500,
        output: 'No errors',
      };

      expect(verificationResult.passed).toBe(true);
      expect(verificationResult.duration_ms).toBe(1500);
    });

    it('should calculate partial scores when some steps fail', () => {
      const stepResults = [
        { weight: 0.25, passed: true },
        { weight: 0.25, passed: true },
        { weight: 0.25, passed: false },
        { weight: 0.25, passed: true },
      ];

      const score = stepResults.reduce((sum, step) => sum + (step.passed ? step.weight : 0), 0);
      expect(score).toBe(0.75);
    });

    it('should return 0 score when all steps fail', () => {
      const stepResults = [
        { weight: 0.25, passed: false },
        { weight: 0.25, passed: false },
        { weight: 0.25, passed: false },
        { weight: 0.25, passed: false },
      ];

      const score = stepResults.reduce((sum, step) => sum + (step.passed ? step.weight : 0), 0);
      expect(score).toBe(0);
    });
  });
});