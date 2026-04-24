import { NormalizedScore } from './schemas';

export function normalizeScore(score: number): NormalizedScore {
  if (score >= 0 && score <= 1) {
    return {
      raw: score,
      normalized: Math.round(score * 10000) / 100,
      scale: '0-1',
    };
  }
  return {
    raw: score,
    normalized: score,
    scale: '0-100',
  };
}

export function isScoreNormalized(score: number): boolean {
  return score < 0 || score > 1;
}