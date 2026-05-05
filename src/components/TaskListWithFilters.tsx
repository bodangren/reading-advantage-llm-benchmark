"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/lib/schemas";
import { TaskCard } from "@/components/TaskCard";
import { Input } from "@/components/ui/input";

interface TaskListWithFiltersProps {
  tasks: Task[];
  runCounts: Record<string, number>;
}

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const STATUSES: TaskStatus[] = ["draft", "review", "published"];

export function TaskListWithFilters({ tasks, runCounts }: TaskListWithFiltersProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  const [status, setStatus] = useState<TaskStatus | null>(null);

  const domains = [...new Set(tasks.map(t => t.domain).filter(Boolean))] as string[];

  const filtered = tasks.filter(t => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = t.title.toLowerCase().includes(query);
      const matchesDescription = t.description.toLowerCase().includes(query);
      const matchesId = t.id.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription && !matchesId) return false;
    }
    if (difficulty && t.difficulty !== difficulty) return false;
    if (domain && t.domain !== domain) return false;
    if (status && (t.status || "draft") !== status) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search tasks by title, description, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
          data-testid="search-input"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex items-center gap-2" data-testid="status-filter">
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setStatus(null)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${!status ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              All
            </button>
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setStatus(status === s ? null : s)}
                className={`px-3 py-1 text-sm rounded-md border transition-colors capitalize ${status === s ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2" data-testid="difficulty-filter">
          <span className="text-sm font-medium text-muted-foreground">Difficulty:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setDifficulty(null)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${!difficulty ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              All
            </button>
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(difficulty === d ? null : d)}
                className={`px-3 py-1 text-sm rounded-md border transition-colors capitalize ${difficulty === d ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        {domains.length > 0 && (
          <div className="flex items-center gap-2" data-testid="domain-filter">
            <span className="text-sm font-medium text-muted-foreground">Domain:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setDomain(null)}
                className={`px-3 py-1 text-sm rounded-md border transition-colors ${!domain ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                All
              </button>
              {domains.map(d => (
                <button
                  key={d}
                  onClick={() => setDomain(domain === d ? null : d)}
                  className={`px-3 py-1 text-sm rounded-md border transition-colors ${domain === d ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(task => (
          <TaskCard key={task.id} task={task} runCount={runCounts[task.id] ?? 0} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground">No tasks match the selected filters.</p>
        </div>
      )}
    </div>
  );
}
