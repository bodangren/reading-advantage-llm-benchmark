import { describe, it, expect } from 'vitest';
import { detectRepoType, RepoDetectionResult } from '../../src/lib/utils';

describe('Repo Detection', () => {
  describe('detectRepoType', () => {
    it('should detect React Native project by react-native dependency', () => {
      const packageJson = JSON.stringify({
        name: 'my-react-native-app',
        dependencies: {
          'react-native': '^0.76.0',
          'react': '^18.2.0',
        },
        scripts: {
          ios: 'react-native run-ios',
          android: 'react-native run-android',
        },
      });

      const result = detectRepoType(packageJson);
      expect(result.repoType).toBe('react-native');
      expect(result.packageJson).not.toBeNull();
      expect(result.buildCommands).toContain('npm run ios');
      expect(result.buildCommands).toContain('npm run android');
      expect(result.mobileEnvVars.REACT_NATIVE_VERSION).toBe('^0.76.0');
    });

    it('should detect React Native with scoped metro bundler', () => {
      const packageJson = JSON.stringify({
        name: 'rn-app',
        dependencies: {
          'react-native': '0.75.2',
        },
        scripts: {
          start: 'react-native start',
          'build:ios': 'xcodebuild -workspace',
        },
      });

      const result = detectRepoType(packageJson);
      expect(result.repoType).toBe('react-native');
      expect(result.buildCommands).toContain('npm run build:ios');
    });

    it('should return web type for non-mobile project', () => {
      const packageJson = JSON.stringify({
        name: 'my-nextjs-app',
        dependencies: {
          next: '^14.0.0',
          react: '^18.2.0',
        },
      });

      const result = detectRepoType(packageJson);
      expect(result.repoType).toBe('web');
      expect(result.buildCommands).toHaveLength(0);
      expect(result.mobileEnvVars).toEqual({});
    });

    it('should return web type for empty package.json', () => {
      const packageJson = JSON.stringify({
        name: 'empty-project',
      });

      const result = detectRepoType(packageJson);
      expect(result.repoType).toBe('web');
    });

    it('should return web type for null input', () => {
      const result = detectRepoType(null);
      expect(result.repoType).toBe('web');
      expect(result.packageJson).toBeNull();
    });

    it('should return web type for invalid JSON', () => {
      const result = detectRepoType('not valid json');
      expect(result.repoType).toBe('web');
      expect(result.packageJson).toBeNull();
    });

    it('should return web type for empty string', () => {
      const result = detectRepoType('');
      expect(result.repoType).toBe('web');
    });

    it('should handle React Native in devDependencies only', () => {
      const packageJson = JSON.stringify({
        name: 'rn-app-dev',
        dependencies: {
          react: '^18.2.0',
        },
        devDependencies: {
          'react-native': '0.76.0',
        },
      });

      const result = detectRepoType(packageJson);
      expect(result.repoType).toBe('react-native');
      expect(result.mobileEnvVars.REACT_NATIVE_VERSION).toBe('0.76.0');
    });

    it('should not detect as React Native when only react is present', () => {
      const packageJson = JSON.stringify({
        name: 'react-only-app',
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
        },
      });

      const result = detectRepoType(packageJson);
      expect(result.repoType).toBe('web');
    });

    it('should capture build commands from scripts', () => {
      const packageJson = JSON.stringify({
        name: 'full-rn-app',
        dependencies: {
          'react-native': '^0.76.0',
        },
        scripts: {
          start: 'react-native start',
          ios: 'react-native run-ios',
          android: 'react-native run-android',
          'build:android': 'cd android && ./gradlew assembleRelease',
        },
      });

      const result = detectRepoType(packageJson);
      expect(result.buildCommands).toContain('npm run ios');
      expect(result.buildCommands).toContain('npm run android');
      expect(result.buildCommands).toContain('npm run build:android');
      expect(result.buildCommands).toHaveLength(3);
    });
  });
});