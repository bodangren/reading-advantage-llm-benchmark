'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartDataPoint, ScoreType, getScoreTypeLabel, RegressionAlert, groupRegressionsByModel, exportTrendDataToCSV } from '@/lib/analytics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AnalyticsClientProps {
  chartData: Record<string, ChartDataPoint[]>;
  scoreType: ScoreType;
  onScoreTypeChange: (type: ScoreType) => void;
  regressionAlerts: RegressionAlert[];
}

export function AnalyticsClient({
  chartData,
  scoreType,
  onScoreTypeChange,
  regressionAlerts,
}: AnalyticsClientProps) {
  const [selectedModels, setSelectedModels] = useState<string[]>(Object.keys(chartData));
  const [showMovingAvg, setShowMovingAvg] = useState(true);

  const scoreTypes: ScoreType[] = ['overall', 'correctness', 'safety'];

  const chartDataWithPeriods = useMemo(() => {
    const allPeriods = new Set<string>();
    for (const model of selectedModels) {
      const data = chartData[model] || [];
      data.forEach(d => allPeriods.add(d.period));
    }
    const sortedPeriods = Array.from(allPeriods).sort();
    return sortedPeriods.map(period => {
      const point: Record<string, string | number> = { period };
      for (const model of selectedModels) {
        const modelData = chartData[model] || [];
        const match = modelData.find(d => d.period === period);
        if (match) {
          point[model] = match.score;
          if (showMovingAvg && match.movingAvg != null) {
            point[`${model}_ma`] = match.movingAvg;
          }
        }
      }
      return point;
    });
  }, [chartData, selectedModels, showMovingAvg]);

  const regressionsByModel = useMemo(() => groupRegressionsByModel(regressionAlerts), [regressionAlerts]);

  const toggleModel = (model: string) => {
    setSelectedModels(prev =>
      prev.includes(model)
        ? prev.filter(m => m !== model)
        : [...prev, model]
    );
  };

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {scoreTypes.map(type => (
            <button
              key={type}
              onClick={() => onScoreTypeChange(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                scoreType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {getScoreTypeLabel(type)}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showMovingAvg}
            onChange={e => setShowMovingAvg(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show moving average (3-period)</span>
        </label>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">Models</h3>
        <div className="flex flex-wrap gap-3">
          {Object.keys(chartData).map(model => (
            <label key={model} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedModels.includes(model)}
                onChange={() => toggleModel(model)}
                className="rounded"
              />
              <span>{model}</span>
              {regressionsByModel[model] && (
                <Badge variant="destructive" className="text-xs">
                  {regressionsByModel[model].length} regression{regressionsByModel[model].length > 1 ? 's' : ''}
                </Badge>
              )}
            </label>
          ))}
        </div>
      </div>

      {regressionAlerts.length > 0 && (
        <div className="border border-destructive rounded-lg p-4 bg-destructive/10">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>⚠️</span> Regression Alerts
          </h3>
          <div className="space-y-2">
            {regressionAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span>
                  <strong>{alert.model || 'Model'}</strong> dropped {alert.dropPercent.toFixed(1)}% 
                  (from {alert.previousScore.toFixed(1)} to {alert.currentScore.toFixed(1)}) 
                  in period <strong>{alert.period}</strong>
                </span>
                <Badge variant="destructive" className="text-xs">
                  -{alert.dropPercent.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">Score Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartDataWithPeriods}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <ReferenceLine y={50} stroke="#666" strokeDasharray="3 3" label="Baseline" />
              {selectedModels.map((model, idx) => (
                <Line
                  key={model}
                  type="monotone"
                  dataKey={model}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
              {showMovingAvg && selectedModels.map((model, idx) => (
                <Line
                  key={`${model}_ma`}
                  type="monotone"
                  dataKey={`${model}_ma`}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            const csv = exportTrendDataToCSV(chartData);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `benchmark-trends-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
}