"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RunScores } from "@/lib/schemas";

interface ScoreBreakdownProps {
  scores: RunScores;
  totalScore: number;
}

const SCORE_LABELS: Record<keyof RunScores, { label: string; max: number }> = {
  functional_correctness: { label: "Functional Correctness", max: 40 },
  integration_quality: { label: "Integration Quality", max: 25 },
  regression_safety: { label: "Regression Safety", max: 20 },
  minimality: { label: "Minimality", max: 10 },
  process_quality: { label: "Process Quality", max: 5 },
};

export function ScoreBreakdown({ scores, totalScore }: ScoreBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Overall Score</span>
          <span className="text-3xl font-bold">{(totalScore * 100).toFixed(1)}%</span>
        </div>

        <div className="space-y-4">
          {(Object.keys(SCORE_LABELS) as Array<keyof RunScores>).map((key) => {
            const { label, max } = SCORE_LABELS[key];
            const value = scores[key];
            const percentage = (value / max) * 100;

            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono font-medium">
                    {value}/{max}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}