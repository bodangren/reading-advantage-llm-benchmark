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
