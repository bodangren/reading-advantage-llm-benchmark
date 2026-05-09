import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const SNAPSHOTS_DIR = join(__dirname, '../../data/repo_snapshots/backend');

describe('Backend Repo Snapshots', () => {
  const snapshotDirs = [
    'node_express_prisma',
    'node_express_zod',
    'go_gin_sqlx',
    'python_flask_sqlalchemy',
    'nextjs_trpc',
  ];

  const expectedFields = ['id', 'name', 'language', 'framework', 'description', 'task_id', 'baseline_files'];

  it('should have snapshot directories for all 5 backend tasks', () => {
    snapshotDirs.forEach((dir) => {
      const snapshotPath = join(SNAPSHOTS_DIR, dir, 'snapshot.json');
      expect(existsSync(snapshotPath), `Snapshot exists for ${dir}`).toBe(true);
    });
  });

  it('should validate snapshot structure for all snapshots', () => {
    snapshotDirs.forEach((dir) => {
      const snapshotPath = join(SNAPSHOTS_DIR, dir, 'snapshot.json');
      const content = readFileSync(snapshotPath, 'utf-8');
      const snapshot = JSON.parse(content);

      expectedFields.forEach((field) => {
        expect(snapshot, `${dir}: has ${field}`).toHaveProperty(field);
      });
    });
  });

  it('should have valid language and framework values', () => {
    const validLanguages = ['typescript', 'go', 'python'];
    const validFrameworks = ['node', 'go', 'python', 'nextjs'];

    snapshotDirs.forEach((dir) => {
      const snapshotPath = join(SNAPSHOTS_DIR, dir, 'snapshot.json');
      const content = readFileSync(snapshotPath, 'utf-8');
      const snapshot = JSON.parse(content);

      expect(validLanguages, `${dir}: valid language`).toContain(snapshot.language);
      expect(validFrameworks, `${dir}: valid framework`).toContain(snapshot.framework);
    });
  });

  it('should have baseline_files with required paths', () => {
    snapshotDirs.forEach((dir) => {
      const snapshotPath = join(SNAPSHOTS_DIR, dir, 'snapshot.json');
      const content = readFileSync(snapshotPath, 'utf-8');
      const snapshot = JSON.parse(content);

      expect(Object.keys(snapshot.baseline_files).length, `${dir}: has baseline files`).toBeGreaterThan(0);

      Object.entries(snapshot.baseline_files).forEach(([filePath, content]) => {
        expect(typeof filePath, `${dir}: file path is string`).toBe('string');
        expect(typeof content, `${dir}: file content is string`).toBe('string');
        expect(filePath.split('/').length, `${dir}: ${filePath} has path depth >= 2`).toBeGreaterThanOrEqual(2);
      });
    });
  });

  it('should have test_command and build_command defined', () => {
    snapshotDirs.forEach((dir) => {
      const snapshotPath = join(SNAPSHOTS_DIR, dir, 'snapshot.json');
      const content = readFileSync(snapshotPath, 'utf-8');
      const snapshot = JSON.parse(content);

      expect(snapshot.test_command, `${dir}: has test_command`).toBeDefined();
      expect(snapshot.build_command, `${dir}: has build_command`).toBeDefined();
      expect(snapshot.test_command.length, `${dir}: test_command not empty`).toBeGreaterThan(0);
      expect(snapshot.build_command.length, `${dir}: build_command not empty`).toBeGreaterThan(0);
    });
  });

  it('should map to valid task_id in tasks.json', () => {
    const tasksPath = join(__dirname, '../../data/tasks/tasks.json');
    const tasksContent = readFileSync(tasksPath, 'utf-8');
    const tasks = JSON.parse(tasksContent);
    const taskIds = tasks.map((t: { id: string }) => t.id);

    snapshotDirs.forEach((dir) => {
      const snapshotPath = join(SNAPSHOTS_DIR, dir, 'snapshot.json');
      const content = readFileSync(snapshotPath, 'utf-8');
      const snapshot = JSON.parse(content);

      expect(taskIds, `${dir}: maps to valid task_id`).toContain(snapshot.task_id);
    });
  });

  it('should have unique snapshot IDs', () => {
    const ids = snapshotDirs.map((dir) => {
      const snapshotPath = join(SNAPSHOTS_DIR, dir, 'snapshot.json');
      const content = readFileSync(snapshotPath, 'utf-8');
      const snapshot = JSON.parse(content);
      return snapshot.id;
    });

    const uniqueIds = new Set(ids);
    expect(uniqueIds.size, 'all snapshot IDs are unique').toBe(ids.length);
  });

  it('should have description for each snapshot', () => {
    snapshotDirs.forEach((dir) => {
      const snapshotPath = join(SNAPSHOTS_DIR, dir, 'snapshot.json');
      const content = readFileSync(snapshotPath, 'utf-8');
      const snapshot = JSON.parse(content);

      expect(snapshot.description.length, `${dir}: description not empty`).toBeGreaterThan(10);
    });
  });

  it('should include existing_structure with file listing', () => {
    snapshotDirs.forEach((dir) => {
      const snapshotPath = join(SNAPSHOTS_DIR, dir, 'snapshot.json');
      const content = readFileSync(snapshotPath, 'utf-8');
      const snapshot = JSON.parse(content);

      expect(snapshot.existing_structure, `${dir}: has existing_structure`).toBeDefined();
      expect(Object.keys(snapshot.existing_structure).length, `${dir}: existing_structure not empty`).toBeGreaterThan(0);
    });
  });
});