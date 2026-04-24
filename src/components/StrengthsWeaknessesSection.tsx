interface TaskResult {
  taskId: string;
  taskTitle: string;
  domain?: string;
  normalizedScore: number;
  rawScore: number;
  winner: boolean;
  delta: number;
}

interface ModelResult {
  model: string;
  provider?: string;
  normalizedScore: number;
  rawScore: number;
  taskResults: TaskResult[];
}

interface StrengthsWeaknessesSectionProps {
  models: ModelResult[];
}

function analyzeModelStrengthsWeaknesses(taskResults: TaskResult[]) {
  const categoryMap = new Map<string, { total: number; count: number }>();
  
  for (const task of taskResults) {
    const category = task.domain || 'uncategorized';
    const existing = categoryMap.get(category) || { total: 0, count: 0 };
    existing.total += task.normalizedScore;
    existing.count += 1;
    categoryMap.set(category, existing);
  }
  
  const categories = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    avgScore: data.total / data.count,
    taskCount: data.count,
  }));
  
  const sorted = [...categories].sort((a, b) => b.avgScore - a.avgScore);
  const midpoint = Math.floor(sorted.length / 2);
  
  return {
    strengths: sorted.slice(0, midpoint),
    weaknesses: sorted.slice(midpoint).reverse(),
  };
}

export function StrengthsWeaknessesSection({ models }: StrengthsWeaknessesSectionProps) {
  if (models.length === 0) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      <h3 className="font-semibold p-4 bg-muted">Strengths & Weaknesses</h3>
      <div className="p-4 space-y-6">
        {models.map(m => {
          const { strengths, weaknesses } = analyzeModelStrengthsWeaknesses(m.taskResults);
          return (
            <div key={m.model} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">{m.model}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-green-600 mb-2">Strengths</h5>
                  {strengths.length > 0 ? (
                    <ul className="space-y-1">
                      {strengths.map(s => (
                        <li key={s.category} className="text-sm">
                          <span className="font-medium">{s.category}</span>
                          <span className="text-muted-foreground"> ({s.taskCount} tasks, avg {s.avgScore.toFixed(1)})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No category data available</p>
                  )}
                </div>
                <div>
                  <h5 className="text-sm font-medium text-red-600 mb-2">Weaknesses</h5>
                  {weaknesses.length > 0 ? (
                    <ul className="space-y-1">
                      {weaknesses.map(w => (
                        <li key={w.category} className="text-sm">
                          <span className="font-medium">{w.category}</span>
                          <span className="text-muted-foreground"> ({w.taskCount} tasks, avg {w.avgScore.toFixed(1)})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No category data available</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}