export interface TaskResultInput {
  taskId: string;
  domain?: string;
  normalizedScore: number;
  rawScore: number;
}

export interface CategoryScore {
  category: string;
  avgScore: number;
  taskCount: number;
}

export interface StrengthsWeaknessesResult {
  model: string;
  strengths: CategoryScore[];
  weaknesses: CategoryScore[];
}

export function analyzeStrengthsWeaknesses(
  taskResults: TaskResultInput[],
  model: string
): StrengthsWeaknessesResult {
  const categoryMap = new Map<string, { total: number; count: number }>();
  
  for (const task of taskResults) {
    const category = task.domain || 'uncategorized';
    const existing = categoryMap.get(category) || { total: 0, count: 0 };
    existing.total += task.normalizedScore;
    existing.count += 1;
    categoryMap.set(category, existing);
  }
  
  const categories: CategoryScore[] = [];
  for (const [category, data] of categoryMap) {
    categories.push({
      category,
      avgScore: data.total / data.count,
      taskCount: data.count,
    });
  }
  
  const sorted = [...categories].sort((a, b) => b.avgScore - a.avgScore);
  const midpoint = Math.floor(sorted.length / 2);
  
  const strengths = sorted.slice(0, midpoint).map(c => ({
    category: c.category,
    avgScore: Math.round(c.avgScore * 100) / 100,
    taskCount: c.taskCount,
  }));
  
  const weaknesses = [...sorted]
    .slice(midpoint)
    .reverse()
    .map(c => ({
      category: c.category,
      avgScore: Math.round(c.avgScore * 100) / 100,
      taskCount: c.taskCount,
    }));
  
  return { model, strengths, weaknesses };
}