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

interface TaskDiffViewProps {
  models: ModelResult[];
}

export function TaskDiffView({ models }: TaskDiffViewProps) {
  if (models.length === 0) return null;

  const taskIds = models[0].taskResults.map(t => t.taskId);

  return (
    <div className="border rounded-lg overflow-hidden">
      <h3 className="font-semibold p-4 bg-muted">Per-Task Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Task</th>
              {models.map(m => (
                <th key={m.model} className="text-right p-3">{m.model}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {taskIds.map(taskId => {
              return (
                <tr key={taskId} className="border-b">
                  <td className="p-3">
                    <div className="font-medium">{models[0].taskResults.find(t => t.taskId === taskId)?.taskTitle}</div>
                    {models[0].taskResults.find(t => t.taskId === taskId)?.domain && (
                      <div className="text-sm text-muted-foreground">
                        {models[0].taskResults.find(t => t.taskId === taskId)?.domain}
                      </div>
                    )}
                  </td>
                  {models.map((m, idx) => {
                    const t = m.taskResults.find(tr => tr.taskId === taskId)!;
                    return (
                      <td key={idx} className="p-3 text-right">
                        <span className={t.winner ? 'font-bold text-green-600' : ''}>
                          {t.normalizedScore.toFixed(1)}
                        </span>
                        {t.winner && t.delta !== 0 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({t.delta > 0 ? '+' : ''}{t.delta.toFixed(1)})
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}