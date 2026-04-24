interface AggregateScore {
  model: string;
  normalizedScore: number;
  rank: number;
}

interface SummaryTableProps {
  aggregateScores: AggregateScore[];
}

export function SummaryTable({ aggregateScores }: SummaryTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <h3 className="font-semibold p-4 bg-muted">Summary</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Rank</th>
            <th className="text-left p-3">Model</th>
            <th className="text-right p-3">Score</th>
          </tr>
        </thead>
        <tbody>
          {aggregateScores.map((score) => (
            <tr key={score.model} className="border-b">
              <td className="p-3">{score.rank}</td>
              <td className="p-3 font-medium">{score.model}</td>
              <td className="p-3 text-right">{score.normalizedScore.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}