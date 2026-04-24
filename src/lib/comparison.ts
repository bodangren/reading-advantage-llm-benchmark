export interface ModelScoreInput {
  model: string;
  rawScore: number;
  normalizedScore: number;
}

export interface ComparedModel extends ModelScoreInput {
  taskId: string;
  winner: boolean;
  delta: number;
}

export function compareModels(results: ModelScoreInput[], taskId: string): ComparedModel[] {
  if (results.length === 0) return [];
  
  const maxScore = Math.max(...results.map(r => r.normalizedScore));
  const compared = results.map(r => ({
    ...r,
    taskId,
    winner: r.normalizedScore === maxScore && results.filter(x => x.normalizedScore === maxScore).length === 1,
    delta: r.normalizedScore - maxScore,
  }));
  
  return compared;
}

export interface RankedModel {
  model: string;
  normalizedScore: number;
  rank: number;
}

export function rankModels(scores: { model: string; normalizedScore: number }[]): RankedModel[] {
  if (scores.length === 0) return [];
  
  const sorted = [...scores].sort((a, b) => b.normalizedScore - a.normalizedScore);
  const ranked: RankedModel[] = [];
  
  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    let rank = i + 1;
    
    if (i > 0 && sorted[i - 1].normalizedScore === current.normalizedScore) {
      rank = ranked[i - 1].rank;
    }
    
    ranked.push({
      model: current.model,
      normalizedScore: current.normalizedScore,
      rank,
    });
  }
  
  return ranked;
}