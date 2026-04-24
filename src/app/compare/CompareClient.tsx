'use client';

import { useState, useMemo } from 'react';
import { LeaderboardEntry } from '@/lib/schemas';
import { SummaryTable } from '@/components/SummaryTable';
import { TaskDiffView } from '@/components/TaskDiffView';
import { StrengthsWeaknessesSection } from '@/components/StrengthsWeaknessesSection';

interface ModelResult {
  model: string;
  provider?: string;
  normalizedScore: number;
  rawScore: number;
  taskResults: {
    taskId: string;
    taskTitle: string;
    domain?: string;
    normalizedScore: number;
    rawScore: number;
    winner: boolean;
    delta: number;
  }[];
}

interface ComparisonReport {
  id: string;
  generatedAt: string;
  datasetVersion?: string;
  taskSet: string[];
  models: ModelResult[];
  aggregateScores: {
    model: string;
    normalizedScore: number;
    rank: number;
  }[];
  strengthsWeaknesses?: {
    model: string;
    strengths: { category: string; avgScore: number; taskCount: number }[];
    weaknesses: { category: string; avgScore: number; taskCount: number }[];
  }[];
}

interface CompareClientProps {
  leaderboardEntries: LeaderboardEntry[];
  availableTasks: { id: string; title: string; domain?: string }[];
}

export function CompareClient({ leaderboardEntries, availableTasks }: CompareClientProps) {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const models = useMemo(() => {
    const uniqueModels = new Map<string, { model: string; provider?: string }>();
    for (const entry of leaderboardEntries) {
      if (!uniqueModels.has(entry.model)) {
        uniqueModels.set(entry.model, { model: entry.model, provider: entry.provider });
      }
    }
    return Array.from(uniqueModels.values());
  }, [leaderboardEntries]);

  const toggleModel = (model: string) => {
    setSelectedModels(prev => 
      prev.includes(model) 
        ? prev.filter(m => m !== model)
        : prev.length < 5 ? [...prev, model] : prev
    );
  };

  const report: ComparisonReport | null = useMemo(() => {
    if (selectedModels.length < 2) return null;

    const modelResults: ModelResult[] = selectedModels.map(model => {
      const entries = leaderboardEntries.filter(e => e.model === model);
      const avgScore = entries.length > 0 
        ? entries.reduce((sum, e) => sum + e.score, 0) / entries.length 
        : 50;

      const taskResults = availableTasks.map(t => ({
        taskId: t.id,
        taskTitle: t.title,
        domain: t.domain,
        normalizedScore: avgScore,
        rawScore: avgScore,
        winner: false,
        delta: 0,
      }));

      return {
        model,
        provider: entries[0]?.provider,
        normalizedScore: avgScore,
        rawScore: avgScore,
        taskResults,
      };
    });

    const maxScore = Math.max(...modelResults.map(m => m.normalizedScore));
    modelResults.forEach(mr => {
      mr.taskResults.forEach(tr => {
        tr.winner = mr.normalizedScore === maxScore;
        tr.delta = mr.normalizedScore - maxScore;
        tr.normalizedScore = mr.normalizedScore;
        tr.rawScore = mr.normalizedScore;
      });
    });

    const sortedByScore = [...modelResults].sort((a, b) => b.normalizedScore - a.normalizedScore);
    const aggregateScores = sortedByScore.map((mr, idx) => ({
      model: mr.model,
      normalizedScore: mr.normalizedScore,
      rank: idx + 1,
    }));

    return {
      id: 'comparison-report',
      generatedAt: new Date().toISOString(),
      taskSet: availableTasks.map(t => t.id),
      models: modelResults,
      aggregateScores,
    };
  }, [selectedModels, leaderboardEntries, availableTasks]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Select Models (2-5)</h3>
          <div className="space-y-2">
            {models.map(m => (
              <label key={m.model} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedModels.includes(m.model)}
                  onChange={() => toggleModel(m.model)}
                  disabled={!selectedModels.includes(m.model) && selectedModels.length >= 5}
                  className="rounded"
                />
                <span>{m.model}</span>
                {m.provider && <span className="text-muted-foreground text-sm">({m.provider})</span>}
              </label>
            ))}
          </div>
        </div>

        
      </div>

      {report && (
        <div className="space-y-8">
          <SummaryTable aggregateScores={report.aggregateScores} />
          <TaskDiffView models={report.models} />
          <StrengthsWeaknessesSection models={report.models} />
        </div>
      )}
    </div>
  );
}