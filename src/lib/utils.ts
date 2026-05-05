import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { LeaderboardEntry } from './schemas'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function filterByTrack(entries: LeaderboardEntry[], track: 'fixed' | 'native'): LeaderboardEntry[] {
  return entries
    .filter((entry) => entry.track === track)
    .sort((a, b) => b.score - a.score);
}

export function normalizeScore(score: number): number {
  return score <= 1 ? score * 100 : score;
}

export type RepoType = 'web' | 'react-native';

export interface RepoDetectionResult {
  repoType: RepoType;
  packageJson: Record<string, unknown> | null;
  buildCommands: string[];
  mobileEnvVars: Record<string, string>;
}

export function detectRepoType(packageJsonContent: string | null): RepoDetectionResult {
  const defaultResult: RepoDetectionResult = {
    repoType: 'web',
    packageJson: null,
    buildCommands: [],
    mobileEnvVars: {},
  };

  if (!packageJsonContent) {
    return defaultResult;
  }

  try {
    const pkg = JSON.parse(packageJsonContent);
    const dependencies = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

    if (dependencies['react-native']) {
      const mobileEnvVars: Record<string, string> = {
        REACT_NATIVE_VERSION: dependencies['react-native'] as string,
      };

      const buildCommands: string[] = [];
      if (pkg.scripts?.ios) buildCommands.push('npm run ios');
      if (pkg.scripts?.android) buildCommands.push('npm run android');
      if (pkg.scripts?.['build:ios']) buildCommands.push('npm run build:ios');
      if (pkg.scripts?.['build:android']) buildCommands.push('npm run build:android');

      return {
        repoType: 'react-native',
        packageJson: pkg,
        buildCommands,
        mobileEnvVars,
      };
    }

    return defaultResult;
  } catch {
    return defaultResult;
  }
}
